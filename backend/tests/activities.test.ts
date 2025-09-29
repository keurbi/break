import request from "supertest";
import app from "../src/app";

// Mock de l'admin Firebase pour Firestore
jest.mock("../src/config/firebase", () => {
  const mockDocs = [] as any[];
  const mockSnapshot = {
    docs: mockDocs,
  };
  const chain = {
    where: () => chain,
    orderBy: () => chain,
    limit: () => chain,
    startAfter: () => chain,
    get: async () => mockSnapshot,
  };
  return {
    __esModule: true,
    default: {
      firestore: () => ({
        collection: () => chain,
      }),
    },
  };
});

describe("Activities routes (public)", () => {
  it("GET /api/activities -> 200 et items[]", async () => {
    const res = await request(app).get("/api/activities");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("items");
    expect(Array.isArray(res.body.items)).toBe(true);
    expect(res.body).toHaveProperty("nextCursor");
  });
});
