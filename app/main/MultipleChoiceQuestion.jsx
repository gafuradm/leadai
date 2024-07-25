import React, { useState } from 'react';
import styled from 'styled-components';

const QuestionContainer = styled.div`
  margin-bottom: 20px;
  color: black;
`;

const QuestionText = styled.h3`
  color: black;
`;

const OptionLabel = styled.label`
  color: black;
`;

const MultipleChoiceQuestion = ({ question, onAnswerChange }) => {
  const [selectedOption, setSelectedOption] = useState('');

  const handleOptionChange = (option) => {
    setSelectedOption(option);
    onAnswerChange(question.id, option);
  };

  return (
    <QuestionContainer>
      <QuestionText>{question.question}</QuestionText>
      {question.options.map((option, index) => (
        <div key={index}>
          <input
            type="radio"
            id={`${question.id}-${index}`}
            name={question.id}
            value={option}
            checked={selectedOption === option}
            onChange={() => handleOptionChange(option)}
          />
          <OptionLabel htmlFor={`${question.id}-${index}`}>{option}</OptionLabel>
        </div>
      ))}
    </QuestionContainer>
  );
};

export default MultipleChoiceQuestion;
