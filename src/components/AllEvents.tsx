import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  Search, 
  MapPin, 
  Layers, 
  ExternalLink,
  Users,
  Play,
  Bookmark,
  PlusCircle,
  Filter,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { initAuth, googleSignIn } from '../lib/auth';

interface UniversityEvent {
  id: string;
  title: string;
  courseCode?: string;
  professor: string;
  dateTime: string;
  duration: string;
  type: 'seminar' | 'grading' | 'office-hours' | 'academic-panel' | 'social';
  location: string;
  status: 'concluded' | 'active' | 'upcoming';
  mappedHCs?: string[];
  description: string;
}

const ACADEMIC_EVENTS: UniversityEvent[] = [
  {
    id: 'ev-ss110',
    title: 'SS110 Session 2.1: Sensation vs Perception',
    courseCode: 'SS110',
    professor: 'Prof. Freeman',
    dateTime: 'Today @ 17:00',
    duration: '90m',
    type: 'seminar',
    location: 'London (Virtual Floor)',
    status: 'active',
    mappedHCs: ['#analogies', '#breakitdown'],
    description: 'Core breakout seminar testing neural signaling pathways vs cultural translation metaphors. Participation logs checked live.'
  },
  {
    id: 'ev-grade-ns111',
    title: 'Grading Deadline: NS111 Empirical Solutions',
    courseCode: 'NS111',
    professor: 'Prof. Freeman',
    dateTime: 'Tomorrow @ 23:59',
    duration: 'End of Day',
    type: 'grading',
    location: 'Faculty Portal',
    status: 'upcoming',
    mappedHCs: ['#variables', '#dataviz'],
    description: 'Synthesis of constructive feedback comments for all sections on structural oxidation metrics.'
  },
  {
    id: 'ev-office-hours',
    title: 'Office Hours: Cognitive Systems Analysis',
    courseCode: 'SS110',
    professor: 'Prof. Freeman',
    dateTime: 'Friday @ 14:00',
    duration: '60m',
    type: 'office-hours',
    location: 'London Virtual Hub',
    status: 'upcoming',
    description: 'Open discussion floor addressing students questions on collective action loops and system feedback loops.'
  },
  {
    id: 'ev-panel-capstone',
    title: 'Degree Capstone Proposal Review',
    professor: 'Dr. Genone',
    dateTime: 'Friday @ 16:00',
    duration: '120m',
    type: 'academic-panel',
    location: 'San Francisco Hub 2',
    status: 'upcoming',
    mappedHCs: ['#testability', '#theorytesting'],
    description: 'Mid-term evaluation of independent study plans under double concentration rules.'
  },
  {
    id: 'ev-social-seoul',
    title: 'Artemis Global Rotational Social Mixer',
    professor: 'Dean Bader-Natal',
    dateTime: 'Saturday @ 19:30',
    duration: '180m',
    type: 'social',
    location: 'Seoul Cohort Plaza',
    status: 'upcoming',
    description: 'Collaborative cohort bonding session exploring local cultural systems and architecture.'
  },
  {
    id: 'ev-concluded-ns',
    title: 'NS111 Session 1.2: Wave-Particle Duality',
    courseCode: 'NS111',
    professor: 'Prof. Freeman',
    dateTime: 'Yesterday @ 09:00',
    duration: '90m',
    type: 'seminar',
    location: 'Seoul (Virtual Floor)',
    status: 'concluded',
    mappedHCs: ['#variables', '#testability'],
    description: 'Introductory discussion of distant stellar matter and testing setups for sensor telemetry.'
  }
];

interface AllEventsProps {
  onEnterLiveClassroom: () => void;
}

