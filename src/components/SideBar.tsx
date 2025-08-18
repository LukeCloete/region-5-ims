import { signOut } from "@/lib/auth";
import {
  ArrowLeftRight,
  BarChart3,
  ClipboardCopy,
  ClipboardPaste,
  FileEdit,
  Grid2X2,
  Power,
  Settings,
  User,
  UserCircle,
  Warehouse,
} from "lucide-react";
import Image from "next/image";
import LOGO from "../../public/logo.jpg";
export default function SideBar() {
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

        <div className="w-full rounded-xl bg-primary flex items-center justify-start gap-2 p-2 ">
          <Grid2X2 className="text-[#f2f2f2] text-md w-5 h-5" />
          <div className="text-sm text-[#f2f2f2]">Dashboard</div>
        </div>

        <div className="w-full rounded-xl flex items-center justify-start gap-2 p-2 ">
          <Warehouse className="text-[#B3C3CB] text-md w-5 h-5" />
          <div className="text-sm text-[#B3C3CB]">Inventory</div>
        </div>

        <div className="w-full rounded-xl flex items-center justify-start gap-2 p-2 ">
          <ClipboardCopy className="text-[#B3C3CB] text-md w-5 h-5" />
          <div className="text-sm text-[#B3C3CB]">Quick Add/ Scan Item</div>
        </div>

        <div className="w-full rounded-xl flex items-center justify-start gap-2 p-2 ">
          <ClipboardPaste className="text-[#B3C3CB] text-md w-5 h-5" />
          <div className="text-sm text-[#B3C3CB]">Dispense Item</div>
        </div>

        <div className="w-full rounded-xl flex items-center justify-start gap-2 p-2 ">
          <ArrowLeftRight className="text-[#B3C3CB] text-md w-5 h-5" />
          <div className="text-sm text-[#B3C3CB]">Transactions</div>
        </div>

        <div className="w-full rounded-xl flex items-center justify-start gap-2 p-2 ">
          {/* Changed icon to BarChart3 for Reports */}
          <BarChart3 className="text-[#B3C3CB] text-md w-5 h-5" />
          <div className="text-sm text-[#B3C3CB]">Reports</div>
        </div>
      </section>

      <section className="flex flex-col gap-1 items-start justify-start">
        <p className="text-slate-50/50 text-xs">Other</p>

        <div className="w-full rounded-xl flex items-center justify-start gap-2 p-2 ">
          <Settings className="text-[#B3C3CB] text-md w-5 h-5" />
          <div className="text-sm text-[#B3C3CB]">Settings</div>
        </div>
      </section>
    </div>
  );
}
