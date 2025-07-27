import { getAuth } from 'firebase/auth';

export const fetchAndStoreUserRole = async () => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (user) {
    const tokenResult = await user.getIdTokenResult(true);
    const role = tokenResult.claims.role;
    if (role) {
      localStorage.setItem('role', String(role));
    }
  }
};