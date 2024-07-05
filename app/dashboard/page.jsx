"use client";

import React, { useState, useEffect, useRef } from "react";
import { auth, storage } from "@/lib/firebase";
import { signOut, updatePassword, updateProfile, onAuthStateChanged } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useRouter } from "next/navigation";
import MagicButton from "@/components/MagicButton";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Spotlight } from "@/components/ui/Spotlight";
import Link from "next/link";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FloatingNav } from "@/components/ui/FloatingNavbar";

const DashboardPage = () => {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const inactivityTimeoutRef = useRef(null);
  const [avatarFile, setAvatarFile] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setName(currentUser.displayName || "");
        setEmail(currentUser.email);
        setAvatar(currentUser.photoURL);
      } else {
        router.push("/login");
      }
    });

    const handleInactive = () => {
      toast.error("You have been logged out due to inactivity.");
      signOut(auth)
        .then(() => router.push("/login"))
        .catch(() => toast.error("Logout failed, please try again."));
    };

    const resetTimeout = () => {
      if (inactivityTimeoutRef.current) {
        clearTimeout(inactivityTimeoutRef.current);
      }
      inactivityTimeoutRef.current = setTimeout(handleInactive, 3600000); // 1 hour = 3600000 ms
    };

    resetTimeout();

    window.addEventListener("mousemove", resetTimeout);
    window.addEventListener("keypress", resetTimeout);

    return () => {
      if (inactivityTimeoutRef.current) {
        clearTimeout(inactivityTimeoutRef.current);
      }
      window.removeEventListener("mousemove", resetTimeout);
      window.removeEventListener("keypress", resetTimeout);
      unsubscribe();
    };
  }, [router]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = async () => {
    try {
      if (auth.currentUser) {
        let photoURL = avatar;

        if (avatarFile) {
          const avatarRef = ref(storage, `avatars/${auth.currentUser.uid}`);
          await uploadBytes(avatarRef, avatarFile);
          photoURL = await getDownloadURL(avatarRef);
        }

        await updateProfile(auth.currentUser, { displayName: name, photoURL });
        setUser({ ...auth.currentUser, displayName: name, photoURL });

        if (password) {
          await updatePassword(auth.currentUser, password);
          setPassword("");
        }

        toast.success("Profile successfully updated!");
      }
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error("Profile update failed, please try again.");
    }
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        router.push("/login");
        toast.success("Logged out successfully.");
      })
      .catch((error) => {
        console.error("Logout error:", error);
        toast.error("Logout failed, please try again.");
      });
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const navItems = [
    { name: "Home", link: "/" },
    { name: "Reviews", link: "/reviews" },
    { name: "Dashboard", link: "/dashboard" },
  ];

  return (
    <main className="relative flex justify-center items-center min-h-screen overflow-hidden">
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
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
              <h1 className="text-2xl font-bold mb-4">{name}</h1>
            </div>
            <div className="space-y-6">
              <div className="flex flex-col items-center mb-6">
                <label htmlFor="avatar-upload" className="relative cursor-pointer mb-4">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-700">
                    <img
                      src={avatar || "/da.png"}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                      style={{ width: "100px", height: "100px", objectFit: "cover" }}
                    />
                  </div>
                  <input
                    id="avatar-upload"
                    type="file"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>
                <div className="mb-4 w-full">
                  <label className="block text-lg font-medium">Username</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-indigo-500 bg-gray-700 text-white"
                  />
                </div>
                <div className="mb-4 w-full">
                  <label className="block text-lg font-medium">Email</label>
                  <input
                    type="email"
                    value={email}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-indigo-500 bg-gray-700 text-white"
                    readOnly
                  />
                </div>
                <div className="mb-4 w-full relative">
                  <label className="block text-lg font-medium">New Password</label>
                  <div className="relative flex items-center">
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="mr-2 text-gray-400 hover:text-white"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-indigo-500 bg-gray-700 text-white"
                      placeholder="Enter your new password"
                    />
                  </div>
                </div>
                <MagicButton
                  title="Save changes"
                  handleClick={handleSaveChanges}
                  otherClasses="mb-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                  position="left"
                />
                <Link href="/login" onClick={handleLogout} className="text-blue-600 hover:text-blue-700 mt-2">
                  Logout
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default DashboardPage;
