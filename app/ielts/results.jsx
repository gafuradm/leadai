import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import PulseLoader from 'react-spinners/PulseLoader';
import styled from 'styled-components';
import { fetchResults } from './chatgpt';

const Container = styled.div`
  padding: 20px;
`;

const Title = styled.h1`
  text-align: center;
`;

const Section = styled.div`
  margin-top: 20px;
`;

const ScoreChart = styled.div`
  width: 100%;
  height: 300px;
  margin-bottom: 20px;
`;

const Feedback = styled.div`
  margin-bottom: 20px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const ActionButton = styled.button`
  background-color: #FF69B4;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 5px;

  &:hover {
    background-color: #FF1493;
  }
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
          try {
            const sectionResult = await fetchResults(section, answers[section], testType);
            const score = parseScore(sectionResult);
            totalScore += score;
            newResults[section] = { feedback: sectionResult, score: score };
          } catch (error) {
            setError(`Error fetching ${section} results: ${error.message}`);
            return;
          }
        }
        
        const overallScore = testType === 'full' 
          ? (totalScore / sections.length).toFixed(1) 
          : totalScore.toFixed(1);
  
        setResult({ ...newResults, overallScore });
      } catch (err) {
        console.error('Error in getResults:', err);
        setError(`General error fetching results: ${err.message}`);
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
    
    // Parse the feedback content to add formatting
    const feedbackContent = sectionResult.feedback
      .replace(/### Detailed Feedback and Score/g, '<h3>Detailed Feedback and Score</h3>')
      .replace(/- \*\*/g, '<li><strong>')
      .replace(/\*\* \- /g, '</strong> - ')
      .replace(/<li><strong>/g, '<ul><li><strong>')
      .replace(/<\/strong> - ([^<]+)(\n|$)/g, '</strong> - $1</li>')
      .replace(/Materials to Improve Listening Skills:/g, '<h3>Materials to Improve Listening Skills:</h3>')
      .replace(/### Reading Practice Material/g, '<h3>Reading Practice Material</g>')
      .replace(/### Listening Practice Script/g, '<h3>Listening Practice Script</h3>')
      .replace(/### Writing Practice Material/g, '<h3>Writing Practice Material</h3>')
      .replace(/### Speaking Practice Material/g, '<h3>Speaking Practice Material</h3>')
      .replace(/\*\*Text:\*\*/g, '<h4>Text:</h4>')
      .replace(/\*\*Comprehension Questions:\*\*/g, '<h4>Comprehension Questions:</h4>')
      .replace(/\*\*Script:\*\*/g, '<h4>Script:</h4>')
      .replace(/\*\*Questions:\*\*/g, '<h4>Questions:</h4>')
      .replace(/\*\*Essay Example:\*\*/g, '<h4>Essay Example:</h4>')
      .replace(/\*\*Letter Example:\*\*/g, '<h4>Letter Example:</h4>')
      .replace(/\*\*Dialogue Example:\*\*/g, '<h4>Dialogue Example:</h4>')
      .replace(/_/g, '')
      .replace(/\n/g, '<br/>');

    return (
      <Feedback key={section}>
        <h2>{section.charAt(0).toUpperCase() + section.slice(1)} Feedback</h2>
        <div dangerouslySetInnerHTML={{ __html: feedbackContent }} />
        <p>Score: {sectionResult.score.toFixed(1)}/40</p>
      </Feedback>
    );
  };

  const downloadResults = () => {
    let textContent = "IELTS Test Results\n\n";

    for (const section in result) {
      if (section !== 'overallScore') {
        textContent += `${section.charAt(0).toUpperCase() + section.slice(1)} Feedback:\n`;
        textContent += `${result[section].feedback}\n`;
        textContent += `Score: ${result[section].score.toFixed(1)}/40\n\n`;
      }
    }

    textContent += `Overall Score: ${result.overallScore}/9\n`;

    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'results.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return (
    <LoadingContainer>
      <PulseLoader color="#FF69B4" />
    </LoadingContainer>
  );
  if (error) return <Container><p>{error}</p></Container>;

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
      <ButtonContainer>
        <ActionButton onClick={downloadResults}>Download Results</ActionButton>
      </ButtonContainer>
    </Container>
  );
};

export default Results;
