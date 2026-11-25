import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, Trash2 } from 'lucide-react';

interface ChatBotProps {
  score: number | null;
}

interface Message {
  role: 'user' | 'model';
  text: string;
}

const STORAGE_KEY = 'neurogadget_chat_history';

const ChatBot: React.FC<ChatBotProps> = ({ score }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  
  // Load initial state from local storage
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to load chat history", e);
      return [];
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Save to local storage whenever messages change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  // Initial greeting
  useEffect(() => {
    if (isOpen && messages.length === 0) {
       const initialText = score !== null 
         ? `Hello! I'm your Offline Digital Wellness Coach. I see your addiction risk score is ${score.toFixed(0)}%. How can I help you improve your digital balance today?`
         : "Hello! I'm your Offline Digital Wellness Coach. Once you complete the assessment, I can give you specific advice. For now, do you have general questions about digital habits?";
       
       setMessages([{ role: 'model', text: initialText }]);
    }
  }, [isOpen, score, messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleClearChat = () => {
    if (window.confirm("Are you sure you want to clear your conversation history?")) {
      setMessages([]);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const getResponse = (query: string): string => {
    const lower = query.toLowerCase();
    
    if (lower.includes('score')) {
      return score !== null 
        ? `Your score of ${score.toFixed(0)} is calculated based on your daily usage hours, frequency of phone checks, and psychological factors like anxiety and neuroticism.` 
        : "I can't explain your score until you complete the survey!";
    }
    
    if (lower.includes('sleep') || lower.includes('bed') || lower.includes('tired')) {
      return "Blue light from screens suppresses melatonin, the sleep hormone. Try to stop using screens at least 60 minutes before bed to improve your sleep quality.";
    }

    if (lower.includes('anxiety') || lower.includes('stress') || lower.includes('worried')) {
      return "High smartphone usage is often linked to higher anxiety (FOMO). Try 'grounding' techniques: put the phone in another room and focus on a physical hobby for 30 minutes.";
    }

    if (lower.includes('game') || lower.includes('gaming')) {
      return "Gaming triggers dopamine reward loops, making it hard to stop. Try setting a strict alarm before you start playing, or play only after finishing homework.";
    }
    
    if (lower.includes('social') || lower.includes('media')) {
      return "Social media often leads to negative comparisons. Remember that people usually only post their 'highlight reels', not their real lives.";
    }

    if (lower.includes('focus') || lower.includes('study') || lower.includes('concentrate')) {
      return "Try the Pomodoro technique: 25 minutes of focused work followed by a 5-minute break. Keep your phone in a drawer during the 25 minutes.";
    }

    if (lower.includes('hello') || lower.includes('hi')) {
      return "Hi there! I'm here to help you build healthier digital habits. Ask me about sleep, focus, or gaming.";
    }

    return "That's an interesting point. My offline database suggests that balancing screen time with physical exercise and face-to-face interaction is key to mental well-being. Can I help with specific advice on Sleep or Focus?";
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    // Simulate network delay for "thinking"
    setTimeout(() => {
      const responseText = getResponse(userMsg);
      setMessages(prev => [...prev, { role: 'model', text: responseText }]);
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white rounded-2xl shadow-xl w-80 md:w-96 mb-4 overflow-hidden border border-[#e8ecf1] pointer-events-auto flex flex-col max-h-[500px] animate-fadeIn">
          <div className="bg-[#55c2da] p-4 flex justify-between items-center text-white">
            <div className="flex items-center">
              <Bot className="w-5 h-5 mr-2" />
              <span className="font-semibold">Digital Coach (Offline)</span>
            </div>
            <div className="flex items-center space-x-1">
              <button 
                onClick={handleClearChat} 
                className="hover:bg-[#4ab3c9] p-1 rounded text-white/90 hover:text-white transition-colors"
                title="Clear Chat History"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button onClick={() => setIsOpen(false)} className="hover:bg-[#4ab3c9] p-1 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto bg-[#f4f6f9] space-y-3 min-h-[300px]">
            {messages.length === 0 && (
              <div className="text-center text-[#6b7280] text-sm mt-10">
                <p>No messages yet.</p>
                <p>Ask about Sleep, Focus, or Gaming!</p>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                  m.role === 'user' 
                    ? 'bg-[#55c2da] text-white rounded-tr-none' 
                    : 'bg-white border border-[#e8ecf1] text-[#374151] rounded-tl-none shadow-sm'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-[#e8ecf1] p-3 rounded-2xl rounded-tl-none shadow-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-[#9ca3af] rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-[#9ca3af] rounded-full animate-bounce delay-75"></div>
                    <div className="w-2 h-2 bg-[#9ca3af] rounded-full animate-bounce delay-150"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 bg-white border-t border-[#e8ecf1] flex items-center">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about sleep, focus, or stress..."
              className="flex-1 px-4 py-2 bg-[#f4f6f9] rounded-full focus:outline-none focus:ring-2 focus:ring-[#55c2da] text-sm text-[#1a2332] border border-[#e8ecf1]"
            />
            <button 
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="ml-2 p-2 bg-[#55c2da] text-white rounded-full hover:bg-[#4ab3c9] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="pointer-events-auto bg-[#55c2da] hover:bg-[#4ab3c9] text-white p-4 rounded-full shadow-lg transition-transform hover:scale-105 flex items-center justify-center"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>
    </div>
  );
};

export default ChatBot;