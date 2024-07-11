import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import PulseLoader from 'react-spinners/PulseLoader';
import styled from 'styled-components';
import { fetchResults, fetchExampleEssay, fetchListeningExamples, fetchSpeakingExamples } from './chatgpt';

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

const Results = ({ answers, testType }) => {
  const [result, setResult] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [listeningExamples, setListeningExamples] = useState(null);
  const [speakingExamples, setSpeakingExamples] = useState(null);

  useEffect(() => {
    const getResults = async () => {
      try {
        setLoading(true);
        setError(null);
        const sections = testType === 'full' 
          ? ['listening', 'reading', 'writing', 'speaking'] 
          : [testType];

        console.log('Sections:', sections);
        console.log('Answers:', answers);

        const newResults = {};
        let totalScore = 0;

        for (const section of sections) {
          if (!answers[section]) {
            console.warn(`Missing data for ${section} section`);
            continue;
          }
          try {
            let sectionData = answers[section];
            console.log(`Section data for ${section}:`, sectionData);

            if (section === 'speaking') {
              sectionData = {
                questions: sectionData.questions,
                answers: sectionData.answers
              };
            }
            console.log(`Processed section data for ${section}:`, sectionData);

            const sectionResult = await fetchResults(section, sectionData, testType);
            console.log(`Result for ${section}:`, sectionResult);

            const score = parseScore(sectionResult);
            totalScore += score;
            newResults[section] = { feedback: sectionResult, score: score };
            
            if (section === 'writing') {
              const exampleEssay = await fetchExampleEssay(answers[section].topics);
              newResults[section].exampleEssay = exampleEssay;
            }
          } catch (error) {
            console.error(`Error processing ${section}:`, error);
            setError(`Error fetching ${section} results: ${error.message}`);
            return;
          }
        }
        
        const overallScore = testType === 'full' 
          ? (totalScore / sections.length).toFixed(1) 
          : totalScore.toFixed(1);

        setResult({ ...newResults, overallScore });

        if (testType === 'full' || testType === 'listening') {
          const examples = await fetchListeningExamples();
          setListeningExamples(examples);
        }

        if (testType === 'full' || testType === 'speaking') {
          const examples = await fetchSpeakingExamples();
          console.log("Speaking examples:", examples);
          setSpeakingExamples(examples);
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

  const parseScore = (content) => {
    if (!content) return 0;
    const scoreMatch = content.match(/out of 40, the score is (\d+)/);
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
        {section === 'writing' && sectionResult.exampleEssay && (
          <>
            <h3>Example Essay:</h3>
            <div dangerouslySetInnerHTML={{ __html: sectionResult.exampleEssay }} />
          </>
        )}
        <p>Score: {sectionResult.score.toFixed(1)}/40</p>
      </Feedback>
    );
  };

  const renderListeningExamples = () => {
    if (!listeningExamples) return null;

    const examples = listeningExamples.split(/Part \d+:/);
    return examples.slice(1).map((example, index) => {
      const utterance = new SpeechSynthesisUtterance(example);
      utterance.lang = 'en-US';
      
      return (
        <Section key={index}>
          <h3>Listening Practice - Part {index + 1}</h3>
          <p>{example}</p>
          <Button onClick={() => window.speechSynthesis.speak(utterance)}>
            Play Audio
          </Button>
        </Section>
      );
    });
  };

  const renderSpeakingExamples = () => {
    if (!speakingExamples) {
      console.log("No speaking examples available");
      return null;
    }
  
    const parts = speakingExamples.split(/Set \d+:/);
    return parts.slice(1).map((set, setIndex) => {
      const lines = set.trim().split('\n');
      const sections = [
        { title: 'Part 1', start: lines.findIndex(line => line.includes('Part 1')) },
        { title: 'Part 2', start: lines.findIndex(line => line.includes('Part 2')) },
        { title: 'Part 3', start: lines.findIndex(line => line.includes('Part 3')) },
      ];
  
      return (
        <Section key={setIndex}>
          <h3>Speaking Practice - Set {setIndex + 1}</h3>
          {sections.map((section, index) => {
            const nextSection = sections[index + 1];
            const sectionContent = lines.slice(section.start + 1, nextSection ? nextSection.start : undefined).join('\n');
            const [question, ...answerParts] = sectionContent.split('Sample answer:');
            const answer = answerParts.join('Sample answer:').trim();
  
            return (
              <div key={section.title}>
                <h4>{section.title}</h4>
                <p>{question.trim()}</p>
                <Button onClick={() => speak(question.trim())}>
                  Play Question
                </Button>
                <p><strong>Sample answer:</strong></p>
                <p>{answer}</p>
                <Button onClick={() => speak(answer)}>
                  Play Sample Answer
                </Button>
              </div>
            );
          })}
        </Section>
      );
    });
  };

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  const downloadResults = () => {
    let textContent = "IELTS Test Results\n\n";

    for (const section in result) {
      if (section !== 'overallScore') {
        textContent += `${section.charAt(0).toUpperCase() + section.slice(1)} Feedback:\n`;
        textContent += `${result[section].feedback}\n`;
        textContent += `Score: ${result[section].score.toFixed(1)}/40\n\n`;
        if (section === 'writing' && result[section].exampleEssay) {
          textContent += `Example Essay:\n${result[section].exampleEssay}\n\n`;
        }
      }
    }

    textContent += `Overall Score: ${result.overallScore}/9\n`;

    if (listeningExamples) {
      textContent += "\nListening Practice Examples:\n\n";
      textContent += listeningExamples;
    }

    if (speakingExamples) {
      textContent += "\nSpeaking Practice Examples:\n\n";
      textContent += speakingExamples;
    }

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
      <PulseLoader color="#FFFFFF" />
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
              <Bar dataKey="score" fill="#FFFFFF" />
            </BarChart>
          </ResponsiveContainer>
        </ScoreChart>
        {testType === 'full' ? (
          <h2>Overall Score: {result.overallScore}/9</h2>
        ) : (
          <h2>Section Score: {result[testType]?.score.toFixed(1)}/40</h2>
        )}
      </Section>
      {Object.keys(result)
        .filter(section => section !== 'overallScore')
        .map(section => renderFeedback(section))}
      {(testType === 'full' || testType === 'listening') && (
        <Section>
          <h2>Listening Practice</h2>
          {renderListeningExamples()}
        </Section>
      )}
      {(testType === 'full' || testType === 'speaking') && (
        <Section>
          <h2>Speaking Practice</h2>
          {renderSpeakingExamples()}
        </Section>
      )}
      <ButtonContainer>
        <ActionButton onClick={downloadResults}>Download Results</ActionButton>
      </ButtonContainer>
    </Container>
  );
};

export default Results;