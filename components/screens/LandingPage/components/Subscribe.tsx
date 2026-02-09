"use client";
import { useState } from "react";
import emailjs from "@emailjs/browser";
import SectionHeader from "@/components/custom/SectionHeader/SectionHeader";

const Subscribe = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("first check");

    emailjs
      .send(
        "EmailJS",
        "template_4hc1h7a", // ✅ NEW TEMPLATE
        { Email: email }, // ✅ only email
        "surJQeZfOB9k_Riok"
      )
      .then(() => {
        console.log("second check at here ");
        alert("Subscribed ✅");
        setEmail("");
      })
      .catch(() => {
        console.log("failed at her");
        alert("Failed ❌");
      });
  };

  return (
    <div className="w-full mb-12 md:mb-14">
      <div className="max-w-7xl mx-auto flex flex-col items-center w-full p-4 md:p-6">
        <SectionHeader
          title="Never Miss a Deal!"
          subTitle="Subscribe to get the latest offers, new arrivals, and exclusive discounts"
        />
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-4xl flex flex-col sm:flex-row bg-white rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] ring-1 ring-black/5 overflow-hidden"
        >
          <input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full flex-1 px-6 py-4 text-base outline-none placeholder:text-gray-400"
          />
          <button
            type="submit"
            className="w-full cursor-pointer sm:w-auto px-10 py-4 font-medium text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 transition-all duration-200"
          >
            Subscribe
          </button>
        </form>
      </div>
    </div>
  );
};

export default Subscribe;
