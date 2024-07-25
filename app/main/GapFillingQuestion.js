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

const GapFillingQuestion = ({ question, onAnswerChange, savedAnswer }) => {
  const [answer, setAnswer] = useState('');

  useEffect(() => {
    if (savedAnswer) {
      setAnswer(savedAnswer);
    }
  }, [savedAnswer]);

  const handleChange = (e) => {
    setAnswer(e.target.value);
    onAnswerChange(e.target.value);
  };

  const parts = question.question.split('_______');
  const hint = question.hint || "Fill in the gap"; // Добавляем подсказку

  return (
    <QuestionContainer>
      <QuestionText>
        {parts[0]}
        <Input
          type="text"
          value={answer}
          onChange={handleChange}
          placeholder={hint}
        />
        {parts[1]}
      </QuestionText>
    </QuestionContainer>
  );
};

export default GapFillingQuestion;