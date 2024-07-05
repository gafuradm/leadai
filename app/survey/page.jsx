// app/survey/page.jsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const SurveyPage = () => {
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  // Добавьте остальные поля опроса
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Сохраните данные опроса
    localStorage.setItem("hasCompletedSurvey", "true");
    // Добавьте сохранение остальных данных опроса

    router.push("/dashboard");
  };

  return (
    <main className="relative bg-gray-900 text-white flex justify-center items-center flex-col overflow-hidden mx-auto sm:px-10 px-5" style={{ paddingTop: "80px" }}>
      <div className="max-w-7xl w-full">
        <section className="min-h-screen py-20">
          <div className="max-w-2xl mx-auto bg-gray-800 p-5 rounded-lg shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-5 flex flex-col items-center">
              <div className="w-full flex flex-col items-center">
                <label className="block text-lg font-medium">Age</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-1/3 px-4 py-2 border rounded-lg focus:outline-none focus:border-indigo-500 bg-gray-700 text-white"
                  placeholder="Enter your age"
                />
              </div>
              <div className="w-full flex flex-col items-center">
                <label className="block text-lg font-medium">Gender</label>
                <input
                  type="text"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-1/3 px-4 py-2 border rounded-lg focus:outline-none focus:border-indigo-500 bg-gray-700 text-white"
                  placeholder="Enter your gender"
                />
              </div>
              {/* Добавьте остальные вопросы */}
              <button type="submit" className="w-1/3 bg-indigo-500 text-white px-4 py-2 rounded-lg">
                Submit
              </button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
};

export default SurveyPage;
