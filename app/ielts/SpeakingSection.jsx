import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { fetchResults } from './chatgpt';
import HeygenAvatar from './HeygenAvatar';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Roboto', sans-serif;
  color: #ffffff;
`;

const Title = styled.h1`
  color: #FF69B4;
  text-align: center;
`;

const Section = styled.div`
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(255, 255, 255, 0.1);
  padding: 20px;
  margin-bottom: 20px;
  background-color: #333333;
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

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const Question = styled.p`
  font-weight: bold;
  margin-bottom: 10px;
`;

const Transcript = styled.p`
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #91d5ff;
  background-color: #444444;
`;

const Feedback = styled.div`
  margin-top: 20px;
  padding: 10px;
  border: 1px solid #91d5ff;
  border-radius: 4px;
  background-color: #444444;
`;

const SpeakingSection = ({ onNext, timedMode }) => {
  const [currentPart, setCurrentPart] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [answers, setAnswers] = useState([]);
  const [feedback, setFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');

  const parts = [
    {
      name: "Part 1: Interview",
      questions: [
        "Can you tell me about your hometown?",
        "What do you like to do in your free time?",
        "Do you work or are you a student?",
        "What's your favorite season and why?",
      ]
    },
    {
      name: "Part 2: Cue Card",
      questions: [
        "Describe a book you have recently read. You should say:\n- what the book was\n- what it was about\n- why you decided to read it\n- and explain whether you would recommend it to other people.",
      ]
    },
    {
      name: "Part 3: Discussion",
      questions: [
        "Do you think reading habits have changed in recent years?",
        "How do you think technology will affect books in the future?",
        "What kinds of books are most popular in your country?",
      ]
    }
  ];

  useEffect(() => {
    if (currentPart < parts.length) {
      speakQuestion(parts[currentPart].questions[currentQuestion]);
    }
  }, [currentPart, currentQuestion]);

  const speakQuestion = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = speechSynthesis.getVoices();
    const englishVoice = voices.find(voice => voice.lang.startsWith('en-'));
    if (englishVoice) {
      utterance.voice = englishVoice;
    }
    utterance.rate = 0.9;
    utterance.pitch = 1;
    speechSynthesis.speak(utterance);
  };

  const startRecording = () => {
    setIsRecording(true);
    setTranscript('');

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = 'en-US';
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      const current = event.resultIndex;
      const transcript = event.results[current][0].transcript;
      setTranscript(transcript);
    };

    recognition.start();
  };

  const stopRecording = async () => {
    setIsRecording(false);

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.stop();
    
    // Save the answer
    setAnswers(prevAnswers => {
      const updatedAnswers = [...prevAnswers];
      if (!updatedAnswers[currentPart]) {
        updatedAnswers[currentPart] = [];
      }
      updatedAnswers[currentPart][currentQuestion] = transcript;
      return updatedAnswers;
    });

    // Move to the next question or part
    if (currentQuestion < parts[currentPart].questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else if (currentPart < parts.length - 1) {
      setCurrentPart(currentPart + 1);
      setCurrentQuestion(0);
    } else {
      await submitAnswers();
    }
  };

  const submitAnswers = async () => {
    setIsLoading(true);
    try {
      const result = await fetchResults(answers);
      setFeedback(result);
    } catch (error) {
      console.error('Error fetching results:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Title>Speaking Section</Title>
      {currentPart < parts.length ? (
        <Section>
          <h2>{parts[currentPart].name}</h2>
          <Question>{parts[currentPart].questions[currentQuestion]}</Question>
          <HeygenAvatar question={parts[currentPart].questions[currentQuestion]} />
          {isRecording ? (
            <Button onClick={stopRecording}>Stop Recording</Button>
          ) : (
            <Button onClick={startRecording}>Start Recording</Button>
          )}
          <Transcript>{transcript}</Transcript>
        </Section>
      ) : (
        <Section>
          <h2>Thank you for completing the Speaking Section</h2>
          {isLoading ? (
            <p>Loading feedback...</p>
          ) : (
            <Feedback>
              <h3>Feedback</h3>
              <p>{feedback}</p>
            </Feedback>
          )}
        </Section>
      )}
      <Button onClick={onNext} disabled={isRecording}>
        Next
      </Button>
    </Container>
  );
};

export default SpeakingSection;
