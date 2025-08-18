"use client";
import SideBar from "@/components/SideBar";
import { useAuthContext } from "@/lib/contexts/AuthContext";
import React from "react";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { user, loading } = useAuthContext();
  return (
    <div className="flex h-screen flex-col md:flex-row overflow-hidden bg-dashboardBackgroundDark px-2 py-4 ">
      <div className="w-full h-full flex-none md:w-64">
        <SideBar user={user} />
      </div>
      <div className="flex-grow p-2 overflow-y-scroll scrollbar-thin scrollbar-thumb-primary scrollbar-track-dashboardBackground scrollbar-corner-dashboardBackground">
        {children}
      </div>
    </div>
  );
}
