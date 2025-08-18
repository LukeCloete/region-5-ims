"use server";

import SideBar from "@/components/SideBar";
import React from "react";

export default async function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden bg-dashboardBackgroundDark px-2 py-4">
      <div className="w-full h-full flex-none md:w-64">
        <SideBar />
      </div>
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
    </div>
  );
}
