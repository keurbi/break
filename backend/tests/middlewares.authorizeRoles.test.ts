import { authorizeRoles } from "../src/middlewares/authRoles";

function makeCtx(role?: string) {
  const req: any = { userRole: role };
  const res: any = {
    statusCode: 200,
    body: undefined as any,
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    json(obj: any) {
      this.body = obj;
      return this;
    },
  };
  let proceeded = false;
  const next = () => {
    proceeded = true;
  };
  return {
    req,
    res,
    next,
    get proceeded() {
      return proceeded;
    },
  };
}

describe("authorizeRoles middleware", () => {
  it("403 si rôle manquant", () => {
    const { req, res, next, proceeded } = makeCtx(undefined);
    // @ts-ignore
    authorizeRoles("manager")(req, res, next);
    expect(res.statusCode).toBe(403);
    expect(proceeded).toBe(false);
  });

  it("200 (next) si rôle autorisé", () => {
    const { req, res, next } = makeCtx("manager");
    // @ts-ignore
    authorizeRoles("manager")(req, res, next);
    expect(res.statusCode).toBe(200);
  });

  it("403 si rôle interdit", () => {
    const { req, res, next } = makeCtx("user");
    // @ts-ignore
    authorizeRoles("manager")(req, res, next);
    expect(res.statusCode).toBe(403);
  });
});