export default function AllEvents({ onEnterLiveClassroom }: AllEventsProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'seminar' | 'grading' | 'office-hours' | 'social'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeEventId, setActiveEventId] = useState<string>('ev-ss110');
  const [needsAuth, setNeedsAuth] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [reminderMinutes, setReminderMinutes] = useState(10);

  useEffect(() => {
    const unsub = initAuth(
      (user, token) => {
        setNeedsAuth(false);
        setAccessToken(token);
      },
      () => {
        setNeedsAuth(true);
        setAccessToken(null);
      }
    );
    return () => unsub();
  }, []);

  const filteredEvents = ACADEMIC_EVENTS.filter(ev => {
    const matchesTab = activeTab === 'all' || ev.type === activeTab;
    const matchesSearch = 
      ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ev.courseCode && ev.courseCode.toLowerCase().includes(searchQuery.toLowerCase())) ||
      ev.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const selectedEvent = ACADEMIC_EVENTS.find(e => e.id === activeEventId) || ACADEMIC_EVENTS[0];

  const syncEvent = async (token: string) => {
    // For realistic simulation, we place the event a few days in advance based on the string.
    const start = new Date();
    start.setDate(start.getDate() + 1);
    start.setHours(17, 0, 0, 0);
    const end = new Date(start);
    end.setMinutes(end.getMinutes() + 90);

    const eventBody: any = {
      summary: selectedEvent.title,
      description: selectedEvent.description + `\n\nCourse: ${selectedEvent.courseCode || 'N/A'}\nHost: ${selectedEvent.professor}`,
      location: selectedEvent.location,
      start: { dateTime: start.toISOString() },
      end: { dateTime: end.toISOString() },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'popup', minutes: reminderMinutes }
        ]
      }
    };

    if (!window.confirm(`Sync "${selectedEvent.title}" to your Google Calendar?`)) {
      return;
    }

    try {
      const res = await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(eventBody)
      });
      if (res.ok) {
        alert("Event synchronized to Google Calendar successfully!");
      } else {
        alert("Failed to sync to Google Calendar.");
      }
    } catch (err) {
      console.error("Sync error:", err);
      alert("Error syncing.");
    }
  };

  const handleSyncToCalendar = async () => {
    if (needsAuth) {
      try {
        const res = await googleSignIn();
        if (res) {
          syncEvent(res.accessToken);
        }
      } catch (err) {
        console.error("Login failed", err);
      }
    } else if (accessToken) {
      syncEvent(accessToken);
    }
  };

  return (
    <div id="all-events-root" className="flex flex-col lg:flex-row h-full w-full overflow-y-auto lg:overflow-hidden bg-[#F3F4F6] text-slate-750 font-sans">
      
      {/* LEFT COLUMN: EVENTS COMPREHENSIVE STREAM */}
      <div id="events-stream-panel" className="w-full lg:w-[410px] shrink-0 border-b lg:border-b-0 lg:border-r border-slate-200 bg-white flex flex-col overflow-hidden h-auto lg:h-full">
        
        {/* PANEL HEADER */}
        <div className="p-5 border-b border-slate-200/80 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold tracking-widest text-slate-800 uppercase font-mono flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-orange-500" />
              <span>University Calendar</span>
            </h2>
            <span className="text-[9px] font-mono font-bold bg-orange-50 text-orange-700 border border-orange-200 px-2 py-0.5 rounded">
              Active Term
            </span>
          </div>

          {/* SEARCH FILTERS */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search lectures, deadlines, cohorts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 text-slate-800 border border-slate-200 rounded-lg text-xs font-medium placeholder-slate-400 focus:outline-none focus:border-orange-500 transition focus:bg-white"
            />
          </div>

          {/* QUICK CHANNELS */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none select-none">
            {['all', 'seminar', 'grading', 'office-hours', 'social'].map(type => (
              <button
                key={type}
                id={`event-tab-${type}`}
                onClick={() => setActiveTab(type as any)}
                className={`px-3 py-1 rounded text-[10px] uppercase font-mono tracking-wider transition font-bold shrink-0 border ${
                  activeTab === type
                    ? 'bg-orange-500/10 border-orange-500/30 text-orange-700 font-bold'
                    : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                {type.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* LIST OF TIMELINE EVENTS */}
        <div className="flex-grow overflow-y-auto p-4 space-y-3.5 scrollbar-thin bg-slate-50/50">
          {filteredEvents.length === 0 ? (
            <div className="p-10 text-center text-slate-400 text-xs font-mono">
              No matching academic events found.
            </div>
          ) : (
            filteredEvents.map(ev => {
              const isActiveCard = activeEventId === ev.id;
              return (
                <button
                  key={ev.id}
                  id={`event-card-${ev.id}`}
                  onClick={() => setActiveEventId(ev.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                    isActiveCard
                      ? 'bg-white border-orange-500 shadow-sm relative ring-1 ring-orange-500/10'
                      : 'bg-white border-slate-250 border-slate-200 hover:bg-slate-50/80 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <span className={`text-[8.5px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${
                      ev.type === 'seminar'
                        ? 'bg-red-50 text-red-700 border-red-200/50'
                        : ev.type === 'grading'
                        ? 'bg-amber-50 text-amber-750 text-amber-700 border-amber-200/50'
                        : ev.type === 'office-hours'
                        ? 'bg-indigo-50 text-indigo-750 text-indigo-700 border-indigo-200/50'
                        : 'bg-emerald-50 text-emerald-750 text-emerald-700 border-emerald-200/50'
                    }`}>
                      {ev.type}
                    </span>
                    
                    {ev.status === 'active' && (
                      <span className="bg-red-50 border border-red-200 text-[8px] text-red-600 px-1.5 py-0.5 rounded font-mono font-bold animate-pulse">
                        LIVE NOW
                      </span>
                    )}
                  </div>

                  <h3 className={`text-xs font-bold font-serif leading-snug mt-2.5 line-clamp-1 ${
                    isActiveCard ? 'text-slate-900 font-extrabold' : 'text-slate-800'
                  }`}>
                    {ev.title}
                  </h3>

                  <p className="text-[10.5px] text-slate-500 font-sans mt-1.5 font-medium line-clamp-2 leading-relaxed">
                    {ev.description}
                  </p>

                  <div className="flex items-center justify-between border-t border-slate-100 pt-2.5 mt-3 text-[9px] font-mono text-slate-500">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>{ev.dateTime}</span>
                    </span>
                    <span className="text-slate-500 truncate max-w-[130px] text-right font-semibold">
                      {ev.location}
                    </span>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* RIGHT COLUMN: EVENT SUMMARY DETAIL VIEW */}
      <div id="event-detail-panel" className="flex-1 flex flex-col bg-slate-50/50 h-auto lg:h-full lg:overflow-hidden">
        
        {/* HERO HEADER */}
        <div className="p-6 md:p-8 bg-white border-b border-slate-200 shrink-0 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl -tr-10" />
          
          <div className="relative z-10 space-y-3">
            <div className="flex flex-wrap items-center gap-2.5">
              {selectedEvent.courseCode && (
                <span className="bg-orange-50 border border-orange-200 text-orange-700 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded">
                  {selectedEvent.courseCode}
                </span>
              )}
              <span className="text-[10px] font-mono text-slate-500">
                Duration: {selectedEvent.duration} &bull; Host: {selectedEvent.professor}
              </span>
            </div>

            <h1 className="text-lg md:text-xl font-serif text-slate-900 tracking-tight leading-snug font-bold">
              {selectedEvent.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
              <span className="flex items-center space-x-1.5">
                <Clock className="w-4 h-4 text-orange-500 shrink-0" />
                <span className="font-mono text-[11px] font-medium">{selectedEvent.dateTime} (Local Hub Time)</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="font-sans font-semibold text-slate-600">{selectedEvent.location}</span>
              </span>
            </div>
          </div>
        </div>

        {/* CONTENT PANELS */}
        <div className="flex-grow overflow-y-auto p-6 md:p-8 space-y-6 scrollbar-thin">
          
          {/* DETAILED GUIDANCE */}
          <div id="event-details-content" className="bg-white border border-slate-200 rounded-xl p-6 md:p-8 space-y-4 shadow-xs">
            <h3 className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <Bookmark className="w-3.5 h-3.5 text-orange-500" />
              <span>Event Descriptives</span>
            </h3>
            <p className="text-xs md:text-[13px] text-slate-650 text-slate-600 leading-relaxed font-sans font-medium">
              {selectedEvent.description}
            </p>
            
            {/* Conditional action parameters */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-3 justify-between">
              {selectedEvent.id === 'ev-ss110' ? (
                <>
                  <span className="text-[10.5px] text-red-600 font-mono font-bold animate-pulse">
                    &bull; This class session is running now inside the virtual arena.
                  </span>
                  <button
                    onClick={onEnterLiveClassroom}
                    className="bg-orange-600 hover:bg-orange-500 text-white px-4 py-2 rounded-lg text-xs font-bold font-sans tracking-wide flex items-center space-x-1.5 transition select-none cursor-pointer shadow-xs"
                  >
                    <Play className="w-3.5 h-3.5 fill-current shrink-0" />
                    <span>Enter Live Arena</span>
                  </button>
                </>
              ) : (
                <>
                  <span className="text-[10.5px] text-slate-500 font-mono font-medium">
                    This event is scheduled for a future time slot.
                  </span>
                </>
              )}
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg px-2.5 text-slate-700">
                  <span className="text-[9.5px] font-mono text-slate-500 whitespace-nowrap">Reminder:</span>
                  <select
                    value={reminderMinutes}
                    onChange={(e) => setReminderMinutes(Number(e.target.value))}
                    className="bg-transparent border-none outline-none text-xs text-slate-800 p-1.5 font-bold cursor-pointer"
                  >
                    <option value={10}>10 min</option>
                    <option value={30}>30 min</option>
                    <option value={60}>1 hour</option>
                    <option value={1440}>1 day</option>
                  </select>
                </div>
                <button
                  onClick={handleSyncToCalendar}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-xs font-bold font-sans tracking-wide flex items-center space-x-1.5 transition select-none cursor-pointer border border-blue-600 shadow-xs"
                >
                  <Calendar className="w-3.5 h-3.5 shrink-0" />
                  <span>{needsAuth ? "Sign in to Sync" : "Sync Calendar"}</span>
                </button>
              </div>
            </div>
          </div>

          {/* MAPPED CORE OUTCOMES */}
          {selectedEvent.mappedHCs && selectedEvent.mappedHCs.length > 0 && (
            <div className="space-y-3.5">
              <h3 className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200 pb-2">
                Core Cornerstone HCs Evaluated
              </h3>
              
              <div className="flex flex-wrap gap-2 pt-1.5">
                {selectedEvent.mappedHCs.map((hc, idx) => (
                  <span
                    key={idx}
                    className="p-2.5 bg-white border border-slate-200 text-orange-600 font-mono text-[10.5px] rounded-lg tracking-wider font-bold transition select-none hover:border-orange-500 cursor-pointer"
                  >
                    {hc}
                  </span>
                ))}
              </div>
              <p className="text-[10.5px] text-slate-500 leading-relaxed font-sans font-medium pt-2">
                Active attendance triggers continuous speech-tag scoring. Ensure your discussion comment drafts explicitly apply these designated concepts during breakout loops and forum feedback prompts.
              </p>
            </div>
          )}

          {/* SECTOR PLAN REQUIREMENTS */}
          <div className="bg-orange-500/5 border border-orange-200/50 rounded-xl p-5 space-y-3">
            <h4 className="text-[10px] font-mono text-orange-850 text-orange-700 uppercase tracking-widest font-extrabold">
              Artemis Rotational Hub Operations Warning
            </h4>
            <p className="text-[10.5px] text-slate-600 leading-relaxed font-sans font-semibold">
              Rotational global Hub events require student sync with rotational city parameters (London, Seoul, San Francisco). Any absence alert indices will report immediately to advisor advisors directory logs if self-audits fail.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
