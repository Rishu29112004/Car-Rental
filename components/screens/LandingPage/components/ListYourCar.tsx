import React from "react";
import Image from "next/image";
import Link from "next/link";

const ListYourCar = () => {
  return (
    <div className="flex w-full items-center justify-center p-4 mb-12 md:mb-14 ">
      <div className="flex flex-col sm:flex-row p-6 ms:p-12 w-7xl gap-15 sm:gap-0 items-center justify-between rounded-2xl bg-gradient-to-r from-[#1F5EFF] via-[#4E86FF] to-[#A9C9FF]">
        <div className="flex flex-col gap-12 sm:gap-6 items-start">
          <p className="font-semibold text-white text-3xl">
            Do You Own a Luxury Car?
          </p>

          <p className="text-white">
            Monetize your vehicle effortlessly by listing it on CarRental.
            <br /> We take care of insurance, driver verification and secure
            payments — so
            <br />
            you can earn passive income, stress-free.
          </p>
          <Link href={"/admin/add-car"}>
            <button className="bg-white cursor-pointer rounded-lg font-bold text-blue-500 px-4 py-1">
              List your car
            </button>
          </Link>
        </div>
        <div className="">
          <Image
            src="/banner_car_image.png"
            alt="Logo"
            width={400}
            height={40}
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default ListYourCar;
