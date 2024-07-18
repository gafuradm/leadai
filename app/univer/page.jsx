"use client";
import { useState } from 'react';
import dynamic from 'next/dynamic';
import PulseLoader from 'react-spinners/PulseLoader';

// Dynamically import the Map component without server-side rendering
const MapWithNoSSR = dynamic(() => import('../../components/Map'), { ssr: false });

export default function Home() {
  const [userData, setUserData] = useState({
    test_score: '',
    test_type: '',
    test_details: '',
    gender: '',
    native_language: '',
    interests: '',
    desired_major: '',
    age: '',
    desired_country: ''
  });

  const [recommendations, setRecommendations] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle input changes and update state
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prevData => ({ ...prevData, [name]: value }));
  };

  // Handle form submission and fetch recommendations
  const handleSubmit = async (e) => {
    e.preventDefault();
    setRecommendations("Loading recommendations...");
    setLoading(true);
    try {
      const response = await fetch('/api/getRecommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setRecommendations(data.recommendations);
    } catch (error) {
      console.error("An error occurred:", error);
      setRecommendations(`An error occurred while fetching recommendations: ${error.message}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="container mx-auto p-10 bg-white max-w-3xl rounded-lg">
        <h1 className="text-4xl font-bold mb-8 text-center" style={{ color: '#800120' }}>Select Your University</h1>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Test type selection */}
          <div className="flex flex-col">
            <label className="text-black text-lg font-semibold text-gray-700 mb-2">Test or exam:</label>
            <select
              name="test_type"
              value={userData.test_type}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black bg-white text-black"
            >
              <option value="">Select test or exam</option>
              <option value="IELTS">IELTS</option>
              <option value="TOEFL">TOEFL</option>
              <option value="SAT">SAT</option>
              <option value="ACT">ACT</option>
              <option value="GRE">GRE</option>
              <option value="GMAT">GMAT</option>
              <option value="HSK">HSK</option>
              <option value="ЕНТ">ЕНТ</option>
              <option value="ЕГЭ">ЕГЭ</option>
              <option value="高考">高考</option>
              <option value="None">Without test</option>
            </select>
          </div>
          {/* Conditional rendering for test score input */}
          {userData.test_type !== 'None' && (
            <div className="flex flex-col">
              <label className="text-black text-lg font-semibold text-gray-700 mb-2">Test score:</label>
              <input
                type="text"
                name="test_score"
                value={userData.test_score}
                onChange={handleInputChange}
                placeholder="Enter your test score"
                className="w-full p-3 border rounded-lg bg-white text-black"
              />
            </div>
          )}
          {/* Test details input */}
          <div className="flex flex-col">
            <label className="text-black text-lg font-semibold text-gray-700 mb-2">Test details:</label>
            <textarea
              name="test_details"
              value={userData.test_details}
              onChange={handleInputChange}
              placeholder="Enter test details"
              className="w-full p-3 border rounded-lg bg-white text-black"
            />
          </div>
          {/* Gender input */}
          <div className="flex flex-col">
            <label className="text-black text-lg font-semibold text-gray-700 mb-2">Gender:</label>
            <input
              type="text"
              name="gender"
              value={userData.gender}
              onChange={handleInputChange}
              placeholder="Enter your gender"
              className="w-full p-3 border rounded-lg bg-white text-black"
            />
          </div>
          {/* Native language input */}
          <div className="flex flex-col">
            <label className="text-black text-lg font-semibold text-gray-700 mb-2">Native language:</label>
            <input
              type="text"
              name="native_language"
              value={userData.native_language}
              onChange={handleInputChange}
              placeholder="Enter your native language"
              className="w-full p-3 border rounded-lg bg-white text-black"
            />
          </div>
          {/* Interests input */}
          <div className="flex flex-col">
            <label className="text-black text-lg font-semibold text-gray-700 mb-2">Interests:</label>
            <input
              type="text"
              name="interests"
              value={userData.interests}
              onChange={handleInputChange}
              placeholder="Enter your interests"
              className="w-full p-3 border rounded-lg bg-white text-black"
            />
          </div>
          {/* Desired major input */}
          <div className="flex flex-col">
            <label className="text-black text-lg font-semibold text-gray-700 mb-2">Desired major:</label>
            <input
              type="text"
              name="desired_major"
              value={userData.desired_major}
              onChange={handleInputChange}
              placeholder="Enter your desired major"
              className="w-full p-3 border rounded-lg bg-white text-black"
            />
          </div>
          {/* Age input */}
          <div className="flex flex-col">
            <label className="text-black text-lg font-semibold text-gray-700 mb-2">Age:</label>
            <input
              type="text"
              name="age"
              value={userData.age}
              onChange={handleInputChange}
              placeholder="Enter your age"
              className="w-full p-3 border rounded-lg bg-white text-black"
            />
          </div>
          {/* Desired country input */}
          <div className="flex flex-col">
            <label className="text-black text-lg font-semibold text-gray-700 mb-2">Desired country of study:</label>
            <input
              type="text"
              name="desired_country"
              value={userData.desired_country}
              onChange={handleInputChange}
              placeholder="Enter your desired country of study"
              className="w-full p-3 border rounded-lg bg-white text-black"
            />
          </div>
          {/* Submit button */}
          <div className="mt-10">
            <button 
              type="submit" 
              className="w-full text-white py-4 px-6 rounded-lg text-lg font-semibold hover:bg-white hover:text-black transition-colors duration-300"
              style={{ backgroundColor: '#800120' }}
            >
              Get recommendations
            </button>
          </div>
        </form>
      </div>

      {/* Loading spinner */}
      {loading && (
        <div className="flex justify-center mt-8">
          <PulseLoader color="#800120" />
        </div>
      )}

      {/* Recommendations */}
      {!loading && recommendations && (
        <div className="container mx-auto p-10 bg-white max-w-3xl rounded-lg mt-8">
          <h2 className="text-2xl font-bold mb-4" style={{ color: '#800120' }}>Recommendations:</h2>
          <div
            className="recommendations-content text-black"
            dangerouslySetInnerHTML={{ __html: recommendations.replace(/\n/g, '<br>') }}
          />
          <MapWithNoSSR recommendations={recommendations} />
        </div>
      )}
    </div>
  );
}
