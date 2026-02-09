import React from "react";
import Image from "next/image";
import { FacebookIcon, InstagramIcon, Mail, TwitchIcon } from "lucide-react";

const Footer = () => {
  return (
    <div className="w-full bg-slate-100 py-12 text-gray-700">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between gap-10">
          {/* Left Section */}
          <div className="flex flex-col gap-4 md:w-1/2">
            <Image
              src="/logo.svg"
              alt="Logo"
              width={150}
              height={50}
            />
            <p className="text-sm leading-relaxed max-w-md">
              Discover a seamless car rental experience with luxury and everyday
              vehicles, designed to make every journey comfortable and stylish.
            </p>

            <div className="flex items-center gap-4">
              <FacebookIcon className="cursor-pointer hover:text-black transition" />
              <InstagramIcon className="cursor-pointer hover:text-black transition" />
              <TwitchIcon className="cursor-pointer hover:text-black transition" />
              <Mail className="cursor-pointer hover:text-black transition" />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex flex-wrap justify-between gap-10 md:w-1/2">
            <div className="flex flex-col gap-2 text-sm">
              <h1 className="font-semibold text-gray-900">QUICK LINKS</h1>
              <p className="hover:text-black cursor-pointer">Home</p>
              <p className="hover:text-black cursor-pointer">Browse Cars</p>
              <p className="hover:text-black cursor-pointer">List Your Car</p>
              <p className="hover:text-black cursor-pointer">About Us</p>
            </div>

            <div className="flex flex-col gap-2 text-sm">
              <h1 className="font-semibold text-gray-900">RESOURCES</h1>
              <p className="hover:text-black cursor-pointer">Help Center</p>
              <p className="hover:text-black cursor-pointer">
                Terms of Service
              </p>
              <p className="hover:text-black cursor-pointer">Privacy Policy</p>
              <p className="hover:text-black cursor-pointer">Insurance</p>
            </div>

            <div className="flex flex-col gap-2 text-sm">
              <h1 className="font-semibold text-gray-900 pb-1">CONTACT</h1>
              <p>1234 Luxury Drive</p>
              <p>San Francisco, CA 94107</p>
              <p>+1 234 567 890</p>
              <p>info@example.com</p>
            </div>
          </div>
        </div>

        <hr className="border-gray-400 my-6" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
          <p>© 2026 Brand. All rights reserved.</p>

          <div className="flex items-center gap-4">
            <p className="hover:text-black cursor-pointer">Privacy</p>
            <span>|</span>
            <p className="hover:text-black cursor-pointer">Terms</p>
            <span>|</span>
            <p className="hover:text-black cursor-pointer">Cookies</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
