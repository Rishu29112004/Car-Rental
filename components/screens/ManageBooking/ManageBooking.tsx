"use client";

import { PageLoader } from "@/components/custom/loader/PageLoader";
import SectionHeader from "@/components/custom/SectionHeader/SectionHeader";
import { useEffect, useState } from "react";
import { authDash } from "@/components/services/authDash.service";
import clsx from "clsx";

const tableHeaders = ["Car Brand","Car Modal", "Date Range", "Total", "Payment"];

interface Booking {
  _id: string;
  carId: {
    brand?: string;
    model?: string;
  };
  startDate: string;
  endDate: string;
  totalAmount: number;
  paymentStatus: string;
}

const ManageBooking = () => {
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>([]);

useEffect(() => {
  let isMounted = true;

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await authDash.getAdminDashboard();
      if (isMounted) setBookings(res.data.data?.bookedCarsData || []);
    } catch (error) {
      if (isMounted) console.error("Failed to fetch bookings:", error);
    } finally {
      if (isMounted) setLoading(false);
    }
  };

  fetchBookings();

  return () => {
    isMounted = false; // cleanup
  };
}, []);


  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-5 rounded-md">
        <PageLoader loading={true} error={null} loadingText="Loading bookings...">
          <div />
        </PageLoader>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-5 rounded-md">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          title="Manage Bookings"
          subTitle="View all car bookings on the platform."
          align="left"
        />

        <div className="border rounded-md h-[77vh] overflow-auto bg-white">
          <table className="w-full border-collapse text-sm">
            {/* HEADER */}
            <thead className="bg-slate-100 sticky top-0 z-10">
              <tr className="text-gray-700 font-semibold">
                {tableHeaders.map((header) => (
                  <th key={header} className="px-4 py-3 text-left whitespace-nowrap">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            {/* BODY */}
            <tbody>
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                    No bookings available.
                  </td>
                </tr>
              ) : (
                bookings.map((booking) => (
                  <tr
                    key={booking._id}
                    className="border-b last:border-none hover:bg-slate-50 transition"
                  >
                    <td className="px-4 py-3 font-medium text-gray-800">
                      {booking.carId?.brand || "Unknown"|| ""}
                    </td>
                      <td className="px-4 py-3 font-medium text-gray-800">
                      {booking.carId?.model || ""}
                    </td>

                    <td className="px-4 py-3 text-gray-600">
                      {new Date(booking.startDate).toLocaleDateString()} →{" "}
                      {new Date(booking.endDate).toLocaleDateString()}
                    </td>

                    <td className="px-4 py-3 text-gray-700">₹{booking.totalAmount || 0}</td>

                    <td className="px-4 py-3">
                      <span
                        className={clsx(
                          "px-3 py-1 rounded-full text-xs font-semibold capitalize",
                          booking.paymentStatus?.toLowerCase() === "paid"
                            ? "bg-emerald-100 text-emerald-600"
                            : "bg-amber-100 text-amber-600"
                        )}
                      >
                        {booking.paymentStatus || "Pending"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageBooking;
