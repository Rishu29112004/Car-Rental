"use client";

import { Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import { cityList } from "@/public/assets";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { carService } from "@/components/services/car.service"; // Adjust the path if needed

const HeroSection = () => {
  const [pickupLocation, setPickupLocation] = useState("");
  const [cars, setCars] = useState<any[]>([]);
  const [filteredCars, setFilteredCars] = useState<any[]>([]);
  const router = useRouter();

  // Fetch all cars from backend
  const fetchCars = async () => {
    try {
      const res = await carService.getAllCars();
      setCars(res.data.data || res.data); // backend response may vary
    } catch (error) {
      console.error("Failed to fetch cars", error);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  // Filter cars by location safely
  useEffect(() => {
    if (!pickupLocation) {
      setFilteredCars([]);
      return;
    }

    const results = cars.filter(
      (car) =>
        car.location && car.location.toLowerCase() === pickupLocation.toLowerCase()
    );

    setFilteredCars(results);
  }, [pickupLocation, cars]);

  // Handle search submit
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (!pickupLocation) return alert("Please select a location");

    if (filteredCars.length > 0) {
      // Redirect to first car details
      router.push(`/car-details/${filteredCars[0]._id}`);
    } else {
      alert("No cars available at this location");
    }
  };

  return (
    <div className="bg-slate-100 w-full flex md:min-h-screen mb-12 md:mb-14">
      <div className="max-w-7xl mx-auto text-center flex items-center flex-col px-4 md:px-0 pt-12">
        <h1 className="text-3xl md:text-5xl font-semibold mb-4 md:mb-6">
          Luxury cars on Rent
        </h1>
        <p className="text-md font-normal mb-8 md:mb-10 max-w-2xl text-black">
          Experience elegance, comfort, and performance with our exclusive
          collection of luxury vehicles—perfect for business trips, vacations,
          or special occasions.
        </p>

        {/* Search Card */}
        <form
          onSubmit={handleSearch}
          className="mx-auto w-full max-w-6xl bg-white shadow-[0_10px_30px_rgba(0,0,0,0.08)] rounded-3xl md:rounded-full px-6 py-5 flex flex-col md:flex-row gap-6 md:gap-8 items-stretch md:items-center mb-10"
        >
          {/* Pickup Location */}
          <div className="flex flex-col w-full md:items-start">
            <span className="text-xs font-medium text-gray-500">
              Pickup Location
            </span>
            <div className="relative">
              <select
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
                required
                className="w-full appearance-none bg-transparent text-sm font-medium text-gray-800 pr-6 focus:outline-none"
              >
                <option value="">Please select location</option>
                {cityList.map((city) => (
                  <option key={city.toLowerCase()} value={city.toLowerCase()}>
                    {city}
                  </option>
                ))}
              </select>

              {/* Arrow */}
              <svg
                className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" />
              </svg>
            </div>
          </div>

          {/* Pickup Date */}
          <div className="flex flex-col w-full md:items-start">
            <span className="text-xs font-medium text-gray-500">Pick-up Date</span>
            <input
              type="date"
              min={new Date().toISOString().split("T")[0]}
              required
              className="bg-transparent text-sm font-medium text-gray-800 focus:outline-none"
            />
          </div>

          {/* Return Date */}
          <div className="flex flex-col w-full md:items-start">
            <span className="text-xs font-medium text-gray-500">Return Date</span>
            <input
              type="date"
              required
              className="bg-transparent text-sm font-medium text-gray-800 focus:outline-none"
            />
          </div>

          {/* Search Button */}
          <button
            type="submit"
            className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-medium transition flex items-center justify-center gap-2 shrink-0"
          >
            <Search className="h-4 w-4" />
            Search
          </button>
        </form>

        {/* Hero Image */}
        <div className="mb-6 md:mb-0">
          <Image
            src="/main_car.png"
            alt="Car"
            width={800}
            height={600}
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
