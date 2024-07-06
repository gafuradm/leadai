"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import MagicButton from "@/components/MagicButton";
import { Spotlight } from "@/components/ui/Spotlight";
import { PuffLoader } from "react-spinners";

const CabinetPage = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.push("/login");
      }
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, [router]);

  const tools = [
    { name: "IELTS Preparation", route: "/ielts" },
    { name: "SAT Preparation", route: "/sat" },
    { name: "HSK Preparation", route: "/hsk" },
    { name: "GRE Preparation", route: "/gre" },
    { name: "TOEFL Preparation", route: "/toefl" },
    { name: "Programming", route: "/prog" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-black-100">
        <PuffLoader size={60} color="#4A90E2" />
      </div>
    );
  }

  return user ? (
    <main className="relative flex flex-col justify-center items-center min-h-screen overflow-hidden bg-white dark:bg-black-100">
      <div className="absolute inset-0">
        <Spotlight className="-top-40 -left-10 md:-left-32 md:-top-20 h-screen" fill="white" />
        <Spotlight className="h-[80vh] w-[50vw] top-10 left-full from-gray-800 to-gray-900" fill="purple" />
        <Spotlight className="left-80 top-28 h-[80vh] w-[50vw]" fill="blue" />
      </div>
      <div className="relative z-10 w-full max-w-3xl p-6 mt-16">
        <section className="rounded-lg shadow-lg p-8 bg-gray-100 dark:bg-gray-900">
          <h1 className="text-2xl font-bold mb-8 text-center">Dashboard</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {tools.map((tool, index) => (
              <MagicButton
                key={index}
                title={tool.name}
                handleClick={() => router.push(tool.route)}
                otherClasses="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                position="left"
              />
            ))}
          </div>
          <div className="flex justify-center">
            <MagicButton
              title="Profile"
              handleClick={() => router.push("/dashboard")}
              otherClasses="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
              position="left"
            />
          </div>
        </section>
      </div>
    </main>
  ) : (
    <p>Loading...</p>
  );
};

export default CabinetPage;