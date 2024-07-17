import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { fetchResults } from './chatgpt';

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
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [answers, setAnswers] = useState([]);
  const [feedback, setFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const recognitionRef = useRef(null);
  const [timeLeft, setTimeLeft] = useState(14 * 60);
  const [videoId, setVideoId] = useState(null);
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

  const createAvatarVideo = async (text) => {
  try {
    const response = await fetch('https://api.heygen.com/v2/video/generate', {
      method: 'POST',
      headers: {
        'X-Api-Key': 'ODY4MTlmNDEwZGM1NGIxZWJkMmM5NjUyYTI5MmRlZmYtMTcyMTE5NTExOQ==',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        video_inputs: [
          {
            character: {
              type: "avatar",
              avatar_id: "Angela-inblackskirt-20220820",
              avatar_style: "normal"
            },
            voice: {
              type: "text",
              input_text: text,
              voice_id: "1bd001e7e50f421d891986aad5158bc8",
              speed: 1.1
            }
          }
        ],
        test: false,
        aspect_ratio: "16:9"
      })
    });

    const data = await response.json();
    console.log('API response data:', data);

    if (data.data && data.data.video_id) {
      console.log('Video generation initiated, video_id:', data.data.video_id);
      setVideoId(data.data.video_id);
      checkVideoStatus(data.data.video_id);
    } else if (data.error) {
      console.error('Error in video generation:', data.error);
    } else {
      console.error('Unexpected response structure:', data);
    }
  } catch (error) {
    console.error("Error in avatar video generation:", error);
  }
};

const checkVideoStatus = async (id) => {
  try {
    const response = await fetch(`https://api.heygen.com/v1/video_status.get?video_id=${id}`, {
      headers: {
        'X-Api-Key': 'ODY4MTlmNDEwZGM1NGIxZWJkMmM5NjUyYTI5MmRlZmYtMTcyMTE5NTExOQ==',
      }
    });

    const data = await response.json();
    console.log('Video status data:', data);

    if (data.data) {
      switch(data.data.status) {
        case 'completed':
          setVideoUrl(data.data.video_url);
          break;
        case 'processing':
        case 'pending':
        case 'waiting':
          // Проверяем статус снова через 5 секунд
          setTimeout(() => checkVideoStatus(id), 5000);
          break;
        default:
          console.log('Current video status:', data.data.status);
          // Можно добавить дополнительную логику обработки неизвестных статусов
          setTimeout(() => checkVideoStatus(id), 5000);
      }
    } else {
      console.error('Unexpected response structure:', data);
    }
  } catch (error) {
    console.error("Error checking video status:", error);
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
      question: parts[currentPart].questions[currentQuestion],
      answer: transcript
    }];
    setAnswers(newAnswers);

    await createAvatarVideo(transcript);

    const data = {
      questions: [parts[currentPart].questions[currentQuestion]],
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
      console.error("Error fetching speaking results:", error);
      setFeedback("Error fetching feedback. Please try again.");
    }

    setIsLoading(false);

    if (currentQuestion < parts[currentPart].questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else if (currentPart < parts.length - 1) {
      setCurrentPart(currentPart + 1);
      setCurrentQuestion(0);
    } else {
      onNext({
        section: 'speaking',
        data: {
          questions: parts.flatMap(part => part.questions),
          answers: newAnswers
        }
      });
    }
  };

  return (
    <Container>
      <Title>IELTS Speaking Test</Title>
      <Section>
        <Question>{parts[currentPart].questions[currentQuestion]}</Question>
        <Button onClick={startRecording} disabled={isRecording || isLoading}>
          {isRecording ? 'Recording...' : 'Start Recording'}
        </Button>
        <Button onClick={stopRecording} disabled={!isRecording || isLoading}>
          Stop Recording
        </Button>
        {timedMode && <Timer>Time Left: {formatTime(timeLeft)}</Timer>}
        <Transcript>{transcript}</Transcript>
        {feedback && <Feedback>{feedback}</Feedback>}
      </Section>
      {videoUrl && (
        <Section>
          <video controls>
            <source src={videoUrl} type="video/mp4" />
          </video>
        </Section>
      )}
    </Container>
  );
};

export default SpeakingSection;
