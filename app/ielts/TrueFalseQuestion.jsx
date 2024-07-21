import React from 'react';

const TrueFalseQuestion = ({ question, onAnswerChange }) => {
  return (
    <div className="true-false-question">
      <h3>{question.question}</h3>
      {question.options.map(option => (
        <label key={option} style={{ display: 'block', marginBottom: '5px' }}>
          <input
            type="radio"
            name={question.id}
            value={option}
            onChange={() => onAnswerChange(question.id, option)}
          />
          {option}
        </label>
      ))}
    </div>
  );
};

export default TrueFalseQuestion;
