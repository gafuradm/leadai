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
  color: black;
`;

const AnswerOption = styled.label`
  display: block;
  margin-bottom: 10px;
  color: black;
  cursor: pointer;
  font-weight: bold;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

const InstructionSection = styled.div`
  border-radius: 8px;
  background-color: #000000;
  padding: 20px;
  margin-bottom: 20px;
`;

const ListeningSection = ({ onNext, timedMode }) => {
  const [answers, setAnswers] = useState([]);
  const [currentPart, setCurrentPart] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30 * 60);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [randomQuestions, setRandomQuestions] = useState([]);

  useEffect(() => {
    const selectedQuestions = ieltsData.sections.listening.parts.map(part => {
      const shuffled = [...part.questions].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, 10);
    });
    setRandomQuestions(selectedQuestions);
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

  useEffect(() => {
  if (timedMode && timeLeft === 0) {
    handleSubmit();
  }
}, [timedMode, timeLeft]);

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
        questions: randomQuestions.flatMap(part => 
          part.map(q => ({ id: q.id, question: q.question }))
        ),
        correctAnswers: randomQuestions.flatMap(part => 
          part.map(q => q.correctAnswer)
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
      const currentQuestion = randomQuestions[currentPart][currentQuestionIndex];
      speakText(currentQuestion.audio);
      setIsPlaying(true);
      setHasPlayed(true);
      setTimeout(() => setIsPlaying(false), currentQuestion.audio.length * 100);
    }
  };

  const moveToNextQuestion = () => {
    if (currentQuestionIndex < 9) {
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
      setCurrentQuestionIndex(9);
    }
    setHasPlayed(false);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const currentQuestion = randomQuestions[currentPart] && randomQuestions[currentPart][currentQuestionIndex];

  return (
    <Container>
      <Title>Listening Section</Title>
      {timedMode && <Timer>Time left: {formatTime(timeLeft)}</Timer>}
      <InstructionSection>
        <h2>Instructions:</h2>
        <p>
          You will hear a recording. Listen carefully and answer the questions.
          You can navigate between questions using the 'Next' and 'Previous' buttons.
          Once you have completed all questions and are ready to submit, click 'Finish'.
        </p>
        {timedMode && (
          <p>
            You have 30 minutes for this section. After 30 minutes, your results will be automatically submitted.
          </p>
        )}
      </InstructionSection>
      {currentQuestion && (
        <Section>
          <p style={{ color: 'black' }}>Part {currentPart + 1} - Question {currentQuestionIndex + 1}</p>
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
      )}
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
