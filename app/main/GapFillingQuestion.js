import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const QuestionContainer = styled.div`
  margin-bottom: 20px;
  color: black;
`;

const QuestionText = styled.p`
  font-weight: bold;
  margin-bottom: 10px;
  color: black;
`;

const Input = styled.input`
  padding: 5px;
  margin: 0 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: white;
`;

const GapFillingQuestion = ({ question, savedAnswer, onAnswerChange }) => {
  const [answer, setAnswer] = useState(savedAnswer || '');

  const handleChange = (e) => {
    const newAnswer = e.target.value;
    setAnswer(newAnswer);
    onAnswerChange(newAnswer);
  };
  
  const parts = question.question.split('__');
  const placeholder = question.hint || "Fill in the gap";

  return (
    <QuestionContainer>
      <QuestionText>
        {parts[0]}
        <Input
          type="text"
          value={answer}
          onChange={handleChange}
          placeholder={placeholder}
        />
        {parts[1]}
      </QuestionText>
    </QuestionContainer>
  );
};

export default GapFillingQuestion;