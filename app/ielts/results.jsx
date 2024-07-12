import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import PulseLoader from 'react-spinners/PulseLoader';
import styled from 'styled-components';
import { fetchResults, fetchExampleEssay, fetchListeningExamples, fetchSpeakingExamples, fetchReadingExamples, fetchWritingExamples } from './chatgpt';

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
  background-color: #800120;
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
`;

const DownloadButton = styled(ActionButton)`
  margin-left: 10px;
`;

const Results = ({ answers, testType }) => {
  const [result, setResult] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [listeningExamples, setListeningExamples] = useState(null);
  const [speakingExamples, setSpeakingExamples] = useState(null);
  const [readingExamples, setReadingExamples] = useState(null);
  const [writingExamples, setWritingExamples] = useState(null);

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
        let validSections = 0;
  
        for (const section of sections) {
          if (answers[section] && answers[section].data) {
            console.log(`Processing section: ${section}`, answers[section].data);
            try {
              const sectionResult = await fetchResults(section, answers[section].data, testType);
              const score = parseScore(sectionResult);
              if (score > 0) {
                totalScore += score;
                validSections++;
              }
              newResults[section] = { feedback: sectionResult, score: score };
              
              // Fetch examples based on the section and score
              if (section === 'listening' || testType === 'full') {
                const listening = await fetchListeningExamples();
                setListeningExamples(listening);
                console.log("Listening examples:", listening);
              }
              if (section === 'speaking' || testType === 'full') {
                const speaking = await fetchSpeakingExamples();
                setSpeakingExamples(speaking);
                console.log("Speaking examples:", speaking);
              }
              if (section === 'reading' || testType === 'full') {
                const reading = await fetchReadingExamples(score);
                setReadingExamples(reading);
                console.log("Reading examples:", reading);
              }
              if (section === 'writing' || testType === 'full') {
                const writingTopic = answers[section]?.data?.topics?.task2 || 'general writing topic';
                const writing = await fetchWritingExamples(score, writingTopic);
                setWritingExamples(writing);
                console.log("Writing examples:", writing);
              }
            } catch (error) {
              console.error(`Error processing ${section}:`, error);
              setError(`Error fetching ${section} results: ${error.message}`);
            }
          } else {
            console.warn(`Missing data for ${section} section`);
          }
        }
  
        const overallScore = validSections > 0 ? roundIELTSScore(totalScore / validSections) : 0;
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

  const downloadResults = () => {
    let content = `IELTS Test Results\n\n`;
    content += `Overall Score: ${result.overallScore}/9\n\n`;

    Object.entries(result).forEach(([section, data]) => {
      if (section !== 'overallScore') {
        content += `${section.charAt(0).toUpperCase() + section.slice(1)} Score: ${data.score.toFixed(1)}/40\n`;
        content += `${section.charAt(0).toUpperCase() + section.slice(1)} Feedback:\n${data.feedback}\n\n`;
      }
    });

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'IELTS_Test_Results.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const roundIELTSScore = (score) => {
    const decimalPart = score % 1;
    if (decimalPart < 0.25) return Math.floor(score);
    if (decimalPart < 0.75) return Math.floor(score) + 0.5;
    return Math.ceil(score);
  };

  const parseScore = (content) => {
    if (!content) return 0;
    const scoreMatch = content.match(/Score: (\d+(\.\d+)?)/);
    return scoreMatch ? parseFloat(scoreMatch[1]) : 0;
  };

  const renderFeedback = (section) => {
    const sectionResult = result[section];
    if (!sectionResult) return null;
    
    const feedbackContent = sectionResult.feedback
      .replace(/### Detailed Feedback and Score/g, '<h3>Detailed Feedback and Score</h3>')
      .replace(/- \*\*/g, '<li><strong>')
      .replace(/\*\* \- /g, '</strong> - ')
      .replace(/<li><strong>/g, '<ul><li><strong>')
      .replace(/<\/strong> - ([^<]+)(\n|$)/g, '</strong> - $1</li>')
      .replace(/Materials to Improve Listening Skills:/g, '<h3>Materials to Improve Listening Skills:</h3>')
      .replace(/### Reading Practice Material/g, '<h3>Reading Practice Material</h3>')
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

  if (loading) {
    return (
      <LoadingContainer>
        <PulseLoader color="#800120" size={15} />
      </LoadingContainer>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Container>
      <Title>Test Results</Title>
      <ScoreChart>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={Object.entries(result).filter(([key]) => key !== 'overallScore').map(([key, value]) => ({ name: key, score: value.score }))}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="score" fill="#800120" />
          </BarChart>
        </ResponsiveContainer>
      </ScoreChart>
      <Section>
        <h2>Overall Score: {result.overallScore}/9</h2>
        {Object.keys(result).filter((section) => section !== 'overallScore').map(renderFeedback)}
      </Section>
      <ButtonContainer>
        <Button onClick={() => window.location.href = '/start-education'}>Start Education</Button>
        <DownloadButton onClick={downloadResults}>Download Results</DownloadButton>
      </ButtonContainer>
    </Container>
  );
};

export default Results;
