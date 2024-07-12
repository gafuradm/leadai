import React, { useState } from 'react';

const synth = window.speechSynthesis;

const IELTSListeningAudio = ({ text }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const playAudio = () => {
    if (!text) return;

    const utterThis = new SpeechSynthesisUtterance(text);
    utterThis.onend = () => {
      setIsPlaying(false);
    };
    synth.speak(utterThis);
    setIsPlaying(true);
  };

  return (
    <div>
      <h3>Listening Section</h3>
      <button onClick={playAudio} disabled={isPlaying}>
        {isPlaying ? 'Playing...' : 'Play Audio'}
      </button>
    </div>
  );
};

export default IELTSListeningAudio;
