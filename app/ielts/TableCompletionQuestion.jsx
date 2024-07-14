import React, { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  margin-bottom: 20px;
`;

const Table = styled.table`
  border-collapse: collapse;
`;

const Cell = styled.td`
  border: 1px solid black;
  padding: 5px;
`;

const TableCompletionQuestion = ({ question, onAnswerChange }) => {
  const [answers, setAnswers] = useState({});

  const handleChange = (optionIndex, value) => {
    const newAnswers = { ...answers, [optionIndex]: value };
    setAnswers(newAnswers);
    onAnswerChange(question.id, newAnswers);
  };

  if (!question.options || !Array.isArray(question.options)) {
    console.error('Invalid question structure for TableCompletionQuestion:', question);
    return <Container>Error: Invalid question structure</Container>;
  }

  return (
    <Container>
      <h3>{question.question}</h3>
      <Table>
        <tbody>
          {question.options.map((option, index) => (
            <tr key={index}>
              <Cell>{option}</Cell>
              <Cell>
                <input
                  type="text"
                  onChange={(e) => handleChange(index, e.target.value)}
                  value={answers[index] || ''}
                  style={{ 
                    width: '100px', 
                    margin: '0 5px', 
                    backgroundColor: '#ffffff', // Белый фон
                    color: '#000000', // Черный текст
                    border: '1px solid #000000' // Черные границы
                  }}
                />
              </Cell>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default TableCompletionQuestion;