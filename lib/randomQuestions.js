// lib/randomQuestions.js
export const getRandomQuestions = (data, numQuestions) => {
    const selectedQuestions = [];
    const usedIndexes = new Set();
  
    while (selectedQuestions.length < numQuestions) {
      const randomIndex = Math.floor(Math.random() * data.length);
  
      if (!usedIndexes.has(randomIndex)) {
        selectedQuestions.push(data[randomIndex]);
        usedIndexes.add(randomIndex);
      }
    }
  
    return selectedQuestions;
  };
  