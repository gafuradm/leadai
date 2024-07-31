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
      }
    }
  };

  const OptionButton = ({ children, onClick }) => (
    <button
      className="m-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-teal-400 text-white rounded shadow-lg hover:from-blue-600 hover:to-teal-500 transition-all transform hover:scale-105"
      onClick={onClick}
    >
      {children}
    </button>
  );

  const renderMessageContent = (content) => {
    if (content.startsWith('```') && content.endsWith('```')) {
      const codeContent = content.slice(3, -3).trim(); // Убираем ``` и пробелы
      return (
        <SyntaxHighlighter language="javascript" style={solarizedlight} className="rounded-lg shadow-md my-2">
          {codeContent}
        </SyntaxHighlighter>
      );
    }
    return content.split('\n').map((line, i) => (
      <p key={i} className="text-gray-800 my-1">{line}</p>
    ));
  };

  return (
    <div className="min-h-screen bg-gray-200 flex flex-col">
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white shadow-lg rounded-lg p-6">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`mb-4 p-4 rounded-lg shadow-md ${message.role === 'user' ? 'bg-blue-100 self-end' : 'bg-green-100 self-start'}`}
                >
                  <div className="flex items-center">
                    <span className="text-xs text-gray-500" style={{ color: "#000000" }}>{message.timestamp}</span>
                  </div>
                  <div className="mt-2 text-sm">
                    {renderMessageContent(message.content)}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
          </div>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="p-4 bg-white shadow-inner">
        <div className="flex items-center">
          <input
            type="text"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring focus:ring-teal-400"
            placeholder="Введите сообщение..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
          />
          <button
            type="submit"
            className="px-4 py-2 bg-teal-500 text-white rounded-r-lg hover:bg-teal-600 focus:outline-none focus:ring focus:ring-teal-400"
            disabled={isLoading}
          >
            <FaPaperPlane />
          </button>
        </div>
      </form>
    </div>
  );
}
