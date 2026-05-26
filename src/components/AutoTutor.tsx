import React, { useState, useRef, useEffect } from 'react';
import { 
  BookOpen, 
  Video,
  Phone,
  ArrowLeftRight,
  Clock,
  BarChart3,
  Search,
  Bot,
  Volume2,
  VolumeX,
  FileText,
  Calendar,
  Send,
  MoreVertical,
  Activity,
  Users,
  BrainCircuit,
  MessageSquare,
  ChevronRight
} from 'lucide-react';

interface Article {
  id: string;
  title: string;
  author: string;
  type: string;
  year: number;
  highlighted?: boolean;
  abstract: string;
  tags: string[];
}

interface CalendarEvent {
  id: string;
  time: string;
  title: string;
  location: string;
  tag: 'lecture' | 'meeting' | 'review' | 'advising';
  attendees?: string[];
}

const ARTEMIS_DOCUMENTS: Article[] = [
  {
    id: 'art-1',
    title: 'Applying #constraints to Cognitive Load Limits',
    author: 'Alex Rivera',
    type: 'Thesis',
    year: 2026,
    abstract: 'Explores how explicitly teaching the #constraints heuristic reduces cognitive load for students tackling macro-economics. Examines active retention over a 12-week longitudinal study.',
    tags: ['#constraints', 'Cognitive Load', 'Macro-Econ']
  },
  {
    id: 'art-2',
    title: 'The Bronze Age Collapse: A #breakitdown Analysis',
    author: 'Gavin Phillips',
    type: 'Research',
    year: 2025,
    abstract: 'Decomposes the systemic failure variables of late Bronze Age civilizations using modern causal loop diagrams. Identifies three explicit tiers of structural fragility.',
    tags: ['#breakitdown', 'Historical Systems', 'Causality']
  },
  {
    id: 'art-3',
    title: 'Reverse Engineering the Humanities Assessment',
    author: 'Dr. Sarah Chen',
    type: 'Assessment',
    year: 2026,
    highlighted: true,
    abstract: 'Proposes a unified outcome index linking history essays to empirical testability rubrics. Identifies correlation vs causation flaws in standard subjective grading.',
    tags: ['#correlation', '#testability', 'Assessment']
  },
  {
    id: 'art-4',
    title: 'Student Absence Telemetry: Fall 2026',
    author: 'Admin Records',
    type: 'Analytics',
    year: 2026,
    abstract: 'Tracks absence clusters across the K-12 and University divisions, confirming a statistically significant spike in Wednesday seminar absences correlating with midterm pressure.',
    tags: ['Telemetry', 'Student Success', 'Attendance']
  }
];

const INITIAL_SCHEDULE: CalendarEvent[] = [
  {
    id: 'ev-1',
    time: '09:00 AM',
    title: 'Verify absence logs for Seminar SS110',
    location: 'Dashboard / Advising Module',
    tag: 'review'
  },
  {
    id: 'ev-2',
    time: '11:30 AM',
    title: 'Sync with Dr. Sarah Chen on Assessment Rubrics',
    location: 'Artemis Video Link',
    tag: 'meeting',
    attendees: ['Dr. Sarah Chen']
  },
  {
    id: 'ev-3',
    time: '01:30 PM',
    title: 'Lecture: #correlation vs Causation in Data',
    location: 'Artemis Main Amphitheater',
    tag: 'lecture',
    attendees: ['SS110 Cohort (14)']
  }
];

