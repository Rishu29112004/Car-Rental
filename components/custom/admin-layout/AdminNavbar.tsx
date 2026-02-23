"use client";
import Link from "next/link"
import { useAuth } from "@/context/auth-context";

import Image from "next/image";


const AdminNavbar = () => {
const { user } = useAuth();
  return (
    <div className="w-full bg-slate-100 shadow-md fixed top-0 z-50">
      {/* NAVBAR */}
      <div className="px-6 h-16 flex items-center justify-between ">
        {/* Logo */}
        <Link href={"/"}>
          <Image
            src="/logo.svg"
            alt="Logo"
            width={120}
            height={40}
            className="object-contain" // object-contain handles aspect ratio visually, but the warning is about the 'style' attribute.
            style={{ height: "auto" }}
          />
        </Link>
        <div>
          <p className="font-semibold text-gray-500">Welcome, {user?.name || "User"}</p>
        </div>
      </div>

    </div>
  );
};

export default AdminNavbar;
