import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  margin-bottom: 20px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  background-color: #f2f2f2;
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
`;

const Td = styled.td`
  border: 1px solid #ddd;
  padding: 8px;
`;

const TableCompletionQuestion = ({ question, onAnswerChange }) => {
  if (!question || !question.columns || !question.rows) {
    console.error('Invalid table completion question structure:', question);
    return null;
  }

  const handleChange = (rowIndex, colIndex, event) => {
    const updatedAnswers = {
      ...question.answers,
      [rowIndex]: {
        ...question.answers[rowIndex],
        [colIndex]: event.target.value,
      },
    };
    onAnswerChange(question.id, updatedAnswers);
  };

  return (
    <Container>
      <h3>{question.prompt}</h3>
      <Table>
        <thead>
          <tr>
            {question.columns.map((col, index) => (
              <Th key={index}>{col}</Th>
            ))}
          </tr>
        </thead>
        <tbody>
          {question.rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, colIndex) => (
                <Td key={colIndex}>
                  <input
                    type="text"
                    value={question.answers[rowIndex][colIndex]}
                    onChange={(event) => handleChange(rowIndex, colIndex, event)}
                  />
                </Td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default TableCompletionQuestion;
