import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { fetchResults } from './chatgpt';

const AssistantContainer = styled.div`
  margin-top: 40px;
  padding: 20px;
  background-color: #f0f8ff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const AssistantTitle = styled.h3`
  color: #14465a;
  margin-bottom: 20px;
`;

const ChatContainer = styled.div`
  max-height: 300px;
  overflow-y: auto;
  margin-bottom: 20px;
  padding: 10px;
  background-color: white;
  border-radius: 4px;
`;

const Message = styled.div`
  margin-bottom: 10px;
  padding: 8px;
  border-radius: 4px;
  ${props => props.isUser ? `
    background-color: #e6f3ff;
    text-align: right;
  ` : `
    background-color: #f0f0f0;
  `}
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Button = styled.button`
  background-color: #14465a;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #1a5a74;
  }
`;

const AIAssistant = ({ result }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, isUser: true };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    try {
      const response = await fetchResults('ai_assistant', { 
        message: input, 
        context: result 
      }, 'full');
      
      const assistantResponse = { text: response, isUser: false };
      setMessages(prev => [...prev, assistantResponse]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage = { text: 'Sorry, I encountered an error. Please try again.', isUser: false };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      const lastAssistantMessage = messages.filter(m => !m.isUser).pop();
      if (lastAssistantMessage) {
        const utterance = new SpeechSynthesisUtterance(lastAssistantMessage.text);
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        speechSynthesis.speak(utterance);
      }
    } else {
      alert('Sorry, your browser does not support text-to-speech!');
    }
  };

  return (
    <AssistantContainer>
      <AssistantTitle>AI Assistant</AssistantTitle>
      <ChatContainer ref={chatContainerRef}>
        {messages.map((message, index) => (
          <Message key={index} isUser={message.isUser}>
            {message.text}
          </Message>
        ))}
      </ChatContainer>
      <Input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask a question about your IELTS results..."
      />
      <ButtonContainer>
        <Button onClick={handleSendMessage}>Send</Button>
        <Button onClick={handleSpeak} disabled={isSpeaking}>
          {isSpeaking ? 'Speaking...' : 'Speak Last Response'}
        </Button>
      </ButtonContainer>
    </AssistantContainer>
  );
};

export default AIAssistant;