const axios = require('axios');

const HEYGEN_API_KEY = 'YTNiODAxOTVhNzVhNDYzMGExYzdlY2JmNDIyN2IyYjctMTcyMDQzMDc4OQ==';

async function listAvatars() {
  try {
    const response = await axios.get('https://api.heygen.com/v2/avatars', {
      headers: {
        'Accept': 'application/json',
        'X-Api-Key': HEYGEN_API_KEY
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching avatars:', error);
    throw error;
  }
}

async function listVoices() {
  try {
    const response = await axios.get('https://api.heygen.com/v1/voice.list', {
      headers: {
        'Accept': 'application/json',
        'X-Api-Key': HEYGEN_API_KEY
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching voices:', error);
    throw error;
  }
}

async function generateVideo(avatarId, voiceId, text) {
  try {
    const response = await axios.post('https://api.heygen.com/v2/video/generate', {
      video_inputs: [
        {
          character: {
            type: "avatar",
            avatar_id: avatarId,
            avatar_style: "normal"
          },
          voice: {
            type: "text",
            input_text: text,
            voice_id: voiceId,
            speed: 1.0
          }
        }
      ],
      test: true,
      aspect_ratio: "16:9"
    }, {
      headers: {
        'X-Api-Key': HEYGEN_API_KEY,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error generating video:', error);
    throw error;
  }
}

module.exports = {
  listAvatars,
  listVoices,
  generateVideo
};
