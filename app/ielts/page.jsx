"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ListeningSection from './ListeningSection';
import ReadingSection from './ReadingSection';
import WritingSection from './WritingSection';
import SpeakingSection from './SpeakingSection';
import Results from './results';
import Image from 'next/image';

const testOptions = [
  {
    id: 1,
    title: "Full IELTS Test",
    des: "Complete all sections of the IELTS test",
    img: "/rec.jpeg",
    value: 'full'
  },
  {
    id: 2,
    title: "Listening Section",
    des: "Practice your listening skills for IELTS",
    img: "/aud.jpeg",
    value: 'listening'
  },
  {
    id: 3,
    title: "Reading Section",
    des: "Improve your reading comprehension for IELTS",
    img: "/rea.jpeg",
    value: 'reading'
  },
  {
    id: 4,
    title: "Writing Section",
    des: "Enhance your writing skills for IELTS",
    img: "/wri.jpeg",
    value: 'writing'
  },
  {
    id: 5,
    title: "Speaking Section",
    des: "Develop your speaking abilities for IELTS",
    img: "/spe.jpeg",
    value: 'speaking'
  }
];

const modeOptions = [
  {
    id: 1,
    title: "Timed Mode",
    des: "Take the test with time constraints, just like the real IELTS",
    img: "/hard.jpeg",
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
    img: "/academ.jpeg",
    value: 'academic'
  },
  {
    id: 2,
    title: "General Training",
    des: "For those migrating to Australia, Canada, and the UK, or applying for secondary education, training programmes and work experience",
    img: "/general.jpeg",
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

  const handleTestSelection = (test, type = null) => {
    setSelectedTest(test);
    setTestType(type);
    setTimedMode(null);
  };

  const handleModeSelection = (isTimed) => {
    setTimedMode(isTimed);
    if (selectedTest === 'full') {
      setCurrentSection('listening');
    } else {
      setCurrentSection(selectedTest);
    }
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
  };

  const renderCards = (options, handleClick) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {options.map((option) => (
        <div
          key={option.id}
          className="cursor-pointer transform hover:scale-105 transition-transform duration-300 bg-gray-800 p-6 rounded-lg shadow-lg"
          onClick={() => handleClick(option.value)}
        >
          <Image src={option.img} alt={option.title} width={300} height={200} className="mb-4 w-full h-48 object-cover rounded" />
          <h3 className="text-2xl font-semibold mb-2">{option.title}</h3>
          <p>{option.des}</p>
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
      <section className="pt-20 pb-12">
        <h2 className="text-3xl font-bold text-center mb-8">Choose your IELTS test</h2>
        {renderCards(testOptions, handleTestSelection)}
      </section>
    );
  }

  if (['full', 'reading', 'writing'].includes(selectedTest) && !testType) {
    return (
      <section className="pt-20 pb-12">
        <h2 className="text-3xl font-bold text-center mb-8">Select test type</h2>
        {renderCards(typeOptions, (type) => handleTestSelection(selectedTest, type))}
      </section>
    );
  }

  if (timedMode === null) {
    return (
      <section className="pt-20 pb-12">
        <h2 className="text-3xl font-bold text-center mb-8">Select mode</h2>
        {renderCards(modeOptions, handleModeSelection)}
      </section>
    );
  }

  return renderSection();
};

export default Page;
