'use client';

import React, { useState, useEffect, useRef } from 'react';
import { FaPaperPlane, FaRobot } from 'react-icons/fa';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { solarizedlight } from 'react-syntax-highlighter/dist/esm/styles/prism';

const topics = [
  'Android разработка',
  'Веб разработка',
  'iOS разработка',
  'Разработка ПО для ПК',
  'Кроссплатформенная разработка (Flutter)',
  'Другое'
];

const durations = [
  { name: 'Ультрабуллет', time: '1 неделя' },
  { name: 'Буллет', time: '2 недели' },
  { name: 'Блиц', time: '1 месяц' },
  { name: 'Рапид', time: '2 месяца' },
  { name: 'Медиум', time: '3 месяца' },
  { name: 'Классика', time: '6 месяцев' },
  { name: 'Про', time: '9 месяцев' }
];

export default function ProgrammingPage() {
  const [stage, setStage] = useState('topic');
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentDay, setCurrentDay] = useState(1);
  const [currentModule, setCurrentModule] = useState(1);
  const chatEndRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    try {
      const savedState = localStorage.getItem('programmingChatState');
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        if (parsedState && typeof parsedState === 'object') {
          const { stage, selectedTopic, selectedDuration, messages, currentDay, currentModule } = parsedState;
          setStage(stage || 'topic');
          setSelectedTopic(selectedTopic || null);
          setSelectedDuration(selectedDuration || null);
          setMessages(messages || [{
            role: 'assistant',
            content: "Привет, я Лидер! Чему ты хочешь научиться?"
          }]);
          setCurrentDay(currentDay || 1);
          setCurrentModule(currentModule || 1);
        } else {
          throw new Error('Invalid saved state');
        }
      } else {
        setMessages([{
          role: 'assistant',
          content: "Привет, я Лидер! Чему ты хочешь научиться?"
        }]);
      }
    } catch (error) {
      console.error('Error loading saved state:', error);
      // Сброс к начальному состоянию в случае ошибки
      setStage('topic');
      setMessages([{
        role: 'assistant',
        content: "Привет, я Лидер! Чему ты хочешь научиться?"
      }]);
    }
  }, []);

  useEffect(() => {
    const saveStateTimer = setTimeout(() => {
      const stateToSave = { stage, selectedTopic, selectedDuration, messages, currentDay, currentModule };
      localStorage.setItem('programmingChatState', JSON.stringify(stateToSave));
    }, 300); // 300 мс задержка

    return () => clearTimeout(saveStateTimer);
  }, [stage, selectedTopic, selectedDuration, messages, currentDay, currentModule]);

  const appendMessage = (role, content) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages(prevMessages => [...prevMessages, { role, content, timestamp }]);
  };

  const handleTopicSelect = (topic) => {
    setSelectedTopic(topic);
    setStage('duration');
    appendMessage('assistant', `Отлично! Вы выбрали ${topic}. Теперь выберите продолжительность обучения.`);
  };

  const handleDurationSelect = (duration) => {
    setSelectedDuration(duration);
    setStage('plan');
    generatePlan(selectedTopic, duration);
  };

  const generatePlan = async (topic, duration) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/codeAI', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages,
          selectedTopic: topic,
          selectedDuration: duration,
          userMessage: "Create a detailed learning plan for the selected topic and duration. Break it down into modules and days."
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch from API');
      }

      const data = await response.json();
      appendMessage('assistant', data.content);
      appendMessage('assistant', "Если вы готовы начать обучение, напишите 'Готов начать'.");
    } catch (error) {
      console.error('Error generating plan:', error);
      appendMessage('assistant', 'Извините, произошла ошибка при создании плана. Пожалуйста, попробуйте еще раз.');
    } finally {
      setIsLoading(false);
    }
  };

  const startLearning = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/codeAI', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages,
          selectedTopic,
          selectedDuration,
          currentDay,
          currentModule,
          userMessage: "Start the learning process. Provide theory, practical tasks, and explanations for the current day and module."
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch from API');
      }

      const data = await response.json();
      appendMessage('assistant', data.content);
    } catch (error) {
      console.error('Error starting learning:', error);
      appendMessage('assistant', 'Извините, произошла ошибка при начале обучения. Пожалуйста, попробуйте еще раз.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    appendMessage('user', input);
    setInput('');
    setIsLoading(true);
    setIsTyping(true);

    if (input.toLowerCase() === 'готов начать' && stage === 'plan') {
      setStage('learning');
      await startLearning();
    } else {
      try {
        const response = await fetch('/api/codeAI', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages,
            selectedTopic,
            selectedDuration,
            currentDay,
            currentModule,
            userMessage: input
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch from API');
        }

        const data = await response.json();
        appendMessage('assistant', data.content);

        if (data.nextDay) {
          setCurrentDay(prevDay => prevDay + 1);
        }
        if (data.nextModule) {
          setCurrentModule(prevModule => prevModule + 1);
          setCurrentDay(1);
        }
        if (data.isTest) {
          appendMessage('assistant', "Теперь давайте проведем небольшой тест по пройденному материалу.");
        }
        if (data.isInterview) {
          appendMessage('assistant', "Давайте проведем мини-интервью для закрепления знаний.");
        }
      } catch (error) {
        console.error('Error sending message:', error);
        appendMessage('assistant', 'Извините, произошла ошибка при обработке вашего сообщения. Пожалуйста, попробуйте еще раз.');
      } finally {
        setIsLoading(false);
        setIsTyping(false);
      }
    }
  };

  const OptionButton = ({ children, onClick }) => (
    <button
      className="m-2 px-4 py-2 bg-[#800120] text-white rounded-full shadow-lg hover:bg-[#600010] transition-all transform hover:scale-105"
      onClick={onClick}
    >
      {children}
    </button>
  );

  const renderMessageContent = (content) => {
    if (content.startsWith('```') && content.endsWith('```')) {
      const codeContent = content.slice(3, -3).trim();
      return (
        <SyntaxHighlighter language="javascript" style={solarizedlight} className="rounded-lg shadow-md my-2">
          {codeContent}
        </SyntaxHighlighter>
      );
    }
    return content.split('\n').map((line, i) => (
      <p key={i} className="my-1">{line}</p>
    ));
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="bg-[#800120] text-white p-4 shadow-md">
        <h1 className="text-xl font-bold text-white">Лидер - ваш помощник в программировании</h1>
      </div>
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto p-4">
          <div className="max-w-3xl mx-auto space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] p-3 rounded-lg ${
                    message.role === 'user' 
                      ? 'bg-[#DCF8C6] text-black' 
                      : 'bg-white text-black border border-gray-300'
                  } message-bubble`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm mr-2 text-[#800120]">
                      {message.role === 'user' ? 'Вы' : 'Лидер'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {message.timestamp}
                    </span>
                  </div>
                  <div className="text-sm">
                    {renderMessageContent(message.content)}
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white text-black border border-gray-300 rounded-lg p-3 message-bubble">
                  <div className="flex items-center">
                    <span className="font-bold text-sm mr-2 text-[#800120]">Лидер</span>
                    <span className="typing-animation">
                      <span className="dot"></span>
                      <span className="dot"></span>
                      <span className="dot"></span>
                    </span>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="p-2 bg-[#F0F0F0] shadow-inner">
        <div className="flex items-center bg-white rounded-full overflow-hidden shadow-md border border-gray-300">
          <input
            type="text"
            className="flex-1 px-3 py-2 focus:outline-none bg-white text-black placeholder-gray-500"
            placeholder="Введите сообщение..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
          />
          <button
            type="submit"
            className="px-3 py-2 bg-[#800120] text-white hover:bg-[#600010] focus:outline-none flex-shrink-0"
            disabled={isLoading}
          >
            <FaPaperPlane className="text-white" />
          </button>
        </div>
      </form>

      <style jsx global>{`
        .message-bubble {
          position: relative;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }

        .message-bubble::before {
          content: '';
          position: absolute;
          top: 0;
          width: 0;
          height: 0;
          border: 10px solid transparent;
        }

        .user .message-bubble::before {
          right: -10px;
          border-left-color: #DCF8C6;
          border-right: 0;
        }

        .assistant .message-bubble::before {
          left: -10px;
          border-right-color: #ffffff;
          border-left: 0;
        }

        .typing-animation {
          display: inline-flex;
          align-items: center;
        }

        .dot {
          width: 8px;
          height: 8px;
          margin: 0 3px;
          background: #800120;
          border-radius: 50%;
          opacity: 0;
          animation: typingAnimation 1.4s infinite ease-in-out;
        }

        .dot:nth-child(2) {
          animation-delay: 0.2s;
        }

        .dot:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes typingAnimation {
          0% { opacity: 0.2; transform: translateY(0); }
          20% { opacity: 1; transform: translateY(-5px); }
          40%, 100% { opacity: 0.2; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}