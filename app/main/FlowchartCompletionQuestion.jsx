import React, { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  margin-bottom: 20px;
`;

const FlowchartItem = styled.div`
  margin-bottom: 10px;
`;

const FlowchartCompletionQuestion = ({ question, onAnswerChange }) => {
  const [answers, setAnswers] = useState({});

  const handleChange = (optionIndex, value) => {
    const newAnswers = { ...answers, [optionIndex]: value };
    setAnswers(newAnswers);
    onAnswerChange(question.id, newAnswers);
  };

  if (!question.options || !Array.isArray(question.options)) {
    console.error('Invalid question structure for FlowchartCompletionQuestion:', question);
    return <Container>Error: Invalid question structure</Container>;
  }

  return (
    <Container>
      <h3>{question.question}</h3>
      {question.options.map((option, index) => (
        <FlowchartItem key={index}>
          <label>{option}: </label>
          <input
            type="text"
            onChange={(e) => handleChange(index, e.target.value)}
            value={answers[index] || ''}
            style={{ 
              width: '100px', 
              margin: '0 5px', 
              backgroundColor: '#ffffff', // Белый фон
              color: '#000000', // Черный текст
              border: '1px solid #000000' // Черные границы
            }}
          />
        </FlowchartItem>
      ))}
    </Container>
  );
};

export default FlowchartCompletionQuestion;