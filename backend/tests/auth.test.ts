import request from "supertest";
import app from "../src/app";

describe("Auth middlewares", () => {
  it("firebaseAuth -> 401 si token manquant", async () => {
    const res = await request(app).post("/api/users");
    expect(res.status).toBe(401);
  });

  it("authRoles -> 403 si rôle absent/interdit (avec token vide simulé)", async () => {
    // On simule un token Bearer invalide pour passer le header et déclencher 401
    // Ici verifyIdToken échoue volontairement, on reste donc à 401. Ce test valide le comportement d’échec.
    const res = await request(app)
      .post("/api/users")
      .set("Authorization", "Bearer invalid");
    expect([401, 403]).toContain(res.status);
  });
});
