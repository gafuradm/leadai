import { FaLocationArrow } from "react-icons/fa6";
import MagicButton from "./MagicButton";
import { TextGenerateEffect } from "./ui/TextGenerateEffect";
import { useState } from "react";

const Hero = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  return (
    <div className="pb-20 pt-36 relative bg-white">
      <div className="flex justify-between items-center w-full px-10 absolute top-4 left-0 z-20">
        <div className="flex items-center">
          <img src="/logo1.png" alt="Logo" className="h-16" />
        </div>
        <div className="relative">
          <button
            className="flex items-center space-x-2 text-gray-800"
            onClick={toggleDropdown}
          >
            <img src="/path/to/current-flag.png" alt="Current Language" className="h-6 w-6" />
            <span>EN</span>
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded shadow-lg">
              <ul>
                <li className="flex items-center p-2 cursor-pointer hover:bg-gray-200" onClick={closeDropdown}>
                  <img src="/path/to/flag-fr.png" alt="French" className="h-6 w-6 mr-2" />
                  <span>FR</span>
                </li>
                <li className="flex items-center p-2 cursor-pointer hover:bg-gray-200" onClick={closeDropdown}>
                  <img src="/path/to/flag-es.png" alt="Spanish" className="h-6 w-6 mr-2" />
                  <span>ES</span>
                </li>
                {/* Add more languages here */}
              </ul>
            </div>
          )}
        </div>
      </div>
      <div className="h-screen w-full absolute top-0 left-0 flex items-center justify-center bg-white">
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-white" />
      </div>
      <div className="flex justify-between items-center relative my-20 z-10 px-10">
        <div className="max-w-[89vw] md:max-w-2xl lg:max-w-[60vw] flex flex-col items-start justify-center">
          <TextGenerateEffect
            words="Prepare for IELTS quickly and for free without registration"
            className="text-left text-[40px] md:text-5xl lg:text-6xl"
          />
          <a href="#recent-projects" className="scroll-smooth mt-10">
            <MagicButton
              title="Master your IELTS"
              icon={<FaLocationArrow />}
              position="right"
              otherClasses="bg-burgundy border-burgundy"
            />
          </a>
        </div>
        <div className="hidden md:flex items-center justify-center">
          <img src="/path/to/phone-image.png" alt="Phone with App" className="max-h-[80vh]" />
        </div>
      </div>
    </div>
  );
};

export default Hero;
