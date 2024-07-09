const HEYGEN_API_URL = 'https://api.heygen.com/v2';
const HEYGEN_API_KEY = 'YTNiODAxOTVhNzVhNDYzMGExYzdlY2JmNDIyN2IyYjctMTcyMDQzMDc4OQ==';
const MAX_RETRIES = 3;
const RETRY_DELAY = 5000; // 5 секунд

const fetchWithRetries = async (url, options, retries = MAX_RETRIES) => {
    try {
        const response = await fetch(url, options);

        if (!response.ok) {
            if (response.status === 429 && retries > 0) {
                console.warn(`HTTP error 429! Retrying in ${RETRY_DELAY / 1000} seconds... (${MAX_RETRIES - retries + 1}/${MAX_RETRIES})`);
                await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
                return fetchWithRetries(url, options, retries - 1);
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
    } catch (error) {
        console.error('Error in fetchWithRetries:', error);
        throw error;
    }
};

export const generateVideo = async (text) => {
    try {
        const response = await fetchWithRetries(`${HEYGEN_API_URL}/video/generate`, {
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

        console.log('Generated video ID:', response.video_id);
        return response.video_id;
    } catch (error) {
        console.error('Error generating video:', error);
        throw error;
    }
};

export const getVideoStatus = async (videoId) => {
    try {
        console.log('Checking status for video ID:', videoId);

        const response = await fetchWithRetries(`${HEYGEN_API_URL}/video_status.get?video_id=${videoId}`, {
            headers: {
                'X-Api-Key': HEYGEN_API_KEY,
            },
        });

        console.log('Video status response:', response);
        return response;
    } catch (error) {
        console.error('Error getting video status:', error);
        throw error;
    }
};
