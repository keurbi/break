import { authorizeRoles } from '../src/middlewares/authRoles';
describe('authorizeRoles middleware', () => {
  it('should call next if user has required role', () => {
    const req = { user: { role: 'manager' } } as any;
    const res = {} as any;
    const next = jest.fn();
  authorizeRoles('manager')(req as any, res as any, next);
    expect(next).toHaveBeenCalled();
  });

  it('should send 403 if user lacks role', () => {
    const req = { user: { role: 'user' } } as any;
  const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;
    const next = jest.fn();
  authorizeRoles('manager')(req as any, res as any, next);
  expect(res.status).toHaveBeenCalledWith(403);
  expect(res.json).toHaveBeenCalledWith({ error: 'Accès interdit : rôle insuffisant' });
  });
});
