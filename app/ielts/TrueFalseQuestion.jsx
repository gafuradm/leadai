import React, { useState } from 'react';

const TrueFalseQuestion = ({ question }) => {
  const [answer, setAnswer] = useState('');

  return (
    <div className="true-false-question">
      <h3>{question.question}</h3>
      <div>
        <label>
          <input 
            type="radio" 
            name={question.id} 
            value="True" 
            checked={answer === 'True'}
            onChange={(e) => setAnswer(e.target.value)}
          /> True
        </label>
        <label style={{ marginLeft: '10px' }}>
          <input 
            type="radio" 
            name={question.id} 
            value="False" 
            checked={answer === 'False'}
            onChange={(e) => setAnswer(e.target.value)}
          /> False
        </label>
      </div>
    </div>
  );
};

export default TrueFalseQuestion;

