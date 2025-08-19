"use client";
import { signOut } from "@/lib/auth";
import Link from "next/link";
import { getCurrentUserDetails } from "../app/(core)/add-item/_lib/actions";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  ArrowLeftRight,
  BarChart3,
  ClipboardCopy,
  ClipboardPaste,
  Grid2X2,
  Settings,
  User,
  Warehouse,
  LogOut,
} from "lucide-react";
import Image from "next/image";
import LOGO from "../../public/logo.jpg";
import { usePathname } from "next/navigation";
import { AuthUserWithRole } from "@/lib/contexts/AuthContext";
export default function SideBar({ user }: { user: AuthUserWithRole | null }) {
  const pathname = usePathname();
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false); // State for logout dialog

  const handleLogoutConfirm = async () => {
    await signOut(); // Call the mock signOut function
    setIsLogoutDialogOpen(false); // Close the dialog
    // In a real app, after signOut, Firebase usually triggers a state change
    // which the AuthContext would catch and redirect the user.
    // For this mock, we just console.log the logout.
  };

  // Define the navigation items in an array for cleaner code
  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: Grid2X2 },
    { name: "Inventory", href: "/inventory", icon: Warehouse },
    { name: "Quick Add/ Scan Item", href: "/add-item", icon: ClipboardCopy },
    { name: "Dispense Item", href: "/dispense-item", icon: ClipboardPaste },
    { name: "Transactions", href: "/transactions", icon: ArrowLeftRight },
    // { name: "Reports", href: "/reports", icon: BarChart3 },
    // { name: "Settings", href: "/settings", icon: Settings },
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

          <div className="flex flex-col  overflow-hidden">
            {/* Display the user's email if available */}
            <p className=" text-primary text-xs font-medium line-clamp-1">
              {user ? user.email : "User Name"}
            </p>
            {/* Display the user's role */}
            <p className="text-gray-400 text-xs">
              {user ? user.role : "User role"}
            </p>
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

        {/* Conditionally render the Reports section ONLY if the user is an admin */}
        {user && user.role === "admin" && (
          <Link
            href="/reports"
            className={`w-full rounded-xl flex items-center hover:bg-primary/10 justify-start gap-2 p-2 ${
              pathname === "/reports" ? "bg-primary" : ""
            }`}
          >
            <BarChart3
              className={`text-md w-5 h-5 ${
                pathname === "/reports" ? "text-[#f2f2f2]" : "text-[#B3C3CB]"
              }`}
            />
            <div
              className={`text-sm ${
                pathname === "/reports" ? "text-[#f2f2f2]" : "text-[#B3C3CB]"
              }`}
            >
              Reports
            </div>
          </Link>
        )}
      </section>

      {/* <section className="flex flex-col gap-1 items-start justify-start">
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
      </section> */}

      {/* Logout Button */}
      <div className="mt-auto pt-4">
        {" "}
        {/* Use mt-auto to push to the bottom */}
        <Button
          onClick={() => setIsLogoutDialogOpen(true)}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </Button>
      </div>

      {/* Logout Confirmation Dialog */}
      <Dialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Logout</DialogTitle>
            <DialogDescription className="text-gray-400">
              Are you sure you want to log out? You will be redirected to the
              login page.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <DialogClose asChild>
              <Button
                onClick={() => setIsLogoutDialogOpen(false)}
                className="bg-gray-600 hover:bg-gray-700 text-white"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              onClick={handleLogoutConfirm}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Logout
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
