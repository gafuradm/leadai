"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ReactGA from "react-ga4";
import ListeningSection from './ListeningSection';
import ReadingSection from './ReadingSection';
import WritingSection from './WritingSection';
import SpeakingSection from './SpeakingSection';
import Results from './results';
import Image from 'next/image';
import Modal from 'react-modal';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { sendFeedback } from './feedback';

const testOptions = [
  {
    id: 1,
    title: "Full IELTS Test",
    des: "Complete all sections of the IELTS test",
    img: "/full.png",
    value: 'full'
  },
  {
    id: 2,
    title: "Listening Section",
    des: "Practice your listening skills for IELTS",
    img: "/mus.png",
    value: 'listening'
  },
  {
    id: 3,
    title: "Reading Section",
    des: "Improve your reading comprehension for IELTS",
    img: "/books.png",
    value: 'reading'
  },
  {
    id: 4,
    title: "Writing Section",
    des: "Enhance your writing skills for IELTS",
    img: "/essa.png",
    value: 'writing'
  },
  {
    id: 5,
    title: "Speaking Section",
    des: "Develop your speaking abilities for IELTS",
    img: "/voc.png",
    value: 'speaking'
  }
];

const modeOptions = [
  {
    id: 1,
    title: "Timed Mode",
    des: "Take the test with time constraints, just like the real IELTS",
    img: "/time3.png",
    value: true
  },
  {
    id: 2,
    title: "Untimed Mode",
    des: "Practice at your own pace without time pressure",
    img: "/lite.jpeg",
    value: false
  }
];

const typeOptions = [
  {
    id: 1,
    title: "Academic",
    des: "For those applying to higher education or professional registration",
    img: "/hats.png",
    value: 'academic'
  },
  {
    id: 2,
    title: "General Training",
    des: "For those migrating to Australia, Canada, and the UK, or applying for secondary education, training programmes and work experience",
    img: "/brie.png",
    value: 'general'
  }
];

const Page = () => {
  const [selectedTest, setSelectedTest] = useState(null);
  const [testType, setTestType] = useState(null);
  const [currentSection, setCurrentSection] = useState(null);
  const [answers, setAnswers] = useState({});
  const [timedMode, setTimedMode] = useState(null);
  const router = useRouter();

  useEffect(() => {
    ReactGA.initialize("G-TBSYZ03L8M");
    
    ReactGA.send({ hitType: "pageview", page: "/ielts" });
  }, []);

  const handleTestSelection = (test, type = null) => {
    setSelectedTest(test);
    setTestType(type);
    setTimedMode(null);

    ReactGA.event({
      category: "Test Selection",
      action: "Selected Test",
      label: test
    });
  };

  const handleModeSelection = (isTimed) => {
    setTimedMode(isTimed);
    if (selectedTest === 'full') {
      setCurrentSection('listening');
    } else {
      setCurrentSection(selectedTest);
    }

    ReactGA.event({
      category: "Mode Selection",
      action: "Selected Mode",
      label: isTimed ? "Timed" : "Untimed"
    });
  };

  const handleSectionComplete = (sectionData) => {
    setAnswers(prev => ({ ...prev, [currentSection]: sectionData }));
    if (selectedTest === 'full') {
      const sections = ['listening', 'reading', 'writing', 'speaking'];
      const currentIndex = sections.indexOf(currentSection);
      if (currentIndex < sections.length - 1) {
        setCurrentSection(sections[currentIndex + 1]);
      } else {
        setCurrentSection('results');
      }
    } else {
      setCurrentSection('results');
    }

    ReactGA.event({
      category: "Section Completion",
      action: "Completed Section",
      label: currentSection
    });
  };

  const renderCards = (options, handleClick) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {options.map((option) => (
      <div
        key={option.id}
        className="cursor-pointer transform hover:scale-105 transition-transform duration-300 p-6 rounded-lg shadow-lg"
        style={{
                backgroundColor:
                  options.id === 2 || options.id === 4
                    ? "#000000"
                    : "#810021",
                height: "15em",
              }}
        onClick={() => handleClick(option.value)}
      >
        <Image src={option.img} alt={option.title} width={300} height={200} className="mb-4 w-20 h-20 object-cover rounded-lg mx-auto" />
        <h3 className="text-2xl font-semibold mb-2 text-center text-white">{option.title}</h3>
        <p className="text-sm text-center text-white">{option.des}</p>
      </div>
    ))}
  </div>
);

  const renderSection = () => {
    switch (currentSection) {
      case 'listening':
        return <ListeningSection onNext={handleSectionComplete} timedMode={timedMode} />;
      case 'reading':
        return <ReadingSection onNext={handleSectionComplete} testType={testType} timedMode={timedMode} />;
      case 'writing':
        return <WritingSection onNext={handleSectionComplete} testType={testType} timedMode={timedMode} />;
      case 'speaking':
        return <SpeakingSection onNext={handleSectionComplete} timedMode={timedMode} />;
      case 'results':
        return <Results answers={answers} testType={selectedTest} />;
      default:
        return null;
    }
  };

  if (!selectedTest) {
    return (
      <section className="pt-20 pb-12" style={{ backgroundColor: 'white' }}>
        <h2 className="text-3xl text-black font-bold text-center mb-8">Choose your IELTS test</h2>
        {renderCards(testOptions, handleTestSelection)}
      </section>
    );
  }

  if (['full', 'reading', 'writing'].includes(selectedTest) && !testType) {
    return (
      <section className="pt-20 pb-12" style={{ backgroundColor: 'white' }}>
        <h2 className="text-3xl text-black font-bold text-center mb-8">Select test type</h2>
        {renderCards(typeOptions, (type) => handleTestSelection(selectedTest, type))}
      </section>
    );
  }

  if (timedMode === null) {
    return (
      <section className="pt-20 pb-12" style={{ backgroundColor: 'white' }}>
        <h2 className="text-3xl text-black font-bold text-center mb-8">Select mode</h2>
        {renderCards(modeOptions, handleModeSelection)}
      </section>
    );
  }

  return (
    <div style={{ backgroundColor: 'white' }}>
      {renderSection()}
    </div>
  );
};

export default Page;
