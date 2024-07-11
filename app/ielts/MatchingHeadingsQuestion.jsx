import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  margin-bottom: 20px;
`;

const Heading = styled.h3`
  margin-bottom: 10px;
`;

const Option = styled.div`
  margin-bottom: 5px;
`;

const MatchingHeadingsQuestion = ({ question, onAnswerChange }) => {
  const handleInputChange = (e, index) => {
    const newAnswer = [...question.answers];
    newAnswer[index] = e.target.value;
    onAnswerChange(question.id, newAnswer);
  };

  return (
    <Container>
      <Heading>{question.prompt}</Heading>
      {question.headings.map((heading, index) => (
        <Option key={index}>
          <strong>{heading}</strong>: {' '}
          <input
            type="text"
            value={question.answers[index]}
            onChange={(e) => handleInputChange(e, index)}
          />
        </Option>
      ))}
    </Container>
  );
};

export default MatchingHeadingsQuestion;
