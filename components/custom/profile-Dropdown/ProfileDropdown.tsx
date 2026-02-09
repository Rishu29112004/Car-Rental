"use client";

import LoginForm from "@/components/screens/Login/components/LoginForm";
import { useAuth } from "@/context/auth-context";
import { useModal } from "@/context/modal-context";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProfileDropdownProps {
  profileImageUrl?: string; // optional image URL
}

const ProfileDropdown = ({ profileImageUrl }: ProfileDropdownProps) => {
  const { user, logout } = useAuth();
  const { openModal } = useModal();
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const handleLogout = async () => {
    await logout();
    openModal(<LoginForm />, false);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        dropdownRef.current.style.display = "none";
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Generate initials
  const initials = user?.name
    ?.split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  return (
    <div
      ref={dropdownRef}
      className="absolute right-3 top-16 w-64 bg-white border border-gray-200 shadow-xl rounded-xl p-4 z-50 animate-in fade-in zoom-in-95"
    >
      {/* User Info */}
      <div className="flex items-center gap-3 border-b pb-3">
        <Avatar className="h-10 w-10">
          {profileImageUrl ? (
            <AvatarImage src={profileImageUrl} />
          ) : user?.imageUrl ? (
            <AvatarImage src={user.imageUrl} />
          ) : (
            <AvatarFallback className="bg-slate-200 text-slate-700 font-semibold">
              {initials || user?.name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          )}
        </Avatar>

        <div className="flex flex-col">
          <p className="font-semibold text-gray-800 leading-tight">
            {user?.name}
          </p>
          <p className="text-xs text-gray-500 truncate">{user?.email}</p>
        </div>
      </div>

      {/* Actions */}
      <Link href="/bookings">
        <button className="mt-4 cursor-pointer w-full flex items-center justify-center gap-2 bg-slate-200 hover:bg-slate-300 transition text-slate-700 rounded-lg py-2 text-sm font-medium">
          Profile
        </button>
      </Link>
      <button
        onClick={handleLogout}
        className="mt-4 w-full cursor-pointer flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 transition text-white rounded-lg py-2 text-sm font-medium"
      >
        Logout
      </button>
    </div>
  );
};

export default ProfileDropdown;
