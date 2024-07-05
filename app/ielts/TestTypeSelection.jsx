// TestTypeSelection.jsx
import React from 'react';

const TestTypeSelection = ({ onSelect }) => {
  return (
    <div>
      <h2>Select IELTS Test Type</h2>
      <button onClick={() => onSelect('general')}>General Training</button>
      <button onClick={() => onSelect('academic')}>Academic</button>
    </div>
  );
};

export default TestTypeSelection;