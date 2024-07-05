"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Spotlight } from "@/components/ui/Spotlight";
import MagicButton from "@/components/MagicButton";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/cabinet");
    } catch (err) {
      if (
        err.code === "auth/invalid-email" ||
        err.code === "auth/user-not-found" ||
        err.code === "auth/wrong-password"
      ) {
        toast.error(
          "Your email or password is incorrect, please enter correct information."
        );
      } else {
        toast.error("An error occurred, please try again.");
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
      <div className="absolute inset-0">
        <Spotlight className="-top-40 -left-10 md:-left-32 md:-top-20 h-screen" fill="white" />
        <Spotlight className="h-[80vh] w-[50vw] top-10 left-full" fill="purple" />
        <Spotlight className="left-80 top-28 h-[80vh] w-[50vw]" fill="blue" />
      </div>
      <div className="absolute inset-0 dark:bg-black-100 bg-white dark:bg-grid-white/[0.03] bg-grid-black-100/[0.2] flex items-center justify-center">
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black-100 bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      </div>
      <div className="relative z-10 flex justify-center items-center min-h-screen w-full">
        <div className="w-full max-w-sm p-6 mt-16">
          <section>
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold mb-4">Login</h1>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-lg font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-indigo-500 bg-gray-700 text-white"
                  placeholder="Enter Your email"
                />
              </div>
              <div className="relative">
                <label className="block text-lg font-medium mb-2">Password</label>
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="mr-2"
                  >
                    {showPassword ? <FaEyeSlash className="text-gray-400" /> : <FaEye className="text-gray-400" />}
                  </button>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-indigo-500 bg-gray-700 text-white"
                    placeholder="Enter Your password"
                  />
                </div>
              </div>
              <div className="flex justify-center">
                <MagicButton
                  title="Sign In"
                  handleClick={handleSubmit}
                  otherClasses="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
                  position="left"
                />
              </div>
              <div className="flex flex-col items-center space-y-2 mt-2">
                <a href="/forgot" className="text-gray-400 text-sm mb-1">Forgot your password?</a>
                <a href="/signup" className="text-gray-400 text-sm">Don't have an account yet?</a>
              </div>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;
