"use client";
import {
  // Car,
  CircleCheckBig,
  Fuel,
  MapPin,
  MoveLeft,
  Settings,
  UsersRound,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { carService } from "../../services/car.service";
import { Car } from "@/components/custom/carCard/CarCard";
import { useParams } from "next/navigation";
import { carBookingService } from "@/components/services/carBooking.service";
import PaymentModal from "./components/PaymentModal";

// types/car.ts
export type car = {
  _id: string;
  image: File;
  brand: string;
  model: string;
  manufacturingYear: number;
  dailyPrice: number;
  category: "suv" | "sedan" | "luxury";
  transmission: "automatic" | "manual";
  fuelType: "petrol" | "diesal" | "electric";
  seats: number;
  location: "delhi" | "pune" | "bangalore";
  description: string;
  status: "available" | "booked" | "inactive";
};

export const categoryFeatures = {
  suv: [
    "4 Wheel Drive",
    "Hill Assist",
    "Terrain Response Modes",
    "360° Camera",
    "Off-Road Suspension",
  ],

  sedan: [
    "Cruise Control",
    "Sunroof",
    "Rear AC Vents",
    "Push Button Start",
    "Lane Assist",
  ],

  luxury: [
    "Heated Seats",
    "Ventilated Seats",
    "Panoramic Sunroof",
    "Premium Sound System",
    "Ambient Lighting",
  ],
};

type Data = {
  pickupDate: string;
  returnDate: string;
};

type Error = {
  pickupDate?: string;
  returnDate?: string;
};

const CarRental = () => {
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams<{ id: string }>();
  const carId = params?.id;


  const fetchCars = async () => {
    try {
      const res = await carService.getCarById(carId);
      setCar(res.data.data || res.data); // backend compatible
    } catch (error) {
      console.error("Failed to fetch cars", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (carId) {
      fetchCars();
    }
  }, [carId]);

  const [formdata, setFormData] = useState<Data>({
    pickupDate: "",
    returnDate: "",
  });

  const [error, setError] = useState<Error>({});

  const today = new Date().toISOString().split("T")[0];

  const errorValidation = () => {
    const newErrors: Error = {};

    if (!formdata.pickupDate) {
      newErrors.pickupDate = "Pick-up Date Required";
    }

    if (!formdata.returnDate) {
      newErrors.returnDate = "Return Date Required";
    }

    if (
      formdata.pickupDate &&
      formdata.returnDate &&
      formdata.returnDate < formdata.pickupDate
    ) {
      newErrors.returnDate = "Return date must be after pickup date";
    }

    setError(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError((prev) => ({ ...prev, [name]: undefined }));
  };

  // const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   if (errorValidation()) {
  //     setFormData({
  //       pickupDate: "",
  //       returnDate: "",
  //     });
  //     console.log(formdata);
  //     toast.success("Added Submitted Successfully");
  //   }
  // };

  const features = car ? categoryFeatures[car.category] || [] : [];

  //////////////////////////////////////////////////////////////////////////////////////////booking part

  const [booking, setBooking] = useState<any>(null);
  const [paymentStatus, setPaymentStatus] = useState<
    "idle" | "booked" | "paid"
  >("idle");

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!errorValidation()) return;

    try {
      const payload = {
        carId: carId as string,
        startDate: formdata.pickupDate,
        endDate: formdata.returnDate,
      };

      const res = await carBookingService.createBooking(payload);

      setBooking(res.booking);
      setPaymentStatus("booked");

      toast.success("Booking Created");

      setFormData({
        pickupDate: "",
        returnDate: "",
      });
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Booking Failed");
    }
  };

  return (
    <div className="min-h-screen w-full">
      <div className="max-w-7xl px-4 lg:px-2 mx-auto flex flex-col justify-between items-center">
        <div className="w-full flex flex-col mt-12 md:mt-18">
          <Link href={"/cars"}>
            <button className="text-gray-500 font-semibold flex gap-2">
              <span className="text-blue-500">
                <MoveLeft />
              </span>
              Back to all cars
            </button>
          </Link>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-10 px-4 md:px-0 w-full mt-10 p-6">
          <div className="">
            {loading ? (
              <div className="w-[2000px] max-w-full h-[500px] bg-gray-200 animate-pulse rounded"></div>
            ) : (
              <Image
                loading="lazy"
                src={car?.image || "/car_image1.png"}
                alt={car ? `${car.brand} ${car.model}` : "img"}
                width={2000}
                height={500}
                className="rounded-md"
              />
            )}
          </div>
          <div className=" w-full">
            <form
              onSubmit={handleSubmit}
              className="border border-gray-200 bg-slate-100 flex flex-col gap-4 p-4 rounded-md "
            >
              <div className="flex justify-between ">
                <h1 className="text-2xl font-semibold">
                  {loading ? "..." : `$${car?.dailyPrice || 200}`}
                </h1>
                <p className="text-gray-500">Per Day</p>
              </div>
              <hr className="border w-full" />
              <div className="flex flex-col gap-2">
                <label htmlFor="date">Pickup Date</label>
                <input
                  name="pickupDate"
                  value={formdata.pickupDate}
                  onChange={handleInput}
                  type="date"
                  min={today}
                  className="border border-gray-300 rounded-md p-4"
                />
                {error.pickupDate && (
                  <p className="text-red-500 font-bold">{error.pickupDate}</p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="date">Return Date</label>
                <input
                  name="returnDate"
                  value={formdata.returnDate}
                  onChange={handleInput}
                  type="date"
                  min={formdata.pickupDate || today}
                  className="border border-gray-300 rounded-md p-4"
                />
                {error.returnDate && (
                  <p className="text-red-500 font-bold">{error.returnDate}</p>
                )}
              </div>
              <div>
                {paymentStatus === "idle" && (
                  <button
                    type="submit"
                    className="w-full py-2 cursor-pointer font-semibold text-white bg-blue-500 rounded-md"
                  >
                    Book Now
                  </button>
                )}

                {paymentStatus === "booked" && (
                  <button
                    type="button"
                    onClick={() => setIsPaymentModalOpen(true)}
                    className="w-full py-2 font-semibold text-white bg-green-500 rounded-md"
                  >
                    Pay Now
                  </button>
                )}

                {paymentStatus === "paid" && (
                  <button
                    disabled
                    className="w-full py-2 font-semibold text-white bg-gray-400 rounded-md"
                  >
                    Paid
                  </button>
                )}
              </div>
              <p className="text-sm text-gray-500 w-full flex items-center justify-center">
                No credit card required to reserve
              </p>
            </form>
          </div>
        </div>
        {loading ? (
          <div className="w-full mt-10 space-y-6">
            <div className="h-8 w-48 bg-gray-200 animate-pulse rounded"></div>
            <div className="h-4 w-32 bg-gray-200 animate-pulse rounded"></div>
            <hr className="border-t my-6 border w-full" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-24 bg-gray-200 animate-pulse rounded-md"
                ></div>
              ))}
            </div>
          </div>
        ) : car ? (
          <div className="w-full">
            <div className="w-full mt-10">
              <p className="text-3xl font-bold text-gray-900 capitalize tracking-tight">
                {car.brand} {car.model}
              </p>

              <div className="flex items-center gap-4 mt-2 text-sm">
                <p className="text-gray-500 font-medium capitalize">
                  {car.category} • {car.manufacturingYear}
                </p>

                <span
                  className={`px-2 py-0.5 rounded-md text-md font-semibold border ${
                    car.status === "available"
                      ? "bg-blue-50 text-blue-600 border-blue-100"
                      : car.status === "booked"
                        ? "bg-orange-50 text-orange-600 border-orange-100"
                        : "bg-gray-100 text-gray-600 border-gray-200"
                  }`}
                >
                  {car.status}
                </span>
              </div>
            </div>

            <hr className="border-t my-6 border w-full" />
            <div className="flex flex-col md:flex-row gap-6 md:gap-2 items-center mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center justify-around w-full md:w-1/2 px-4 md:px-0">
                <div className="flex flex-col items-center gap-2 px-16 py-3 bg-slate-100 rounded-md">
                  <p className="text-gray-500">
                    <UsersRound />
                  </p>
                  <p className="font-semibold">{car.seats} Seats</p>
                </div>
                <div className="flex flex-col items-center gap-2 px-8 py-3 bg-slate-100 rounded-md">
                  <p className="text-gray-500">
                    <Fuel />
                  </p>
                  <p className="font-semibold capitalize">{car.fuelType}</p>
                </div>
                <div className="flex flex-col items-center gap-2 px-8 py-3 bg-slate-100 rounded-md">
                  <p className="text-gray-500">
                    <Settings />
                  </p>
                  <p className="font-semibold capitalize">{car.transmission}</p>
                </div>
                <div className="flex flex-col items-center gap-2 px-8 py-3 bg-slate-100 rounded-md">
                  <p className="text-gray-500">
                    <MapPin />
                  </p>
                  <p className="font-semibold capitalize">{car.location}</p>
                </div>
              </div>
              <div className="w-full md:w-1/2 flex flex-col gap-5 p-5">
                <p className="text-xl font-semibold">About this car</p>
                <p className="text-gray-500 leading-relaxed">
                  {car.description}
                </p>
              </div>
            </div>
            <div className="w-full pb-6 md:pb-4 md:py-6 p-5 md:p-0">
              <p className="text-xl font-semibold">Baisc features:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:flex gap-4 py-4 md:gap-0 items-center justify-around pt-4">
                {features.map((feature, i) => (
                  <div key={i}>
                    <p className="flex gap-2 text-gray-500 font-semibold">
                      <span className="text-blue-500">
                        <CircleCheckBig />
                      </span>
                      {feature}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>
      {isPaymentModalOpen && booking && car && (
        <PaymentModal
          car={car}
          booking={booking}
          onClose={() => setIsPaymentModalOpen(false)}
          onPay={async () => {
            try {
              await carBookingService.payBooking(booking._id);

              setPaymentStatus("paid");
              setIsPaymentModalOpen(false);

              toast.success("Payment Successful 🎉");
            } catch {
              toast.error("Payment Failed");
            }
          }}
        />
      )}
    </div>
  );
};

export default CarRental;
