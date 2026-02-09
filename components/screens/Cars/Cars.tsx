"use client";

import { useEffect, useRef, useState } from "react";
import { carService } from "../../services/car.service";
import { Filter, Search } from "lucide-react";
import CarCard, { Car } from "@/components/custom/carCard/CarCard";
import Footer from "@/components/custom/Footer/Footer";
import { useRouter } from "next/navigation";
import Image from "next/image";

const Cars = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);


  const [searchItem, setSearchItem] = useState("");
  const [filterCar, setFilterCar] = useState<Car[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();

  // const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

 useEffect(() => {
  if (searchItem.trim() === "") {
    setFilterCar([]);
    setShowDropdown(false);
    return;
  }

  const results = cars.filter((car) =>
    `${car.brand} || ${car.model} || ${car.dailyPrice} || ${car.description} || ${car.model}`.toLowerCase().includes(searchItem.toLowerCase())
  );

  setFilterCar(results);
  setShowDropdown(results.length > 0);
}, [searchItem, cars]);


  const handleSelectCar = (carId: string) => {
    router.push(`/car-details/${carId}`);
    setShowDropdown(false);
    setSearchItem("");
  };

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

  useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node) &&
      inputRef.current &&
      !inputRef.current.contains(event.target as Node)
    ) {
      setShowDropdown(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);

  return (
    <div className="w-full flex flex-col">
      {/* ===== HEADER ===== */}
      <div className="w-full bg-slate-100 text-center flex items-center flex-col px-4 md:px-0 p-12">
        <h1 className="text-3xl md:text-5xl font-semibold mb-4 md:mb-6">
          Available Cars
        </h1>
        <p className="text-md font-normal mb-8 md:mb-10 max-w-2xl text-black">
          Browse our selection of premium vehicles available for your next
          adventure
        </p>

        {/* Search UI (same as before, logic later add kar sakte hain) */}
        <div className="relative mx-auto w-full max-w-xl">
          <div className=" flex w-full max-w-xl items-center gap-3 rounded-full border border-gray-200 bg-white px-4 py-3 shadow-md">
            <Search className="h-4 w-4 shrink-0 text-gray-500" />
            <input
              ref={inputRef}
              type="text"
              value={searchItem}
              onChange={(e) => setSearchItem(e.target.value)}
              placeholder="Search by make, model, or features"
              className="w-full bg-transparent text-sm text-gray-700 placeholder-gray-400 focus:outline-none"
            />
            <Filter className="h-4 w-4 shrink-0 cursor-pointer text-gray-500" />
          </div>
          {showDropdown && (
            <div
              ref={dropdownRef}
              className="absolute cursor-pointer items-center p-3 top-full mt-1 w-full max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg z-50"
            >
              {filterCar.map((car) => (
                <div
                  key={car._id}
                  onClick={() => handleSelectCar(car._id)}
                  className="flex items-center rounded-full gap-3  px-4 py-2 cursor-pointer hover:bg-gray-100 transition-colors"
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

      {/* ===== CONTENT ===== */}
      <div className="mb-12 md:mb-14 p-4 md:p-0">
        <div className="max-w-7xl mx-auto">
          <p className="text-gray-500 font-semibold py-6">
            Showing {cars.length} Cars
          </p>

          {/* Loading */}
          {loading && (
            <p className="text-center text-gray-500 py-10">Loading cars...</p>
          )}

          {/* Empty */}
          {!loading && cars.length === 0 && (
            <p className="text-center text-gray-500 py-10">No cars available</p>
          )}

          {/* Cars Grid */}
          {!loading && cars.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
              {cars.map((car) => (
                <CarCard car={car} key={car._id} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cars;
