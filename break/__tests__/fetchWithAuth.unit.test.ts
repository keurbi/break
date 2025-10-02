// @ts-nocheck
import { fetchWithAuth } from '../src/utils/fetchWithAuth';
jest.mock('firebase/app', () => ({ getApps: () => [] }));
jest.mock('firebase/auth', () => ({ getAuth: () => ({ currentUser: null }) }));
describe('fetchWithAuth', () => {
  it('should add Authorization header', async () => {
    // Polyfill fetch and mock token in localStorage
    const getItemSpy = jest
      .spyOn(Storage.prototype, 'getItem')
      .mockImplementation((key: string) => (key === 'token' ? 'token' : null));
  const fetchMock = jest.fn().mockResolvedValue({ ok: true, status: 200 });
  // @ts-ignore
  global.fetch = fetchMock;
  await fetchWithAuth('url');
    expect(fetchMock).toHaveBeenCalledWith('url', expect.objectContaining({ headers: expect.objectContaining({ Authorization: 'Bearer token' }) }));
  getItemSpy.mockRestore();
  });
});
