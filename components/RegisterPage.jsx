"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MagicButton from "@/components/MagicButton";
import { Spotlight } from "@/components/ui/Spotlight";
import { useTranslation } from "react-i18next";
import i18n from "../i18n";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { t } = useTranslation();
  const searchParams = useSearchParams();

  useEffect(() => {
    const lang = searchParams.get('lang') || 'en';
    i18n.changeLanguage(lang);
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: name });

      router.push("/cabinet");
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        toast.error(t('this_email_already_registered'));
      } else if (err.code === 'auth/invalid-email') {
        toast.error(t('enter_valid_email'));
      } else if (err.code === 'auth/weak-password') {
        toast.error(t('password_must_contain'));
      } else {
        toast.error(t('error_occurred'));
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
      <div className="absolute inset-0 dark:bg-black-100 bg-black dark:bg-grid-white/[0.03] bg-grid-black-100/[0.2] flex items-center justify-center">
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black-100 bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      </div>
      <div className="relative z-10 flex justify-center items-center min-h-screen w-full">
        <div className="w-full max-w-sm p-6 mt-16">
          <section className="rounded-lg">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold mb-4 text-black">{t("sign_up")}</h1>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-lg font-medium mb-2 text-black">{t("username")}</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-indigo-500 bg-gray-700 bg-white text-black"
                  placeholder={t("enter_username")}
                />
              </div>
              <div>
                <label className="block text-lg font-medium mb-2 text-black">{t("email")}</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-indigo-500 bg-gray-700 bg-white text-black"
                  placeholder={t("enter_email")}
                />
              </div>
              <div className="relative">
                <label className="block text-lg font-medium mb-2 text-black">{t("password")}</label>
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute left-2 top-9 p-1"
                  >
                    {showPassword ? <FaEyeSlash className="text-black" /> : <FaEye className="text-black" />}
                  </button>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-indigo-500 bg-gray-700 bg-white text-black"
                    placeholder={t("enter_password")}
                  />
                </div>
              </div>
              <div className="flex justify-center mt-4">
                <MagicButton
                  title={t("sign_up")}
                  handleClick={handleSubmit}
                  otherClasses="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md"
                  position="left"
                />
              </div>
              <div className="flex flex-col items-center mt-2">
                <a href="/login" className="text-gray-400 text-sm text-black">{t("already_have_account")}</a>
              </div>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
};

export default RegisterPage;