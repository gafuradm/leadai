import fetch from 'node-fetch';

export async function fetchResults(section, data, testType) {
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  const systemMessage = testType === 'full'
    ? `You are an IELTS test evaluator. Provide detailed feedback and a score out of 40 for the ${section} section.
       Provide feedback on correct and incorrect answers, highlighting mistakes, suggestions for improvement, and specific aspects to focus on.
       Give detailed recommendations for improving each section.
       For writing, analyze essay structure, coherence, grammar, and vocabulary.
       For speaking, evaluate pronunciation, fluency, coherence, and vocabulary usage.
       After providing the section feedback, suggest a list of countries and universities (with websites) where the user can apply with the given score in the respective section.`
    : `You are an IELTS test evaluator. Provide detailed feedback and a score out of 40 for the ${section} section.
       Provide feedback on correct and incorrect answers, highlighting mistakes, suggestions for improvement, and specific aspects to focus on.
       Give detailed recommendations for improving this section.
       Do not mention other sections or provide university recommendations.`;

  const userMessage = `
    Section: ${section}
    Test Type: ${testType}
    ${section === 'speaking' 
      ? `Questions: ${JSON.stringify(data.questions)}\nAnswers: ${JSON.stringify(data.answers)}`
      : `Answers: ${JSON.stringify(data.answers)}`
    }
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