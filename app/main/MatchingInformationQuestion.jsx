import React, { useState } from 'react';

const MatchingInformationQuestion = ({ question }) => {
  const [matches, setMatches] = useState({});

  const handleMatch = (statement, option) => {
    setMatches(prevMatches => ({
      ...prevMatches,
      [statement]: option
    }));
  };

  const statements = question.question.split(', ');

  return (
    <div className="matching-information-question">
      <h3>{question.question}</h3>
      {statements.map((statement, index) => (
        <div key={index} style={{ marginBottom: '10px' }}>
          <span>{statement}</span>
          <select 
            value={matches[statement] || ''} 
            onChange={(e) => handleMatch(statement, e.target.value)}
            style={{ 
              marginLeft: '10px',
              backgroundColor: '#ffffff',
              color: '#000000'
            }}
          >
            <option value="">Select an option</option>
            {question.options.map((option, optionIndex) => (
              <option key={optionIndex} value={option}>{option}</option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
};

export default MatchingInformationQuestion;
