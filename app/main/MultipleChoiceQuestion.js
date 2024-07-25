import React, { useState } from 'react';
import styled from 'styled-components';

const QuestionContainer = styled.div`
  margin-bottom: 20px;
`;

const QuestionText = styled.p`
  font-weight: bold;
  margin-bottom: 10px;
  color: black;
`;

const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const OptionLabel = styled.label`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  cursor: pointer;
  color: black;
  font-weight: bold;
`;

const RadioInput = styled.input`
  margin-right: 10px;
`;

const MultipleChoiceQuestion = ({ question, onAnswerChange }) => {
  const [selectedOption, setSelectedOption] = useState('');

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
    onAnswerChange(e.target.value);
  };

  return (
    <QuestionContainer>
      <QuestionText>{question.question}</QuestionText>
      <OptionsContainer>
        {question.options.map((option, index) => (
          <OptionLabel key={index}>
            <RadioInput
              type="radio"
              value={option}
              checked={selectedOption === option}
              onChange={handleOptionChange}
            />
            {option}
          </OptionLabel>
        ))}
      </OptionsContainer>
    </QuestionContainer>
  );
};

export default MultipleChoiceQuestion;