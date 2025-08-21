"use client";
import React, { createContext, useContext, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import Image from "next/image";
import LOGO from "../../../public/logo.jpg"; // Adjust the path as necessary
import { usePathname, useRouter } from "next/navigation";
import { UserRole } from "../auth";
import { app } from "../firebase";

export interface AuthUserWithRole {
  uid: string;
  email: string | null;
  role: UserRole | null;
}

interface AuthContextType {
  user: AuthUserWithRole | null;
  loading: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const publicRoutes = ["/login", "/signup", "/"];

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const auth = getAuth(app);
  const db = getFirestore(app);
  const router = useRouter();
  const pathname = usePathname();

  const [user, loading, error] = useAuthState(auth);
  const [userWithRole, setUserWithRole] =
    React.useState<AuthUserWithRole | null>(null);

  useEffect(() => {
    const fetchUserRole = async (uid: string) => {
      const userDocRef = doc(db, "users", uid);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        const role = userDocSnap.data().role as UserRole;
        return { uid, email: user?.email || null, role };
      }
      return null;
    };

    if (user) {
      fetchUserRole(user.uid).then(setUserWithRole);
    } else {
      setUserWithRole(null);
    }
  }, [user, db]);

  // Handle routing based on authentication state
  useEffect(() => {
    if (!loading) {
      // If user is not authenticated and is on a protected route, redirect to login
      if (!user && !publicRoutes.includes(pathname)) {
        router.push("/login");
      }
      // If user is authenticated and on a public route, redirect to dashboard
      if (user && publicRoutes.includes(pathname)) {
        router.push("/dashboard");
      }
    }
  }, [user, loading, pathname, router]);

  if (loading) {
    return (
      <div className="flex flex-col gap-4 items-center justify-center w-screen h-screen">
        <Image
          src={LOGO}
          alt="Company Logo"
          height={512}
          width={512}
          priority
          className="object-cover w-auto h-24"
        />
        <span className="text-lg font-regular animate-pulse">Loading...</span>
      </div>
    );
  }
  return (
    <AuthContext.Provider value={{ user: userWithRole, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error(
      "useAuthContext must be used within an AuthContextProvider"
    );
  }
  return context;
};
