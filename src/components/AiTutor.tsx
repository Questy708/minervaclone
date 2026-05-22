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
  ChevronUp
} from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  steps?: {
    status: 'completed' | 'running' | 'pending';
    title: string;
    text?: string;
  }[];
}

const PRESET_TOPICS = [
  {
    title: 'Explain #constraints modeling',
    prompt: 'Can you teach me how to identify active and latent constraints (#constraints) when modeling political resistance systems?',
    tag: '#constraints'
  },
  {
    title: 'Cause-effect loop analysis #breakitdown',
    prompt: 'I want to examine the causal factors of the Bronze Age Collapse. Please guide me through #breakitdown step-by-step.',
    tag: '#breakitdown'
  },
  {
    title: 'Causation vs Correlation in polls',
    prompt: 'During live class polls, students often mix up causation and correlation. How can I formulate a testable setup to isolate variables?',
    tag: '#correlation'
  },
  {
    title: 'Analyze Capstone #testability',
    prompt: 'I am planning a capstone on neuro-sensory feedback loops. Review my empirical testing layout using #testability heuristics.',
    tag: '#testability'
  }
];

const HC_GUIDES = [
  { code: '#constraints', text: 'Define bounds of possible solutions' },
  { code: '#analogies', text: 'Transfer structural knowledge' },
  { code: '#breakitdown', text: 'Divide complex systems into subparts' },
  { code: '#correlation', text: 'Isolate statistical causal vectors' },
  { code: '#dataviz', text: 'Present quantitative data beautifully' }
];

