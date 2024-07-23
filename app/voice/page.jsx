"use client";
import { useState, useEffect, useRef } from 'react';

export default function VoicePage() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [topic, setTopic] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
  if (!('webkitSpeechRecognition' in window)) {
    console.log('Speech recognition not available');
  } else {
    recognitionRef.current = new window.webkitSpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = 'en-US';
    recognitionRef.current.onresult = handleRecognitionResult;
  }
}, []);

  const handleRecognitionResult = (event) => {
    const transcript = Array.from(event.results)
      .map(result => result[0].transcript)
      .join('');
    setTranscript(transcript);
  };

  const startRecording = () => {
    setIsRecording(true);
    recognitionRef.current.start();
  };

  const stopRecording = () => {
    setIsRecording(false);
    recognitionRef.current.stop();
  };

  const handleAnalysis = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: transcript, task: 'analyze' }),
      });
      const data = await response.json();
      setAnalysis(data.result);
    } catch (error) {
      console.error('Error analyzing speech:', error);
      setAnalysis("An error occurred while analyzing the speech. Please try again.");
    }
    setIsLoading(false);
  };

  const handleTopicGenerate = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task: 'generate' }),
      });
      const data = await response.json();
      setTopic(data.result);
    } catch (error) {
      console.error('Error generating topic:', error);
      setTopic("Failed to generate a topic. Please try again.");
    }
    setIsLoading(false);
  };

  return (
    <div className="container">
      <h1>Speech Analysis System</h1>
      
      <div className="topic-generator">
        <button onClick={handleTopicGenerate} disabled={isLoading}>
          Generate Topic
        </button>
        {topic && <p className="topic" style={{ color: "#000000" }}>Topic: {topic}</p>}
      </div>

      <div className="speech-recorder">
        <button onClick={isRecording ? stopRecording : startRecording}>
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </button>
        {transcript && (
          <>
            <p style={{ color: "#000000" }}>Transcript: {transcript}</p>
            <button onClick={handleAnalysis} disabled={isLoading}>
              Analyze Speech
            </button>
          </>
        )}
      </div>

      {isLoading && <p className="loading" style={{ color: "#000000" }}>Processing...</p>}

      {analysis && (
        <div className="analysis">
          <h2>Speech Analysis</h2>
          <p>{analysis}</p>
        </div>
      )}

      <style jsx>{`
        .container {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem;
          font-family: Arial, sans-serif;
        }
        h1 {
          text-align: center;
          color: #800120;
          font-weight: bold;
        }
        .topic-generator, .speech-recorder {
          margin-bottom: 2rem;
        }
        button {
          background-color: #800120;
          color: white;
          padding: 10px 20px;
          border: none;
          cursor: pointer;
          margin-right: 10px;
        }
        button:disabled {
          background-color: #cccccc;
        }
        .loading {
          text-align: center;
          font-style: italic;
          color: black
        }
        .analysis {
          background-color: #f0f0f0;
          color: black;
          padding: 1rem;
          border-radius: 5px;
        }
      `}</style>
    </div>
  );
}