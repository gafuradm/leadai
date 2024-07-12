import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ieltsData from './ielts-data.json';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Roboto', sans-serif;
`;

const Title = styled.h1`
  color: #800120;
  text-align: center;
`;

const Section = styled.div`
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 20px;
`;

const Button = styled.button`
  background-color: #800120;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #14465a;
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const Timer = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: #800120;
  text-align: center;
  margin-bottom: 20px;
`;

const Question = styled.p`
  font-weight: bold;
  margin-bottom: 10px;
`;

const AnswerOption = styled.label`
  display: block;
  margin-bottom: 10px;
  cursor: pointer;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

const ListeningSection = ({ onNext, timedMode }) => {
  const [answers, setAnswers] = useState([]);
  const [currentPart, setCurrentPart] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30 * 60);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);

  useEffect(() => {
    setAnswers(new Array(40).fill(''));
  }, []);

  useEffect(() => {
    if (timedMode) {
      const timer = setInterval(() => {
        if (timeLeft > 0 && currentPart < 4) {
          setTimeLeft(prevTime => prevTime - 1);
        } else {
          clearInterval(timer);
          handleSubmit();
        }
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft, currentPart, timedMode]);

  const handleAnswerChange = (index, answer) => {
    const newAnswers = [...answers];
    newAnswers[index] = answer;
    setAnswers(newAnswers);
  };

  const handleSubmit = () => {
    if (answers.some(answer => answer !== '')) {
      const sectionData = {
        section: 'listening',
        data: {
          answers: answers,
          questions: ieltsData.sections.listening.parts.flatMap(part => 
            part.questions.map(q => ({ id: q.id, question: q.question }))
          )
        }
      };
      onNext(sectionData);
    } else {
      alert("Please answer at least one question before submitting.");
    }
  };

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Sorry, your browser doesn't support text to speech!");
    }
  };

  const playCurrentAudio = () => {
    if (!isPlaying && !hasPlayed) {
      const currentQuestion = ieltsData.sections.listening.parts[currentPart].questions[currentQuestionIndex];
      speakText(currentQuestion.audio);
      setIsPlaying(true);
      setHasPlayed(true);
      setTimeout(() => setIsPlaying(false), currentQuestion.audio.length * 100); // Rough estimate of audio duration
    }
  };

  const moveToNextQuestion = () => {
    if (currentQuestionIndex < ieltsData.sections.listening.parts[currentPart].questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    } else if (currentPart < 3) {
      setCurrentPart(prevPart => prevPart + 1);
      setCurrentQuestionIndex(0);
    } else {
      handleSubmit();
    }
    setHasPlayed(false);
  };

  const moveToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prevIndex => prevIndex - 1);
    } else if (currentPart > 0) {
      setCurrentPart(prevPart => prevPart - 1);
      setCurrentQuestionIndex(ieltsData.sections.listening.parts[currentPart - 1].questions.length - 1);
    }
    setHasPlayed(false);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const currentQuestion = ieltsData.sections.listening.parts[currentPart].questions[currentQuestionIndex];

  return (
    <Container>
      <Title>Listening Section</Title>
      {timedMode && <Timer>Time left: {formatTime(timeLeft)}</Timer>}
      <Section>
        <p>Part {currentPart + 1} - Question {currentQuestionIndex + 1}</p>
        <Button onClick={playCurrentAudio} disabled={isPlaying || hasPlayed}>
          {isPlaying ? 'Playing...' : hasPlayed ? 'Played' : 'Play Audio'}
        </Button>
        <Question>{currentQuestion.question}</Question>
        {currentQuestion.answers.map((answer, ansIndex) => (
          <AnswerOption key={ansIndex}>
            <input
              type="radio"
              name={`question-${currentPart}-${currentQuestionIndex}`}
              value={answer}
              checked={answers[currentPart * 10 + currentQuestionIndex] === answer}
              onChange={() => handleAnswerChange(currentPart * 10 + currentQuestionIndex, answer)}
            />
            {answer}
          </AnswerOption>
        ))}
      </Section>
      <Pagination>
        <Button onClick={moveToPreviousQuestion} disabled={currentPart === 0 && currentQuestionIndex === 0}>
          Previous
        </Button>
        <Button onClick={moveToNextQuestion}>
          {currentPart === 3 && currentQuestionIndex === 9 ? 'Finish' : 'Next Question'}
        </Button>
      </Pagination>
    </Container>
  );
};

export default ListeningSection;
