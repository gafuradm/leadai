// MultipleChoiceQuestion.jsx

import React, { useState } from 'react';

const MultipleChoiceQuestion = ({ question, onAnswerChange }) => {
  const [selectedOption, setSelectedOption] = useState('');

  const handleOptionChange = (option) => {
    setSelectedOption(option);
    onAnswerChange(question.id, option);
  };

  return (
    <div className="multiple-choice-question">
      <h3>{question.question}</h3>
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
          <label htmlFor={`${question.id}-${index}`}>{option}</label>
        </div>
      ))}
    </div>
  );
};

export default MultipleChoiceQuestion;

