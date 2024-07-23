import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  const { text, task } = await req.json();
  try {
    let response;
    if (task === 'analyze') {
      response = await analyzeSpeech(text);
    } else if (task === 'generate') {
      response = await generateTopic();
    } else {
      return new Response(JSON.stringify({ error: 'Invalid task' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return new Response(JSON.stringify({ result: response }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('OpenAI API error:', error);
    return new Response(JSON.stringify({ error: 'Error processing your request' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

async function analyzeSpeech(speech) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      { role: "system", content: "You are a helpful assistant that analyzes speeches. Provide your analysis in a structured format with a detailed evaluation, score out of 100, and specific recommendations for improvement." },
      { role: "user", content: `Please analyze the following speech and provide a detailed evaluation, score out of 100, and specific recommendations for improvement:\n\n${speech}` }
    ],
  });
  return completion.choices[0].message.content;
}

async function generateTopic() {
  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      { role: "system", content: "You are a helpful assistant that generates interesting speech topics." },
      { role: "user", content: "Generate an interesting and challenging topic for a speech." }
    ],
  });
  return completion.choices[0].message.content;
}