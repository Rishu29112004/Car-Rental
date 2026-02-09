import React from "react";
import Image from "next/image";

export interface Car {
  _id: string;
  owner: string;
  brand: string;
  model: string;
  image: string;
  manufacturingYear: number;
  dailyPrice: number;
  category: "suv" | "sedan" | "luxury";
  transmission: "automatic" | "manual";
  fuelType: "petrol" | "diesal" | "electric";
  seats: number;
  location: "delhi" | "pune" | "bangalore";
  description: string;
  isAvailable: boolean;
  createdAt: string;
}

interface Booking {
  _id: string;
  carId: Car;
  startDate: string;
  endDate: string;
  totalAmount: number;
  bookingStatus: string;
  paymentStatus: string;
}

interface Props {
  booking: Booking;
}

const MyBookingsCard = ({ booking }: Props) => {
  const carData = booking.carId;

  return (
    <div className="w-full max-w-6xl mx-auto bg-white border border-slate-200 rounded-3xl shadow-xl hover:shadow-2xl transition p-4 md:p-6 flex flex-col md:flex-row gap-6">

      {/* Image */}
      <div className="relative w-full md:w-[320px] h-[220px] md:h-auto rounded-2xl overflow-hidden">
        <Image
          src={carData?.image || "/car_image1.png"}
          alt="Car"
          fill
          className="object-cover"
        />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-between">

        {/* Top */}
        <div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <h2 className="text-2xl md:text-3xl font-semibold">
              {carData?.brand} {carData?.model}
            </h2>

            <span
              className={`text-xs px-3 py-1 rounded-full w-fit ${
                booking.paymentStatus === "confirmed"
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {booking.paymentStatus}
            </span>
          </div>

          <p className="text-gray-500 mt-1 capitalize">
            {carData?.category} • {carData?.manufacturingYear}
          </p>

          {/* Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 mt-6 text-sm">

            <div>
              <p className="text-gray-400">Booking ID</p>
              <p className="font-semibold">#{booking._id.slice(-6)}</p>
            </div>

            <div>
              <p className="text-gray-400">Pick-up Date</p>
              <p className="font-semibold">
                {new Date(booking.startDate).toDateString()}
              </p>
            </div>

            <div>
              <p className="text-gray-400">Drop-off Date</p>
              <p className="font-semibold">
                {new Date(booking.endDate).toDateString()}
              </p>
            </div>

            <div>
              <p className="text-gray-400">Location</p>
              <p className="font-semibold capitalize">{carData?.location}</p>
            </div>

            <div>
              <p className="text-gray-400">Seats</p>
              <p className="font-semibold">{carData?.seats} Seats</p>
            </div>

            <div>
              <p className="text-gray-400">Transmission</p>
              <p className="font-semibold capitalize">
                {carData?.transmission}
              </p>
            </div>

            <div>
              <p className="text-gray-400">Fuel Type</p>
              <p className="font-semibold capitalize">
                {carData?.fuelType}
              </p>
            </div>

            <div>
              <p className="text-gray-400">Total Price</p>
              <p className="text-xl font-bold text-black">
                ₹{booking.totalAmount}
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default MyBookingsCard;
