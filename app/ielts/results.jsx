import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { fetchResults } from './chatgpt';
import { PulseLoader } from 'react-spinners';

const Container = styled.div`
  background-color: black;
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

const ScoreChart = styled.div`
  height: 300px;
  margin-bottom: 40px;
`;

const Feedback = styled.div`
  background-color: #333; // Set a dark background color
  color: white; // Ensure the text color is light
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const Results = ({ answers, testType }) => {
  const [result, setResult] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getResults = async () => {
      try {
        setLoading(true);
        setError(null);
        const sections = testType === 'full' 
          ? ['listening', 'reading', 'writing', 'speaking'] 
          : [testType];

        for (const section of sections) {
          if (!answers[section]) {
            console.warn(`Missing data for ${section} section`);
            continue;
          }
          const sectionResult = await fetchResults(section, answers[section]);
          setResult(prevResult => ({
            ...prevResult,
            [section]: sectionResult
          }));
        }
      } catch (err) {
        console.error('Error in getResults:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    getResults();
  }, [answers, testType]);

  const parseScore = (content) => {
    if (!content) return 0;
    
    const scoreMatch = content.match(/(\d+(\.\d+)?)\s*\/\s*9/);
    if (scoreMatch) {
      return parseFloat(scoreMatch[1]);
    }
    
    return 0;
  };

  const convertTo40Scale = (score) => {
    return Math.round((score / 9) * 40);
  };

  const renderFeedback = (section) => {
    const feedback = result[section];
    const score = parseScore(feedback);
    const recommendationsMatch = feedback.match(/List of countries and universities:\s*([\s\S]*)/);
    const recommendations = recommendationsMatch ? recommendationsMatch[1] : '';
    return (
      <Feedback key={section}>
        <h2>{section.charAt(0).toUpperCase() + section.slice(1)} Feedback</h2>
        <p>{feedback}</p>
        <p>Score: {score.toFixed(1)}/9 ({convertTo40Scale(score)}/40)</p>
      </Feedback>
    );
  };

  const downloadResults = () => {
    const sections = testType === 'full' 
      ? ['listening', 'reading', 'writing', 'speaking']
      : [testType];

    const scores = sections.map(section =>
      parseScore(result[section])
    );

    let resultsText;

    if (testType === 'full') {
      const totalScore = scores.reduce((a, b) => a + b, 0);
      const overallScore = (totalScore / 4).toFixed(1);
      resultsText = sections.map(section =>
        `${section.charAt(0).toUpperCase() + section.slice(1)} Feedback:
        ${result[section] || 'No feedback available'}
        Score: ${parseScore(result[section]).toFixed(1)}/9 (${convertTo40Scale(parseScore(result[section]))}/40)`
      ).join('\n\n') +
      `\n\nOverall Score:
      ${overallScore}/9 (Total: ${totalScore.toFixed(1)}/36)`;
    } else {
      resultsText = `${testType.charAt(0).toUpperCase() + testType.slice(1)} Feedback:
      ${result[testType] || 'No feedback available'}
      Score: ${scores[0].toFixed(1)}/9 (${convertTo40Scale(scores[0])}/40)`;
    }

    const blob = new Blob([resultsText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'IELTS_Results.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (loading) return (
    <LoadingContainer>
      <PulseLoader color="#FF69B4" />
    </LoadingContainer>
  );
  if (error) return <Container><p>Error fetching results: {error}</p></Container>;

  const chartData = Object.entries(result).map(([section, data]) => ({
    name: section.charAt(0).toUpperCase() + section.slice(1),
    score: parseScore(data)
  }));

  const overallScore = chartData.reduce((sum, item) => sum + item.score, 0) / chartData.length;

  return (
    <Container>
      <Title>IELTS Test Results</Title>
      <Section>
        <ScoreChart>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 9]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="score" fill="#FF69B4" />
            </BarChart>
          </ResponsiveContainer>
        </ScoreChart>
        <h2>Overall Score: {overallScore.toFixed(1)}/9</h2>
      </Section>
      {Object.keys(result).map(renderFeedback)}
      <Button onClick={downloadResults}>Download Results</Button>
    </Container>
  );
};

export default Results;
