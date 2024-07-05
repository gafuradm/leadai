import axios from 'axios';

const HEYGEN_API_URL = 'https://api.heygen.com/v1/generate';
const HEYGEN_API_KEY = 'your_heygen_api_key';  // Ваш API ключ HeyGen

const HeyGen = {
  async getAvatarResponse(prompt) {
    try {
      const response = await axios.post(
        HEYGEN_API_URL,
        { prompt },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${HEYGEN_API_KEY}`,
          },
        }
      );

      return response.data.response;
    } catch (error) {
      console.error('Error fetching response from HeyGen:', error);
      return 'An error occurred while fetching the response.';
    }
  },
};

export default HeyGen;
