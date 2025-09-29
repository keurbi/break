import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import request from "supertest";
import app from "../src/app";

// Simule l’auth manager pour les opérations protégées
jest.mock("../src/middlewares/firebaseAuth", () => ({
  authenticateFirebase: (_req: any, _res: any, next: any) => {
    _req.userRole = "manager";
    next();
  },
}));

// Mock Firebase admin module avec Firestore pour activities
jest.mock("../src/config/firebase", () => {
  const getDocMock = jest.fn();
  const addMock = jest.fn();
  const updateDocMock = jest.fn();
  const docMock = jest.fn((id?: string) => ({
    get: getDocMock,
    update: updateDocMock,
  }));
  const collectionMock = jest.fn((name: string) => {
    if (name === "activities") {
      return { doc: docMock, add: addMock } as any;
    }
    return { doc: docMock } as any;
  });
  const firestore: any = () => ({ collection: collectionMock });
  firestore.FieldValue = { serverTimestamp: jest.fn(() => "ts") };
  return {
    __esModule: true,
    default: { firestore },
    __mocks__: { getDocMock, addMock, updateDocMock, docMock, collectionMock },
  };
});

// Récupère les mocks exposés par le module mocké
// eslint-disable-next-line @typescript-eslint/no-var-requires
const firebaseModule: any = require("../src/config/firebase");
const { getDocMock, addMock, updateDocMock } = firebaseModule.__mocks__;

describe("Activities routes (write + 404)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("GET /api/activities/:id -> 404 si supprimée ou inexistante", async () => {
    getDocMock.mockResolvedValueOnce({ exists: false });
    const res = await request(app).get("/api/activities/a1");
    expect(res.status).toBe(404);
  });

  it("GET /api/activities/:id -> 200 quand existe et non supprimée", async () => {
    getDocMock.mockResolvedValueOnce({
      exists: true,
      id: "a1",
      data: () => ({
        title: "Act",
        deletedAt: null,
        resourceUrl: "https://ex.com/r",
      }),
    });
    const res = await request(app).get("/api/activities/a1");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("id", "a1");
    expect(res.body).toHaveProperty("resource", "https://ex.com/r");
  });

  it("POST /api/activities (manager) -> 201", async () => {
    addMock.mockResolvedValueOnce({ id: "a1" });
    const res = await request(app)
      .post("/api/activities")
      .send({ title: "Title", description: "Description ok" });
    expect(res.status).toBe(201);
    expect(res.body).toEqual({ id: "a1" });
  });

  it("PUT /api/activities/:id (manager) -> 200", async () => {
    updateDocMock.mockResolvedValueOnce(undefined);
    const res = await request(app)
      .put("/api/activities/a1")
      .send({ title: "Zed" });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ success: true });
  });

  it("DELETE /api/activities/:id (manager) -> 204", async () => {
    updateDocMock.mockResolvedValueOnce(undefined);
    const res = await request(app).delete("/api/activities/a1");
    expect(res.status).toBe(204);
  });
});
