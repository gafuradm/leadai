import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import styled from 'styled-components';
import ieltsData from './ielts-data.json';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Roboto', sans-serif;
`;

const TitleStyled = styled.h1`
  color: #FF69B4;
  text-align: center;
`;

const Section = styled.div`
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 20px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
`;

const Button = styled.button`
  background-color: #FF69B4;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #14465a;
  }
`;

const Timer = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: #FF69B4;
  text-align: center;
  margin-bottom: 20px;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
`;

const WritingSection = ({ testType, onNext, timedMode }) => {
  const [task1, setTask1] = useState(null);
  const [task2, setTask2] = useState(null);
  const [answers, setAnswers] = useState(['', '']);
  const [timeLeft, setTimeLeft] = useState(60 * 60); // 60 minutes
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    if (testType === 'academic') {
      const graphs = ieltsData.sections.writing.graphs.filter(g => g.type === 'bar' || g.type === 'line');
      if (graphs.length > 0) {
        const randomGraph = graphs[Math.floor(Math.random() * graphs.length)];
        setTask1(randomGraph);
      }
    } else {
      const letters = ieltsData.sections.writing.letters;
      if (letters && letters.length > 0) {
        const randomLetter = letters[Math.floor(Math.random() * letters.length)];
        setTask1(randomLetter);
      } else {
        setTask1({ description: "Write a letter. The details for this task are missing." });
      }
    }

    const essays = ieltsData.sections.writing.essay_topics.filter(t => t.type === (testType === 'academic' ? 'Academic' : 'General Training'));
    if (essays.length > 0) {
      const randomEssay = essays[Math.floor(Math.random() * essays.length)];
      setTask2(randomEssay);
    }
  }, [testType]);

  useEffect(() => {
    if (timedMode) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            handleSubmit();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timedMode]);

  const handleAnswerChange = (taskIndex, answer) => {
    const newAnswers = [...answers];
    newAnswers[taskIndex] = answer;
    setAnswers(newAnswers);
  };

  const handleSubmit = () => {
    onNext({
      answers: answers,
      topics: {
        task1: task1,
        task2: task2
      }
    });
  };

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage(currentPage - 1);
  };

  return (
    <Container>
      <TitleStyled>Writing Section</TitleStyled>
      {timedMode && <Timer>Time left: {Math.floor(timeLeft / 60)}:{timeLeft % 60 < 10 ? '0' : ''}{timeLeft % 60}</Timer>}
      
      {currentPage === 0 && (
        <Section>
          <h3>Task 1</h3>
          {testType === 'academic' && task1 && (
            <>
              <p>{task1.title}</p>
              <div style={{ width: '100%', maxWidth: '600px', margin: '0 auto' }}>
                {task1.type === 'bar' && <Bar data={task1.data} options={{ maintainAspectRatio: true, responsive: true }} />}
                {task1.type === 'line' && <Line data={task1.data} options={{ maintainAspectRatio: true, responsive: true }} />}
              </div>
            </>
          )}
          {testType === 'general' && task1 && (
            <p>{task1.description}</p>
          )}
          <TextArea
            value={answers[0]}
            onChange={(e) => handleAnswerChange(0, e.target.value)}
            placeholder="Write your answer for Task 1 here..."
          />
          <Button onClick={handleNextPage}>Next</Button>
        </Section>
      )}

      {currentPage === 1 && (
        <Section>
          <h3>Task 2</h3>
          {task2 && <p>{task2.title}</p>}
          <TextArea
            value={answers[1]}
            onChange={(e) => handleAnswerChange(1, e.target.value)}
            placeholder="Write your essay for Task 2 here..."
          />
          <ButtonContainer>
            <Button onClick={handlePreviousPage}>Previous</Button>
            <Button onClick={handleSubmit}>Submit</Button>
          </ButtonContainer>
          </Section>
      )}
    </Container>
  );
};

export default WritingSection;