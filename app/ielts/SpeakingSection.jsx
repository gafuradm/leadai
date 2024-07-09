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
    setIsLoading(true);
    
    if (transcript.trim() === '') {
      alert("No speech detected. Please try again.");
      setIsLoading(false);
      return;
    }
  
    const newAnswers = [...answers, transcript];
    setAnswers(newAnswers);
  
    const prompt = `Evaluate this IELTS Speaking answer for the question "${parts[currentPart].questions[currentQuestion]}". Provide brief feedback and a score out of 9:\n\nAnswer: ${transcript}`;
    
    try {
      const result = await fetchResults('speaking', prompt);
      if (typeof result === 'object' && result.feedback) {
        setFeedback(`${result.feedback}\nScore: ${result.score}`);
      } else {
        setFeedback(result.toString());
      }
    } catch (error) {
      console.error("Error fetching results:", error);
      setFeedback("Sorry, there was an error evaluating your answer. Please try again.");
    }

    setIsLoading(false);
  
    if (currentQuestion < parts[currentPart].questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else if (currentPart < parts.length - 1) {
      setCurrentPart(currentPart + 1);
      setCurrentQuestion(0);
    } else {
      onNext(newAnswers);
    }
  };

  return (
    <Container>
      <Title>Speaking Section</Title>
      {currentPart < parts.length ? (
        <Section>
          <h3>{parts[currentPart].name}</h3>
          <HeygenAvatar question={parts[currentPart].questions[currentQuestion]} />
          <Question>{parts[currentPart].questions[currentQuestion]}</Question>
          <Button onClick={isRecording ? stopRecording : startRecording} disabled={isLoading}>
            {isRecording ? 'Stop Recording' : 'Start Recording'}
          </Button>
          {transcript && <Transcript>Your answer: {transcript}</Transcript>}
          {isLoading && <p>Evaluating your answer...</p>}
          {feedback && (
            <Feedback>
              <h3>Feedback:</h3>
              <p>{feedback}</p>
            </Feedback>
          )}
        </Section>
      ) : (
        <p>All parts completed. Your responses have been recorded.</p>
      )}
    </Container>
  );
};

export default SpeakingSection;