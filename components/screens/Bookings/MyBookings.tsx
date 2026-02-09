"use client";

import Footer from "@/components/custom/Footer/Footer";
import React, { useEffect, useState } from "react";
import { useModal } from "@/context/modal-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/context/auth-context";
import UserProfileEdit from "@/components/custom/userProfile/component/UserProfileEdit";
import MyBookingsCard from "./component/MyBookingsCard";
import axiosInstance from "@/components/services/url.service";
import { carBookingService } from "@/components/services/carBooking.service";

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  imageUrl?: string;
}

interface Booking {
  _id: string;
  carId: any;
  startDate: string;
  endDate: string;
  totalAmount: number;
  bookingStatus: string;
  paymentStatus: string;
}

const MyBookings = () => {
  const { openSheet } = useModal();
  const { user } = useAuth();

  const [profileDetails, setProfileDetails] = useState<UserProfile | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const initials =
    user?.name
      ?.split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase() || "";

  /* ✅ PROFILE FETCH */
  const fetchProfileData = async () => {
    if (!user?._id) return;
    try {
      const res = await axiosInstance.get(`/api/profile/${user._id}`);
      setProfileDetails(res.data.data);
    } catch (error) {
      console.error("Profile fetch error", error);
    }
  };

  /* ✅ BOOKINGS FETCH */
  const fetchMyBookings = async () => {
    try {
      const res = await carBookingService.getMyBookings();
      setBookings(res.bookings || []);
    } catch (error) {
      console.error("Booking fetch error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchProfileData();
      fetchMyBookings();
    }
  }, [user]);

  /* ✅ EDIT OPEN */
  const handleEdit = () => {
    if (!user) return;

    openSheet(
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Update user details</h2>
        <UserProfileEdit userId={user._id} onSuccess={fetchProfileData} />
      </div>
    );
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 flex flex-col">

      {/* HERO */}
      <div className="w-full bg-gradient-to-r from-black via-gray-900 to-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold">My Profile</h1>
          <p className="text-gray-300 mt-2 text-lg">
            View and manage your profile details
          </p>
        </div>
      </div>

      {/* PROFILE CARD */}
      <div className="-mt-10 px-4 md:px-0">
        <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl p-6 md:p-10 border border-slate-200">

          <div className="flex flex-col md:flex-row items-center gap-8">

            {/* Avatar */}
            <div className="flex flex-col items-center">
              <Avatar className="w-44 h-44">
                <AvatarImage
                  src={profileDetails?.imageUrl || user?.imageUrl || ""}
                />
                <AvatarFallback className="bg-blue-600 text-white text-6xl">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <p className="mt-3 text-sm text-slate-500">Profile Photo</p>
            </div>

            {/* Details */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                {profileDetails?.name || user?.name}
              </h2>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                <p>Email: {profileDetails?.email || user?.email}</p>
                <p>Phone: {profileDetails?.phone || user?.phone || "Empty"}</p>
                <p className="md:col-span-2">
                  Bio: {profileDetails?.bio || user?.bio || "No bio"}
                </p>
              </div>

              <div className="pt-6">
                <button
                  onClick={handleEdit}
                  className="bg-black cursor-pointer text-white px-8 py-3 rounded-full"
                >
                  Edit Profile
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* BOOKINGS */}
      <div className="max-w-7xl mx-auto flex flex-col px-4 md:px-0 p-5 mt-12 w-full">
        <h1 className="text-3xl md:text-4xl font-semibold mb-4">
          My Bookings
        </h1>

        <div className="grid grid-cols-1 gap-6">
          {loading ? (
            <p>Loading bookings...</p>
          ) : bookings.length === 0 ? (
            <p>No bookings found</p>
          ) : (
            bookings.map((booking) => (
              <MyBookingsCard key={booking._id} booking={booking} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MyBookings;
