"use client";

import React from "react";
import { navItems } from "@/data";
import { FloatingNav } from "@/components/ui/FloatingNavbar";
import Footer from "@/components/Footer";
import Clients from "@/components/Clients";

const Reviews = () => {
  return (
    <main className="relative bg-gray-900 text-white flex justify-center items-center flex-col overflow-hidden mx-auto sm:px-10 px-5" style={{ paddingTop: "60px" }}>
      <div className="max-w-7xl w-full">
        <FloatingNav navItems={navItems} />
        <Clients />
        <Footer />
      </div>
    </main>
  );
};

export default Reviews;

