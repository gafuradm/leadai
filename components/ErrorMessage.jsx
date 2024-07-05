import React from 'react';

const ErrorMessage = ({ message }) => {
  return (
    <div className="bg-red-600 text-white p-3 rounded-lg mb-5">
      {message}
    </div>
  );
};

export default ErrorMessage;
