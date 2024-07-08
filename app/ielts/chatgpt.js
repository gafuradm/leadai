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
    Answers: ${JSON.stringify(data)}
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
    return responseData.choices[0].message.content;
  } catch (error) {
    console.error('Error fetching results:', error);
    throw error;
  }
}