
import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Bot, 
  Send, 
  Lightbulb, 
  MessageSquare, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle,
  User,
  Loader2,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
  isError?: boolean;
}

interface QuickResponse {
  title: string;
  response: string;
  keywords: string[];
}

// Typing indicator component
const TypingIndicator: React.FC = () => (
  <div className="flex items-center space-x-1">
    <div className="flex space-x-1">
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
    </div>
    <span className="text-xs text-gray-500 ml-2">AI is typing...</span>
  </div>
);

export const AISupportPage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState<'checking' | 'available' | 'unavailable'>('checking');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [quickResponses, setQuickResponses] = useState<Record<string, QuickResponse>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Check AI service status and load conversation history on component mount
  useEffect(() => {
    checkAIServiceStatus();
    loadQuickResponses();
    loadConversationHistory();
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const checkAIServiceStatus = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/ai/health`);
      const data = await response.json();
      setApiStatus(data.aiService === 'available' ? 'available' : 'unavailable');
    } catch (error) {
      console.error('Error checking AI service:', error);
      setApiStatus('unavailable');
    }
  };

  const loadQuickResponses = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/ai/quick-responses`);
      const data = await response.json();
      if (data.success) {
        setQuickResponses(data.responses);
      }
    } catch (error) {
      console.error('Error loading quick responses:', error);
    }
  };

  const loadConversationHistory = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/ai/conversation/${user?.id || 'anonymous'}`);
      const data = await response.json();
      if (data.success && data.history.length > 0) {
        const historyMessages: ChatMessage[] = data.history.map((msg: any, index: number) => ({
          id: `history-${index}`,
          role: msg.role,
          content: msg.content,
          timestamp: new Date()
        }));
        setMessages(historyMessages);
      } else {
        // Add welcome message if no history
        setMessages([{
          id: 'welcome',
          role: 'assistant',
          content: 'Hello! I\'m your AI pregnancy support assistant. I\'m here to help you with questions about pregnancy, nutrition, exercise, and maternal health. Feel free to ask me anything!',
          timestamp: new Date()
        }]);
      }
    } catch (error) {
      console.error('Error loading conversation history:', error);
      // Add welcome message as fallback
      setMessages([{
        id: 'welcome',
        role: 'assistant',
        content: 'Hello! I\'m your AI pregnancy support assistant. I\'m here to help you with questions about pregnancy, nutrition, exercise, and maternal health. Feel free to ask me anything!',
        timestamp: new Date()
      }]);
    }
  };

  // Fallback responses when API is unavailable
  const fallbackResponses: Record<string, string> = {
    'food': 'During pregnancy, it\'s important to eat a balanced diet rich in folic acid, iron, calcium, and protein. Avoid raw fish, unpasteurized dairy, and limit caffeine. Focus on fruits, vegetables, whole grains, and lean proteins. Always consult your healthcare provider for personalized nutrition advice.',
    'weight': 'Normal weight gain during pregnancy varies by your pre-pregnancy BMI. Generally, women with normal BMI should gain 25-35 pounds. Always consult your healthcare provider for personalized recommendations.',
    'exercise': 'Safe exercises during pregnancy include walking, swimming, prenatal yoga, and stationary cycling. Avoid contact sports, activities with fall risks, and exercises lying flat on your back after the first trimester. Consult your healthcare provider before starting any exercise program.',
    'symptoms': 'Common pregnancy symptoms include nausea, fatigue, breast changes, frequent urination, and mood changes. However, severe symptoms like persistent vomiting, severe headaches, or bleeding should be reported to your doctor immediately.',
    'nutrition': 'Essential nutrients during pregnancy include folic acid (400-800 mcg daily), iron (27mg daily), calcium (1000mg daily), and DHA. Prenatal vitamins can help fill nutritional gaps, but a balanced diet is key.',
    'default': 'Thank you for your question! For the most accurate and personalized advice about your pregnancy, I recommend consulting with your healthcare provider. They can provide guidance specific to your situation and medical history.'
  };

  const generateFallbackResponse = (question: string): string => {
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes('food') || lowerQuestion.includes('eat') || lowerQuestion.includes('avoid')) {
      return fallbackResponses.food;
    } else if (lowerQuestion.includes('weight') || lowerQuestion.includes('gain')) {
      return fallbackResponses.weight;
    } else if (lowerQuestion.includes('exercise') || lowerQuestion.includes('workout') || lowerQuestion.includes('activity')) {
      return fallbackResponses.exercise;
    } else if (lowerQuestion.includes('symptom') || lowerQuestion.includes('feel') || lowerQuestion.includes('sick')) {
      return fallbackResponses.symptoms;
    } else if (lowerQuestion.includes('vitamin') || lowerQuestion.includes('nutrition') || lowerQuestion.includes('supplement')) {
      return fallbackResponses.nutrition;
    } else {
      return fallbackResponses.default;
    }
  };

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    setIsLoading(true);
    
    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    // Add placeholder for AI response
    const aiMessageId = (Date.now() + 1).toString();
    const aiMessage: ChatMessage = {
      id: aiMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isStreaming: true
    };

    setMessages(prev => [...prev, aiMessage]);

    try {
      // Try streaming response first
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: content.trim(),
          userId: user?.id || 'anonymous',
          stream: true
        }),
      });

      if (response.ok) {
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let fullResponse = '';

        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split('\n');

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                try {
                  const data = JSON.parse(line.slice(6));
                  if (data.partial && data.content) {
                    fullResponse += data.content;
                    setMessages(prev => 
                      prev.map(msg => 
                        msg.id === aiMessageId 
                          ? { ...msg, content: fullResponse }
                          : msg
                      )
                    );
                  } else if (data.complete) {
                    setMessages(prev => 
                      prev.map(msg => 
                        msg.id === aiMessageId 
                          ? { ...msg, content: fullResponse, isStreaming: false }
                          : msg
                      )
                    );
                  }
                } catch (e) {
                  console.error('Error parsing streaming data:', e);
                }
              }
            }
          }
        }
      } else {
        // Fallback to non-streaming
        const data = await response.json();
        if (data.success && data.response) {
          setMessages(prev => 
            prev.map(msg => 
              msg.id === aiMessageId 
                ? { ...msg, content: data.response, isStreaming: false }
                : msg
            )
          );
        } else {
          throw new Error('API error');
        }
      }
    } catch (error) {
      console.error('Error getting AI response:', error);
      // Use fallback response
      const fallbackAnswer = generateFallbackResponse(content);
      setMessages(prev => 
        prev.map(msg => 
          msg.id === aiMessageId 
            ? { ...msg, content: fallbackAnswer, isStreaming: false, isError: true }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
      setCurrentMessage('');
    }
  };

  const handleSendMessage = () => {
    sendMessage(currentMessage);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickResponse = (responseKey: string) => {
    const quickResponse = quickResponses[responseKey];
    if (quickResponse) {
      sendMessage(quickResponse.title);
    }
  };

  const clearConversation = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/ai/conversation/${user?.id || 'anonymous'}`, {
        method: 'DELETE'
      });
    } catch (error) {
      console.error('Error clearing conversation:', error);
    }
    setMessages([{
      id: 'welcome',
      role: 'assistant',
      content: 'Hello! I\'m your AI pregnancy support assistant. I\'m here to help you with questions about pregnancy, nutrition, exercise, and maternal health. Feel free to ask me anything!',
      timestamp: new Date()
    }]);
  };

  const sampleQuestions = [
    t('ai.q1') || 'What should I eat during pregnancy?',
    t('ai.q2') || 'Is it safe to exercise while pregnant?',
    t('ai.q3') || 'What are common pregnancy symptoms?'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50">
      <div className="max-w-4xl mx-auto h-screen flex flex-col">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-pink-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  {t('ai.title') || 'AI Pregnancy Support'}
                </h1>
                <div className="flex items-center space-x-2">
                  {apiStatus === 'checking' && (
                    <div className="flex items-center space-x-1 text-blue-600">
                      <RefreshCw className="h-3 w-3 animate-spin" />
                      <span className="text-xs">Checking...</span>
                    </div>
                  )}
                  {apiStatus === 'available' && (
                    <div className="flex items-center space-x-1 text-green-600">
                      <CheckCircle className="h-3 w-3" />
                      <span className="text-xs">AI Available</span>
                    </div>
                  )}
                  {apiStatus === 'unavailable' && (
                    <div className="flex items-center space-x-1 text-orange-600">
                      <AlertCircle className="h-3 w-3" />
                      <span className="text-xs">Fallback Mode</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <Button
              onClick={clearConversation}
              variant="outline"
              size="sm"
              className="text-gray-600 hover:text-gray-800"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Clear Chat
            </Button>
          </div>
        </div>

        {/* Chat Messages */}
        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-3 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.role === 'user' 
                      ? 'bg-gradient-to-r from-pink-500 to-purple-600' 
                      : 'bg-gradient-to-r from-indigo-500 to-purple-600'
                  }`}>
                    {message.role === 'user' ? (
                      <User className="h-4 w-4 text-white" />
                    ) : (
                      <Bot className="h-4 w-4 text-white" />
                    )}
                  </div>
                  <div className={`rounded-2xl px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
                      : 'bg-white shadow-sm border border-gray-200'
                  }`}>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm font-medium">
                        {message.role === 'user' ? 'You' : 'AI Assistant'}
                      </span>
                      <span className="text-xs opacity-70">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="text-sm leading-relaxed">
                      {message.content}
                      {message.isStreaming && <TypingIndicator />}
                    </div>
                    {message.isError && (
                      <div className="mt-2 text-xs text-orange-600">
                        ⚠️ This is a fallback response. For real-time AI assistance, please check your API configuration.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Quick Responses */}
        {Object.keys(quickResponses).length > 0 && (
          <div className="bg-white/80 backdrop-blur-sm border-t border-pink-200 p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Lightbulb className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium text-gray-700">Quick Questions</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(quickResponses).map(([key, response]) => (
                <Button
                  key={key}
                  onClick={() => handleQuickResponse(key)}
                  variant="outline"
                  size="sm"
                  className="text-xs border-purple-200 hover:bg-purple-50 hover:border-purple-300"
                  disabled={isLoading}
                >
                  {response.title}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Sample Questions */}
        <div className="bg-white/80 backdrop-blur-sm border-t border-pink-200 p-4">
          <div className="flex items-center space-x-2 mb-3">
            <MessageSquare className="h-4 w-4 text-indigo-600" />
            <span className="text-sm font-medium text-gray-700">Try asking about:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {sampleQuestions.map((question, index) => (
              <Button
                key={index}
                onClick={() => sendMessage(question)}
                variant="outline"
                size="sm"
                className="text-xs border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300"
                disabled={isLoading}
              >
                {question}
              </Button>
            ))}
          </div>
        </div>

        {/* Message Input */}
        <div className="bg-white/80 backdrop-blur-sm border-t border-pink-200 p-4">
          <div className="flex space-x-3">
            <Input
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={t('ai.placeholder') || 'Ask me anything about pregnancy, nutrition, exercise, or maternal health...'}
              className="flex-1 border-pink-200 focus:border-pink-400"
              disabled={isLoading}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!currentMessage.trim() || isLoading}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-yellow-50 border-t border-yellow-200 p-3">
          <p className="text-xs text-yellow-800 text-center">
            <strong>Disclaimer:</strong> This AI support is for informational purposes only and should not replace professional medical advice. 
            Always consult with your healthcare provider for personalized medical guidance.
          </p>
        </div>
      </div>
    </div>
  );
};
