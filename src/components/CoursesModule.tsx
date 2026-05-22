import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  ExternalLink, 
  Play, 
  Grid, 
  Layers, 
  Users, 
  Calendar, 
  TrendingUp, 
  Sliders, 
  Award,
  Book,
  FileText,
  BadgeAlert,
  GraduationCap
} from 'lucide-react';

interface Course {
  id: string;
  code: string;
  title: string;
  description: string;
  professor: string;
  schedule: string;
  location: string;
  enrolled: number;
  status: 'active' | 'upcoming' | 'past' | 'visiting' | 'assisting';
  syllabus: {
    unit: string;
    weeks: string[];
    objectives: string[];
    hcsMapped: string[];
  };
}

const COURSES_DATA: Course[] = [
  {
    id: 'ss110',
    code: 'SS110',
    title: 'Sensation, Systems & Social Perception',
    description: 'Deconstruct complex neuro-social pathways. Examine how individuals receive sensory sensory telemetry, formulate perceptual judgments, and build standard interactive community systems.',
    professor: 'Prof. Freeman',
    schedule: 'MW @ 17:00',
    location: 'London',
    enrolled: 48,
    status: 'active',
    syllabus: {
      unit: 'Unit 2: Neurological Signaling to Cultural Metaphors',
      weeks: [
        'Session 2.1: Sensation vs Perception (#analogies, #breakitdown)',
        'Session 2.2: Systematic Cognitive Biases (#constraints, #observation)',
        'Session 2.3: Collective Action Problems in Social Hierarchies'
      ],
      objectives: [
        'Validate dual-stream neuro-sensory hypotheses.',
        'Contrast immediate sensory limits with long-term cultural systems.',
        'Formulate causal-feedback loops for media propaganda vectors.'
      ],
      hcsMapped: ['#analogies', '#breakitdown', '#constraints', '#observation', '#modeling']
    }
  },
  {
    id: 'ns111',
    code: 'NS111',
    title: 'Empirical Physics & Cosmos Modeling',
    description: 'Investigate biological, chemical, and physical structures of matter from subatomic configurations to orbital galaxy systems using computational models.',
    professor: 'Prof. Freeman',
    schedule: 'MW @ 09:00',
    location: 'Seoul',
    enrolled: 32,
    status: 'active',
    syllabus: {
      unit: 'Unit 1: Quantum Kinematics to Macro Structures',
      weeks: [
        'Session 1.1: Quantum Spacing & Particle Distribution',
        'Session 1.2: Seeing Distant Matter: Wave-Particle Duality',
        'Session 2.1: Thermodynamics of Closed Planetary Systems'
      ],
      objectives: [
        'Determine baseline entropy changes in molecular structures.',
        'Apply #dataviz to present multivariate kinetic energy levels.',
        'Simulate thermal oxidation rates under atmospheric density variations.'
      ],
      hcsMapped: ['#variables', '#dataviz', '#descriptivestats', '#modeling', '#testability']
    }
  },
  {
    id: 'il181',
    code: 'IL181',
    title: 'Global Commerce, Governance & Treaties',
    description: 'An empirical examination of cross-border financial systems, macro economy constraints, historical currency peg systems, and diplomatic negotiation theory.',
    professor: 'Prof. Freeman',
    schedule: 'Mon @ 17:00',
    location: 'London',
    enrolled: 55,
    status: 'active',
    syllabus: {
      unit: 'Unit 4: Post-WWII Multilateral Trade Agreements',
      weeks: [
        'Session 4.1: Game-theoretic models of tariff strategies',
        'Session 4.2: Sovereign Debt Default Crises',
        'Session 4.3: International Climate Accords Strategy'
      ],
      objectives: [
        'Analyze game theoretic strategies with moral hazard offsets.',
        'Contrast quantitative loan ratios against historical default milestones.',
        'Establish carrot-and-stick diplomatic leverage frameworks.'
      ],
      hcsMapped: ['#analogies', '#constraints', '#gapanalysis', '#critique']
    }
  },
  {
    id: 'ns166',
    code: 'NS166',
    title: 'Biochemistry of Synaptic Transmission',
    description: 'Examine detailed protein synthesis channels inside synaptic gaps, neural receptors, neurotransmitter breakdown, and pharmaceutical drug interference vectors.',
    professor: 'Prof. Freeman',
    schedule: 'TTh @ 17:00',
    location: 'London',
    enrolled: 19,
    status: 'active',
    syllabus: {
      unit: 'Unit 3: Synaptic Cleavage & Molecule Breakdown',
      weeks: [
        'Session 3.1: Receptor Potential Kinetics',
        'Session 3.2: Acetylcholinesterase Speeds',
        'Session 3.3: Cognitive Enhancement Biomarkers'
      ],
      objectives: [
        'Track chemical cleavage speeds under temperature variables.',
        'Apply #hypothesisdriven testing layouts for receptor blockages.'
      ],
      hcsMapped: ['#variables', '#hypothesisdriven', '#theorytesting']
    }
  },
  {
    id: 'ah110',
    code: 'AH110',
    title: 'Comparative Historical Revolutions',
    description: 'Deep historiography exploring geopolitical causality patterns of major historical state collapses, and post-crisis system re-engineering.',
    professor: 'Dr. Genone',
    schedule: 'TTh @ 11:00',
    location: 'San Francisco',
    enrolled: 40,
    status: 'upcoming',
    syllabus: {
      unit: 'Unit 1: The Historiography of Systemic Insurrections',
      weeks: [
        'Session 1.1: Bread Shortages & Agrarian Distress Factors',
        'Session 1.2: Intellectual Cabals & Pamphlet Propaganda Networks'
      ],
      objectives: [
        'Isolate structural triggers from rhetorical triggers.',
        'Trace circulation velocity spikes of revolutionary brochures.'
      ],
      hcsMapped: ['#critique', '#breakitdown', '#epistemology']
    }
  }
];

