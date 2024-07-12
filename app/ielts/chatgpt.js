import fetch from 'node-fetch';

export async function fetchResults(section, data, testType) {
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  if (!OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not defined');
  }

  const systemMessage = `You are an IELTS test evaluator. Provide detailed feedback and a score out of 40 for the ${section} section.
     Provide feedback on correct and incorrect answers, highlighting mistakes, suggestions for improvement, and specific aspects to focus on.
     Give detailed recommendations for improving this section.
     Always include the score in the format "Score: X.X/40" at the end of your response.`;

  const userMessage = `
    Section: ${section}
    Test Type: ${testType}
    ${section === 'speaking' 
      ? `Questions: ${JSON.stringify(data.questions)}\nAnswers: ${JSON.stringify(data.answers)}`
      : `Answers: ${JSON.stringify(data.answers)}`
    }
    ${section === 'reading' || section === 'listening' ? `Questions: ${JSON.stringify(data.questions)}` : ''}
    ${section === 'writing' ? `Topics: ${JSON.stringify(data.topics)}` : ''}
  `;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
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
    return responseData.choices[0].message.content;
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
        model: 'gpt-4',
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
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: userMessage }
        ],
        max_tokens: 2000,
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
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: userMessage }
        ],
        max_tokens: 2000,
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
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: userMessage }
        ],
        max_tokens: 2000,
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
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: userMessage }
        ],
        max_tokens: 2000,
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
