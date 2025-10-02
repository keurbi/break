// @ts-nocheck
// Mock Firebase modules BEFORE importing the module under test
const getAppsMock = jest.fn(() => []);
const getAuthMock = jest.fn(() => ({ currentUser: null }));
jest.mock('firebase/app', () => ({ getApps: (...args: any[]) => getAppsMock(...args) }));
jest.mock('firebase/auth', () => ({ getAuth: (...args: any[]) => getAuthMock(...args) }));

import { fetchWithAuth } from '../src/utils/fetchWithAuth';

describe('fetchWithAuth extra scenarios', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('redirects to /login and clears storage on 401', async () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key: string) => (key === 'token' ? 'token' : null));
  const removeItemSpy = jest.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {});
    const fetchMock = jest.fn().mockResolvedValue({ status: 401 });
    // @ts-ignore
    global.fetch = fetchMock;
    const res = await fetchWithAuth('/api/test');
    expect(res).toBeNull();
    expect(fetchMock).toHaveBeenCalled();
    expect(removeItemSpy).toHaveBeenCalledWith('token');
  expect(removeItemSpy).toHaveBeenCalledWith('role');
  });

  it('falls back to Firebase currentUser token when localStorage empty', async () => {
    // Simulate Firebase initialized and a logged-in user
    getAppsMock.mockReturnValueOnce([1]);
    getAuthMock.mockReturnValueOnce({ currentUser: { getIdToken: () => Promise.resolve('fb-token') } });

    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue(null);
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {});
    const fetchMock = jest.fn().mockResolvedValue({ ok: true, status: 200 });
    // @ts-ignore
    global.fetch = fetchMock;

    await fetchWithAuth('/api/ok');
    expect(setItemSpy).toHaveBeenCalledWith('token', 'fb-token');
    expect(fetchMock).toHaveBeenCalledWith('/api/ok', expect.objectContaining({ headers: expect.objectContaining({ Authorization: 'Bearer fb-token' }) }));
  });
});
