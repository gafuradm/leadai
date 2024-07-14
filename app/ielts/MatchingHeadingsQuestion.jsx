import React, { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  margin-bottom: 20px;
`;

const Option = styled.div`
  margin-bottom: 10px;
`;

const MatchingHeadingsQuestion = ({ question, onAnswerChange }) => {
  const [selectedAnswers, setSelectedAnswers] = useState({});

  const handleChange = (optionIndex, value) => {
    const newAnswers = { ...selectedAnswers, [optionIndex]: value };
    setSelectedAnswers(newAnswers);
    onAnswerChange(question.id, newAnswers);
  };

  if (!question.options || !Array.isArray(question.options)) {
    console.error('Invalid question structure for MatchingHeadingsQuestion:', question);
    return <Container>Error: Invalid question structure</Container>;
  }

  return (
    <Container>
      <h3>{question.question}</h3>
      {question.options.map((option, index) => (
        <Option key={index}>
          <p>{option}</p>
          <select
            onChange={(e) => handleChange(index, e.target.value)}
            value={selectedAnswers[index] || ''}
            style={{ 
              marginLeft: '10px',
              backgroundColor: '#ffffff',
              color: '#000000'
            }}
          >
            <option value="">Select a heading</option>
            {question.options.map((heading, headingIndex) => (
              <option key={headingIndex} value={headingIndex}>
                {heading}
              </option>
            ))}
          </select>
        </Option>
      ))}
    </Container>
  );
};

export default MatchingHeadingsQuestion;