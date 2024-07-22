"use client";
import { useState } from 'react';
import Head from 'next/head';

export default function Home() {
  const [essay, setEssay] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [topic, setTopic] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleEssaySubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  try {
    const result = await analyzeEssay(essay);
    setAnalysis(result);
  } catch (error) {
    console.error('Error analyzing essay:', error);
    setAnalysis({
      score: 0,
      feedback: "An error occurred while analyzing the essay. Please try again.",
      recommendations: "Unable to provide recommendations due to an error."
    });
  }
  setIsLoading(false);
};

  const handleTopicGenerate = async () => {
    setIsLoading(true);
    try {
      const newTopic = await generateTopic();
      setTopic(newTopic);
    } catch (error) {
      console.error('Error generating topic:', error);
    }
    setIsLoading(false);
  };

  const analyzeEssay = async (text) => {
  const response = await fetch('/api/openai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt: text, task: 'analyze' }),
  });
  const data = await response.json();
  
  // Parse the plain text response
  const [scoreLine, ...rest] = data.result.split('\n');
  const score = parseInt(scoreLine.match(/\d+/)[0], 10);
  const feedback = rest.join('\n');

  return {
    score: score || 0,
    feedback: feedback || "No feedback provided",
    recommendations: "Recommendations extracted from feedback"
  };
};

  const generateTopic = async () => {
    const response = await fetch('/api/openai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task: 'generate' }),
    });
    const data = await response.json();
    return data.result;
  };

  return (
    <div className="container">
      <Head>
        <title>Essay Analysis System</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Essay Analysis System</h1>
        
        <div className="topic-generator">
          <button onClick={handleTopicGenerate} disabled={isLoading}>
            Generate Topic
          </button>
          {topic && <p className="topic">Topic: {topic}</p>}
        </div>

        <form onSubmit={handleEssaySubmit} className="essay-form">
          <textarea
            value={essay}
            onChange={(e) => setEssay(e.target.value)}
            placeholder="Enter your essay here"
            rows="10"
            required
          />
          <button type="submit" disabled={isLoading}>
            Submit for Analysis
          </button>
        </form>

        {isLoading && <p className="loading">Processing...</p>}

        {analysis && (
          <div className="analysis">
            <h2>Essay Analysis</h2>
            <p className="score">Score: {analysis.score}/100</p>
            <h3>Detailed Feedback:</h3>
            <p>{analysis.feedback}</p>
            <h3>Recommendations for Improvement:</h3>
            <p>{analysis.recommendations}</p>
          </div>
        )}
      </main>

      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          background-color: #f0f4f8;
        }

        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          max-width: 800px;
          width: 100%;
        }

        h1 {
          margin: 0 0 2rem;
          line-height: 1.15;
          font-size: 3rem;
          text-align: center;
          color: #2c3e50;
        }

        .topic-generator {
          margin-bottom: 2rem;
          text-align: center;
        }

        .topic {
          margin-top: 1rem;
          font-style: italic;
          color: #34495e;
        }

        .essay-form {
          width: 100%;
          display: flex;
          flex-direction: column;
        }

        textarea {
          width: 100%;
          min-height: 200px;
          padding: 0.5rem;
          margin-bottom: 1rem;
          border: 1px solid #bdc3c7;
          border-radius: 4px;
          font-size: 1rem;
        }

        button {
          padding: 0.5rem 1rem;
          font-size: 1rem;
          background-color: #3498db;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        button:hover {
          background-color: #2980b9;
        }

        button:disabled {
          background-color: #bdc3c7;
          cursor: not-allowed;
        }

        .loading {
          margin-top: 1rem;
          font-style: italic;
          color: #7f8c8d;
        }

        .analysis {
          margin-top: 2rem;
          padding: 1rem;
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .score {
          font-size: 1.2rem;
          font-weight: bold;
          color: #27ae60;
        }

        h2, h3 {
          color: #2c3e50;
        }

        p {
          line-height: 1.6;
          color: #34495e;
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
}