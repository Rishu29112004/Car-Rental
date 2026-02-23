"use client";

import Image from "next/image";
import { CustomButton } from "../CustomButton/CustomButton";
import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useModal } from "@/context/modal-context";
import LoginForm from "@/components/screens/Login/components/LoginForm";
import SignupForm from "@/components/screens/Signup/SignupForm";
import { useAuth } from "@/context/auth-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ProfileDropdown from "../profile-Dropdown/ProfileDropdown";
import { carService } from "../../services/car.service";
import CarCard, { Car } from "@/components/custom/carCard/CarCard";
import { useRouter } from "next/navigation";
import axiosInstance from "@/components/services/url.service";

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  imageUrl?: string;
}

export const navbarLinks = [
  { id: 1, label: "Home", href: "/" },
  { id: 2, label: "Cars", href: "/cars" },
  { id: 3, label: "My Bookings", href: "/bookings" },
];

const NavBar = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname();
  const { openModal } = useModal();
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);

  const [cars, setCars] = useState<Car[]>([]);

  const [searchItem, setSearchItem] = useState("");
  const [filterCar, setFilterCar] = useState<Car[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(0);

  const router = useRouter();
  const [profileDetails, setProfileDetails] = useState<UserProfile | null>(
    null,
  );

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const fetchProfileData = async () => {
    if (!user?._id) return;
    try {
      const res = await axiosInstance.get(`/api/profile/${user._id}`);
      setProfileDetails(res.data.data);
    } catch (error) {
      console.error("Profile fetch error", error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchProfileData();
    }
  }, [user]);

  // FILTER CARS
  useEffect(() => {
    if (searchItem.trim() === "") {
      setFilterCar([]);
      setShowDropdown(false);
      return;
    }
    const results = cars.filter((car) =>
      `${car.brand} || ${car.model} || ${car.dailyPrice} || ${car.description} || ${car.model}`
        .toLowerCase()
        .includes(searchItem.toLowerCase()),
    );
    setFilterCar(results);
    setShowDropdown(results.length > 0);
  }, [searchItem, cars]);

  const fetchCars = async () => {
    try {
      const res = await carService.getAllCars();
      setCars(res.data.data || res.data); // backend compatible
    } catch (error) {
      console.error("Failed to fetch cars", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const handleSelectCar = (carId: string) => {
    router.push(`/car-details/${carId}`);
    setShowDropdown(false);
    setSearchItem("");
  };

  const initials =
    user?.name
      ?.split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase() || "";

  const [openProfileDropdown, setOpenProfileDropdown] = useState(false);

  const handleLogout = async () => {
    await logout();
    openModal(<LoginForm />, false);
  };

  const handleProfileClick = () => {
    setOpenProfileDropdown((prev) => !prev);
  };

  const handleLoginClick = () => {
    openModal(<LoginForm />);
  };

  // const handleSignupClick = () => {
  //   openModal(<SignupForm />);
  // };

  // Close profile dropdown if user logs out
  useEffect(() => {
    if (!user) setOpenProfileDropdown(false);
  }, [user]);

  // CLOSE MOBILE SIDEBAR ON RESIZE
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsSheetOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // CLOSE MOBILE SIDEBAR ON CLICK OUTSIDE
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsSheetOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-full bg-slate-100">
      {/* NAVBAR */}
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between relative">
        {/* Logo */}
        <Link href={"/"}>
          <Image
            src="/logo.svg"
            alt="Logo"
            width={120}
            height={40}
            className="object-contain w-auto"
          />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          {navbarLinks.map((t) => (
            <Link key={t.id} href={t.href}>
              <p
                className={`cursor-pointer hover:text-blue-500 ${
                  pathname === t.href
                    ? "text-blue-500 font-semibold underline"
                    : ""
                }`}
              >
                {t.label}
              </p>
            </Link>
          ))}

          {/* SEARCH ONLY ON MD+ */}
          {/* SEARCH ONLY ON MD+ */}
          <div className="relative w-64 hidden md:block">
            <div className="relative w-full">
              <Input
                ref={inputRef}
                value={searchItem}
                onChange={(e) => setSearchItem(e.target.value)}
                type="text"
                placeholder="Search"
                className="w-full rounded-full border border-gray-300 bg-white py-2 px-4 text-sm"
                onFocus={() => {
                  if (filterCar.length > 0) setShowDropdown(true);
                }}
                onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
              />

              {showDropdown && (
                <div
                  ref={dropdownRef}
                  className="absolute left-0 top-full mt-1 w-full max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg z-[9999]"
                >
                  {filterCar.map((car, index) => (
                    <div
                      key={car._id}
                      onMouseDown={() => handleSelectCar(car._id)}
                      className={`flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-gray-100 transition-colors ${
                        index === highlightIndex ? "bg-gray-100" : ""
                      }`}
                    >
                      <Image
                        src={car.image || "/images/placeholder.png"}
                        alt={`${car.brand} ${car.model}`}
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-full object-cover border border-gray-300"
                      />
                      <div className="flex flex-col">
                        <span className="text-gray-900 font-medium text-sm">
                          {car.brand} {car.model}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Desktop Right */}
        <div className="hidden sm:flex items-center gap-4">
          <Link href={"/admin/dashboard"}>
            <p className="cursor-pointer font-medium text-slate-600 hover:text-blue-500">
              Dashboard
            </p>
          </Link>

          {!user ? (
            <>
              <CustomButton
                onClick={handleLoginClick}
                content="Login"
                className="px-6 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700"
              />
            </>
          ) : (
            <Avatar
              className="w-10 h-10 cursor-pointer"
              onClick={handleProfileClick}
            >
              <AvatarImage
                src={profileDetails?.imageUrl || user?.imageUrl || ""}
              />
              <AvatarFallback className="bg-blue-600 text-white text-sm">
                {initials}
              </AvatarFallback>
            </Avatar>
          )}
        </div>

        {/* Profile Dropdown */}
        {openProfileDropdown && <ProfileDropdown />}

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsSheetOpen((prev) => !prev)}
          className={`sm:hidden bg-blue-500 p-2 rounded-full md:hidden
            hover:scale-105 active:scale-95
            transition duration-300 ease-in-out text-white absolute ${
              isSheetOpen ? "right-66" : "right-3"
            }`}
        >
          {isSheetOpen ? (
            <X className="h-4 w-4" />
          ) : (
            <Menu className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* MOBILE SIDEBAR */}
      <div
        ref={containerRef}
        className={`fixed top-0 right-0 z-50 h-screen w-64 bg-blue-500 text-white
          transition-transform duration-300 ease-in-out
          ${isSheetOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* USER / LOGIN */}
        {user && (
          <div
            onClick={handleProfileClick}
            className="flex px-6 py-5 gap-3 cursor-pointer"
          >
            <Avatar>
              <AvatarFallback className="bg-white text-blue-600 font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold leading-tight">{user.name}</p>
              <p className="text-xs text-white/70">{user.email}</p>
            </div>
          </div>
        )}

        {/* MENU */}
        <div className={`px-6 flex flex-col gap-3 ${user ? "pt-0" : "pt-16"}`}>
          {navbarLinks.map((item) => (
            <Link key={item.id} href={item.href}>
              <div
                onClick={() => setIsSheetOpen(false)}
                className={`flex items-center justify-between text-lg font-semibold px-5 py-4 rounded-xl cursor-pointer transition-all active:scale-95 ${
                  pathname === item.href
                    ? "bg-white/20 text-blue-200"
                    : "bg-white/10 hover:bg-white/20"
                }`}
              >
                <span>{item.label}</span>
                <span className="text-white/60 text-sm">→</span>
              </div>
            </Link>
          ))}

          <Link href="/admin/dashboard">
            <div
              onClick={() => setIsSheetOpen(false)}
              className="flex items-center cursor-pointer  justify-between px-5 py-4 rounded-xl bg-white/10 hover:bg-white/20 font-semibold"
            >
              <span>Dashboard</span>
              <span className="text-white/60 text-sm">→</span>
            </div>
          </Link>

          <div className="flex flex-col gap-2">
            <Link href="/bookings">
              <button className="flex cursor-pointer  items-center justify-center w-full bg-slate-200 transition hover:bg-slate-300 text-black font-bold py-3 rounded-xl cursor-pointer active:scale-95">
                Profile
              </button>
            </Link>

            {!user ? (
              <div
                onClick={() => {
                  setIsSheetOpen(false);
                  handleLoginClick();
                }}
                className="flex items-center justify-center bg-white text-blue-600 font-bold py-3 rounded-xl cursor-pointer active:scale-95"
              >
                Login
              </div>
            ) : (
              <button
                onClick={handleLogout}
                className="flex items-center justify-center w-full bg-red-500 transition hover:bg-red-600 text-white font-bold py-3 rounded-xl cursor-pointer active:scale-95"
              >
                Logout
              </button>
            )}

            {openProfileDropdown && (
              <div className="mt-3">
                <ProfileDropdown />
              </div>
            )}
          </div>
        </div>
      </div>

      <hr className="border-slate-300" />
    </div>
  );
};

export default NavBar;
