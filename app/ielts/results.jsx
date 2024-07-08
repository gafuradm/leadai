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
  background-color: #333;
  color: white;
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
  
        const newResults = {};
        let totalScore = 0;
  
        for (const section of sections) {
          if (!answers[section]) {
            console.warn(`Missing data for ${section} section`);
            continue;
          }
          const sectionResult = await fetchResults(section, answers[section], testType);
          const score = parseScore(sectionResult);
          totalScore += score;
          newResults[section] = { feedback: sectionResult, score: score };
        }
        
        const overallScore = testType === 'full' 
          ? (totalScore / sections.length).toFixed(1) 
          : totalScore.toFixed(1);
  
        setResult({ ...newResults, overallScore });
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
    const scoreMatch = content.match(/Score:\s*(\d+(\.\d+)?)/);
    return scoreMatch ? parseFloat(scoreMatch[1]) : 0;
  };

  const renderFeedback = (section) => {
    const sectionResult = result[section];
    if (!sectionResult) return null;
    return (
      <Feedback key={section}>
        <h2>{section.charAt(0).toUpperCase() + section.slice(1)} Feedback</h2>
        <p>{sectionResult.feedback}</p>
        <p>Score: {sectionResult.score.toFixed(1)}/40</p>
      </Feedback>
    );
  };

  if (loading) return (
    <LoadingContainer>
      <PulseLoader color="#FF69B4" />
    </LoadingContainer>
  );
  if (error) return <Container><p>Error fetching results: {error}</p></Container>;

  const chartData = Object.entries(result)
  .filter(([key]) => key !== 'overallScore')
  .map(([section, data]) => ({
    name: section.charAt(0).toUpperCase() + section.slice(1),
    score: data.score
  }));

  return (
    <Container>
      <Title>IELTS Test Results</Title>
      <Section>
        <ScoreChart>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 40]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="score" fill="#FF69B4" />
            </BarChart>
          </ResponsiveContainer>
        </ScoreChart>
        {testType === 'full' ? (
  <h2>Overall Score: {result.overallScore}/9</h2>
) : (
  <h2>Section Score: {result[testType]?.score.toFixed(1)}/40</h2>
)}
      </Section>
      {Object.keys(result).filter(key => key !== 'overallScore').map(renderFeedback)}
      <Button onClick={() => {}}>Download Results</Button>
    </Container>
  );
};

export default Results;