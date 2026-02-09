"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import CarCard, { Car } from "@/components/custom/carCard/CarCard";
import Title from "@/components/custom/SectionHeader/SectionHeader";
import { ArrowRight } from "lucide-react";
import { carService } from "@/components/services/car.service";

const FeaturedSection: React.FC = () => {
 
 const [carData, setCarData] = useState<Car[]>([]);

  useEffect(() => {
    const featuredCarData = async () => {
      try {
        const res = await carService.getAllCars();
        setCarData(res.data);
      } catch (error) {
        console.error("Failed to fetch featured cars:", error);
      }
    };

    featuredCarData();
  }, []);
  
  return (
    <section
      className="
        relative
        w-full
        bg-white
        z-10
        pt-14 md:pt-20
        mb-10 md:mb-14
      "
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-8 md:gap-12 px-4 sm:px-6 lg:px-0">
        {/* Section Title */}
        <Title
          title="Featured Vehicles"
          subTitle="Explore our selection of premium vehicles available for your next adventure."
          align="center"
        />

        {/* Cars Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 cursor-pointer lg:grid-cols-3 gap-8 sm:gap-10">
            {carData.slice(0,6).map((car: Car) => (
              <CarCard key={car._id} car={car} />
            ))}
          </div>

        {/* Explore Button */}
        <div className="flex justify-center pt-4">
          <Link href={"/cars"}>
            <button className="group flex items-center cursor-pointer gap-2 border border-gray-400 px-6 py-3 rounded-full text-sm md:text-base hover:bg-gray-900 hover:text-white transition-all duration-200">
              Explore all cars
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedSection;
