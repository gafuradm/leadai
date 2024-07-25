import React, { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  margin-bottom: 20px;
`;

const SentenceItem = styled.div`
  margin-bottom: 10px;
`;

const SentenceCompletionQuestion = ({ question, onAnswerChange }) => {
  const [answer, setAnswer] = useState('');

  const handleChange = (value) => {
    setAnswer(value);
    onAnswerChange(question.id, value);
  };

  if (!question.options || !Array.isArray(question.options)) {
    console.error('Invalid question structure for SentenceCompletionQuestion:', question);
    return <Container>Error: Invalid question structure</Container>;
  }

  return (
    <Container>
      <h3>{question.question}</h3>
      <SentenceItem>
        <select
          onChange={(e) => handleChange(e.target.value)}
          value={answer}
          style={{ 
            marginLeft: '10px',
            backgroundColor: '#ffffff',
            color: '#000000'
          }}
        >
          <option value="">Select an option</option>
          {question.options.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      </SentenceItem>
    </Container>
  );
};

export default SentenceCompletionQuestion;