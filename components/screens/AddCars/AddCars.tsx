"use client"
import SectionHeader from "@/components/custom/SectionHeader/SectionHeader";
import { AddCarForm } from "./component/AddCarform";
import { useEffect, useState } from "react";
import { PageLoader } from "@/components/custom/loader/PageLoader";

const AddCarsPage = () => {
    const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Agar koi API call hai to yaha karo
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500); // fake loading (remove if API exists)

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-5">
        <PageLoader loading={true} error={null} loadingText="Preparing form...">
          <div />
        </PageLoader>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-white space-y-6">
      <SectionHeader
        align="left"
        title="Add New Car"
        subTitle="Fill in details to list a new car for booking, including pricing, availability, and car specifications."
      />

      <AddCarForm />
    </div>
  );
};

export default AddCarsPage;
