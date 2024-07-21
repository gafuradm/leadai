import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { fetchResults } from './chatgpt';

const AssistantContainer = styled.div`
  margin-top: 40px;
  padding: 20px;
  background-color: #800120;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const AssistantTitle = styled.h3`
  color: #ffffff;
  margin-bottom: 20px;
  font-weight: bold;
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
    background-color: #800120;
    text-align: right;
  ` : `
    background-color: #ffffff;
    color: black;
  `}
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  color: black;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Button = styled.button`
  background-color: #000000;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    color: black;
    background-color: #ffffff;
  }
`;

const LoadingDots = styled.span`
  &::after {
    content: ' .';
    animation: dots 1s steps(5, end) infinite;
  }

  @keyframes dots {
    0%, 20% {
      content: ' .';
    }
    40% {
      content: ' ..';
    }
    60% {
      content: ' ...';
    }
    80%, 100% {
      content: '';
    }
  }
`;

const AIAssistant = ({ result }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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
    setIsLoading(true);

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
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      const lastAssistantMessage = messages.filter(m => !m.isUser).pop();
      if (lastAssistantMessage) {
        const utterance = new SpeechSynthesisUtterance(lastAssistantMessage.text);
        utterance.lang = 'en-US';  // Устанавливаем стандартный английский акцент
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
        {isLoading && (
          <Message isUser={false}>
            Thinking<LoadingDots />
          </Message>
        )}
      </ChatContainer>
      <Input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask a question about your IELTS results..."
        disabled={isLoading}
      />
      <ButtonContainer>
        <Button onClick={handleSendMessage} disabled={isLoading}>Send</Button>
        <Button onClick={handleSpeak} disabled={isSpeaking || isLoading}>
          {isSpeaking ? 'Speaking...' : 'Speak Last Response'}
        </Button>
      </ButtonContainer>
    </AssistantContainer>
  );
};

export default AIAssistant;