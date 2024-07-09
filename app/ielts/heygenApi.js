const HEYGEN_API_URL = 'https://api.heygen.com/v2';
const HEYGEN_API_KEY = 'YTNiODAxOTVhNzVhNDYzMGExYzdlY2JmNDIyN2IyYjctMTcyMDQzMDc4OQ==';

export const generateVideo = async (text) => {
  try {
    const response = await fetch(`${HEYGEN_API_URL}/video/generate`, {
      method: 'POST',
      headers: {
        'X-Api-Key': HEYGEN_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        video_inputs: [
          {
            character: {
              type: "avatar",
              avatar_id: "Daisy-inskirt-20220818",
              avatar_style: "normal"
            },
            voice: {
              type: "text",
              input_text: text,
              voice_id: "2d5b0e6cf36f460aa7fc47e3eee4ba54"
            },
            background: {
              type: "color",
              value: "#008000"
            }
          }
        ],
        dimension: {
          width: 1280,
          height: 720
        },
        aspect_ratio: "16:9",
        test: true
      }),
    });

    const data = await response.json();
    return data.video_id;
  } catch (error) {
    console.error('Error generating video:', error);
    throw error;
  }
};

export const getVideoStatus = async (videoId) => {
  try {
    const response = await fetch(`${HEYGEN_API_URL}/video_status.get?video_id=${videoId}`, {
      headers: {
        'X-Api-Key': HEYGEN_API_KEY,
      },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting video status:', error);
    throw error;
  }
};