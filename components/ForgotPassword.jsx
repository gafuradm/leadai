"use client";

import React, { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MagicButton from "@/components/MagicButton";
import { Spotlight } from "@/components/ui/Spotlight";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    if (!email) {
      toast.error("Please enter your email.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset email sent!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (err) {
      setError(err.message);
      toast.error(`Firebase: Error (${err.code}).`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <main className="relative flex justify-center items-center min-h-screen overflow-hidden">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="absolute inset-0 dark:bg-black-100 bg-black dark:bg-grid-white/[0.03] bg-grid-black-100/[0.2] flex items-center justify-center">
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-white-100 bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      </div>
      <div className="relative z-10 flex justify-center items-center min-h-screen w-full">
        <div className="w-full max-w-sm p-6 mt-16">
          <section className="rounded-lg">
            <div className="max-w-2xl mx-auto p-5 rounded-lg">
              <form onSubmit={handleSubmit} className="space-y-5 flex flex-col items-center">
                <div className="w-full flex flex-col items-center">
                  <label className="block text-lg font-medium text-black">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-1/3 px-4 py-2 border rounded-lg focus:outline-none focus:border-indigo-500 bg-gray-700 bg-white text-black"
                    placeholder="Enter your email"
                  />
                </div>
                {error && <p className="text-red-500">{error}</p>}
                <div className="flex justify-center">
                  <MagicButton
                    title="Send Reset Email"
                    handleClick={handleSubmit}
                    otherClasses="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md"
                    position="left"
                  />
                </div>
                <div className="flex flex-col items-center mt-2">
                  <a href="/login" className="text-gray-400 text-sm mb-1 text-black">Remember your password?</a>
                  <a href="/signup" className="text-gray-400 text-sm text-black">Don&apos;t have an account yet?</a>
                </div>
              </form>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default ForgotPasswordPage;
