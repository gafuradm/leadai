import React, { useState } from 'react';

const SummaryCompletionQuestion = ({ question }) => {
  const [answer, setAnswer] = useState('');

  return (
    <div className="summary-completion-question">
      <h3>{question.question}</h3>
      <p>
        {question.question.split('__________').map((part, index, array) => (
          <React.Fragment key={index}>
            {part}
            {index < array.length - 1 && (
              <input
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                style={{ width: '100px', margin: '0 5px' }}
              />
            )}
          </React.Fragment>
        ))}
      </p>
      <div>
        <strong>Options:</strong>
        <ul>
          {question.options.map((option, index) => (
            <li key={index}>{option}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SummaryCompletionQuestion;

