"use client";

import React, { useState, useEffect } from 'react';
import { generateVideo, getVideoStatus } from './heygenApi';

const HeygenAvatar = ({ question }) => {
  const [videoUrl, setVideoUrl] = useState(null);

  useEffect(() => {
    const createVideo = async () => {
      try {
        const videoId = await generateVideo(question);
        let status = 'pending';
        
        while (status !== 'completed') {
          const statusData = await getVideoStatus(videoId);
          status = statusData.status;
          
          if (status === 'completed') {
            setVideoUrl(statusData.video_url);
          } else if (status === 'failed') {
            console.error('Video generation failed');
            break;
          }
          
          await new Promise(resolve => setTimeout(resolve, 5000)); // Проверяем каждые 5 секунд
        }
      } catch (error) {
        console.error('Error in video creation process:', error);
      }
    };

    createVideo();
  }, [question]);

  return (
    <div className="heygen-avatar">
      {videoUrl ? (
        <video src={videoUrl} controls width="100%" />
      ) : (
        <p>Generating avatar video...</p>
      )}
    </div>
  );
};

export default HeygenAvatar;
