import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  margin-bottom: 20px;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  color: white;
`;

const FlowchartCompletionQuestion = ({ question, onAnswerChange }) => {
  const handleInputChange = (e) => {
    onAnswerChange(question.id, e.target.value);
  };

  return (
    <Container>
      <h3>{question.prompt}</h3>
      <Input type="text" value={question.answer || ''} onChange={handleInputChange} />
    </Container>
  );
};

export default FlowchartCompletionQuestion;
