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
      <div className="absolute inset-0 bg-white flex items-center justify-center">
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-20 backdrop-filter backdrop-blur-md" />
      </div>
      <div className="relative z-10 flex justify-center items-center min-h-screen w-full">
        <div className="w-full max-w-sm p-6 mt-16 bg-[#CBACF9] rounded-lg shadow-lg">
          <section>
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold mb-4 text-black">Login</h1>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-lg font-medium mb-2 text-black">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-indigo-500 bg-white text-black"
                  placeholder="Enter Your email"
                />
              </div>
              <div className="relative">
                <label className="block text-lg font-medium mb-2 text-black">Password</label>
                <div className="flex items-center">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-indigo-500 bg-white text-black placeholder-left-14"
                    placeholder="Enter Your password"
                  />
                  <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute left-2 top-9 p-1"
                >
                  {showPassword ? <FaEyeSlash className="text-black" /> : <FaEye className="text-black" />}
                </button>
                </div>
              </div>
              <div className="flex justify-center">
                <MagicButton
                  title="Sign In"
                  handleClick={handleSubmit}
                  otherClasses="bg-red-600] hover:bg-[#B28ED9] text-white px-4 py-2 rounded-md"
                  position="left"
                />
              </div>
              <div className="flex flex-col items-center space-y-2 mt-2">
                <a href="/forgot" className="text-gray-400 text-sm mb-1 text-black">Forgot your password?</a>
                <a href="/signup" className="text-gray-400 text-sm text-black">Don&apos;t have an account yet?</a>
              </div>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;
