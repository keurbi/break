import request from "supertest";
import app from "../src/app";

// Mock authenticateFirebase pour injecter un rôle manager
jest.mock("../src/middlewares/firebaseAuth", () => ({
  authenticateFirebase: (_req: any, _res: any, next: any) => {
    // @ts-ignore
    _req.userRole = "manager";
    next();
  },
}));

// Mock Firebase Admin (auth + firestore) entièrement dans la factory pour éviter les problèmes de hoisting
jest.mock("../src/config/firebase", () => {
  const createUserMock = jest.fn();
  const setCustomUserClaimsMock = jest.fn();
  const updateUserMock = jest.fn();
  const deleteUserAuthMock = jest.fn();

  const setMock = jest.fn();
  const getMock = jest.fn();
  const updateMock = jest.fn();
  const deleteDocMock = jest.fn();
  const docMock = jest.fn(() => ({
    set: setMock,
    get: getMock,
    update: updateMock,
    delete: deleteDocMock,
  }));
  const collectionGetMock = jest.fn();
  const collectionMock = jest.fn((name: string) => {
    if (name === "users") {
      return { doc: docMock, get: collectionGetMock } as any;
    }
    return { doc: docMock } as any;
  });
  const firestoreDb = { collection: collectionMock };
  const firestoreFn: any = () => firestoreDb;
  firestoreFn.FieldValue = { serverTimestamp: jest.fn(() => "ts") };

  // Expose mocks pour assertions
  (global as any).__adminMocks = {
    createUserMock,
    setCustomUserClaimsMock,
    updateUserMock,
    deleteUserAuthMock,
    setMock,
    getMock,
    updateMock,
    deleteDocMock,
    docMock,
    collectionGetMock,
    collectionMock,
  };

  return {
    __esModule: true,
    default: {
      auth: () => ({
        createUser: createUserMock,
        setCustomUserClaims: setCustomUserClaimsMock,
        updateUser: updateUserMock,
        deleteUser: deleteUserAuthMock,
      }),
      firestore: firestoreFn,
    },
  };
});

describe("Users routes (manager)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("POST /api/users -> 201 et user créé", async () => {
    const m = (global as any).__adminMocks;
    m.createUserMock.mockResolvedValueOnce({ uid: "u123" });
    m.setMock.mockResolvedValueOnce(undefined);
    const body = {
      email: "john@doe.com",
      password: "pass1234",
      firstName: "John",
      lastName: "Doe",
      department: "IT",
      role: "manager",
    };
    const res = await request(app).post("/api/users").send(body);
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      id: "u123",
      email: "john@doe.com",
      role: "manager",
    });
    expect(m.createUserMock).toHaveBeenCalled();
    expect(m.setCustomUserClaimsMock).toHaveBeenCalledWith("u123", {
      role: "manager",
    });
    expect(m.setMock).toHaveBeenCalled();
  });

  it("GET /api/users -> 200 + liste", async () => {
    const m = (global as any).__adminMocks;
    m.collectionGetMock.mockResolvedValueOnce({
      docs: [
        { id: "u1", data: () => ({ email: "a@a", firstName: "A" }) },
        { id: "u2", data: () => ({ email: "b@b", firstName: "B" }) },
      ],
    });
    const res = await request(app).get("/api/users");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(2);
  });

  it("GET /api/users/:id -> 200 + user", async () => {
    const m = (global as any).__adminMocks;
    m.getMock.mockResolvedValueOnce({
      exists: true,
      id: "u1",
      data: () => ({ email: "a@a", firstName: "A" }),
    });
    const res = await request(app).get("/api/users/u1");
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ id: "u1", email: "a@a" });
  });

  it("PUT /api/users/:id -> 200 + update ok", async () => {
    const m = (global as any).__adminMocks;
    m.updateMock.mockResolvedValueOnce(undefined);
    m.getMock.mockResolvedValueOnce({
      id: "u1",
      data: () => ({ email: "a@a" }),
    });
    const res = await request(app)
      .put("/api/users/u1")
      .send({ firstName: "New" });
    expect(res.status).toBe(200);
    const m2 = (global as any).__adminMocks;
    expect(m2.updateMock).toHaveBeenCalled();
  });

  it("DELETE /api/users/:id -> 200 + suppression ok", async () => {
    const m = (global as any).__adminMocks;
    m.deleteDocMock.mockResolvedValueOnce(undefined);
    m.deleteUserAuthMock.mockResolvedValueOnce(undefined);
    const res = await request(app).delete("/api/users/u1");
    expect(res.status).toBe(200);
    const m2 = (global as any).__adminMocks;
    expect(m2.deleteDocMock).toHaveBeenCalled();
    expect(m2.deleteUserAuthMock).toHaveBeenCalledWith("u1");
  });
});
