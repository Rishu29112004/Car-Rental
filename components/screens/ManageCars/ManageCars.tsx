"use client";

import SectionHeader from "@/components/custom/SectionHeader/SectionHeader";
import React, { useState, useEffect } from "react";
import clsx from "clsx";
import { Pencil, Trash2 } from "lucide-react";
import { useModal } from "@/context/modal-context";
import DeleteCarModal from "./component/DeleteCarModal";
import EditCarDetailsForm from "./component/EditCarDetailsForm";
import { carService } from "@/components/services/car.service";
import { PageLoader } from "@/components/custom/loader/PageLoader";
import { toast } from "sonner";

const tableHeaders = [
  "Car",
  "Category",
  "Price",
  "Status",
  "Changes",
  "Delete",
];

const ManageCars = () => {
  const { openSheet, openModal } = useModal();

  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch user's cars
const fetchMyCars = async () => {
  try {
    setLoading(true);
    const response = await carService.getMyCars();
    setCars(response.data || []);
 
  } catch (error: any) {
    toast.error("Failed to fetch your cars");
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  let isMounted = true;

  const fetchMyCars = async () => {
    try {
      setLoading(true);
      const response = await carService.getMyCars();
      if (isMounted) setCars(response.data || []);
    } catch (error: any) {
      if (isMounted) toast.error("Failed to fetch your cars");
    } finally {
      if (isMounted) setLoading(false);
    }
  };

  fetchMyCars();

  return () => {
    isMounted = false; // cleanup on unmount
  };
}, []);



  const handleEdit = (car: any) => {
    openSheet(
      <div >
        <h2 className="text-xl font-bold mb-4">Edit Car Details</h2>
        <EditCarDetailsForm carId={car._id}  refreshCars={fetchMyCars} />
      </div>
    );
  };

  const handleDelete = async (carId: string, carName: string) => {
    openModal(
      <DeleteCarModal
        carName={carName}
        onConfirmDelete={async () => {
          try {
            const response = await carService.deleteCar(carId);
            
            if (response.status === "success") {
              toast.success(response.message || `${carName} deleted successfully! 🗑️`);
              // Refresh the list after deletion
              const refreshResponse = await carService.getMyCars();
              setCars(refreshResponse.data || []);
            } else {
              toast.error(response.message || "Failed to delete car");
            }
          } catch (error: any) {
            const errorMessage = error.response?.data?.message || `Failed to delete ${carName}`;
            toast.error(errorMessage);
            console.error(`Failed to delete car: ${carName}`, error);
          }
        }}
      />
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-5 rounded-md">
        <PageLoader loading={true} error={null} loadingText="Loading your cars...">
          <div />
        </PageLoader>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-5 rounded-md">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          title="Manage Cars"
          subTitle="View all listed cars, update their details, or remove them from the booking platform."
          align="left"
        />

        <div className="border rounded-md h-[77vh] overflow-auto bg-white">
          <table className="w-full border-collapse text-sm">
            {/* TABLE HEAD */}
            <thead className="bg-slate-100 sticky top-0 z-10">
              <tr className="text-gray-700 font-semibold">
                {tableHeaders.map((header) => (
                  <th
                    key={header}
                    className="px-4 py-3 text-left whitespace-nowrap"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            {/* TABLE BODY */}
            <tbody>
              {cars.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    No cars found. Add your first car to get started.
                  </td>
                </tr>
              ) : (
                cars.map((car: any) => (
                  <tr
                    key={car._id}
                    className="border-b last:border-none hover:bg-slate-50 transition"
                  >
                    <td className="px-4 py-3 font-medium text-gray-800">
                      {car.brand} {car.model}
                    </td>

                    <td className="px-4 py-3 text-gray-600 capitalize">{car.category}</td>

                    <td className="px-4 py-3 text-gray-700">₹{car.dailyPrice}</td>

                    <td className="px-4 py-3">
                      <span
                        className={clsx(
                          "px-3 py-1 rounded-full text-xs font-semibold capitalize",
                          car.status === "available" && "bg-blue-100 text-blue-600",
                          car.status === "booked" && "bg-amber-100 text-amber-600",
                          car.status === "inactive" &&
                            "bg-slate-200 text-slate-600",
                        )}
                      >
                        {car.status}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleEdit(car)}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-md
                        bg-blue-50 text-blue-600 border cursor-pointer border-blue-200
                        hover:bg-blue-100 transition"
                      >
                        <Pencil size={14} />
                        Edit
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleDelete(car._id, `${car.brand} ${car.model}`)}
                        className="flex items-center cursor-pointer gap-2 px-3 py-1.5 text-sm rounded-md
                        bg-red-50 text-red-600 border border-red-200
                        hover:bg-red-100 transition"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
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

export default ManageCars;
