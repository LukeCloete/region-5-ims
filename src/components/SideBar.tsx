"use client";
import { signOut } from "@/lib/auth";
import {
  ArrowLeftRight,
  BarChart3,
  ClipboardCopy,
  ClipboardPaste,
  Grid2X2,
  Settings,
  User,
  Warehouse,
} from "lucide-react";
import Image from "next/image";
import LOGO from "../../public/logo.jpg";
import Link from "next/link";
import { usePathname } from "next/navigation";
export default function SideBar() {
  const pathname = usePathname();

  // Define the navigation items in an array for cleaner code
  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: Grid2X2 },
    { name: "Inventory", href: "/inventory", icon: Warehouse },
    { name: "Quick Add/ Scan Item", href: "/quick-add", icon: ClipboardCopy },
    { name: "Dispense Item", href: "/dispense-item", icon: ClipboardPaste },
    { name: "Transactions", href: "/transactions", icon: ArrowLeftRight },
    { name: "Reports", href: "/reports", icon: BarChart3 },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <div className="flex flex-col text-sm px-3 py-4 rounded-xl h-full gap-4 overflow-y-scroll scrollbar-thin scrollbar-thumb-slate-50/10 scrollbar-track-dashboardBackground scrollbar-corner-dashboardBackground">
      <div className="flex flex-col items-center justify-start gap-2">
        <div className="w-full bg-white rounded-xl border relative h-[20vh] max-h-[20vh]">
          <Image
            src={LOGO}
            alt="Region 5 Youth Games logo"
            fill
            className="object-contain aspect-square"
            priority
          />
        </div>
        <div className="bg-slate-50/10 w-full h-fit flex items-center justify-start px-3 py-1 gap-4 rounded-xl">
          <User
            width={24}
            height={24}
            className="text-primary w-7 h-7 bg-[#001A10] rounded-full p-1 m-0"
          />
          <div className="flex flex-col ">
            <p className=" text-primary text-sm font-bold">User name</p>
            <p className="text-gray-400 text-xs">User email</p>
          </div>
        </div>
      </div>

      <section className="flex flex-col gap-1 items-start justify-start">
        <p className="text-slate-50/50 text-xs">General</p>
        {navItems.slice(0, 6).map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`w-full rounded-xl flex hover:bg-primary/10 items-center justify-start gap-2 p-2 ${
                isActive ? "bg-primary" : ""
              }`}
            >
              <item.icon
                className={`text-md w-5 h-5 ${
                  isActive ? "text-[#f2f2f2]" : "text-[#B3C3CB]"
                }`}
              />
              <div
                className={`text-sm ${
                  isActive ? "text-[#f2f2f2]" : "text-[#B3C3CB]"
                }`}
              >
                {item.name}
              </div>
            </Link>
          );
        })}
      </section>

      <section className="flex flex-col gap-1 items-start justify-start">
        <p className="text-slate-50/50 text-xs">Other</p>
        <Link
          href="/settings"
          className={`w-full rounded-xl flex items-center hover:bg-primary/10 justify-start gap-2 p-2 ${
            pathname === "/settings" ? "bg-primary" : ""
          }`}
        >
          <Settings
            className={`text-md w-5 h-5 ${
              pathname === "/settings" ? "text-[#f2f2f2]" : "text-[#B3C3CB]"
            }`}
          />
          <div
            className={`text-sm ${
              pathname === "/settings" ? "text-[#f2f2f2]" : "text-[#B3C3CB]"
            }`}
          >
            Settings
          </div>
        </Link>
      </section>
    </div>
  );
}
