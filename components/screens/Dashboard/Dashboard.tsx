"use client";
import SectionHeader from "@/components/custom/SectionHeader/SectionHeader";
import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// services/dashboard.service.ts
import { authDash } from "@/components/services/authDash.service";
import { PageLoader } from "@/components/custom/loader/PageLoader";

// ------------------------- Types -------------------------
interface Car {
  brand?: string;
  model?: string;
  location?: string;
}

interface User {
  name?: string;
}

interface Booking {
  carId?: Car;
  userId?: User;
  totalAmount?: number;
  startDate: string;
  endDate: string;
}

interface Stats {
  totalCars: number;
  activeCars: number;
  inactiveCars: number;
  totalBookings: number;
  totalRevenue: number;
  latestBooking?: Booking | null;
  bookedCars: Booking[];
}

// ------------------------- Component -------------------------
const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats>({
    totalCars: 0,
    activeCars: 0,
    inactiveCars: 0,
    totalBookings: 0,
    totalRevenue: 0,
    latestBooking: null,
    bookedCars: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const response = await authDash.getAdminDashboard();
        const dashboardData = response.data.data;

        setStats({
          totalCars: dashboardData.totalCars ?? 0,
          activeCars: dashboardData.activeCars ?? 0,
          inactiveCars: dashboardData.inactiveCars ?? 0,
          totalBookings: dashboardData.totalBookings ?? 0,
          totalRevenue: dashboardData.totalRevenue ?? 0,
          latestBooking: dashboardData.latestBooking ?? null,
          bookedCars: dashboardData.bookedCars ?? [],
        });
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-5">
        <PageLoader loading={true} error={null} loadingText="Loading dashboard...">
          <div />
        </PageLoader>
      </div>
    );
  }

  // ------------------------- JSX -------------------------
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="w-full flex justify-start items-start text-left">
        <SectionHeader
          align="left"
          title="Admin Dashboard"
          subTitle="Monitor overall platform performance including total cars, bookings, revenue, and recent activities"
        />
      </div>

      <div className="border p-4 rounded-lg bg-slate-100">
        {/* Top Stats */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-6">
            <div>
              <p className="text-sm font-semibold text-slate-500">Total Cars</p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">{stats.totalCars}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">🚗</div>
          </div>

          <div className="flex items-center justify-between rounded-xl border bg-white border-slate-200 p-6">
            <div>
              <p className="text-sm font-semibold text-slate-500">Total bookings</p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">{stats.totalBookings}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">📄</div>
          </div>

          <div className="flex items-center justify-between rounded-xl border bg-white border-slate-200 p-6">
            <div>
              <p className="text-sm font-semibold text-slate-500">Total Active Cars</p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">{stats.activeCars}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">✅</div>
          </div>

          <div className="flex items-center font-semibold justify-between rounded-xl border bg-white border-slate-200 p-6">
            <div>
              <p className="text-sm text-slate-500">Total Inactive Cars</p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">{stats.inactiveCars}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">⚠️</div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Recent Bookings */}
          <div className="lg:col-span-2 rounded-xl border bg-white border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900">Recent Bookings</h2>
            <p className="mt-1 text-sm font-semibold text-slate-500">Latest customer bookings</p>

            <div className="mt-8 text-sm text-slate-400">
              {stats.latestBooking ? (
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
                  {/* Left Section: Car Info */}
                  <div className="flex flex-col space-y-1">
                    <p className="text-slate-700 font-semibold">
                      Brand: <span className="text-slate-900">{stats.latestBooking.carId?.brand || "Unknown"}</span>
                    </p>
                    <p className="text-slate-700 font-semibold">
                      Model: <span className="text-slate-900">{stats.latestBooking.carId?.model || "Unknown"}</span>
                    </p>
                    <p className="text-slate-500 text-xs">
                      Location: <span className="text-slate-900">{stats.latestBooking.carId?.location || "Unknown"}</span>
                    </p>
                  </div>

                  {/* Right Section: Booking Info */}
                  <div className="flex flex-col space-y-1 mt-3 sm:mt-0 text-right">
                    <p className="text-slate-500 text-xs">
                      Booked by: <span className="text-slate-900">{stats.latestBooking.userId?.name || "Unknown"}</span>
                    </p>
                    <p className="text-slate-500 text-xs">
                      Amount: <span className="text-slate-900">${stats.latestBooking.totalAmount || 0}</span>
                    </p>
                    <p className="text-slate-500 text-xs">
                      Dates:{" "}
                      <span className="text-slate-900">
                        {new Date(stats.latestBooking.startDate).toLocaleDateString()} -{" "}
                        {new Date(stats.latestBooking.endDate).toLocaleDateString()}
                      </span>
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-4 border rounded-lg bg-slate-50 text-slate-400">
                  No recent bookings available.
                </div>
              )}
            </div>
          </div>

          {/* Monthly Revenue */}
          <div className="rounded-xl border bg-white border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900">Total Revenue</h2>
            <p className="mt-1 font-semibold text-sm text-slate-500">Revenue for All time</p>
            <div className="mt-8 text-3xl font-bold text-blue-500">${stats.totalRevenue}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
