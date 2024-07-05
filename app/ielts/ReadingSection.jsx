import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ieltsData from './ielts-data.json';
import TrueFalseQuestion from './TrueFalseQuestion';
import MatchingInformationQuestion from './MatchingInformationQuestion';
import SummaryCompletionQuestion from './SummaryCompletionQuestion';
import DiagramLabelingQuestion from './DiagramLabelingQuestion';
import MultipleChoiceQuestion from './MultipleChoiceQuestion';
import { PulseLoader } from 'react-spinners';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Roboto', sans-serif;
`;

const Title = styled.h1`
  color: #FF69B4;
  text-align: center;
`;

const Section = styled.div`
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 20px;
`;

const Button = styled.button`
  background-color: #FF69B4;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #14465a;
  }
`;

const Timer = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: #FF69B4;
  text-align: center;
  margin-bottom: 20px;
`;

const ReadingSection = ({ onNext, testType, timedMode }) => {
  const [answers, setAnswers] = useState({});
  const [currentPassage, setCurrentPassage] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60 * 60); // 60 minutes in seconds
  const [passages, setPassages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = () => {
      if (!ieltsData || !ieltsData.sections || !ieltsData.sections.reading) {
        setError('Invalid data structure in ielts-data.json');
        setIsLoading(false);
        return;
      }

      const data = ieltsData.sections.reading[testType];

      if (data) {
        if (Array.isArray(data)) {
          setPassages(data);
        } else if (typeof data === 'object') {
          setPassages([data]);
        } else {
          setError(`Invalid data format for test type: ${testType}`);
        }
      } else {
        setError(`No data available for test type: ${testType}`);
      }
      setIsLoading(false);
    };

    loadData();
  }, [testType]);

  useEffect(() => {
    if (timedMode) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            handleSubmit();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timedMode]);

  const handleAnswerChange = (questionId, answer) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: answer,
    }));
  };

  const handleSubmit = () => {
    const sectionData = {
      section: 'reading',
      data: {
        questions: passages.flatMap(passage => passage.questions),
        answers: answers,
        passages: passages
      }
    };
    onNext(sectionData);
  };

  const renderQuestion = (question) => {
    if (!question || !question.type) {
      console.error('Invalid question structure:', question);
      return null;
    }

    switch (question.type) {
      case 'multiple_choice':
        return <MultipleChoiceQuestion key={question.id} question={question} onAnswerChange={handleAnswerChange} />;
      case 'true_false':
        return <TrueFalseQuestion key={question.id} question={question} onAnswerChange={handleAnswerChange} />;
      case 'matching_information':
        return <MatchingInformationQuestion key={question.id} question={question} onAnswerChange={handleAnswerChange} />;
      case 'summary_completion':
        return <SummaryCompletionQuestion key={question.id} question={question} onAnswerChange={handleAnswerChange} />;
      case 'diagram_labeling':
        return <DiagramLabelingQuestion key={question.id} question={question} onAnswerChange={handleAnswerChange} />;
      default:
        console.warn(`Unsupported question type: ${question.type}`);
        return null;
    }
  };

  const renderPassage = (passage) => {
    if (!passage || !passage.texts || !Array.isArray(passage.texts)) {
      console.error('Invalid passage structure:', passage);
      return <div>Error: Invalid passage data</div>;
    }

    return (
      <Section>
        {passage.texts.map((text, index) => (
          <div key={index}>
            <h3>{text.title}</h3>
            <p>{text.content}</p>
          </div>
        ))}
        {passage.questions && passage.questions.map(renderQuestion)}
      </Section>
    );
  };

  if (isLoading) {
    return (
      <Container>
        <div className="flex items-center justify-center min-h-screen">
          <PulseLoader color="#FF69B4" />
        </div>
      </Container>
    );
  }

  if (error) {
    return <Container><p>Error: {error}</p></Container>;
  }

  if (!passages || passages.length === 0) {
    return <Container><p>No passages available.</p></Container>;
  }

  return (
    <Container>
      <Title>Reading Section ({testType})</Title>
      {timedMode && (
        <Timer>
          Time left: {Math.floor(timeLeft / 60)}:{timeLeft % 60 < 10 ? '0' : ''}
          {timeLeft % 60}
        </Timer>
      )}
      {renderPassage(passages[currentPassage])}
      <Button
        onClick={() => {
          if (currentPassage < passages.length - 1) {
            setCurrentPassage(currentPassage + 1);
          } else {
            handleSubmit();
          }
        }}
      >
        {currentPassage < passages.length - 1 ? 'Next Passage' : 'Finish'}
      </Button>
    </Container>
  );
};

export default ReadingSection;