export default function AiTutor() {
  const [messages, setMessages] = useState<Message[]>([]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeHcFilter, setActiveHcFilter] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

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
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      steps: [
        { status: 'completed', title: 'Identify core subject and student parameters', text: 'Starting to map educational context...' },
        { status: 'running', title: 'Trace heuristics and causal blocks', text: 'Manus is working: Synthesizing concepts for response structure.' }
      ]
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
          previousHistory: messages.map(m => ({ role: m.sender === 'user' ? 'user' : 'model', parts: [{ text: m.text }] }))
        })
      });

      if (!response.ok) {
        throw new Error('Server returned an error');
      }

      const data = await response.json();
      
      setMessages(prev => prev.map(m => m.id === newAiMsgId ? {
        ...m,
        text: data.reply || data.text || "I apologize, my neural connections are currently refactoring logic blocks. Let us revisit this question momentarily.",
        steps: [
          { status: 'completed', title: 'Analyze instructional context' },
          { status: 'completed', title: 'Identify relevant concepts and frameworks' }
        ]
      } : m));
      setIsLoading(false);

    } catch (err) {
      console.warn("AI Tutor call failed, falling back to simulated high-fidelity Artemis response:", err);
      
      // Smart Fallback simulation reflecting academic tone
      setTimeout(() => {
        let simulatedReply = "The concept you are raising requires critical structural tracing. ";
        
        if (textToSend.includes('#constraints')) {
          simulatedReply = "When applying **#constraints**, you must carefully outline both explicit material constraints (such as physical budgets or law variables) and latent cognitive constraints (such as selective memory filters). Tracing these bounds prevents over-engineered solutions.";
        } else if (textToSend.includes('#breakitdown')) {
          simulatedReply = "Decomposing this system using **#breakitdown** requires and isolates three key causal tiers: \n1. Primary Environmental Pressures (e.g. climate shifts, resource drying).\n2. Socio-Political Fragility (highly consolidated administrative units, debt peaks).\n3. Secondary Activations (propaganda brochures, civil unrest triggers).";
        } else if (textToSend.includes('#correlation')) {
          simulatedReply = "Establishing causal bonds over observed correlations (**#correlation**) requires rigorous counterfactual test layouts. We must determine: would state changes fail to happen in the absolute absence of the primary variable? If so, causation is plausible.";
        } else if (textToSend.includes('#testability')) {
          simulatedReply = "To optimize your thesis's **#testability**, specify an empirical, repeatable baseline. Guard your study against standard confirmation bias using blinded double-referee audits.";
        } else {
          simulatedReply = "To audit this causal loop systematically, let us isolate its core independent and dependent variables. If you apply **#breakitdown**, which constituent parts seem most volatile to outer changes?";
        }

        setMessages(prev => prev.map(m => m.id === newAiMsgId ? {
          ...m,
          text: simulatedReply,
          steps: [
            { status: 'completed', title: 'Identify core subject and student parameters' },
            { status: 'completed', title: 'Trace heuristics and causal blocks' }
          ]
        } : m));
        setIsLoading(false);
      }, 3000);
    }
  };

  const handleReset = () => {
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
          {PRESET_TOPICS.map((topic, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(topic.prompt)}
              className="w-full text-left p-3 rounded-lg hover:bg-slate-100 transition group flex items-start gap-3 cursor-pointer"
            >
              <div className="mt-0.5 bg-slate-800 text-white rounded-full p-1 shrink-0">
                <Box className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium text-slate-800 truncate">{topic.title}</span>
                  <span className="text-[10px] text-slate-400 shrink-0">{i + 1}h ago</span>
                </div>
                <p className="text-xs text-slate-500 truncate mt-0.5">
                  I'll help you explore {topic.tag}...
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
          <div className="flex items-center gap-1 text-slate-500">
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
                  <h2 className="text-4xl font-serif font-medium text-slate-800">Hello</h2>
                  <h3 className="text-4xl font-serif font-medium text-slate-500">What can I do for you?</h3>
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
                      // User Message (Manus style - left aligned heading/text block)
                      <div className="w-full">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 rounded bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600">You</div>
                        </div>
                        <div className="text-[18px] md:text-[20px] font-serif text-slate-800 leading-snug">
                          {m.text}
                        </div>
                      </div>
                    ) : (
                      // AI Message (Manus style)
                      <div className="w-full flex flex-col space-y-4">
                        {m.steps && m.steps.length > 0 && (
                          <div className="bg-[#FAFAFA] border border-slate-200/60 rounded-2xl p-5 space-y-4">
                            {/* Datasource / status pill */}
                            <div className="flex items-center gap-2">
                              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-full text-xs font-medium text-slate-600 border border-slate-200/60">
                                <Sparkles className="w-3.5 h-3.5 text-slate-400" />
                                Connected to specialized heuristic context
                                <ChevronRight className="w-3 h-3 text-slate-400 rotate-90 ml-1" />
                              </span>
                            </div>

                            <div className="space-y-4 pl-2">
                              {m.steps.map((step, idx) => (
                                <div key={idx} className="flex gap-3">
                                  <div className="mt-0.5 shrink-0">
                                    {step.status === 'completed' ? (
                                      <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500"><polyline points="20 6 9 17 4 12"/></svg>
                                      </div>
                                    ) : (
                                      <div className="w-5 h-5 rounded-full border border-slate-300 flex items-center justify-center bg-white shadow-sm overflow-hidden relative">
                                        <div className="w-3 h-3 bg-blue-500 rounded-full animate-ping" />
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex-1 space-y-2">
                                    <h4 className="text-[15px] font-medium text-slate-800 flex items-center gap-2">
                                      {step.title}
                                      {step.status === 'completed' && <ChevronUp className="w-3.5 h-3.5 text-slate-400" />}
                                    </h4>
                                    
                                    {step.text && (
                                      <div className="text-[13px] text-slate-500 leading-relaxed font-sans">
                                        {step.status === 'running' ? (
                                          <div className="flex items-center gap-2 bg-white p-3 rounded-xl border border-slate-200/80 shadow-sm">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                                            <span className="font-medium text-slate-700">{step.text}</span>
                                          </div>
                                        ) : (
                                          <div className="pl-1">
                                            {step.text}
                                            <div className="mt-2 text-slate-400 bg-slate-100/50 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono border border-slate-200/50">
                                              <Play className="w-3 h-3" />
                                              Executing contextual alignment
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Actual AI Response Text */}
                        {m.text && (
                          <div className="text-[15px] text-slate-800 leading-relaxed font-sans prose prose-slate whitespace-pre-wrap">
                            {m.text}
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
                    placeholder="Message Manus..."
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