export default function AutoTutor() {
  const [activeTab, setActiveTab] = useState<'library' | 'matrix' | 'schedule' | 'directory'>('library');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(ARTEMIS_DOCUMENTS[2]);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isDoubleView, setIsDoubleView] = useState<boolean>(false);
  const [schedule] = useState<CalendarEvent[]>(INITIAL_SCHEDULE);
  
  const [isVoiceOn, setIsVoiceOn] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<{ id: string; sender: 'ai' | 'user'; text: string; time: string }[]>([
    {
      id: 'init-1',
      sender: 'ai',
      text: 'Good morning. I am your Artemis Navigator. I have loaded your schedule, recent student absence telemetry, and the latest assessment rubrics.',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const [callState, setCallState] = useState<'off' | 'ringing' | 'connected'>('off');
  const [isDbSynced, setIsDbSynced] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const speakText = (text: string) => {
    if (!isVoiceOn || !synthRef.current) return;

    try {
      synthRef.current.cancel();
      const cleanText = text.replace(/\*\*|#/g, '').replace(/\[.*?\]/g, '').replace(/\s+/g, ' ').trim();
      if (!cleanText) return;

      const utterance = new SpeechSynthesisUtterance(cleanText);
      
      const voices = synthRef.current.getVoices();
      const idealVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Samantha') || v.name.includes('Apple') || v.name.includes('Natural') || v.name.includes('Google'))) || voices[0];
      
      if (idealVoice) utterance.voice = idealVoice;
      utterance.rate = 1.05;
      utterance.pitch = 1.0;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      synthRef.current.speak(utterance);
    } catch (err) {
      console.warn("Speech Synthesis issue:", err);
      setIsSpeaking(false);
    }
  };

  const stopActiveSpeech = () => {
    if (synthRef.current) synthRef.current.cancel();
    setIsSpeaking(false);
  };

  const toggleVoice = () => {
    if (isVoiceOn) stopActiveSpeech();
    setIsVoiceOn(!isVoiceOn);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    stopActiveSpeech();

    const query = inputText.trim();
    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user' as const,
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    // Basic heuristic routing for local UI effects
    const lowerQuery = query.toLowerCase();
    if (lowerQuery.includes('sarah') || lowerQuery.includes('chen') || lowerQuery.includes('call')) {
      setActiveTab('directory');
    } else if (lowerQuery.includes('matrix') || lowerQuery.includes('chart') || lowerQuery.includes('compare')) {
      setActiveTab('matrix');
      if (lowerQuery.includes('compare')) setIsDoubleView(true);
    } else if (lowerQuery.includes('schedule') || lowerQuery.includes('agenda') || lowerQuery.includes('lecture')) {
      setActiveTab('schedule');
    } else if (lowerQuery.includes('article') || lowerQuery.includes('read') || lowerQuery.includes('rubric')) {
      setActiveTab('library');
      setSelectedArticle(ARTEMIS_DOCUMENTS[2]);
    }

    try {
      const response = await fetch('/api/gemini/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: query,
          role: 'faculty',
          cluster: 'university',
          previousHistory: messages.map(m => ({ role: m.sender === 'ai' ? 'model' : 'user', parts: [{ text: m.text }] }))
        })
      });

      if (!response.ok) throw new Error('API Error');

      const data = await response.json();
      const replyText = data.reply || data.text || "I have analyzed your request. Please review the highlighted module.";
      
      const aiMsg = {
        id: `ai-${Date.now()}`,
        sender: 'ai' as const,
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prev => [...prev, aiMsg]);
      speakText(replyText);

    } catch (err) {
      console.warn("Fallback to local response");
      setTimeout(() => {
        const fallbacks = [
          "Navigating to the requested module based on your query. I have highlighted the most relevant heuristic data points.",
          "I've cross-referenced this with the university database. A noticeable correlation exists. Would you like me to map the variables?",
          "Understood. I am syncing these updates across the university board."
        ];
        const replyText = fallbacks[Math.floor(Math.random() * fallbacks.length)];
        
        const aiMsg = {
          id: `ai-${Date.now()}`,
          sender: 'ai' as const,
          text: replyText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        
        setMessages(prev => [...prev, aiMsg]);
        speakText(replyText);
        setIsLoading(false);
      }, 1500);
      return;
    }
    
    setIsLoading(false);
  };

  const triggerDatabaseSync = () => {
    setIsSyncing(true);
    const syncMsg = "Cross-referencing your course heuristics with Dr. Chen's department rubrics... syncing academic logs.";
    setMessages(prev => [...prev, { id: `ai-${Date.now()}`, sender: 'ai', text: syncMsg, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    speakText(syncMsg);
    
    setTimeout(() => {
      setIsSyncing(false);
      setIsDbSynced(true);
      const doneMsg = "Database Synchronization complete! The outcome indexes are now perfectly aligned with your active seminars.";
      setMessages(prev => [...prev, { id: `ai-${Date.now()}`, sender: 'ai', text: doneMsg, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
      speakText(doneMsg);
    }, 4000);
  };

  const filteredArticles = ARTEMIS_DOCUMENTS.filter(a => 
    a.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    a.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="flex h-full bg-slate-50 text-slate-800 overflow-hidden font-sans border border-slate-200 rounded-xl m-2 shadow-sm">
      
      {/* LEFT PANEL: Artemis Navigator AI */}
      <div className="w-1/3 min-w-[340px] max-w-[420px] bg-white border-r border-slate-200 flex flex-col z-10 flex-shrink-0">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-md shadow-indigo-200">
                <Bot className="w-5 h-5 text-white" />
              </div>
              {isSpeaking && (
                <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white"></span>
                </span>
              )}
            </div>
            <div>
              <h2 className="font-semibold text-slate-900 leading-tight">Artemis Navigator</h2>
              <p className="text-[11px] font-medium text-indigo-600 tracking-wide uppercase">Intelligent Companion</p>
            </div>
          </div>
          <button 
            onClick={toggleVoice}
            className={`p-2 rounded-lg transition-colors ${isVoiceOn ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-slate-100 text-slate-400'}`}
            title={isVoiceOn ? "Voice Enabled" : "Voice Muted"}
          >
            {isVoiceOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50/50">
          {messages.map((m) => (
            <div key={m.id} className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-[13px] leading-relaxed shadow-xs ${
                m.sender === 'user' 
                  ? 'bg-indigo-600 text-white rounded-br-none' 
                  : 'bg-white border border-slate-200 text-slate-700 rounded-bl-none'
              }`}>
                {m.text}
              </div>
              <span className="text-[10px] text-slate-400 mt-1 px-1 font-medium">{m.time}</span>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start">
              <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-none px-4 py-3 shadow-xs">
                <div className="flex gap-1.5 items-center h-4">
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <div className="p-4 bg-white border-t border-slate-100">
          <form onSubmit={handleSendMessage} className="relative flex items-center">
            <input 
              type="text" 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask the Navigator..."
              className="w-full bg-slate-100 border-transparent focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-xl pl-4 pr-12 py-3 text-sm text-slate-800 transition-all outline-none"
              disabled={isLoading}
            />
            <button 
              type="submit" 
              disabled={isLoading || !inputText.trim()}
              className="absolute right-2 p-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-lg transition-colors shadow-sm"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* RIGHT PANEL: Workspace */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50">
        
        {/* Top Navigation */}
        <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center gap-6 overflow-x-auto">
          {[
            { id: 'library', icon: BookOpen, label: 'Academic Library' },
            { id: 'matrix', icon: BarChart3, label: 'Performance Matrix' },
            { id: 'schedule', icon: Calendar, label: 'Daily Agenda' },
            { id: 'directory', icon: Users, label: 'Faculty Directory' }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-1 py-2 border-b-2 text-[13px] font-semibold transition-colors whitespace-nowrap ${
                  isActive ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Workspace Content Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-5xl mx-auto w-full h-full">
            
            {/* LIBRARY VIEW */}
            {activeTab === 'library' && (
              <div className="flex flex-col h-full space-y-6 animate-fade-in">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-xl font-bold text-slate-900">Document Hub</h1>
                    <p className="text-sm text-slate-500 mt-1">Review active thesis and assessment rubrics.</p>
                  </div>
                  <div className="relative relative w-full sm:w-72">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input 
                      type="text" 
                      placeholder="Search title, author, or #tags..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 flex-1 min-h-0">
                  <div className="md:col-span-5 flex flex-col space-y-3 overflow-y-auto pr-2 pb-6">
                    {filteredArticles.map(art => (
                      <div 
                        key={art.id} 
                        onClick={() => setSelectedArticle(art)} 
                        className={`p-4 rounded-xl border cursor-pointer transition-all ${
                          selectedArticle?.id === art.id 
                            ? 'bg-indigo-50 border-indigo-200 shadow-sm' 
                            : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
                        }`}
                      >
                        <div className="flex justify-between items-start gap-2 mb-1">
                          <h3 className={`text-sm font-semibold leading-snug ${selectedArticle?.id === art.id ? 'text-indigo-900' : 'text-slate-800'}`}>
                            {art.title}
                          </h3>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-500 whitespace-nowrap">
                            {art.type}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 mb-2">
                          {art.author} • {art.year}
                        </div>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {art.tags.map(tag => (
                            <span key={tag} className="px-1.5 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-[10px] text-slate-600 font-medium tracking-wide">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="md:col-span-7 flex flex-col">
                    {selectedArticle ? (
                      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col h-full">
                        <div className="flex items-center gap-2 mb-4">
                          <FileText className="w-5 h-5 text-indigo-500" />
                          <span className="text-xs font-bold text-indigo-600 tracking-wider uppercase">Abstract Preview</span>
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">{selectedArticle.title}</h2>
                        <div className="flex items-center gap-2 text-sm text-slate-500 mb-6 pb-6 border-b border-slate-100">
                          <span className="font-medium text-slate-700">{selectedArticle.author}</span>
                          <span>•</span>
                          <span>{selectedArticle.year}</span>
                          <span>•</span>
                          <span className="bg-slate-100 px-2 py-0.5 rounded">{selectedArticle.type}</span>
                        </div>
                        <p className="text-[15px] leading-relaxed text-slate-700 flex-1">
                          {selectedArticle.abstract}
                        </p>
                        
                        <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between">
                          <button 
                            onClick={() => speakText(selectedArticle.abstract)} 
                            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-semibold transition-colors"
                          >
                            <Volume2 className="w-4 h-4" /> Narration
                          </button>
                          {selectedArticle.id === 'art-3' && (
                             <button 
                               onClick={() => { setActiveTab('matrix'); setIsDoubleView(true); }} 
                               className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm"
                             >
                              <BarChart3 className="w-4 h-4" /> View Rubric Matrix
                            </button>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-slate-400 bg-white border border-slate-200 border-dashed rounded-2xl p-8">
                        <BookOpen className="w-12 h-12 mb-4 text-slate-300 stroke-1" />
                        <p className="text-sm">Select a document from the hub to preview details.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* PERFORMANCE MATRIX VIEW */}
            {activeTab === 'matrix' && (
              <div className="flex flex-col space-y-6 animate-fade-in w-full max-w-4xl">
                 <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                  <div>
                    <h1 className="text-xl font-bold text-slate-900">Performance Matrix</h1>
                    <p className="text-sm text-slate-500 mt-1">Analyzing heuristic outcomes across student cohorts.</p>
                  </div>
                  <button 
                    onClick={() => setIsDoubleView(!isDoubleView)} 
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                      isDoubleView ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-white border text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <ArrowLeftRight className="w-4 h-4" />
                    {isDoubleView ? 'Single View' : 'Compare Rubrics'}
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                  <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col items-center">
                     <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide mb-6">Legacy Assessment Grading</h3>
                     
                     {/* Clean CSS Visualization */}
                     <div className="w-full flex justify-center items-end h-40 gap-8 mb-6 border-b border-slate-100 pb-2">
                       <div className="relative flex flex-col items-center w-20 group">
                         <div className="absolute -top-7 text-xs font-bold text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">85%</div>
                         <div className="w-full bg-slate-300 rounded-t-md transition-all duration-1000 h-[85%] relative overflow-hidden">
                           <div className="absolute inset-0 bg-slate-400 opacity-20"></div>
                         </div>
                         <span className="mt-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Pass</span>
                       </div>
                       <div className="relative flex flex-col items-center w-20 group">
                         <div className="absolute -top-7 text-xs font-bold text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">15%</div>
                         <div className="w-full bg-rose-200 rounded-t-md transition-all duration-1000 h-[15%]"></div>
                         <span className="mt-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Fail</span>
                       </div>
                     </div>
                     <p className="text-[13px] text-slate-500 text-center leading-relaxed">
                       Subjective grading criteria yielded high pass rates, largely correlating with rote memorization rather than systemic comprehension.
                     </p>
                  </div>

                  {isDoubleView ? (
                     <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 shadow-sm flex flex-col items-center animate-fade-in relative overflow-hidden">
                       <div className="absolute top-0 right-0 p-4 opacity-10">
                         <BrainCircuit className="w-24 h-24 text-indigo-600" />
                       </div>
                       <h3 className="text-sm font-bold text-indigo-900 uppercase tracking-wide mb-6 relative z-10">Empirical Testability Rubric</h3>
                       
                       <div className="w-full flex justify-center items-end h-40 gap-8 mb-6 border-b border-indigo-200/50 pb-2 relative z-10">
                         <div className="relative flex flex-col items-center w-20 group">
                           <div className="absolute -top-7 text-xs font-bold text-indigo-800 opacity-0 group-hover:opacity-100 transition-opacity">62%</div>
                           <div className="w-full bg-indigo-500 rounded-t-md transition-all duration-1000 h-[62%]"></div>
                           <span className="mt-3 text-xs font-semibold text-indigo-700 uppercase tracking-wider">Pass</span>
                         </div>
                         <div className="relative flex flex-col items-center w-20 group">
                           <div className="absolute -top-7 text-xs font-bold text-rose-800 opacity-0 group-hover:opacity-100 transition-opacity">38%</div>
                           <div className="w-full bg-rose-400 rounded-t-md transition-all duration-1000 h-[38%] relative overflow-hidden">
                             <div className="absolute inset-0 bg-white/20 stripe-pattern"></div>
                           </div>
                           <span className="mt-3 text-xs font-semibold text-rose-700 uppercase tracking-wider">Fail</span>
                         </div>
                       </div>
                       <p className="text-[13px] text-indigo-800/80 text-center leading-relaxed relative z-10 font-medium">
                         Applying #constraints and #testability heuristics clarifies critical thinking gaps. Students must now explicitly trace causal structures.
                       </p>
                     </div>
                  ) : (
                    <div className="bg-white border border-slate-200 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center text-slate-400">
                      <BarChart3 className="w-8 h-8 mb-3 opacity-50" />
                      <p className="text-sm font-medium">Select 'Compare Rubrics' to view the Empirical Testability overlay.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* DAILY SCHEDULE VIEW */}
            {activeTab === 'schedule' && (
              <div className="flex flex-col animate-fade-in max-w-3xl">
                <div className="border-b border-slate-200 pb-4 mb-6">
                  <h1 className="text-xl font-bold text-slate-900">Today's Agenda</h1>
                  <p className="text-sm text-slate-500 mt-1">Your upcoming events and academic commitments.</p>
                </div>
                
                <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-slate-200">
                  {schedule.map((ev, index) => (
                    <div key={ev.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-slate-50 bg-white shadow-sm shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 ${
                        ev.tag === 'meeting' ? 'text-purple-500' : ev.tag === 'lecture' ? 'text-indigo-500' : 'text-emerald-500'
                      }`}>
                        {ev.tag === 'meeting' ? <Video className="w-4 h-4" /> : ev.tag === 'lecture' ? <BookOpen className="w-4 h-4" /> : <Activity className="w-4 h-4" />}
                      </div>
                      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white border border-slate-200 p-5 rounded-2xl shadow-sm transition-all hover:shadow-md hover:border-slate-300">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold font-mono tracking-wide text-slate-500">{ev.time}</span>
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                            ev.tag === 'meeting' ? 'bg-purple-50 text-purple-600' : ev.tag === 'lecture' ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'
                          }`}>
                            {ev.tag}
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-slate-800 mb-2">{ev.title}</h3>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3">
                          <span className="font-medium">{ev.location}</span>
                        </div>
                        {ev.attendees && (
                          <div className="pt-3 border-t border-slate-100 flex gap-2">
                            {ev.attendees.map(a => (
                              <div key={a} className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 rounded-lg text-[11px] text-slate-600 font-medium">
                                <Users className="w-3 h-3 text-slate-400" /> {a}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* FACULTY DIRECTORY & CALLING */}
            {activeTab === 'directory' && (
              <div className="flex flex-col animate-fade-in max-w-4xl">
                 <div className="border-b border-slate-200 pb-4 mb-6">
                  <h1 className="text-xl font-bold text-slate-900">Faculty Directory & Network</h1>
                  <p className="text-sm text-slate-500 mt-1">Connect with active academic personnel and sync databases.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Dr. Sarah Chen Card */}
                  <div className={`border-2 rounded-2xl overflow-hidden transition-all duration-500 ${
                    callState === 'connected' ? 'border-emerald-500 shadow-md shadow-emerald-100' : 
                    callState === 'ringing' ? 'border-orange-400 shadow-md shadow-orange-100' : 
                    'border-slate-200 bg-white hover:border-slate-300'
                  }`}>
                    {/* Header Banner */}
                    <div className="h-20 bg-slate-100 flex items-center justify-center relative">
                      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                      <div className="w-16 h-16 rounded-full border-4 border-white bg-indigo-100 flex items-center justify-center absolute -bottom-8 shadow-sm">
                        <Users className="w-6 h-6 text-indigo-500" />
                      </div>
                    </div>
                    
                    <div className="pt-10 px-6 pb-6 text-center">
                      <h2 className="text-lg font-bold text-slate-900">Dr. Sarah Chen</h2>
                      <p className="text-xs text-slate-500 font-medium mt-1 uppercase tracking-wider">Humanities Dept. Head</p>
                      
                      <div className="mt-6 flex flex-col space-y-3">
                         {callState === 'connected' ? (
                           <div className="animate-fade-in">
                             <div className="bg-slate-50 rounded-xl p-4 mb-4 border border-slate-200 text-left">
                               <p className="text-sm text-slate-700 italic leading-relaxed">
                                 "Look at the seminar outcomes! I'm ready to send my empirical assessment rubrics over to sync databases with your workstation."
                               </p>
                             </div>
                             <div className="flex gap-3">
                               <button 
                                 onClick={triggerDatabaseSync} 
                                 disabled={isSyncing || isDbSynced} 
                                 className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-emerald-600 text-white rounded-xl text-xs font-bold uppercase tracking-wide transition-colors flex items-center justify-center gap-2"
                               >
                                 <ArrowLeftRight className="w-4 h-4" />
                                 {isSyncing ? 'Syncing...' : isDbSynced ? 'Databases Synced' : 'Sync Rubrics'}
                               </button>
                               <button 
                                 onClick={() => { setCallState('off'); speakText("Connection closed."); }} 
                                 className="p-2.5 bg-rose-100 hover:bg-rose-200 text-rose-600 rounded-xl transition-colors"
                                 title="End Sync"
                               >
                                 <PhoneOff className="w-5 h-5" />
                               </button>
                             </div>
                           </div>
                         ) : callState === 'ringing' ? (
                           <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 flex flex-col items-center gap-3">
                             <div className="p-3 bg-white rounded-full shadow-sm animate-bounce">
                               <Phone className="w-6 h-6 text-orange-500" />
                             </div>
                             <span className="text-xs font-bold text-orange-600 uppercase tracking-widest animate-pulse">Establishing Connection...</span>
                           </div>
                         ) : (
                           <button 
                             onClick={() => { 
                               setCallState('ringing'); 
                               speakText("Initiating secure network connection with Dr. Chen.");
                               setTimeout(() => {
                                 setCallState('connected');
                                 speakText("Connection established. Dr. Chen is securely linked.");
                               }, 2500); 
                             }} 
                             className="w-full py-2.5 bg-slate-100 border border-slate-200 hover:bg-white hover:border-indigo-300 hover:text-indigo-700 text-slate-700 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 group"
                           >
                             <Video className="w-4 h-4 text-slate-400 group-hover:text-indigo-500" />
                             Start Secure Video Sync
                           </button>
                         )}
                      </div>
                    </div>
                  </div>

                  {/* Other Faculty Member - Inactive Example */}
                  <div className="border border-slate-200 rounded-2xl bg-white overflow-hidden opacity-75 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                    <div className="h-20 bg-slate-100 flex items-center justify-center relative">
                      <div className="w-16 h-16 rounded-full border-4 border-white bg-slate-200 flex items-center justify-center absolute -bottom-8">
                        <Users className="w-6 h-6 text-slate-400" />
                      </div>
                    </div>
                    <div className="pt-10 px-6 pb-6 text-center">
                      <h2 className="text-lg font-bold text-slate-900">Prof. Gavin Phillips</h2>
                      <p className="text-xs text-slate-500 font-medium mt-1 uppercase tracking-wider">Historical Analytics</p>
                      <div className="mt-6">
                        <div className="w-full py-2.5 bg-slate-50 border border-slate-200 text-slate-400 rounded-xl text-sm font-semibold flex items-center justify-center gap-2">
                          <Activity className="w-4 h-4" />
                          Currently in Active Lecture
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
