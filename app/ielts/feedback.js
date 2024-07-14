export const sendFeedback = async ({ rating, feedback }) => {
    const response = await fetch('/api/sendFeedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ rating, feedback }),
    });
  
    if (!response.ok) {
      throw new Error('Failed to send feedback');
    }
  };
  