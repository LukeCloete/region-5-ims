"use client";
import { useAuthState } from "react-firebase-hooks/auth";
import { redirect } from "next/navigation";
import { useState } from "react";
import { updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function Page() {
  const [user] = useAuthState(auth);
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [isEditing, setIsEditing] = useState(!user?.displayName);

  if (!user) {
    redirect("/login");
  }

  const handleSave = async () => {
    if (user && displayName) {
      await updateProfile(user, { displayName });
      setIsEditing(false);
    }
  };

  return (
    <div>
      {isEditing ? (
        <div>
          <h1 className="text-2xl font-bold mb-2">Set your display name</h1>
          <input
            className="border px-2 py-1 rounded mr-2"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Enter display name"
          />
          <button
            className="bg-blue-500 text-white px-4 py-1 rounded"
            onClick={handleSave}
            disabled={!displayName}
          >
            Save
          </button>
        </div>
      ) : (
        <section className="text-left flex items-start justify-start  flex justify-center align-center">
          <h1 className="text-3xl text-primary-foreground font-bold text-white ">
            Welcome, {user.displayName}
          </h1>
        </section>
      )}
    </div>
  );
}
