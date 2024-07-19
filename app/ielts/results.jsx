import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import PulseLoader from 'react-spinners/PulseLoader';
import styled from 'styled-components';
import { fetchResults, fetchExampleEssay, fetchListeningExamples, fetchSpeakingExamples, fetchReadingExamples, fetchWritingExamples, fetchUniversityRecommendations } from './chatgpt';
import { ref, runTransaction, onValue } from "firebase/database";
import { db } from './firebase';
import './firebase';

const Container = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  font-family: Arial, sans-serif;
`;

const Title = styled.h1`
  text-align: center;
  color: #800120;
  font-weight: bold;
  font-size: 2.5em;
  margin-bottom: 30px;
`;

const Section = styled.div`
  margin-top: 40px;
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const ScoreChart = styled.div`
  width: 100%;
  height: 400px;
  margin-bottom: 40px;
`;

const Feedback = styled.div`
  margin-bottom: 30px;
  color: #333;
  line-height: 1.6;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 40px;
`;

const Button = styled.button`
  background-color: #800120;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.1s;
  font-size: 16px;
  font-weight: bold;

  &:hover {
    background-color: #a00130;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const DownloadButton = styled(Button)`
  margin-left: 20px;
  background-color: #14465a;

  &:hover {
    background-color: #1a5a74;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const AudioButton = styled(Button)`
  background-color: #800120;
  margin-top: 10px;

  &:hover {
    background-color: #14465a;
  }
`;

const ExampleContainer = styled.div`
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 20px;
  margin-top: 20px;
`;

const ExampleTitle = styled.h4`
  color: #800120;
  margin-bottom: 10px;
`;

const ExampleText = styled.p`
  margin-bottom: 15px;
`;

const UniversityRecommendations = styled.div`
  margin-top: 40px;
  background-color: #f0f8ff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const RecommendationTitle = styled.h3`
  color: #14465a;
  margin-bottom: 20px;
`;

const University = styled.div`
  margin-bottom: 20px;
  padding: 15px;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
`;

const UniversityName = styled.h4`
  color: #800120;
  margin-bottom: 5px;
`;

const UniversityLocation = styled.p`
  font-style: italic;
  color: #555;
  margin-bottom: 10px;
`;

const UniversityLink = styled.a`
  color: #14465a;
  text-decoration: underline;
  &:hover {
    text-decoration: none;
    color: #1a5a74;
  }
`;

const Results = ({ answers, testType }) => {
  const [result, setResult] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [listeningExamples, setListeningExamples] = useState(null);
  const [speakingExamples, setSpeakingExamples] = useState(null);
  const [readingExamples, setReadingExamples] = useState(null);
  const [writingExamples, setWritingExamples] = useState(null);
  const [universityRecommendations, setUniversityRecommendations] = useState(null);
  const [resultsLoadCount, setResultsLoadCount] = useState(0);

  useEffect(() => {
  const countRef = ref(db, 'resultsLoadCount');
  
  const unsubscribe = onValue(countRef, (snapshot) => {
    const count = snapshot.val() || 0;
    setResultsLoadCount(count);
  });

  return () => unsubscribe();
}, []);

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
          const score = extractScoreFromResult(sectionResult);
          if (score > 0) {
            totalScore += score;
            validSections++;
          }
          newResults[section] = { feedback: sectionResult, score: score };
          
          // Fetch examples based on the section and score
          if (section === 'listening' || testType === 'full') {
            const listening = await fetchListeningExamples();
            setListeningExamples(listening);
          }
          if (section === 'speaking' || testType === 'full') {
            const speaking = await fetchSpeakingExamples();
            setSpeakingExamples(speaking);
          }
          if (section === 'reading' || testType === 'full') {
            const reading = await fetchReadingExamples(score);
            setReadingExamples(reading);
          }
          if (section === 'writing' || testType === 'full') {
            const writingTopic = answers[section]?.data?.topics?.task2 || 'general writing topic';
            const writing = await fetchWritingExamples(score, writingTopic);
            setWritingExamples(writing);
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

    await updateResultsLoadCount();

    if (testType === 'full') {
      const recommendations = await fetchUniversityRecommendations(overallScore);
      setUniversityRecommendations(recommendations);
    }
  } catch (err) {
    console.error('Error in getResults:', err);
    setError(`General error fetching results: ${err.message}`);
  } finally {
    setLoading(false);
  }
};
  
    getResults();
  }, [answers, testType]);

  const extractScoreFromResult = (result) => {
  const match = result.match(/Band Score: ([\d.]+)\/9/);
  return match ? parseFloat(match[1]) : 0;
};

  const downloadResults = () => {
    let content = `IELTS Test Results\n\n`;
    content += `Overall Score: ${result.overallScore}/9\n\n`;
  
    Object.entries(result).forEach(([section, data]) => {
      if (section !== 'overallScore') {
        content += `${section.charAt(0).toUpperCase() + section.slice(1)} Score: ${data.score.toFixed(1)}/40\n`;
        content += `${section.charAt(0).toUpperCase() + section.slice(1)} Feedback:\n${data.feedback}\n\n`;
      }
    });
  
    if (listeningExamples) {
      content += `Listening Practice Materials:\n${listeningExamples}\n\n`;
    }
    if (speakingExamples) {
      content += `Speaking Practice Materials:\n${speakingExamples}\n\n`;
    }
    if (readingExamples) {
      content += `Reading Practice Materials:\n${readingExamples}\n\n`;
    }
    if (writingExamples) {
      content += `Writing Practice Materials:\n${writingExamples}\n\n`;
    }
  
    if (universityRecommendations) {
      content += `University Recommendations:\n${universityRecommendations}\n\n`;
    }
  
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

  const updateResultsLoadCount = async () => {
  const countRef = ref(db, 'resultsLoadCount');
  
  try {
    await runTransaction(countRef, (currentCount) => {
      return (currentCount || 0) + 1;
    });
  } catch (error) {
    console.error("Error updating results load count:", error);
  }
};

  const parseScore = (content) => {
    if (!content) return 0;
    const scoreMatch = content.match(/Score: (\d+(\.\d+)?)/);
    return scoreMatch ? parseFloat(scoreMatch[1]) : 0;
  };

  const playAudio = (text) => {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = 'en-US';
    window.speechSynthesis.speak(speech);
  };

  const formatListeningExamples = (examples) => {
    if (!examples) return null;
    const passages = examples.split(/Passage \d+:/);
    return (
      <div>
        {passages.slice(1).map((passage, index) => (
          <ExampleContainer key={index}>
            <ExampleTitle>Passage {index + 1}</ExampleTitle>
            <ExampleText>{passage.trim()}</ExampleText>
            <AudioButton onClick={() => playAudio(passage.trim())}>Play Audio</AudioButton>
          </ExampleContainer>
        ))}
      </div>
    );
  };

  const formatSpeakingExamples = (examples) => {
    if (!examples) return null;
    const parts = examples.split(/Part \d+:/);
    return (
      <div>
        {parts.slice(1).map((part, index) => (
          <ExampleContainer key={index}>
            <ExampleTitle>Part {index + 1}</ExampleTitle>
            <ExampleText>{part.trim()}</ExampleText>
            <AudioButton onClick={() => playAudio(part.trim())}>Play Audio</AudioButton>
          </ExampleContainer>
        ))}
      </div>
    );
  };

  const formatReadingExamples = (examples) => {
    if (!examples) return null;
    return <ExampleContainer dangerouslySetInnerHTML={{ __html: examples }} />;
  };

  const formatWritingExamples = (examples) => {
    if (!examples) return null;
    return <ExampleContainer dangerouslySetInnerHTML={{ __html: examples }} />;
  };

  const renderUniversityRecommendations = () => {
    if (!universityRecommendations) return null;
  
    const recommendations = universityRecommendations.split('\n\n').map(recommendation => {
      const [name, location, url, ...details] = recommendation.split('\n');
      return { name, location, url, details: details.join(' ') };
    });
  
    return (
      <UniversityRecommendations>
        <RecommendationTitle>Recommended Universities</RecommendationTitle>
        {recommendations.map((uni, index) => (
          <University key={index}>
            <UniversityName>{uni.name}</UniversityName>
            <UniversityLocation>{uni.location}</UniversityLocation>
            {uni.url && <UniversityLink href={uni.url} target="_blank" rel="noopener noreferrer">Visit Website</UniversityLink>}
            <p>{uni.details}</p>
          </University>
        ))}
      </UniversityRecommendations>
    );
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

      let exampleContent = null;
      switch(section) {
        case 'listening':
          exampleContent = formatListeningExamples(listeningExamples);
          break;
        case 'speaking':
          exampleContent = formatSpeakingExamples(speakingExamples);
          break;
        case 'reading':
          exampleContent = formatReadingExamples(readingExamples);
          break;
        case 'writing':
          exampleContent = formatWritingExamples(writingExamples);
          break;
      }

      return (
    <Feedback key={section}>
      <h2>{section.charAt(0).toUpperCase() + section.slice(1)} Feedback</h2>
      <div dangerouslySetInnerHTML={{ __html: feedbackContent }} />
      <p>Score: {sectionResult.score.toFixed(1)}/9</p>
      {exampleContent && (
        <div>
          <h3>Practice Materials</h3>
          {exampleContent}
        </div>
      )}
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
      <Title>IELTS Test Results</Title>
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
        <h2 style={{ color: '#800120', textAlign: 'center' }}><b>Overall Score: {result.overallScore}/9</b></h2>
        {Object.keys(result).filter((section) => section !== 'overallScore').map(renderFeedback)}
        <p style={{ textAlign: 'center' }}>Total results loaded: {resultsLoadCount}</p>
      </Section>
      {testType === 'full' && renderUniversityRecommendations()}
      <ButtonContainer>
        <Button onClick={() => window.location.href = '/ielts'}>Back to Dashboard</Button>
        <DownloadButton onClick={downloadResults}>Download Results</DownloadButton>
      </ButtonContainer>
    </Container>
  );
};

export default Results;