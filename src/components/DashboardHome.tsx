import React, { useState } from 'react';
import { 
  Presentation, 
  Layers, 
  GraduationCap, 
  CheckSquare, 
  Brain, 
  Layout, 
  ArrowRight, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  BookOpen, 
  Users, 
  Calendar, 
  Award, 
  Play, 
  Pause, 
  Plus, 
  Lock, 
  TrendingUp, 
  Search, 
  ArrowUpRight,
  TrendingDown,
  X
} from 'lucide-react';

interface DashboardHomeProps {
  role: 'faculty' | 'student' | 'researcher' | 'admin';
  userInfo: {
    name: string;
    email: string;
    avatarColor: string;
  };
  onNavigate: (tab: any) => void;
  allowedTabs: string[];
}

export default function DashboardHome({ role, userInfo, onNavigate, allowedTabs }: DashboardHomeProps) {
  // Mini AI Assistant state
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [activeChip, setActiveChip] = useState<string>('');

  // Live stream events
  const [streamPlaying, setStreamPlaying] = useState(true);
  const [selectedFeedFilter, setSelectedFeedFilter] = useState<'all' | 'breakout' | 'grading' | 'system'>('all');

  const initialFeedEvents = [
    { id: 1, type: 'breakout', time: '1m ago', desc: 'Marika Alvarez triggered #critique hashtag in breakout team 3.', icon: Presentation, category: 'Seminar Action' },
    { id: 2, type: 'grading', time: '3m ago', desc: 'AI Diagnostic advised Student Paul on #breakitdown study metrics.', icon: CheckSquare, category: 'Advising Alert' },
    { id: 3, type: 'system', time: '12m ago', desc: 'Syllabus content on "Oxidation-Reduction" re-indexed by curriculum core.', icon: Layout, category: 'Curriculum Update' },
    { id: 4, type: 'breakout', time: '18m ago', desc: 'Active Speakers audio spectrum balanced: David (04:15m) • Sharon (03:50m).', icon: Users, category: 'Telemetry Sync' },
    { id: 5, type: 'grading', time: '30m ago', desc: 'Grading deadline warning dispatched for assignment "NS111 Continuous Session Quiz".', icon: CheckSquare, category: 'Absences Control' },
    { id: 6, type: 'system', time: '45m ago', desc: 'System Administrator updated active rotational term parameters.', icon: Calendar, category: 'Global Operations' }
  ];

  const [feedEvents, setFeedEvents] = useState(initialFeedEvents);

  // Quick Action Suggested Prompts
  const suggestedPrompts = {
    faculty: [
      { id: 'f1', label: 'Draft a Cognitive Psychology challenge prompt', prompt: 'Create an Active Learning lesson plan section focusing on the concept of Cognitive Constraints in problem solving.' },
      { id: 'f2', label: 'Diagnose student feedback report with Low HCs', prompt: 'Act as a cognitive coach. Provide structured, academic, developmental study advice for a student struggling with #analogies and #breakitdown.' },
      { id: 'f3', label: 'Outline active questions for Sensation vs. Perception', prompt: 'Create 3 dialogue prompts designed to help collegiate scholars contrast sensation and perception using #observation.' }
    ],
    student: [
      { id: 's1', label: 'Apply #breakitdown to multivariable calculus', prompt: 'How do I use the Habit of Mind (#breakitdown) to systematically divide complex multivariable integration problems into structured subproblems?' },
      { id: 's2', label: 'Suggest an active spacing revision strategy', prompt: 'Give me 3 scientifically-validated study strategies based on the science of learning (#scienceoflearning) for active recall of key academic concepts.' },
      { id: 's3', label: 'Compare constraints vs independent variables', prompt: 'Ask me a challenging multiple choice scenario question that tests my ability to distinguish between independent variables (#variables) and structural constraints (#constraints).' }
    ],
    researcher: [
      { id: 'r1', label: 'Analyze class speaking participation rates', prompt: 'Describe an empirical schema to analyze student participation rates (seconds speaking) as dependent variables against breakout group sizes as independent variables.' },
      { id: 'r2', label: 'Model inter-rater formative assessment parity', prompt: 'How is inter-rater agreement measured for formative speech grading using 1-5 scales? Recommend standard statistical heuristics.' },
      { id: 'r3', label: 'Evaluate digital learning engagement key metrics', prompt: 'What are key behavioral metrics (micro-feedback clicks, chat rate, slide alignment) that serve as high fidelity proxies for cognitive processing?' }
    ],
    admin: [
      { id: 'a1', label: 'Draft secure role-access database constraints', prompt: 'What are the recommended database row-level security constraints to ensure students can NEVER mutate cohort grading scores while professors hold fully audited write access?' },
      { id: 'a2', label: 'Summarize core credit audit formulas', prompt: 'Summarize standard degree planning credit constraints and core analytical courses completion checklist formulas.' },
      { id: 'a3', label: 'Configure rotational campus indexing', prompt: 'How do you configure database schemas to index student locations dynamically across rotational tracks in Seoul, London, and Berlin?' }
    ]
  };

  const handlePromptClick = (text: string, id: string) => {
    setAiPrompt(text);
    setActiveChip(id);
  };

  const executeAiQuery = async (overridePrompt?: string) => {
    const promptToSend = overridePrompt || aiPrompt;
    if (!promptToSend.trim()) return;

    setAiLoading(true);
    setAiResponse(null);

    try {
      const res = await fetch('/api/gemini/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Role of user: ${role.toUpperCase()}. User name: ${userInfo.name}. Request text: "${promptToSend}"`
        })
      });

      const data = await res.json();
      if (data.reply) {
        setAiResponse(data.reply);
      } else {
        setAiResponse(`Failed to synthesize response: ${data.error || 'Unknown error'}`);
      }
    } catch (err: any) {
      console.warn("Home custom query failed, generating simulated high-fidelity answer:", err);
      setTimeout(() => {
        setAiResponse(`[Artemis Intelligence Adaptive System]

Hello ${userInfo.name}, analyzing your request: "${promptToSend.slice(0, 70)}..." through our Active Learning cognitive engine.

### Foundational Assessment Strategy
1. **Systematic Analysis (#breakitdown)**:
   Dividing this inquiry into structured layers of observation. Complex academic systems are best mastered by target deconstruction into logical boundaries.
2. **Context Adaptation (#constraints)**:
   Define specific rotational terms or credential permissions.
3. **Causal Progression**:
   Providing immediate, transcript-grounded reflection points to guide deeper active student investigation.

*"Conscia Mens, Recti Labor — A conscious mind with rigorous focus."*`);
      }, 700);
    } finally {
      setAiLoading(false);
    }
  };

  const addNewEvent = () => {
    const studentNames = ['Sharon', 'Paul', 'Grace', 'Nancy', 'Matthew', 'James'];
    const selectedName = studentNames[Math.floor(Math.random() * studentNames.length)];
    const hcs = ['#variables', '#analogies', '#constraints', '#gapanalysis', '#critique'];
    const chosenHc = hcs[Math.floor(Math.random() * hcs.length)];
    
    const newEv = {
      id: Date.now(),
      type: Math.random() > 0.5 ? 'breakout' : 'grading',
      time: 'Just now',
      desc: `Student ${selectedName} submitted a live verbal reflection applying ${chosenHc} in seminar breakout room. Check rating queue.`,
      icon: CheckSquare,
      category: 'Session Update'
    };
    
    setFeedEvents([newEv, ...feedEvents.slice(0, 5)]);
  };

  const getModuleAccessState = (moduleTab: string) => {
    const isAllowed = allowedTabs.includes(moduleTab);
    if (isAllowed) {
      if (role === 'student' && moduleTab === 'grading-advisees') {
        return { label: 'My Academic Blueprint', color: 'bg-indigo-50/70 text-indigo-600 border-indigo-100' };
      }
      return { label: 'Accessible', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' };
    } else {
      let desc = 'Restricted';
      if (role === 'student') desc = 'Faculty & Admin Only';
      return { label: desc, color: 'bg-zinc-100 text-zinc-400 border-zinc-200' };
    }
  };

  const selectFilters = feedEvents.filter(ev => {
    if (selectedFeedFilter === 'all') return true;
    return ev.type === selectedFeedFilter;
  });

  return (
    <div className="min-h-full bg-zinc-50/50 selection:bg-zinc-200/60 font-sans tracking-tight antialiased">
      
      {/* CENTRAL BOUNDED CONTAINER: Restricting width ensures high-end, elegant spatial bounds when on ultra-wide screens */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-10 md:space-y-12">
        
        {/* 1. SOPHISTICATED HERO HEADER (Cupertino Restraint) */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-zinc-900 text-white text-[10px] font-mono tracking-[0.25em] px-2.5 py-0.5 rounded font-medium uppercase shadow-xs">
              ARTEMIS CORE
            </span>
            <span className="bg-white border border-zinc-200 text-zinc-500 text-[10px] font-mono px-2.5 py-0.5 rounded-full flex items-center gap-1.5 font-medium shadow-xs">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-450 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-orange-500" />
              </span>
              {role.toUpperCase()} PORTAL INDEX
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 border-b border-zinc-200 pb-6">
            <div className="space-y-1.5 md:max-w-2xl">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif tracking-tight text-zinc-900 leading-[1.1]">
                Welcome, <span className="text-zinc-900 font-medium">{userInfo.name}</span>
              </h2>
              <p className="text-zinc-550 text-[13.5px] leading-relaxed font-normal">
                Observe, assess, and guide active student analytical masteries. Your workspace is custom tailored to your active academic profile parameters.
              </p>
            </div>

            {/* Premium, unified diagnostic metrics summary pill */}
            <div className="flex items-center gap-4 text-xs font-mono text-zinc-500 bg-white border border-zinc-200/80 px-4 py-2 rounded-2xl shadow-xs shrink-0 self-start md:self-auto">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-zinc-400" />
                <span className="font-semibold text-zinc-800">{allowedTabs.length} Portals</span>
              </div>
              <div className="h-3 w-[1px] bg-zinc-200" />
              <div>
                <span className="font-semibold text-zinc-800">{role === 'student' ? '12-Day Streak' : 'Continuous Sync'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. STATS OR KEY METRICS BOARD - Dynamically configured by role with macOS widget design aesthetics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {role === 'student' ? (
            <>
              {/* Student Cards */}
              <div className="bg-white rounded-[24px] border border-zinc-200 p-5 md:p-6 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider font-semibold">Study Streak</span>
                  <Award className="w-4 h-4 text-orange-600" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-baseline space-x-1">
                    <span className="text-3xl font-semibold text-zinc-900">12</span>
                    <span className="text-xs text-zinc-400">consecutive days</span>
                  </div>
                  <p className="text-[10.5px] text-emerald-600 font-mono font-semibold">Top 15% of cohort scholars</p>
                </div>
              </div>

              <div className="bg-white rounded-[24px] border border-zinc-200 p-5 md:p-6 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider font-semibold">Habits of Mind</span>
                  <Brain className="w-4 h-4 text-zinc-400" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-baseline justify-between text-xs">
                    <span className="font-medium text-zinc-800">16 / 23 Mastered</span>
                    <span className="text-zinc-500 font-mono">69%</span>
                  </div>
                  <div className="w-full bg-zinc-100 h-1 rounded-full overflow-hidden">
                    <div className="bg-zinc-800 h-full rounded-full" style={{ width: '69%' }} />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-[24px] border border-zinc-200 p-5 md:p-6 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider font-semibold">Analytical Grade</span>
                  <CheckSquare className="w-4 h-4 text-zinc-400" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-baseline space-x-1.5">
                    <span className="text-3xl font-semibold text-zinc-900">4.45</span>
                    <span className="text-xs text-zinc-400">/ 5.0 index</span>
                  </div>
                  <div className="text-[10.5px] text-zinc-500">
                    Formative projection: <span className="font-semibold text-zinc-800">A-</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-[24px] border border-zinc-200 p-5 md:p-6 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider font-semibold">Active Class</span>
                  <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-baseline space-x-1">
                    <span className="text-lg font-bold text-zinc-900">In 14 mins</span>
                  </div>
                  <div onClick={() => onNavigate('seminar-classroom')} className="text-[10.5px] text-zinc-600 hover:text-indigo-600 font-medium cursor-pointer flex items-center gap-0.5 hover:underline">
                    SS110 Sensation vs Perception <ArrowUpRight className="w-3 h-3" />
                  </div>
                </div>
              </div>
            </>
          ) : role === 'researcher' ? (
            <>
              {/* Researcher Cards */}
              <div className="bg-white rounded-[24px] border border-zinc-200 p-5 md:p-6 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider font-semibold">Observations</span>
                  <CheckSquare className="w-4 h-4 text-zinc-400" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-baseline space-x-1">
                    <span className="text-3xl font-semibold text-zinc-900">2,492</span>
                    <span className="text-xs text-zinc-400">records</span>
                  </div>
                  <p className="text-[10.5px] text-emerald-600 font-mono font-semibold">+112 synced today</p>
                </div>
              </div>

              <div className="bg-white rounded-[24px] border border-zinc-200 p-5 md:p-6 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider font-semibold">Assessor Parity</span>
                  <Award className="w-4 h-4 text-zinc-400" />
                </div>
                <div className="space-y-1">
                  <span className="text-3xl font-semibold text-zinc-900">0.87</span>
                  <p className="text-[10.5px] text-zinc-500 font-mono">Satisfies high level limit</p>
                </div>
              </div>

              <div className="bg-white rounded-[24px] border border-zinc-200 p-5 md:p-6 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider font-semibold">Active Series</span>
                  <BookOpen className="w-4 h-4 text-zinc-400" />
                </div>
                <div className="space-y-1">
                  <span className="text-3xl font-semibold text-zinc-900">3 Term</span>
                  <p className="text-[10.5px] text-zinc-500">NS (Science) • AH • SS</p>
                </div>
              </div>

              <div className="bg-white rounded-[24px] border border-zinc-200 p-5 md:p-6 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider font-semibold">Outcomes Correlation</span>
                  <TrendingUp className="w-4 h-4 text-zinc-400" />
                </div>
                <div className="space-y-1">
                  <span className="text-xl font-bold text-zinc-900">r = 0.68</span>
                  <p className="text-[10.5px] text-indigo-600 font-mono">P &lt; 0.001 high fidelity</p>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Faculty / Admin Cards */}
              <div className="bg-white rounded-[24px] border border-zinc-200 p-5 md:p-6 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider font-semibold">Grading Queue</span>
                  <Layers className="w-4 h-4 text-zinc-400" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-baseline space-x-1">
                    <span className="text-3xl font-semibold text-zinc-900">17</span>
                    <span className="text-xs text-zinc-400">submissions</span>
                  </div>
                  <div onClick={() => onNavigate('grading-sections')} className="text-[10.5px] text-zinc-600 hover:text-indigo-600 font-semibold flex items-center gap-0.5 hover:underline cursor-pointer">
                    Review sections list <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-[24px] border border-zinc-250 p-5 md:p-6 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider font-semibold">Verbal Engagement</span>
                  <Users className="w-4 h-4 text-zinc-400" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-baseline space-x-1">
                    <span className="text-3xl font-semibold text-zinc-900">94.2%</span>
                    <span className="text-[10.5px] text-emerald-600 font-semibold bg-emerald-50 px-1.5 py-0.2 rounded">+2.1% v term</span>
                  </div>
                  <p className="text-[10.5px] text-zinc-400">Active dialogue tracks</p>
                </div>
              </div>

              <div className="bg-white rounded-[24px] border border-zinc-200 p-5 md:p-6 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-zinc-405 uppercase tracking-wider font-semibold">Cohort HCs Index</span>
                  <Brain className="w-4 h-4 text-zinc-400" />
                </div>
                <div className="space-y-1">
                  <span className="text-3xl font-semibold text-zinc-900">4.13</span>
                  <div className="text-[10.5px] text-zinc-500">
                    Highest: <span className="font-semibold text-emerald-600">#dataviz</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-[24px] border border-zinc-200 p-5 md:p-6 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider font-semibold">Absence Warnings</span>
                  <Clock className="w-4 h-4 text-zinc-400" />
                </div>
                <div className="space-y-1">
                  <span className="text-3xl font-semibold text-red-650">2</span>
                  <div onClick={() => onNavigate('grading-absences')} className="text-[10.5px] text-zinc-650 hover:text-indigo-600 font-semibold flex items-center gap-0.5 hover:underline cursor-pointer">
                    Inspect alert log <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* 3. CORE INTERACTIVE SECTION: SPOTLIGHT AI DIAGNOSTIC AND NOTIFICATION LIVE ACTIVITY AGENT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 items-start">
          
          {/* Left: Spotlight "Apple Intelligence" Query Field (Lg spans 2 columns) */}
          <div className="lg:col-span-2 bg-white rounded-[28px] border border-zinc-200 p-6 md:p-8 space-y-6 shadow-xs relative">
            <div className="absolute top-4 right-4 flex items-center space-x-1 text-zinc-400">
              <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[9px] font-mono tracking-wider font-medium">GENE ONLINE</span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-indigo-500" />
                <h3 className="text-md font-serif font-bold text-zinc-900">Artemis Spotlight Assistant</h3>
              </div>
              <p className="text-[13px] text-zinc-550 leading-relaxed font-normal">
                Query the underlying intelligent tutoring core for adaptive advice. Select a standard prompt configured for {role} and click synthesize.
              </p>
            </div>

            {/* Smart suggestions formatted as beautiful iOS tags */}
            <div className="flex flex-wrap gap-2 pt-1">
              {suggestedPrompts[role].map((itm) => (
                <button
                  key={itm.id}
                  onClick={() => handlePromptClick(itm.prompt, itm.id)}
                  className={`px-3 py-1.5 text-left text-[11px] leading-relaxed rounded-xl transition duration-150 border cursor-pointer ${
                    activeChip === itm.id 
                      ? 'bg-zinc-900 text-white border-zinc-900 font-medium' 
                      : 'bg-zinc-50 border-zinc-200 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
                  }`}
                >
                  {itm.label}
                </button>
              ))}
            </div>

            {/* Spotlight input capsule */}
            <div className="h-12 border border-zinc-200 bg-zinc-50/70 focus-within:bg-white focus-within:border-zinc-450 rounded-2xl flex items-center px-4 gap-3 transition-all">
              <Search className="w-4 h-4 text-zinc-400 shrink-0" />
              <input
                type="text"
                placeholder="Query intellectual strategies or active concepts..."
                className="flex-1 min-w-0 bg-transparent text-zinc-800 text-xs font-sans font-medium outline-none placeholder-zinc-400"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') executeAiQuery();
                }}
              />
              <button
                onClick={() => executeAiQuery()}
                disabled={aiLoading || !aiPrompt.trim()}
                className="bg-zinc-900 hover:bg-zinc-850 text-white disabled:bg-zinc-200 disabled:text-zinc-400 font-semibold px-4 h-8 rounded-xl text-xs transition shrink-0 cursor-pointer"
              >
                {aiLoading ? 'Synthesizing...' : 'Run'}
              </button>
            </div>

            {/* AI Response section styled with premium Cupertino card margins */}
            {aiResponse && (
              <div className="bg-zinc-50/70 rounded-2xl border border-zinc-200/60 p-5 space-y-3 animate-fade-in relative">
                <div className="flex items-center justify-between border-b border-zinc-200 pb-2.5">
                  <div className="flex items-center space-x-1.5">
                    <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full" />
                    <span className="text-[10px] font-mono tracking-wider font-semibold text-zinc-500 uppercase">ACTIVE ADVISORY SHEET</span>
                  </div>
                  <button 
                    onClick={() => {
                      setAiResponse(null);
                      setActiveChip('');
                    }}
                    className="p-1 text-zinc-450 hover:text-zinc-800 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-zinc-700 leading-relaxed font-serif text-[13px] whitespace-pre-wrap select-text">
                  {aiResponse}
                </div>
              </div>
            )}
          </div>

          {/* Right: Live Telemetry stream styled as a premium Apple Live Activity widget */}
          <div className="bg-white rounded-[28px] border border-zinc-200 p-6 flex flex-col justify-between space-y-6 shadow-xs h-full min-h-[350px]">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="relative flex h-2 w-2">
                    {streamPlaying && (
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                    )}
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-555" />
                  </span>
                  <h3 className="text-[11px] font-mono tracking-wider text-zinc-800 uppercase font-semibold">Forum Activity</h3>
                </div>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => setStreamPlaying(!streamPlaying)}
                    className="p-1 rounded-lg hover:bg-zinc-100 text-zinc-450 transition cursor-pointer"
                    title={streamPlaying ? 'Pause live stream log' : 'Resume live stream log'}
                  >
                    {streamPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={addNewEvent}
                    className="p-1 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 transition cursor-pointer"
                    title="Insert simulated active seminar event"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-[12px] text-zinc-500 leading-relaxed font-normal">
                Verifying real-time breakout discussions and grading logs on key student masteries.
              </p>

              {/* Minimalist iOS activity category tabs */}
              <div className="flex gap-1 border-b border-zinc-100 pb-2">
                {(['all', 'breakout', 'grading', 'system'] as const).map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSelectedFeedFilter(tag)}
                    className={`px-2.5 py-1 rounded-full text-[9px] font-mono font-semibold tracking-wider uppercase border transition ${
                      selectedFeedFilter === tag
                        ? 'bg-zinc-900 border-zinc-900 text-white'
                        : 'bg-zinc-50 border-zinc-150 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>

              {/* Stream Logs */}
              <div className="space-y-3 overflow-y-auto max-h-[220px] pr-1 scrollbar-thin">
                {selectFilters.map((ev) => {
                  const EvIcon = ev.icon;
                  return (
                    <div key={ev.id} className="flex gap-3 text-xs p-2.5 rounded-xl border border-zinc-100 bg-zinc-50/40 hover:bg-zinc-50/90 transition duration-150">
                      <div className="p-1.5 rounded-lg bg-white border border-zinc-200 text-zinc-700 h-max shrink-0">
                        <EvIcon className="w-3.5 h-3.5" />
                      </div>
                      <div className="space-y-0.5 min-w-0 flex-1">
                        <div className="flex items-center justify-between text-[9px] font-mono text-zinc-400 font-semibold tracking-wider">
                          <span>{ev.category}</span>
                          <span>{ev.time}</span>
                        </div>
                        <p className="text-zinc-600 font-medium leading-relaxed font-sans text-[11.5px] truncate-2-lines">
                          {ev.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-2 border-t border-zinc-200/80 flex items-center justify-between text-[9px] font-mono text-zinc-400">
              <span>ACTIVE TERM SYLLABUS: RUNNING</span>
              <span>PORT INDEX: Local</span>
            </div>
          </div>

        </div>

        {/* 4. INTEGRATED MODULE CARDS PORTALS WITH LOCK DECORATIONS */}
        <div className="space-y-6">
          <div className="flex items-baseline justify-between border-b border-zinc-200 pb-3">
            <h3 className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase font-semibold">
              Integrated School Modules
            </h3>
            <span className="text-[10px] font-medium text-zinc-500 bg-white border border-zinc-200 px-2 py-0.5 rounded-full">
              Dynamic Access Controlled Gateways
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* 1. Live Seminar Classroom */}
            <div 
              onClick={() => onNavigate('seminar-classroom')}
              className="bg-white border border-zinc-200 rounded-[24px] p-6 hover:border-orange-500 shadow-xs hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition duration-200 cursor-pointer flex flex-col justify-between group h-[220px]"
            >
              <div className="space-y-3.5">
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-orange-50 border border-orange-100 text-orange-600 flex items-center justify-center transition duration-200 shadow-xs">
                    <Presentation className="w-5 h-5" />
                  </div>
                  <span className={`text-[9px] font-mono font-semibold px-2.5 py-0.5 rounded-full border tracking-wide ${getModuleAccessState('seminar-classroom').color}`}>
                    {getModuleAccessState('seminar-classroom').label}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-[13.5px] font-semibold text-zinc-800 tracking-wide">
                      Seminar Classroom
                    </h4>
                    <span className="bg-red-50 text-red-650 text-[8px] font-bold font-mono px-1.5 py-0.2 rounded-full border border-red-100 animate-pulse">LIVE</span>
                  </div>
                  <p className="text-[11.5px] text-zinc-500 leading-normal font-sans font-medium line-clamp-3">
                    Step inside active learning seminars. View student audio share levels, post poll queries, and logs speaker records.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] font-semibold text-zinc-900 pt-3 border-t border-zinc-100">
                <span>Enter Seminar Classroom</span>
                <ArrowRight className="w-4 h-4 text-zinc-650 group-hover:translate-x-1 transition duration-150" />
              </div>
            </div>

            {/* 2. Courses Curriculum Catalog */}
            <div 
              onClick={() => onNavigate('courses')}
              className="bg-white border border-zinc-200 rounded-[24px] p-6 hover:border-zinc-800 shadow-xs hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition duration-200 cursor-pointer flex flex-col justify-between group h-[220px]"
            >
              <div className="space-y-3.5">
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-zinc-50 border border-zinc-150 text-zinc-700 flex items-center justify-center transition duration-200 shadow-xs">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <span className={`text-[9px] font-mono font-semibold px-2.5 py-0.5 rounded-full border tracking-wide ${getModuleAccessState('courses').color}`}>
                    {getModuleAccessState('courses').label}
                  </span>
                </div>

                <div className="space-y-1">
                  <h4 className="text-[13.5px] font-semibold text-zinc-800 tracking-wide">
                    Courses Catalog
                  </h4>
                  <p className="text-[11.5px] text-zinc-500 leading-normal font-sans font-medium line-clamp-3">
                    Examine full-term syllabuses, map index masteries, and compile active lesson plans dynamically.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] font-semibold text-zinc-900 pt-3 border-t border-zinc-100">
                <span>Browse Syllabus Records</span>
                <ArrowRight className="w-4 h-4 text-zinc-650 group-hover:translate-x-1 transition duration-150" />
              </div>
            </div>

            {/* 3. Syllabus Course Builder */}
            <div 
              onClick={() => {
                if (allowedTabs.includes('course-builder')) onNavigate('course-builder');
              }}
              className={`border rounded-[24px] p-6 shadow-xs flex flex-col justify-between h-[220px] transition ${
                allowedTabs.includes('course-builder') 
                  ? 'bg-white border-zinc-200 hover:border-zinc-805 hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] cursor-pointer group' 
                  : 'bg-zinc-50/50 border-zinc-200/50 opacity-60 cursor-not-allowed select-none'
              }`}
            >
              <div className="space-y-3.5">
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-zinc-50 border border-zinc-150 text-zinc-500 flex items-center justify-center shadow-xs">
                    <Layout className="w-5 h-5" />
                  </div>
                  <span className={`text-[9.5px] font-mono font-semibold px-2.5 py-0.5 rounded-full border tracking-wide flex items-center gap-1 ${getModuleAccessState('course-builder').color}`}>
                    {!allowedTabs.includes('course-builder') && <Lock className="w-3 h-3 text-zinc-400" />}
                    {getModuleAccessState('course-builder').label}
                  </span>
                </div>

                <div className="space-y-1">
                  <h4 className="text-[13.5px] font-semibold text-zinc-800 tracking-wide">
                    Course Builder
                  </h4>
                  <p className="text-[11.5px] text-zinc-500 leading-normal font-sans font-medium line-clamp-3">
                    Syllabus outlines composer, dynamic active learning breakout schedules, and adaptive prompts synthesis.
                  </p>
                </div>
              </div>

              <div className={`flex items-center justify-between text-[11px] font-semibold pt-3 border-t border-zinc-100 ${
                allowedTabs.includes('course-builder') ? 'text-zinc-900' : 'text-zinc-400'
              }`}>
                <span>{allowedTabs.includes('course-builder') ? 'Open Outline Editor' : 'Access Restricted'}</span>
                <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:translate-x-1 transition duration-150" />
              </div>
            </div>

            {/* 4. Active Grading Sections */}
            <div 
              onClick={() => {
                if (allowedTabs.includes('grading-sections')) onNavigate('grading-sections');
              }}
              className={`border rounded-[24px] p-6 shadow-xs flex flex-col justify-between h-[220px] transition ${
                allowedTabs.includes('grading-sections') 
                  ? 'bg-white border-zinc-200 hover:border-zinc-805 hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] cursor-pointer group' 
                  : 'bg-zinc-50/50 border-zinc-200/50 opacity-60 cursor-not-allowed select-none'
              }`}
            >
              <div className="space-y-3.5">
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-zinc-50 border border-zinc-150 text-zinc-500 flex items-center justify-center shadow-xs">
                    <Layers className="w-5 h-5" />
                  </div>
                  <span className={`text-[9.5px] font-mono font-semibold px-2.5 py-0.5 rounded-full border tracking-wide flex items-center gap-1 ${getModuleAccessState('grading-sections').color}`}>
                    {!allowedTabs.includes('grading-sections') && <Lock className="w-3 h-3 text-zinc-400" />}
                    {getModuleAccessState('grading-sections').label}
                  </span>
                </div>

                <div className="space-y-1">
                  <h4 className="text-[13.5px] font-semibold text-zinc-800 tracking-wide">
                    Grading Queue & Sections
                  </h4>
                  <p className="text-[11.5px] text-zinc-500 leading-normal font-sans font-medium line-clamp-3">
                    Review incoming student transcript portfolios, apply continuous grades, and output coach advice.
                  </p>
                </div>
              </div>

              <div className={`flex items-center justify-between text-[11px] font-semibold pt-3 border-t border-zinc-100 ${
                allowedTabs.includes('grading-sections') ? 'text-zinc-900' : 'text-zinc-400'
              }`}>
                <span>{allowedTabs.includes('grading-sections') ? 'Grade Portfolios' : 'Access Restricted'}</span>
                <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:translate-x-1 transition duration-150" />
              </div>
            </div>

            {/* 5. Blueprints / Checklist Planner */}
            <div 
              onClick={() => {
                if (allowedTabs.includes('grading-advisees')) onNavigate('grading-advisees');
              }}
              className={`border rounded-[24px] p-6 shadow-xs flex flex-col justify-between h-[220px] transition ${
                allowedTabs.includes('grading-advisees') 
                  ? 'bg-white border-zinc-200 hover:border-indigo-505 hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] cursor-pointer group' 
                  : 'bg-zinc-50/50 border-zinc-200/50 opacity-60 cursor-not-allowed select-none'
              }`}
            >
              <div className="space-y-3.5">
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-zinc-50 border border-zinc-150 text-zinc-500 flex items-center justify-center shadow-xs">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <span className={`text-[9.5px] font-mono font-semibold px-2.5 py-0.5 rounded-full border tracking-wide flex items-center gap-1 ${getModuleAccessState('grading-advisees').color}`}>
                    {!allowedTabs.includes('grading-advisees') && <Lock className="w-3 h-3 text-zinc-400" />}
                    {getModuleAccessState('grading-advisees').label}
                  </span>
                </div>

                <div className="space-y-1">
                  <h4 className="text-[13.5px] font-semibold text-zinc-800 tracking-wide">
                    {role === 'student' ? 'My Progress Blueprint' : 'Advisees Scheduler'}
                  </h4>
                  <p className="text-[11.5px] text-zinc-500 leading-normal font-sans font-medium line-clamp-3">
                    Track academic credit formulas, certify graduation checklist conditions, and preview course sequences of scholars.
                  </p>
                </div>
              </div>

              <div className={`flex items-center justify-between text-[11px] font-semibold pt-3 border-t border-zinc-100 ${
                allowedTabs.includes('grading-advisees') ? 'text-zinc-900 group-hover:text-indigo-600' : 'text-zinc-400'
              }`}>
                <span>{allowedTabs.includes('grading-advisees') ? 'Open Progress Sheet' : 'Access Restricted'}</span>
                <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:translate-x-1 transition duration-150" />
              </div>
            </div>

            {/* 6. AI Academic Tutor Utility */}
            <div 
              onClick={() => {
                if (allowedTabs.includes('ai-tutor')) onNavigate('ai-tutor');
              }}
              className={`border rounded-[24px] p-6 shadow-xs flex flex-col justify-between h-[220px] transition ${
                allowedTabs.includes('ai-tutor') 
                  ? 'bg-white border-zinc-200 hover:border-zinc-805 hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] cursor-pointer group' 
                  : 'bg-zinc-50/50 border-zinc-200/50 opacity-60 cursor-not-allowed select-none'
              }`}
            >
              <div className="space-y-3.5">
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-zinc-50 border border-zinc-150 text-zinc-500 flex items-center justify-center shadow-xs">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <span className={`text-[9.5px] font-mono font-semibold px-2.5 py-0.5 rounded-full border tracking-wide flex items-center gap-1 ${getModuleAccessState('ai-tutor').color}`}>
                    {!allowedTabs.includes('ai-tutor') && <Lock className="w-3 h-3 text-zinc-400" />}
                    {getModuleAccessState('ai-tutor').label}
                  </span>
                </div>

                <div className="space-y-1">
                  <h4 className="text-[13.5px] font-semibold text-zinc-800 tracking-wide">
                    AI Advisor Core
                  </h4>
                  <p className="text-[11.5px] text-zinc-500 leading-normal font-sans font-medium line-clamp-3">
                    Connect directly to Gemini deep study tutor. Get dynamic adaptive explanations on Habits of Mind (#gapanalysis, #guesstimate etc).
                  </p>
                </div>
              </div>

              <div className={`flex items-center justify-between text-[11px] font-semibold pt-3 border-t border-zinc-100 ${
                allowedTabs.includes('ai-tutor') ? 'text-zinc-900 group-hover:text-indigo-600' : 'text-zinc-400'
              }`}>
                <span>{allowedTabs.includes('ai-tutor') ? 'Access Interactive AI Tutor' : 'Access Restricted'}</span>
                <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:translate-x-1 transition duration-150" />
              </div>
            </div>

          </div>
        </div>

        {/* 5. SOLEMN EPILOGUE FOOTER (Refinement) */}
        <div className="pt-8 border-t border-zinc-200 text-center text-[10px] font-mono tracking-widest text-zinc-450 uppercase space-y-1 select-none">
          <div>ARTEMIS FORUM • BUILT WITH COPULATIVE ACADEMIC SINCERITY</div>
          <div className="text-[9px] lowercase font-light text-zinc-400 tracking-normal">&copy; 2026 Artemis Academic Systems. All privileges reserved.</div>
        </div>

      </div>

    </div>
  );
}
