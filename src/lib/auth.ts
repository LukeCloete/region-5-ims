import {
  getAuth,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import { app } from "./firebase"; // Assumes you have your Firebase app initialized in firebase.ts
import { useEffect, useState } from "react";

// Define a type for user roles
export type UserRole = "admin" | "user" | "superuser";

// Define an interface for the authenticated user, extending the Firebase User type
export interface AuthUser extends User {
  role: UserRole;
}

const auth = getAuth(app);
const db = getFirestore(app);

// Sign In Function with explicit typing for email and password
export async function signIn(
  email: string,
  password: string
): Promise<{ user: AuthUser | null; error: string | null }> {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Fetch user's role and add it to the user object
    const role = await fetchUserRole(user.uid);
    if (role) {
      const authUser: AuthUser = { ...user, role };
      return { user: authUser, error: null };
    }

    // If no role is found, treat it as an error
    return { user: null, error: "User role not found." };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return { user: null, error: error.message };
  }
}

// Sign Up Function
export async function signUp(
  email: string,
  password: string
): Promise<{ user: AuthUser | null; error: string | null }> {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Automatically set the new user's role to 'user' in Firestore
    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, {
      email: user.email,
      role: "user",
    });

    const authUser: AuthUser = { ...user, role: "user" };
    return { user: authUser, error: null };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return { user: null, error: error.message };
  }
}

// Sign Out Function
export async function signOut(): Promise<void> {
  await firebaseSignOut(auth);
}

// Helper to fetch user role from Firestore with explicit typing
export async function fetchUserRole(uid: string): Promise<UserRole | null> {
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);
  if (userSnap.exists()) {
    return userSnap.data().role as UserRole;
  }
  return null;
}

// Custom hook to manage auth state in components with explicit typing
export function useAuth(): { user: AuthUser | null; loading: boolean } {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        // Fetch the user's role
        const role = await fetchUserRole(authUser.uid);
        if (role) {
          // Update the user state with the role
          const authUserWithRole: AuthUser = { ...authUser, role };
          setUser(authUserWithRole);
        } else {
          // If no role is found, sign out the user
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, loading };
}
