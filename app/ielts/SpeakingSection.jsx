import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { fetchResults } from './chatgpt';
import { Configuration, StreamingAvatarApi } from '@heygen/streaming-avatar';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Roboto', sans-serif;
  color: #ffffff;
`;

const Title = styled.h1`
  color: black;
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

const Timer = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: #800120;
  text-align: center;
  margin-bottom: 20px;
`;

const SpeakingSection = ({ onNext, timedMode }) => {
  const [currentPart, setCurrentPart] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [answers, setAnswers] = useState([]);
  const [feedback, setFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const recognitionRef = useRef(null);
  const [timeLeft, setTimeLeft] = useState(14 * 60);
  const [streamingAvatar, setStreamingAvatar] = useState(null);
  const [randomizedQuestions, setRandomizedQuestions] = useState([]);
  const parts = [
    {
    "name": "Part 1: Interview",
    "questions": [
      "What are some popular attractions in your hometown?",
      "Describe a traditional dish from your hometown.",
      "What do you think makes your hometown unique?",
      "How do people in your hometown typically spend weekends?",
      "Is there a special event or festival celebrated in your hometown?",
      "Can you tell me about your hometown?",
      "What do you like to do in your free time?",
      "Do you work or are you a student?",
      "What's your favorite season and why?",
      "How has your hometown changed over the years?",
    ]
  },
  {
    "name": "Part 2: Cue Card",
    "questions": [
      "Talk about a book you read in your childhood that you still remember.",
      "Describe a book you read for academic purposes. What was it about?",
      "Discuss a book that changed your perspective on a particular topic.",
      "Describe a book you would like to read in the future and why.",
      "Talk about a book that you couldn't put down once you started reading it.",
      "Describe a book you have recently read. You should say:\n- what the book was\n- what it was about\n- why you decided to read it\n- and explain whether you would recommend it to other people.",
      "Talk about a movie based on a book you have read.",
      "Describe a character from a book you like. Why do you like this character?",
      "Discuss a book that made you think deeply about an issue.",
      "Describe a book that had a strong emotional impact on you.",
    ]
  },
  {
    "name": "Part 3: Discussion",
    "questions": [
      "Talk about the role of libraries in promoting reading habits.",
      "Should books be adapted into movies or TV series? Why or why not?",
      "Discuss the influence of bestseller lists on readers' choices.",
      "What impact does reading have on one's vocabulary and language skills?",
      "Compare reading physical books versus e-books. Which do you prefer and why?",
      "Do you think reading habits have changed in recent years?",
      "How do you think technology will affect books in the future?",
      "What kinds of books are most popular in your country?",
      "Discuss the importance of reading for pleasure.",
      "How can schools encourage children to read more?",
    ]
  }
  ];

  useEffect(() => {
    const shuffledQuestions = parts.map(part => ({
      ...part,
      questions: shuffleArray([...part.questions])
    }));
    setRandomizedQuestions(shuffledQuestions);
  }, []);

  useEffect(() => {
    if (currentPart < randomizedQuestions.length) {
      speakQuestion(randomizedQuestions[currentPart].questions[currentQuestionIndex]);
    }
  }, [currentPart, currentQuestionIndex, randomizedQuestions]);

  useEffect(() => {
    if (timedMode) {
      const timer = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime > 0) {
            return prevTime - 1;
          } else {
            clearInterval(timer);
            handleTimeUp();
            return 0;
          }
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timedMode]);

  useEffect(() => {
    const initializeAvatar = async () => {
      try {
        const avatarApi = new StreamingAvatarApi(
          new Configuration({accessToken: 'OTExOGIyZGUzMTcxNDMzNGE3MTdmYjliZmI3NDg0ZTQtMTcyMTEyMTg4OQ=='})
        );
        setStreamingAvatar(avatarApi);
        console.log('Avatar API initialized successfully');
      } catch (error) {
        console.error('Error initializing Avatar API:', error);
      }
    };

    initializeAvatar();
  }, []);

  const handleTimeUp = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    onNext({
      section: 'speaking',
      data: {
        questions: parts.flatMap(part => part.questions),
        answers: answers
      }
    });
  };

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

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

  const startAvatar = async (text) => {
    if (!streamingAvatar) {
      console.error('Streaming avatar not initialized');
      return;
    }
  
    try {
      const startResponse = await streamingAvatar.createStartAvatar({
        newSessionRequest: {
          quality: "low",
          avatarName: "josh_lite3_20230714",
          voice: {voiceId: "077ab11b14f04ce0b49b5f6e5cc20979"}
        }
      });
      console.log('Avatar started successfully:', startResponse);
  
      const talkResponse = await streamingAvatar.createTalk({
        talkRequest: {text: text}
      });
      console.log('Avatar talk initiated:', talkResponse);
  
      if (talkResponse.videoUrl) {
        setVideoUrl(talkResponse.videoUrl);
      } else {
        console.error('No video URL received from the API');
      }
    } catch (error) {
      console.error("Error starting avatar:", error);
      if (error.response) {
        console.error("API response:", error.response.data);
      }
    }
  };

  const startRecording = () => {
    setIsRecording(true);
    setTranscript('');

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

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

  if (recognitionRef.current) {
    recognitionRef.current.stop();
  }

  if (transcript.trim() === '') {
    alert("No speech detected. Please try again.");
    setIsLoading(false);
    return;
  }

  const newAnswers = [...answers, {
    question: randomizedQuestions[currentPart].questions[currentQuestionIndex],
    answer: transcript
  }];
  setAnswers(newAnswers);

  if (streamingAvatar) {
    await startAvatar(transcript);
  } else {
    console.error('Streaming avatar not initialized');
  }

  const data = {
    questions: [randomizedQuestions[currentPart].questions[currentQuestionIndex]],
    answers: [transcript]
  };

  try {
    const result = await fetchResults('speaking', data, 'partial');
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

  if (currentQuestionIndex < randomizedQuestions[currentPart].questions.length - 1) {
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  } else if (currentPart < randomizedQuestions.length - 1) {
    setCurrentPart(currentPart + 1);
    setCurrentQuestionIndex(0);
  } else {
    onNext({
      section: 'speaking',
      data: {
        questions: randomizedQuestions.flatMap(part => part.questions),
        answers: newAnswers
      }
    });
  }
};

  return (
    <Container>
      <Title>Speaking Section</Title>
      {timedMode && <Timer>Time left: {formatTime(timeLeft)}</Timer>}
      {currentPart < randomizedQuestions.length ? (
        <Section>
          <h3>{randomizedQuestions[currentPart].name}</h3>
          <Question>{randomizedQuestions[currentPart].questions[currentQuestionIndex]}</Question>
          {currentPart === 1 && (
            <p>You have 1 minute to prepare. You should then speak for 1-2 minutes on this topic.</p>
          )}
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
          {videoUrl && (
            <video 
              src={videoUrl} 
              autoPlay 
              playsInline 
              controls 
              style={{width: '100%', maxWidth: '400px', marginTop: '20px'}}
            />
          )}
        </Section>
      ) : (
        <p>All parts completed. Your responses have been recorded.</p>
      )}
    </Container>
  );
};

export default SpeakingSection;