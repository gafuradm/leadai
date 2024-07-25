import React, { useState } from 'react';
import styled from 'styled-components';

const QuestionText = styled.p`
  font-weight: bold;
  margin-bottom: 10px;
  color: black;
`;

const QuestionContainer = styled.div`
  margin-bottom: 20px;
  color: black;
  @media (max-width: 768px) {
    padding: 0 10px;
  }
`;

const MatchingItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  justify-content: space-between; // Add this line
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const Statement = styled.span`
  margin-right: 10px;
  color: black;
  width: 200px; // Add this line to set a fixed width for the statement
  @media (max-width: 768px) {
    margin-bottom: 5px;
    width: 100%;
  }
`;

const Select = styled.select`
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: white;
  width: 300px; // Add this line to set a fixed width for desktop
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const MatchingQuestion = ({ question, onAnswerChange }) => {
  const [matches, setMatches] = useState({});

  const handleChange = (index, value) => {
    const newMatches = { ...matches, [index]: value };
    setMatches(newMatches);
    onAnswerChange(JSON.stringify(newMatches));
  };

  const getItemText = (option) => {
  return option.item || option.concept || option.phrase || option.entity || option.field || option.term || option.technology;
};

const getMatchText = (option) => {
  return option.location || option.description || option.meaning || option.response || option.role || option.application || option.significance || option.characteristic;
};

  return (
    <QuestionContainer>
      <QuestionText>{question.question}</QuestionText>
      {question.options.map((option, index) => (
        <MatchingItem key={index}>
          <Statement>{getItemText(option)}</Statement>
          <Select
  value={matches[index] || ''}
  onChange={(e) => handleChange(index, e.target.value)}
>
  <option value="">Select a match</option>
  {question.options.map((matchOption, optionIndex) => (
    <option 
      key={optionIndex} 
      value={getMatchText(matchOption)}
      disabled={Object.values(matches).includes(getMatchText(matchOption)) && matches[index] !== getMatchText(matchOption)}
    >
      {getMatchText(matchOption)}
    </option>
  ))}
</Select>
        </MatchingItem>
      ))}
    </QuestionContainer>
  );
};

export default MatchingQuestion;