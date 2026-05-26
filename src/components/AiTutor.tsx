import React, { useState, useRef, useEffect } from 'react';
import { 
  Brain, 
  Send, 
  Sparkles, 
  BookOpen, 
  History, 
  Award, 
  RotateCcw, 
  AlertCircle,
  HelpCircle,
  ChevronRight,
  TrendingUp,
  Sliders,
  Play,
  ArrowUp,
  Paperclip,
  Globe,
  FileText,
  BarChart2,
  Image as ImageIcon,
  MoreHorizontal,
  Box,
  MessageSquare,
  ChevronUp,
  Volume2,
  VolumeX
} from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export default function AiTutor({ role = 'student', cluster = 'university' }: { role?: string, cluster?: string }) {
  const [messages, setMessages] = useState<Message[]>([]);

  const getPresetsForRole = () => {
    switch (role) {
      case 'faculty':
        return [
          { title: 'Draft Seminar Syllabus', prompt: 'I want to draft a new syllabus for my upcoming seminar focusing on Sensation vs Perception.', tag: 'Course Builder' },
          { title: 'Grade Pending Submissions', prompt: 'Show me the criteria for grading the newest submissions from my SS110 section.', tag: 'Assessment' },
          { title: 'Analyze Attendance', prompt: 'Help me review the recent absence reports for students under Academic Warning.', tag: 'Advising' }
        ];
      case 'student':
        return [
          { title: 'Review HC Feedback', prompt: 'Can you help me understand the feedback I received on my use of #constraints?', tag: 'Feedback' },
          { title: 'Prepare for Class', prompt: 'What are the core concepts I should review before my seminar at 17:05?', tag: 'Preparation' },
          { title: 'Brainstorm Capstone', prompt: 'I need to brainstorm empirical testing layouts for my thesis using #testability.', tag: 'Research' }
        ];
      case 'researcher':
        return [
          { title: 'Analyze Learning Outcomes', prompt: 'Can we identify any statistical #correlation between the new visual curriculum and attendance?', tag: 'Telemetry' },
          { title: 'Reverse Engineer Schema', prompt: 'Help me reverse engineer the new grading assessment layout schema.', tag: 'Architecture' }
        ];
      default:
        return [
          { title: 'Dashboard Overview', prompt: 'Give me a summary of active modules running on the forum today.', tag: 'System' }
        ];
    }
  };

  const presetTopics = getPresetsForRole();

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeHcFilter, setActiveHcFilter] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Web Speech API Integration
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(true);
  const [currentlySpeakingId, setCurrentlySpeakingId] = useState<string | null>(null);
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const stopActiveSpeech = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setCurrentlySpeakingId(null);
  };

  const speakText = (text: string, messageId?: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    
    // Stop ongoing speech
    stopActiveSpeech();

    // Clean markdown/symbols for naturally sounding speech
    const cleanText = text
      .replace(/\*\*|#/g, '')
      .replace(/\[.*?\]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanText) return;

    try {
      const utterance = new SpeechSynthesisUtterance(cleanText);
      
      // Select an elegant English voice if available
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Apple') || v.name.includes('Samantha'))) || voices.find(v => v.lang.startsWith('en')) || voices[0];
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
      utterance.rate = 1.05; // Slightly faster for clean pacing
      utterance.pitch = 1.0;

      utterance.onstart = () => {
        if (messageId) {
          setCurrentlySpeakingId(messageId);
        }
      };

      utterance.onend = () => {
        setCurrentlySpeakingId(null);
      };

      utterance.onerror = () => {
        setCurrentlySpeakingId(null);
      };

      currentUtteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.error("Speech synthesis failed:", err);
      setCurrentlySpeakingId(null);
    }
  };

  // Safe Speech Clean-up on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    // Immediately halt outstanding speech synthesis narration
    stopActiveSpeech();

    const userMsg: Message = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newAiMsgId = `msg-ai-${Date.now()}`;
    const initialAiReply: Message = {
      id: newAiMsgId,
      sender: 'ai',
      text: '', // Empty initially
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg, initialAiReply]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToSend,
          role,
          cluster,
          previousHistory: messages.map(m => ({ role: m.sender === 'user' ? 'user' : 'model', parts: [{ text: m.text }] }))
        })
      });

      if (!response.ok) {
        throw new Error('Server returned an error');
      }

      const data = await response.json();
      const replyText = data.reply || data.text || "I apologize, my neural connections are currently refactoring logic blocks. Let us revisit this question momentarily.";
      
      setMessages(prev => prev.map(m => m.id === newAiMsgId ? {
        ...m,
        text: replyText
      } : m));

      if (isSpeechEnabled) {
        speakText(replyText, newAiMsgId);
      }
      setIsLoading(false);

    } catch (err) {
      console.warn("AI Tutor call failed, falling back to simulated logic:", err);
      
      // Smart Fallback simulation reflecting academic tone
      setTimeout(() => {
        let simulatedReply = `Accessing your Artemis ${role} dashboard modules now...`;
        
        if (textToSend.toLowerCase().includes('syllabus')) {
          simulatedReply = "Connecting to the Course Builder module. To draft a syllabus for your SS110 section, let us first identify which Foundational Concepts you are targeting for this academic term.";
        } else if (textToSend.toLowerCase().includes('grade') || textToSend.toLowerCase().includes('feedback')) {
          simulatedReply = "Navigating to Class Assessments. I can see 14 pending submissions. When grading, remember to align feedback with the specific #breakitdown or #constraints heuristics requested by the rubric.";
        } else if (textToSend.toLowerCase().includes('prepare')) {
          simulatedReply = "Pulling up today's Seminar Classroom feed. The previous session ended on a debate about normative claims. For today's session, I recommend brushing up on #correlation methodologies to verify student hypotheses.";
        }

        setMessages(prev => prev.map(m => m.id === newAiMsgId ? {
          ...m,
          text: simulatedReply
        } : m));
        
        if (isSpeechEnabled) {
          speakText(simulatedReply, newAiMsgId);
        }
        setIsLoading(false);
      }, 3000);
    }
  };

  const handleReset = () => {
    stopActiveSpeech();
    setMessages([]);
  };

  return (
    <div id="ai-tutor-root" className="flex flex-col lg:flex-row h-full w-full overflow-y-auto lg:overflow-hidden bg-[#F3F4F6] text-[#334155] font-sans">
      
      {/* LEFT RAIL: HISTORY AND NEW TASK */}
      <div id="tutor-presets-rail" className="w-full lg:w-[260px] bg-[#F9FAFB] border-b lg:border-b-0 lg:border-r border-[#E5E7EB] shrink-0 flex flex-col p-3 space-y-4 h-auto lg:h-full">
        
        {/* Top actions */}
        <div className="flex items-center justify-between px-2 pt-2">
          <button onClick={handleReset} className="text-slate-600 hover:bg-slate-100 p-1.5 rounded-md transition cursor-pointer">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><line x1="9" x2="15" y1="3" y2="3"/><line x1="9" x2="15" y1="21" y2="21"/></svg>
          </button>
          <button className="text-slate-600 hover:bg-slate-100 p-1.5 rounded-md transition cursor-pointer">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </button>
        </div>

        <button
          onClick={handleReset}
          className="w-full py-2 bg-white border border-slate-200 hover:border-slate-300 rounded-lg text-slate-700 text-sm font-medium transition shadow-sm flex items-center justify-center space-x-2 cursor-pointer"
        >
          <span>+</span>
          <span>New task</span>
          <span className="text-slate-400 text-xs ml-2">Ctrl K</span>
        </button>

        {/* TOPICS LIST / HISTORY */}
        <div className="space-y-1 mt-2 flex-grow overflow-y-auto scrollbar-none">
          {presetTopics.map((topic, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(topic.prompt)}
              className="w-full text-left p-3 rounded-lg hover:bg-slate-100 transition group flex items-start gap-3 cursor-pointer"
            >
              <div className="mt-0.5 bg-indigo-600 text-white rounded-full p-1.5 shrink-0">
                <Brain className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium text-slate-800 truncate">{topic.title}</span>
                </div>
                <p className="text-xs text-slate-500 truncate mt-0.5">
                  Explore {topic.tag}...
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* Bottom User Area */}
        <div className="pt-3 border-t border-slate-200 flex items-center justify-between px-2 pb-1">
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="w-7 h-7 rounded-full bg-pink-500 flex items-center justify-center text-white text-xs font-bold">
              GP
            </div>
            <span className="text-sm font-medium text-slate-800">Gavin Phillips</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-500">
            <button 
              onClick={() => {
                if (isSpeechEnabled) {
                  stopActiveSpeech();
                }
                setIsSpeechEnabled(!isSpeechEnabled);
              }}
              className={`p-1.5 rounded-md transition cursor-pointer ${
                isSpeechEnabled ? 'text-sky-600 bg-sky-50 hover:bg-sky-100' : 'text-slate-400 hover:bg-slate-100'
              }`}
              title={isSpeechEnabled ? "Speech Narration Active" : "Speech Narration Muted"}
            >
              {isSpeechEnabled ? <Volume2 className="w-[18px] h-[18px]" /> : <VolumeX className="w-[18px] h-[18px]" />}
            </button>
            <button className="p-1 hover:bg-slate-100 rounded-md transition cursor-pointer">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
            </button>
            <button className="p-1 hover:bg-slate-100 rounded-md transition cursor-pointer">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><line x1="12" x2="12.01" y1="18" y2="18"/></svg>
            </button>
            <button className="p-1 hover:bg-slate-100 rounded-md transition cursor-pointer">
              <BookOpen className="w-[18px] h-[18px]" />
            </button>
          </div>
        </div>
      </div>

      {/* CORE ACTIVE CHAT BOX VIEWPORT (RIGHT PANEL) */}
      <div id="tutor-chat-panel" className="flex-grow flex flex-col bg-white relative overflow-hidden h-auto lg:h-full min-h-[500px] lg:min-h-0">
        
        {/* UPPER STATUS BAR (Only show when checking out a task) */}
        {messages.length > 0 && (
          <div className="px-8 py-5 shrink-0 flex items-center justify-between">
            <h2 className="text-xl font-medium text-slate-800 truncate pr-4">
              {messages.filter(m => m.sender === 'user')[0]?.text || 'New Task'}
            </h2>
            <div className="flex items-center space-x-2 shrink-0">
              <button
                onClick={() => {
                  if (isSpeechEnabled) {
                    stopActiveSpeech();
                  }
                  setIsSpeechEnabled(!isSpeechEnabled);
                }}
                className={`px-3 py-1.5 flex items-center gap-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition cursor-pointer ${
                  isSpeechEnabled 
                    ? 'bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-100 shadow-xs' 
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
                title={isSpeechEnabled ? "Narration On" : "Narration Muted"}
              >
                {isSpeechEnabled ? (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-sky-600" />
                    <span>Narration On</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                    <span>Narration Off</span>
                  </>
                )}
              </button>
              <button className="px-3 py-1.5 flex items-center gap-1.5 rounded-md hover:bg-slate-100 text-slate-600 text-sm font-medium transition cursor-pointer">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" x2="12" y1="2" y2="15"/></svg>
                <span>Share</span>
              </button>
              <button className="p-1.5 rounded-md hover:bg-slate-100 text-slate-600 transition cursor-pointer">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
              </button>
              <button className="p-1.5 rounded-md hover:bg-slate-100 text-slate-600 transition cursor-pointer">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              </button>
              <button className="p-1.5 rounded-md hover:bg-slate-100 text-slate-600 transition cursor-pointer">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        <div className="flex-grow flex flex-col relative min-h-0 bg-white">
          {messages.length === 0 ? (
            <div className="flex-grow flex flex-col items-center justify-center p-6 text-center animate-fade-in relative">
              <div className="w-full max-w-3xl space-y-8">
                <div className="space-y-1 text-left w-full pl-2">
                  <h2 className="text-4xl font-serif font-medium text-slate-800">Knowledge Navigator</h2>
                  <h3 className="text-2xl font-serif font-medium text-slate-500 mt-2">I am plugged into your {role} dashboard. What would you like to build today?</h3>
                </div>
                
                {/* Centered Large Input */}
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage(input);
                  }}
                  className="w-full relative shadow-sm rounded-2xl bg-white border border-slate-200 focus-within:border-slate-300 focus-within:ring-1 focus-within:ring-slate-300/20 transition-all duration-200"
                >
                  <textarea 
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Give your tutor a task to work on..."
                      rows={4}
                      className="w-full p-4 pb-12 bg-transparent resize-none outline-none text-slate-800 placeholder-slate-400 font-sans text-[15px] rounded-2xl"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage(input);
                        }
                      }}
                  />
                  <div className="absolute left-4 bottom-4 flex items-center space-x-1">
                      <button type="button" className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-lg transition cursor-pointer">
                        <Paperclip className="w-4 h-4" />
                      </button>
                      <div className="h-4 w-px bg-slate-200 mx-1"></div>
                      <button type="button" className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-lg transition cursor-pointer flex items-center gap-1">
                        <Box className="w-4 h-4" />
                      </button>
                      <button type="button" className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-lg transition cursor-pointer flex items-center gap-1">
                        <MessageSquare className="w-4 h-4" />
                      </button>
                  </div>
                  <div className="absolute right-4 bottom-4 flex items-center space-x-2">
                      <button
                        type="submit"
                        disabled={!input.trim() || isLoading}
                        className="p-2 bg-slate-400 hover:bg-slate-500 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white rounded-full transition cursor-pointer flex items-center justify-center shrink-0"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                  </div>
                </form>

                {/* Preset Chips */}
                <div className="flex flex-wrap justify-center gap-3 pt-2">
                  <button onClick={() => handleSendMessage('Create an image')} className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-medium rounded-full hover:bg-slate-50 transition shadow-xs flex items-center space-x-2 cursor-pointer">
                      <ImageIcon className="w-3.5 h-3.5 text-slate-400" />
                      <span>Image</span>
                  </button>
                  <button onClick={() => handleSendMessage('Create some slides')} className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-medium rounded-full hover:bg-slate-50 transition shadow-xs flex items-center space-x-2 cursor-pointer">
                      <FileText className="w-3.5 h-3.5 text-slate-400" />
                      <span>Slides</span>
                  </button>
                  <button onClick={() => handleSendMessage('Create a webpage')} className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-medium rounded-full hover:bg-slate-50 transition shadow-xs flex items-center space-x-2 cursor-pointer">
                      <Globe className="w-3.5 h-3.5 text-slate-400" />
                      <span>Webpage</span>
                  </button>
                  <button onClick={() => handleSendMessage('Create a spreadsheet')} className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-medium rounded-full hover:bg-slate-50 transition shadow-xs flex items-center space-x-2 cursor-pointer">
                      <FileText className="w-3.5 h-3.5 text-slate-400" />
                      <span>Spreadsheet</span>
                  </button>
                  <button onClick={() => handleSendMessage('Create a visualization')} className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-medium rounded-full hover:bg-slate-50 transition shadow-xs flex items-center space-x-2 cursor-pointer">
                      <BarChart2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>Visualization</span>
                  </button>
                  <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-medium rounded-full hover:bg-slate-50 transition shadow-xs flex items-center space-x-2 cursor-pointer">
                      <span>More</span>
                  </button>
                </div>
              </div>
              <div className="absolute bottom-6 left-0 right-0 flex justify-center w-full">
                <button className="text-slate-500 hover:text-slate-700 text-xs font-semibold flex items-center space-x-1 transition cursor-pointer">
                  <span>Explore use cases</span>
                  <ChevronUp className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* DIALOG SCROLL BOX */}
              <div className="flex-grow overflow-y-auto p-6 md:p-8 scrollbar-thin flex flex-col items-center">
                <div className="w-full max-w-3xl space-y-6">
                {messages.map((m, index) => {
                  if (index === 0 && m.sender === 'user') return null; // First prompt is the title!

                  return (
                    <div
                      key={m.id}
                      className="flex flex-col animate-fade-in w-full text-left items-start space-y-4"
                    >
                    {m.sender === 'user' ? (
                      // User Message
                      <div className="w-full">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 rounded bg-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-700">You</div>
                        </div>
                        <div className="text-[18px] md:text-[20px] font-serif text-slate-800 leading-snug">
                          {m.text}
                        </div>
                      </div>
                    ) : (
                      // AI Message (Knowledge Navigator style)
                      <div className="w-full flex flex-col space-y-4">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center">
                            <Brain className="w-3.5 h-3.5 text-white" />
                          </div>
                          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Knowledge Navigator</span>
                        </div>
                        
                        {/* Actual AI Response Text */}
                        {m.text ? (
                          <div className="space-y-4">
                            <div className="text-[15px] text-slate-800 leading-relaxed font-sans prose prose-slate whitespace-pre-wrap">
                              {m.text}
                            </div>
                            <div className="flex items-center gap-2 pt-2 border-t border-slate-100/70">
                              <button
                                onClick={() => currentlySpeakingId === m.id ? stopActiveSpeech() : speakText(m.text, m.id)}
                                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide cursor-pointer transition shadow-xs ${
                                  currentlySpeakingId === m.id
                                    ? 'bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200'
                                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                                }`}
                              >
                                {currentlySpeakingId === m.id ? (
                                  <>
                                    <VolumeX className="w-3.5 h-3.5 animate-pulse" />
                                    <span>Mute Reader</span>
                                  </>
                                ) : (
                                  <>
                                    <Volume2 className="w-3.5 h-3.5 text-slate-500" />
                                    <span>Read Aloud</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        ) : (
                           <div className="flex items-center gap-2 text-slate-500 text-sm italic font-serif">
                             <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                             Reading context...
                           </div>
                        )}
                      </div>
                    )}
                  </div>
                  );
                })}

                <div ref={messagesEndRef} />
                </div>
              </div>

              {/* INPUT TRAY */}
              <div className="p-5 shrink-0 flex justify-center bg-[#F9FAFB]">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage(input);
                  }}
                  className="w-full max-w-3xl relative shadow-sm rounded-2xl bg-white border border-slate-200 focus-within:border-slate-300 focus-within:ring-1 focus-within:ring-slate-300/20 transition-all duration-200"
                >
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={`Ask Navigator about your ${role} dashboard...`}
                    className="w-full pl-12 pr-14 py-4 bg-transparent outline-none text-slate-800 placeholder-slate-400 font-sans text-sm rounded-2xl"
                  />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <button type="button" className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-lg transition cursor-pointer">
                      <Paperclip className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <button
                      type="submit"
                      disabled={!input.trim() || isLoading}
                      className="w-8 h-8 bg-slate-800 hover:bg-slate-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white rounded-full transition cursor-pointer flex items-center justify-center shrink-0"
                    >
                      {isLoading ? (
                        <div className="w-2.5 h-2.5 bg-white rounded-sm" />
                      ) : (
                        <ArrowUp className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </>
          )}
        </div>

      </div>

    </div>
  );
}
