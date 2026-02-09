"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Fuel, UsersRound, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import confetti from "canvas-confetti"; // ⭐ NEW

type Props = {
  car: any;
  booking: any;
  onClose: () => void;
  onPay: () => Promise<void>;
};

const PaymentModal = ({ car, booking, onClose, onPay }: Props) => {
  const [isPaying, setIsPaying] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // ⭐ CONFETTI FUNCTION (Celebration Only)
  const fireConfetti = () => {
    const duration = 2500;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 6,
        spread: 70,
        origin: { y: 0.6 },
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  };

  const totalDays = Math.ceil(
    (new Date(booking.endDate).getTime() -
      new Date(booking.startDate).getTime()) /
      (1000 * 60 * 60 * 24)
  );

  const handlePay = async () => {
    try {
      setIsPaying(true);

      await onPay();

      fireConfetti(); // 🎉 Celebration Added

      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 2200);
    } catch {
      setIsPaying(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50">

      {/* SUCCESS SCREEN */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black flex flex-col items-center justify-center z-[60]"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="flex flex-col items-center gap-4"
            >
              <CheckCircle2 className="text-green-400" size={90} />

              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-white text-3xl font-bold"
              >
                Payment Successful 🎉
              </motion.h2>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-gray-300"
              >
                Your booking is confirmed
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN MODAL (UNCHANGED UI) */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 180, damping: 18 }}
        className="w-[440px] max-w-[95vw]"
      >
        <Card className="rounded-3xl shadow-2xl border-0 overflow-hidden">
          <CardContent className="p-6 space-y-5">

            <h2 className="text-2xl font-semibold text-center">
              Confirm Payment
            </h2>

            <div className="relative w-full h-44 rounded-xl overflow-hidden">
              <Image
                src={car.image}
                alt={car.brand}
                fill
                className="object-cover"
              />
            </div>

            <div className="text-center space-y-1">
              <p className="font-semibold text-lg">
                {car.brand} {car.model}
              </p>

              <div className="flex justify-center gap-6 text-sm text-gray-500">
                <p className="flex gap-1 items-center">
                  <UsersRound size={16} /> {car.seats} Seats
                </p>
                <p className="flex gap-1 items-center">
                  <Fuel size={16} /> {car.fuelType}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl text-sm space-y-2">
              <div className="flex justify-between">
                <span>Start Date</span>
                <span>{booking.startDate.slice(0, 10)}</span>
              </div>
              <div className="flex justify-between">
                <span>End Date</span>
                <span>{booking.endDate.slice(0, 10)}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Days</span>
                <span>{totalDays}</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between font-medium">
                <span>Daily Price</span>
                <span>${car.dailyPrice}</span>
              </div>

              <div className="flex justify-between text-xl font-bold">
                <span>Total</span>
                <span>${booking.totalAmount}</span>
              </div>
            </div>

            <div className="flex gap-3 pt-2 w-full">
              <Button
                variant="outline"
                className="flex-1 h-11 cursor-pointer rounded-xl"
                onClick={onClose}
                disabled={isPaying}
              >
                Cancel
              </Button>

              <Button
                className="flex-1 h-11 cursor-pointer rounded-xl bg-green-500 hover:bg-green-600"
                onClick={handlePay}
                disabled={isPaying}
              >
                {isPaying ? "Processing..." : "Pay Now"}
              </Button>
            </div>

          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default PaymentModal;
