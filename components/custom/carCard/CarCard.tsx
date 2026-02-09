"use client";
// components/CarCard.tsx
import React from "react";
import Image from "next/image";
import { Dot } from "lucide-react";
import type { StaticImageData } from "next/image";
import { assets } from "@/public/assets";
import { useRouter } from "next/navigation";

// --- TypeScript Interface ---
export interface Car {
  _id: string; // Database ID
  owner: string; // Who owns the car
  brand: string; // Matches z.string() in schema
  model: string; // Matches z.string() in schema
  image: string; // In schema, it's a File; in DB, it could be URL string
  manufacturingYear: number; // Matches 'manufacturingYear' in schema
  dailyPrice: number; // Matches 'dailyPrice' in schema
  category: "suv" | "sedan" | "luxury"; // z.enum values
  transmission: "automatic" | "manual"; // z.enum values
  fuelType: "petrol" | "diesal" | "electric"; // z.enum values
  seats: number; // Matches 'seats' in schema
  location: "delhi" | "pune" | "bangalore"; // z.enum values
  description: string; // Matches schema
  isAvailable: boolean; // Availability flag
  createdAt: string; // Timestamp
  status: "available" | "booked" | "inactive";
}

// --- Props Interface ---
interface CarCardProps {
  car: Car;
}

// --- CarCard Component ---
const CarCard = ({ car }: CarCardProps) => {
  const currency = process.env.NEXT_PUBLIC_CURRENCY || "$";
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`car-details/${car._id}`)}
      className="w-full bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
    >
      {/* Car Image */}
      <div className="relative h-52 w-full overflow-hidden rounded-t-2xl">
        <Image
          src={car.image || "/images/placeholder.png"}
          alt="Car"
          width={400}
          height={300}
        />
<span className={`absolute top-3 left-3 bg-white/70 text-[10px] font-bold px-2.5 py-1 rounded-md shadow-sm border border-gray-100 ${car.status === "available" ? "text-blue-600" : car.status === "booked" ? "text-orange-600" : "text-gray-500"}`}>{car.status === "available" ? "Available" : car.status === "booked" ? "Booked" : "Inactive"}</span>


        <div className="absolute bottom-4 right-4 bg-black/80 text-white px-4 py-2 rounded-lg text-sm font-semibold">
          {currency}
          <span className="font-normal">{car.dailyPrice}</span>
        </div>
      </div>

      {/* Car Info */}
      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-900">
          {car.brand} {car.model}
        </h3>

        <p className="flex items-center gap-1 text-sm text-gray-500 mt-1">
          {car.category}
          <Dot size={14} />
          {car.manufacturingYear}
        </p>

        {/* Car Specs */}
        <div className="mt-5 grid grid-cols-2 gap-y-3 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Image src={assets.users_icon} alt="Seats" width={16} height={16} />
            {car.seats} Seats
          </div>

          <div className="flex items-center gap-2">
            <Image src={assets.fuel_icon} alt="Fuel" width={16} height={16} />
            {car.fuelType}
          </div>

          <div className="flex items-center gap-2">
            <Image
              src={assets.car_icon}
              alt="Transmission"
              width={16}
              height={16}
            />
            {car.transmission}
          </div>

          <div className="flex items-center gap-2">
            <Image
              src={assets.location_icon}
              alt="Location"
              width={16}
              // height={16}
              style={{ width: 16, height: "auto" }} // keeps original aspect ratio
            />
            {car.location}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarCard;
