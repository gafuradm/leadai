import React, { useState, useEffect } from 'react';

const DiagramLabelingQuestion = ({ question, onAnswerChange }) => {
  const [labels, setLabels] = useState({});

  useEffect(() => {
    // Инициализация меток при загрузке компонента
    const initialLabels = {};
    question.options.forEach(option => {
      initialLabels[option] = null;
    });
    setLabels(initialLabels);
  }, [question]);

  const handleLabelPlacement = (option, event) => {
    const rect = event.target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const newLabels = { ...labels, [option]: { x, y } };
    setLabels(newLabels);
    onAnswerChange(question.id, newLabels);
  };

  const renderDiagram = () => {
    // Здесь мы создаем простую диаграмму мозга
    return (
      <svg width="400" height="300" viewBox="0 0 400 300">
        <path d="M200 280 C 100 280, 40 200, 40 150 C 40 80, 100 20, 200 20 C 300 20, 360 80, 360 150 C 360 200, 300 280, 200 280" fill="#f0f0f0" stroke="black" strokeWidth="2" />
        <path d="M200 280 C 150 280, 120 200, 120 150 M200 20 C 150 20, 120 100, 120 150" stroke="black" strokeWidth="2" fill="none" />
        <circle cx="200" cy="100" r="30" fill="#e0e0e0" stroke="black" strokeWidth="2" />
      </svg>
    );
  };

  return (
    <div className="diagram-labeling-question">
      <h3>{question.question}</h3>
      <div style={{ position: 'relative', width: '400px', height: '300px', border: '1px solid black', margin: '20px 0' }}>
        {renderDiagram()}
        <div 
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
          onClick={(e) => {
            const selectedOption = prompt('Select an option to place:', question.options.join(', '));
            if (selectedOption && question.options.includes(selectedOption)) {
              handleLabelPlacement(selectedOption, e);
            }
          }}
        />
        {Object.entries(labels).map(([option, position]) => (
          position && (
            <div
              key={option}
              style={{
                position: 'absolute',
                left: `${position.x}px`,
                top: `${position.y}px`,
                background: 'white',
                border: '1px solid black',
                padding: '2px',
                borderRadius: '3px',
                fontSize: '12px',
                transform: 'translate(-50%, -50%)'
              }}
            >
              {option}
            </div>
          )
        ))}
      </div>
      <div>
        <strong>Options:</strong>
        <ul>
          {question.options.map((option) => (
            <li key={option}>{option}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DiagramLabelingQuestion;

