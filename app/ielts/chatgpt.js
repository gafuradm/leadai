import fetch from 'node-fetch';

export async function fetchResults(section, data, testType) {
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  if (!OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not defined');
  }

  const calculateScore = (section, correctAnswers) => {
    const listeningScores = [
      [39, 9], [37, 8.5], [35, 8], [32, 7.5], [30, 7], [26, 6.5], [23, 6],
      [18, 5.5], [16, 5], [13, 4.5], [10, 4], [6, 3.5], [4, 3], [2, 2.5], [0, 2]
    ];

    const readingAcademicScores = [
      [39, 9], [37, 8.5], [35, 8], [33, 7.5], [30, 7], [27, 6.5], [23, 6],
      [19, 5.5], [15, 5], [13, 4.5], [10, 4], [8, 3.5], [6, 3], [3, 2.5], [0, 2]
    ];

    const readingGeneralScores = [
      [40, 9], [39, 8.5], [38, 8], [36, 7.5], [34, 7], [32, 6.5], [30, 6],
      [27, 5.5], [23, 5], [19, 4.5], [15, 4], [13, 3.5], [10, 3], [8, 2.5], [6, 2]
    ];

    let scores;
    if (section === 'listening') {
      scores = listeningScores;
    } else if (section === 'reading') {
      scores = testType === 'academic' ? readingAcademicScores : readingGeneralScores;
    } else {
      return null; // For writing and speaking, we'll rely on the AI's evaluation
    }

    for (let [threshold, score] of scores) {
      if (correctAnswers >= threshold) {
        return score;
      }
    }
    return 0;
  };

  const systemMessage = `You are an IELTS test evaluator. Provide very detailed feedback for the ${section} section.
     For listening and reading sections, count the number of correct answers out of 40.
     For writing and speaking sections, provide a score out of 9 based on the IELTS scoring criteria.
     Provide very detailed feedback on correct and incorrect answers, highlighting mistakes, suggestions for improvement, and specific aspects to focus on.
     Give very detailed recommendations for improving this section.
     Always include the raw score (number of correct answers for listening/reading, score out of 9 for writing/speaking) at the end of your response in the format "Raw score: X".`;

  const userMessage = `
    Section: ${section}
    Test Type: ${testType}
    Questions: ${JSON.stringify(data.questions)}
    User Answers: ${JSON.stringify(data.answers)}
    Correct Answers: ${JSON.stringify(data.correctAnswers)}
  `;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: userMessage }
        ],
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch from OpenAI API');
    }

    const responseData = await response.json();
    const aiResponse = responseData.choices[0].message.content;

    // Extract the raw score from the AI's response
    const rawScoreMatch = aiResponse.match(/Raw score: (\d+(\.\d+)?)/);
    const rawScore = rawScoreMatch ? parseFloat(rawScoreMatch[1]) : 0;

    // Calculate the band score for listening and reading
    let bandScore;
    if (section === 'listening' || section === 'reading') {
      bandScore = calculateScore(section, Math.round(rawScore));
    } else {
      bandScore = rawScore; // For writing and speaking, use the AI's score
    }

    // Ensure bandScore is never null
    bandScore = bandScore || 0;

    return `${aiResponse}\n\nBand Score: ${bandScore.toFixed(1)}/9`;
  } catch (error) {
    console.error('Error fetching results:', error);
    throw error;
  }
}

export async function fetchExampleEssay(topics) {
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  if (!OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not defined');
  }

  const systemMessage = `You are an IELTS writing expert. Generate an example essay based on the given topic and question. The essay should demonstrate excellent structure, coherence, grammar, and vocabulary usage appropriate for a high IELTS score.`;
  const userMessage = `
    Task 1 Topic: ${JSON.stringify(topics.task1)}
    Task 2 Topic: ${JSON.stringify(topics.task2)}
    Please write an example essay for Task 2.
  `;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: userMessage }
        ],
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch example essay from OpenAI API');
    }

    const responseData = await response.json();
    return responseData.choices[0].message.content;
  } catch (error) {
    console.error('Error fetching example essay:', error);
    throw error;
  }
}

export async function fetchListeningExamples() {
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  if (!OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not defined');
  }

  const systemMessage = `You are an IELTS listening expert. Generate 4 short listening passages (one for each part of the IELTS listening test) with corresponding questions. Each passage should be about 30-60 seconds long when spoken.`;
  const userMessage = `Please generate 4 listening passages with questions for IELTS practice.`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: userMessage }
        ],
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch listening examples from OpenAI API');
    }

    const responseData = await response.json();
    return responseData.choices[0].message.content;
  } catch (error) {
    console.error('Error fetching listening examples:', error);
    throw error;
  }
}

export async function fetchSpeakingExamples() {
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  if (!OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not defined');
  }

  const systemMessage = `You are an IELTS speaking expert. Generate 3 sets of speaking practice materials. Each set should include:
    1. A question for Part 1 (simple personal questions)
    2. A task for Part 2 (a longer speech on a given topic)
    3. A follow-up question for Part 3 (more abstract questions related to Part 2)
    For each part, also provide a sample answer.`;
  const userMessage = `Generate IELTS speaking practice materials.`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: userMessage }
        ],
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch speaking examples from OpenAI API');
    }

    const responseData = await response.json();
    return responseData.choices[0].message.content;
  } catch (error) {
    console.error('Error fetching speaking examples:', error);
    return null;
  }
}

export async function fetchReadingExamples(score) {
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  if (!OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not defined');
  }

  const systemMessage = `You are an IELTS reading expert. Generate a reading passage with questions suitable for a student with an IELTS reading score of ${score}. The passage should be about 300 words long, followed by 5 questions of various types (multiple choice, true/false/not given, matching, etc.).`;
  const userMessage = `Please generate an IELTS reading practice passage with questions for a student with a score of ${score}.`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: userMessage }
        ],
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch reading examples from OpenAI API');
    }

    const responseData = await response.json();
    return responseData.choices[0].message.content;
  } catch (error) {
    console.error('Error fetching reading examples:', error);
    return null;
  }
}

export async function fetchWritingExamples(score, topic) {
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  if (!OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not defined');
  }

  const systemMessage = `You are an IELTS writing expert. Generate an example essay based on the given topic. The essay should be written at a level suitable for a student with an IELTS writing score of ${score}. It should demonstrate good structure, coherence, grammar, and vocabulary usage.`;
  const userMessage = `Please write an example essay for the following topic: ${topic}. The essay should be suitable for a student with an IELTS writing score of ${score}.`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: userMessage }
        ],
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch writing examples from OpenAI API');
    }

    const responseData = await response.json();
    return responseData.choices[0].message.content;
  } catch (error) {
    console.error('Error fetching writing examples:', error);
    return null;
  }
}

export async function fetchUniversityRecommendations(overallScore) {
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  if (!OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not defined');
  }

  const systemMessage = `You are a university admissions expert. Provide recommendations for universities based on the given IELTS score. Include a mix of universities from different countries and explain why each university might be a good fit. Make sure to include links to the university websites.`;
  const userMessage = `Based on an overall IELTS score of ${overallScore}, recommend 5 universities that would be suitable for the student. Include the university name, location, a brief explanation of why it's recommended, and a link to the university's official website.`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: userMessage }
        ],
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch university recommendations from OpenAI API');
    }

    const responseData = await response.json();
    return responseData.choices[0].message.content;
  } catch (error) {
    console.error('Error fetching university recommendations:', error);
    return null;
  }
}
