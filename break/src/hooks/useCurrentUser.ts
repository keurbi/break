import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { getDb } from '../firebase';

export type CurrentUserProfile = {
  uid: string;
  email?: string | null;
  firstName?: string;
  lastName?: string;
  displayName?: string | null;
};

export function useCurrentUser() {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<CurrentUserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsub = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (!user) {
        setProfile(null);
        setLoading(false);
        return;
      }
      try {
  const db = getDb();
  if (!db) throw new Error('Firestore not available');
        const ref = doc(db, 'users', user.uid);
        const snap = await getDoc(ref);
        const data: Partial<CurrentUserProfile> = snap.exists() ? (snap.data() as Partial<CurrentUserProfile>) : {};
        setProfile({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          firstName: data.firstName,
          lastName: data.lastName,
        });
      } catch {
        setProfile({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
        });
      } finally {
        setLoading(false);
      }
    });
    return () => unsub();
  }, []);

  return { firebaseUser, profile, loading };
}