interface CoursesModuleProps {
  onEnterLiveClassroom: () => void;
  onSelectCourse?: (courseCode: string) => void;
}

export default function CoursesModule({ onEnterLiveClassroom, onSelectCourse }: CoursesModuleProps) {
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'upcoming' | 'past'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState<string>('ss110');
  const [registeredCourseIds, setRegisteredCourseIds] = useState<string[]>(['ss110']);

  const filteredCourses = COURSES_DATA.filter(course => {
    const matchesFilter = activeFilter === 'all' || course.status === activeFilter;
    const matchesSearch = 
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const selectedCourse = COURSES_DATA.find(c => c.id === selectedCourseId) || COURSES_DATA[0];
  const isRegistered = registeredCourseIds.includes(selectedCourse.id);

  return (
    <div id="courses-module-root" className="flex flex-col lg:flex-row h-full w-full overflow-y-auto lg:overflow-hidden bg-[#F3F4F6] text-[#334155] font-sans">
      
      {/* LEFT PANEL: LIST OF COURSES */}
      <div id="courses-list-panel" className="w-full lg:w-96 flex flex-col border-b lg:border-b-0 lg:border-r border-slate-300 bg-[#EBEFF5] shrink-0 h-auto lg:h-full">
        
        {/* HEADER */}
        <div className="p-5 border-b border-slate-300">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold tracking-widest text-slate-800 uppercase font-mono">
              Course Catalog
            </h2>
            <span className="text-[10px] font-mono font-bold text-orange-600 bg-orange-100/60 px-2.5 py-0.5 rounded border border-orange-200">
              ARTEMIS KGI
            </span>
          </div>
          
          {/* SEARCH BAR */}
          <div className="relative mt-4">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Filter course title or code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white text-slate-800 border border-slate-300 rounded-lg text-xs font-semibold placeholder-slate-400 focus:outline-none focus:border-orange-500 transition"
            />
          </div>

          {/* FILTER PILLS */}
          <div className="flex gap-1.5 mt-3.5 select-none">
            {(['all', 'active', 'upcoming', 'past'] as const).map(f => (
              <button
                key={f}
                id={`course-filter-${f}`}
                onClick={() => setActiveFilter(f)}
                className={`px-3 py-1 rounded text-[10px] uppercase font-mono tracking-wider transition font-bold border ${
                  activeFilter === f
                    ? 'bg-orange-500/10 border-orange-500/40 text-orange-700 font-bold'
                    : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* LIST */}
        <div className="flex-grow overflow-y-auto p-4 space-y-3 scrollbar-thin">
          {filteredCourses.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs font-mono">
              No courses match query parameters.
            </div>
          ) : (
            filteredCourses.map(course => (
              <button
                key={course.id}
                id={`course-card-${course.id}`}
                onClick={() => {
                  setSelectedCourseId(course.id);
                  if (onSelectCourse) onSelectCourse(course.code);
                }}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex flex-col justify-between ${
                  selectedCourseId === course.id
                    ? 'bg-white border-orange-500 ring-1 ring-orange-500/20 shadow-md'
                    : 'bg-white border-slate-200 hover:border-slate-350 shadow-xs hover:shadow transition duration-150'
                }`}
              >
                <div className="w-full">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono tracking-widest font-extrabold text-[#EA580C] uppercase">
                      {course.code}
                    </span>
                    {course.id === 'ss110' && (
                      <span className="bg-red-50 border border-red-200 px-1.5 py-0.2 rounded text-[7.5px] text-red-600 font-mono font-bold animate-pulse uppercase">
                        Active Class
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-xs font-bold font-serif text-slate-800 tracking-tight mt-1.5 line-clamp-1 leading-normal">
                    {course.title}
                  </h3>
                  
                  <p className="text-[10.5px] text-slate-500 font-sans mt-1.5 font-medium line-clamp-2 leading-relaxed">
                    {course.description}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-slate-150 pt-3 mt-3 font-mono text-[9px] text-slate-400 font-bold">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-[#334155] shrink-0 opacity-60" />
                    <span>{course.schedule}</span>
                  </span>
                  <span className="font-bold text-slate-500 uppercase">
                    {course.location}
                  </span>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* RIGHT PANEL: MAIN COURSE DETAILS */}
      <div id="course-details-panel" className="flex-1 flex flex-col bg-[#F3F4F6] h-auto lg:h-full lg:overflow-hidden">
        
        {/* DYNAMIC BACKDROP BANNER */}
        <div className="p-6 md:p-8 bg-[#111827] border-b border-slate-350 shrink-0 relative overflow-hidden">
          {/* Banner ocean waves gradient simulation */}
          <div className="absolute inset-0 bg-gradient-to-r from-teal-900/60 via-blue-900/70 to-slate-900/80 pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-500/20 via-transparent to-transparent opacity-60 pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
            <div className="space-y-2">
              <div className="flex items-center space-x-2.5">
                <span className="bg-orange-600 text-white text-[9.5px] font-mono font-bold tracking-widest px-2.5 py-0.5 rounded">
                  {selectedCourse.code}
                </span>
                <span className="text-sky-200/85 font-mono text-[10.5px]">| Enrolled: {selectedCourse.enrolled} Artemis Scholars</span>
              </div>
              
              <h1 className="text-xl md:text-2xl font-serif text-white tracking-tight font-bold">
                {selectedCourse.title}
              </h1>
              
              <div className="text-[11px] text-sky-100/75 font-sans font-medium">
                Syllabus managed under <span className="text-white font-semibold">{selectedCourse.professor}</span> &bull; Regional Rotational Hub: <span className="text-orange-400 font-mono font-bold uppercase">{selectedCourse.location}</span>
              </div>
            </div>

            <div className="flex gap-3">
              {isRegistered ? (
                selectedCourse.id === 'ss110' ? (
                  <button
                    id="launch-classroom-btn"
                    onClick={onEnterLiveClassroom}
                    className="bg-orange-600 hover:bg-orange-500 text-white px-5 py-2.5 rounded-xl font-bold font-sans text-xs tracking-wide flex items-center space-x-2 transition shadow-lg shadow-orange-950/20 shrink-0 active:scale-98 cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-current shrink-0" />
                    <span>Launch {selectedCourse.code} Seminar Forum</span>
                  </button>
                ) : (
                  <button
                    disabled
                    className="bg-white/10 text-slate-300 px-5 py-2.5 rounded-xl font-bold font-sans text-xs tracking-wide flex items-center space-x-2 shrink-0 select-none border border-white/20"
                  >
                    <span>Session Is Scheduling</span>
                  </button>
                )
              ) : (
                <button
                  onClick={() => setRegisteredCourseIds(prev => [...prev, selectedCourse.id])}
                  className="bg-sky-600 hover:bg-sky-500 text-white px-5 py-2.5 rounded-xl font-bold font-sans text-xs tracking-wide flex items-center space-x-2 transition shadow-lg shadow-sky-900/20 shrink-0 active:scale-98 cursor-pointer"
                >
                  <BookOpen className="w-4 h-4 shrink-0" />
                  <span>Register for {selectedCourse.code}</span>
                </button>
              )}
              {isRegistered && selectedCourse.id !== 'ss110' && (
                <button
                  onClick={() => setRegisteredCourseIds(prev => prev.filter(id => id !== selectedCourse.id))}
                  className="bg-slate-800 hover:bg-slate-700 text-white px-5 py-2.5 rounded-xl font-bold font-sans text-xs tracking-wide flex items-center space-x-2 transition active:scale-98 cursor-pointer border border-slate-700"
                >
                  <span>Drop Course</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* DETAILS PANELS */}
        <div className="flex-grow overflow-y-auto p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 scrollbar-thin">
          
          {/* SYLLABUS, OBJECTIVES, WEEKS */}
          <div className="space-y-6">
            
            {/* ACTIVE UNIT FOCUS */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3 shadow-xs">
              <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Layers className="w-4 h-4 text-orange-500" />
                <span>Current Curricular Module</span>
              </h3>
              <p className="text-sm font-bold text-slate-800 font-sans mt-2">
                {selectedCourse.syllabus.unit}
              </p>
              <p className="text-[11px] text-slate-500 leading-relaxed font-sans font-medium pt-1">
                This unit unifies foundational learning outcomes with rigorous empirical methodologies and case-studies. Every session has mandatory readings, pre-polls, and debate layouts.
              </p>
            </div>

            {/* LEARNING OBJECTIVES */}
            <div className="space-y-3.5">
              <h3 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest border-b border-slate-250 pb-2">
                Learning Objectives (LOs)
              </h3>
              <ul className="space-y-2.5 font-sans text-xs font-medium">
                {selectedCourse.syllabus.objectives.map((obj, i) => (
                  <li key={i} className="flex items-start gap-2.5 bg-white p-3 rounded-lg border border-slate-205 border-slate-200 shadow-xs">
                    <span className="w-5 h-5 rounded bg-orange-50 text-orange-600 border border-orange-200 text-[10px] flex items-center justify-center font-mono font-bold shrink-0 mt-0.5">
                      0{i+1}
                    </span>
                    <span className="text-slate-650 leading-normal font-sans font-medium">{obj}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CLASS COMPONENT MATRIX ARCHITECTURE CHART */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs">
              <h3 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
                Session Roster Statistics
              </h3>
              
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-center">
                  <span className="block text-slate-400 text-[9px] font-mono tracking-wider uppercase">Enrolled</span>
                  <span className="block text-slate-800 text-base font-bold font-mono mt-0.5">{selectedCourse.enrolled}</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-center">
                  <span className="block text-slate-400 text-[9px] font-mono tracking-wider uppercase">Completed</span>
                  <span className="block text-orange-600 text-base font-bold font-mono mt-0.5">85%</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-center">
                  <span className="block text-slate-400 text-[9px] font-mono tracking-wider uppercase">Mean Score</span>
                  <span className="block text-emerald-600 text-base font-bold font-mono mt-0.5">3.44</span>
                </div>
              </div>
            </div>

          </div>

          {/* COURSE HCS & WEEK CHRONOLOGY */}
          <div className="space-y-6">
            
            {/* WEEKLY SESSIONS CHRONOLOGY */}
            <div className="space-y-3">
              <h3 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest border-b border-slate-250 pb-2">
                Course Syllabus Timeline
              </h3>
              
              <div className="space-y-2.5 font-mono text-[11px]">
                {selectedCourse.syllabus.weeks.map((week, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3.5 bg-white border border-slate-200 rounded-xl shadow-xs">
                    <div className="flex items-center space-x-2.5">
                      <Book className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="text-slate-750 font-sans font-medium text-xs truncate max-w-[200px] sm:max-w-xs">{week}</span>
                    </div>
                    <span className="text-[8.5px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-500">
                      WEEK {idx+1}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* MAPPED HABITS OF MIND (HCs) */}
            <div className="space-y-3">
              <h3 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest border-b border-slate-250 pb-2">
                Mapped Habits of Mind (HCs)
              </h3>
              
              <div className="flex flex-wrap gap-2 pt-2.5">
                {selectedCourse.syllabus.hcsMapped.map((hc, idx) => (
                  <span
                    key={idx}
                    className="p-2.5 bg-white border border-slate-200 text-orange-700 hover:text-orange-850 hover:border-orange-350 font-mono text-[10.5px] rounded-lg tracking-wider font-bold transition cursor-pointer shadow-xs"
                  >
                    {hc}
                  </span>
                ))}
              </div>
              
              <p className="text-[10.5px] text-slate-500 leading-normal font-sans font-medium pt-3 leading-relaxed">
                Artemis pedagogy replaces traditional exams with continuous formative feedback keyed directly to these mapped Cornerstone Habits of Mind. Faculty evaluates verbal argument submissions on 1-5 scales using context-anchored speech snippets.
              </p>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
