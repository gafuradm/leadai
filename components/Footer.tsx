import { FaLocationArrow } from "react-icons/fa6";
import { socialMedia } from "@/data";
import MagicButton from "./MagicButton";

const Footer = () => {
  const handleSocialMediaClick = (url: string) => {
    window.location.href = url;
  };

  return (
    <footer className="w-full pt-20 pb-10" id="contact">
      {/* background grid */}
      <div className="w-full absolute left-0 -bottom-72 min-h-96">
        <img
          src="/footer-grid.svg"
          alt="grid"
          className="w-full h-full opacity-50"
        />
      </div>

      <div className="flex flex-col items-center">
        <h1 className="heading lg:max-w-[45vw]">
          Take IELTS for free right now{" "}
        </h1>
        <p className="text-white-200 md:mt-10 my-5 text-center">
          Don't put off until tomorrow what you can do today
        </p>
        <a href="/dashboard">
          <MagicButton
            title="Get started"
            icon={<FaLocationArrow />}
            position="right"
          />
        </a>
      </div>
      <div className="flex mt-16 md:flex-row flex-col justify-between items-center">
        <p className="md:text-base text-sm md:font-normal font-light">
          Copyright © 2024 Aleigh Dinara, Damirkyzy Sulamif, Damiruly Gafur participant of NFactorial Incubator
          2024
        </p>

        <div className="flex items-center md:gap-3 gap-6">
          {socialMedia.map((info) => (
            <a
              key={info.id}
              href={info.url} // Добавляем URL для каждой социальной сети
              target="_blank" // Открывать ссылку в новой вкладке
              rel="noopener noreferrer" // Рекомендуется для безопасности
              className="w-10 h-10 cursor-pointer flex justify-center items-center backdrop-filter backdrop-blur-lg saturate-180 bg-opacity-75 bg-black-200 rounded-lg border border-black-300"
            >
              <img
                src={info.img}
                alt="icons"
                width={20}
                height={20}
                onClick={() => handleSocialMediaClick(info.url)}
              />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
