import { PineconeClient } from '@pinecone-database/pinecone';

// Initialize the Pinecone client
const pinecone = new PineconeClient();

await pinecone.init({
  environment: 'us-east-1', // Replace with your environment name
  apiKey: '26bc3caf-8995-4051-8ef1-fac7f3d18f04', // Replace with your API key
});

const index = pinecone.Index('ielts-index'); // Replace with your index name

export const upsertData = async (id, vector) => {
  await index.upsert({
    vectors: [{ id, values: vector }],
  });
};

export const queryData = async (vector) => {
  const result = await index.query({
    topK: 1,
    vector,
  });
  return result;
};
