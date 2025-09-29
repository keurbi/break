import { Request, Response } from "express";

describe("Payments controller (unit)", () => {
  const makeRes = () => {
    const res: any = {};
    res.statusCode = 200;
    res.status = (code: number) => {
      res.statusCode = code;
      return res;
    };
    res.body = undefined;
    res.json = (obj: any) => {
      res.body = obj;
      return res;
    };
    res.send = (text: any) => {
      res.body = text;
      return res;
    };
    return res as Response & { statusCode: number; body: any };
  };

  beforeEach(() => {
    jest.resetModules();
    process.env.STRIPE_SECRET_KEY = "";
    process.env.STRIPE_WEBHOOK_SECRET = "";
  });

  it("createCheckoutSession -> 500 quand Stripe non configuré", async () => {
    const { createCheckoutSession } = await import(
      "../src/controllers/paymentsController"
    );
    const req = { body: { amount: 1000 } } as unknown as Request;
    const res = makeRes();
    await createCheckoutSession(req, res);
    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({ error: "Stripe not configured" });
  });

  it("createCheckoutSession -> 400 quand montant < 100", async () => {
    process.env.STRIPE_SECRET_KEY = "sk_test_x";
    jest.doMock("stripe", () => ({
      __esModule: true,
      default: class Stripe {
        checkout = { sessions: { create: jest.fn() } };
      },
    }));
    const { createCheckoutSession } = await import(
      "../src/controllers/paymentsController"
    );
    const req = { body: { amount: 50, currency: "eur" } } as unknown as Request;
    const res = makeRes();
    await createCheckoutSession(req, res);
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ error: "Montant minimum 1€ (100 cents)" });
  });

  it("createCheckoutSession -> 200 quand Stripe OK et montant valide", async () => {
    process.env.STRIPE_SECRET_KEY = "sk_test_x";
    jest.doMock("stripe", () => ({
      __esModule: true,
      default: class Stripe {
        checkout = {
          sessions: {
            create: jest.fn(async () => ({
              url: "https://pay.example/session",
            })),
          },
        };
      },
    }));
    const { createCheckoutSession } = await import(
      "../src/controllers/paymentsController"
    );
    const req = {
      body: { amount: 1000, currency: "eur" },
      user: { uid: "u1" },
    } as unknown as Request;
    const res = makeRes();
    await createCheckoutSession(req, res);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ url: "https://pay.example/session" });
  });

  it("webhook -> 500 si secret manquant", async () => {
    const { stripeWebhookHandler } = await import(
      "../src/controllers/paymentsController"
    );
    const req = { headers: {} } as unknown as Request;
    const res = makeRes();
    await stripeWebhookHandler(req, res);
    expect(res.statusCode).toBe(500);
    expect(res.body).toBe("Webhook secret not set");
  });

  it("webhook -> 500 si Stripe non configuré", async () => {
    process.env.STRIPE_WEBHOOK_SECRET = "whsec_x";
    const { stripeWebhookHandler } = await import(
      "../src/controllers/paymentsController"
    );
    const req = {
      headers: { "stripe-signature": "sig" },
    } as unknown as Request;
    const res = makeRes();
    await stripeWebhookHandler(req, res);
    expect(res.statusCode).toBe(500);
    expect(res.body).toBe("Stripe not configured");
  });

  it("webhook -> 400 signature invalide", async () => {
    process.env.STRIPE_SECRET_KEY = "sk_test_x";
    process.env.STRIPE_WEBHOOK_SECRET = "whsec_x";
    jest.doMock("stripe", () => ({
      __esModule: true,
      default: class Stripe {
        webhooks = {
          constructEvent: () => {
            throw new Error("Bad signature");
          },
        };
      },
    }));
    const { stripeWebhookHandler } = await import(
      "../src/controllers/paymentsController"
    );
    const req = {
      headers: { "stripe-signature": "sig" },
      body: Buffer.from("{}"),
    } as unknown as Request;
    const res = makeRes();
    await stripeWebhookHandler(req, res);
    expect(res.statusCode).toBe(400);
    expect(String(res.body)).toMatch(/Webhook Error: Bad signature/);
  });

  it("webhook -> 200 checkout.session.completed persiste en DB", async () => {
    process.env.STRIPE_SECRET_KEY = "sk_test_x";
    process.env.STRIPE_WEBHOOK_SECRET = "whsec_x";
    jest.doMock("stripe", () => ({
      __esModule: true,
      default: class Stripe {
        webhooks = {
          constructEvent: () => ({
            type: "checkout.session.completed",
            data: {
              object: {
                id: "cs_123",
                amount_total: 1000,
                currency: "eur",
                payment_status: "paid",
                customer_details: { email: "a@a" },
                metadata: { userId: "u1" },
              },
            },
          }),
        };
      },
    }));
    const setMock = jest.fn();
    jest.doMock("../src/config/firebase", () => ({
      __esModule: true,
      default: {
        firestore: Object.assign(
          () => ({ collection: () => ({ doc: () => ({ set: setMock }) }) }),
          { FieldValue: { serverTimestamp: jest.fn(() => "ts") } }
        ),
      },
    }));
    const { stripeWebhookHandler } = await import(
      "../src/controllers/paymentsController"
    );
    const req = {
      headers: { "stripe-signature": "sig" },
      body: Buffer.from("{}"),
    } as unknown as Request;
    const res = makeRes();
    await stripeWebhookHandler(req, res);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ received: true });
    expect(setMock).toHaveBeenCalled();
  });

  it("webhook -> 200 async_payment_failed persiste en DB (merge)", async () => {
    process.env.STRIPE_SECRET_KEY = "sk_test_x";
    process.env.STRIPE_WEBHOOK_SECRET = "whsec_x";
    jest.doMock("stripe", () => ({
      __esModule: true,
      default: class Stripe {
        webhooks = {
          constructEvent: () => ({
            type: "checkout.session.async_payment_failed",
            data: {
              object: {
                id: "cs_124",
                amount_total: 1000,
                currency: "eur",
                customer_details: { email: "a@a" },
                metadata: { userId: "u1" },
              },
            },
          }),
        };
      },
    }));
    const setMock = jest.fn();
    jest.doMock("../src/config/firebase", () => ({
      __esModule: true,
      default: {
        firestore: Object.assign(
          () => ({ collection: () => ({ doc: () => ({ set: setMock }) }) }),
          { FieldValue: { serverTimestamp: jest.fn(() => "ts") } }
        ),
      },
    }));
    const { stripeWebhookHandler } = await import(
      "../src/controllers/paymentsController"
    );
    const req = {
      headers: { "stripe-signature": "sig" },
      body: Buffer.from("{}"),
    } as unknown as Request;
    const res = makeRes();
    await stripeWebhookHandler(req, res);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ received: true });
    expect(setMock).toHaveBeenCalled();
  });
});
