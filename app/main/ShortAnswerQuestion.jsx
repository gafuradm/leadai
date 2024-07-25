import React, { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  margin-bottom: 20px;
`;

const ShortAnswerQuestion = ({ question, onAnswerChange }) => {
  const [answer, setAnswer] = useState('');

  const handleChange = (value) => {
    setAnswer(value);
    onAnswerChange(question.id, value);
  };

  return (
    <Container>
      <h3>{question.question}</h3>
      <input
        type="text"
        onChange={(e) => handleChange(e.target.value)}
        value={answer}
        placeholder="Enter"
        style={{ 
          width: '100px', 
          margin: '0 5px', 
          backgroundColor: '#ffffff', // Белый фон
          color: '#000000', // Черный текст
          border: '1px solid #000000' // Черные границы
        }}
      />
    </Container>
  );
};

export default ShortAnswerQuestion;