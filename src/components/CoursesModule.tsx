import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Search, 
  Play, 
  Grid, 
  Layers, 
  Users, 
  Calendar, 
  Award,
  Book,
  FileText,
  BadgeAlert,
  GraduationCap,
  Plus,
  Trash2,
  Check,
  Edit,
  Sliders,
  Sparkles,
  HelpCircle,
  Filter,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { Course, LearningCluster } from '../types';

const INITIAL_YALE_COURSES: Course[] = [
  // --- UNIVERSITY (CLUSTER 2) ---
  {
    id: 'ss110',
    code: 'SS110',
    title: 'Sensation, Systems & Social Perception',
    description: 'Deconstruct complex neuro-social pathways. Examine how individuals receive sensory sensory telemetry, formulate perceptual judgments, and build standard interactive community systems.',
    professor: 'Prof. James Freeman',
    schedule: 'MW @ 17:00',
    location: 'London Regional Hub',
    enrolled: 48,
    status: 'active',
    cluster: 'university',
    department: 'Social Sciences',
    level: 'Intermediate',
    approvalStatus: 'approved',
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
    professor: 'Prof. James Freeman',
    schedule: 'MW @ 09:00',
    location: 'Seoul Regional Hub',
    enrolled: 32,
    status: 'active',
    cluster: 'university',
    department: 'STEM',
    level: 'Introductory',
    approvalStatus: 'approved',
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
    professor: 'Dr. Evelyn Sterling',
    schedule: 'Mon @ 17:05',
    location: 'London Regional Hub',
    enrolled: 55,
    status: 'active',
    cluster: 'university',
    department: 'Social Sciences',
    level: 'Advanced',
    approvalStatus: 'approved',
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
    id: 'cpsc201',
    code: 'CPSC 201',
    title: 'Introduction to Computer Science',
    description: 'An introduction to the intellectual enterprises of computer science and physical logic programming. Focus areas include algorithmic complexity, memory management, and binary abstractions.',
    professor: 'Prof. Evelyn Sterling',
    schedule: 'TTh @ 13:00',
    location: 'Silicon Valley Campus',
    enrolled: 120,
    status: 'upcoming',
    cluster: 'university',
    department: 'STEM',
    level: 'Introductory',
    approvalStatus: 'approved',
    syllabus: {
      unit: 'Unit 1: Algorithmic Rigor & Memory Models',
      weeks: [
        'Session 1.1: Binary Search & Complexity Analytics (#breakitdown)',
        'Session 1.2: Structs, Arrays, and Memory Offsets Layouts',
        'Session 1.3: Graph Traversal and Search Matrix Paradigms'
      ],
      objectives: [
        'Analyze temporal and spatial execution bounds recursively.',
        'Formulate memory-safe sequential data structures.'
      ],
      hcsMapped: ['#breakitdown', '#constraints', '#testability']
    }
  },
  {
    id: 'econ115',
    code: 'ECON 115',
    title: 'Introductory Microeconomics',
    description: 'Examine supply and demand curves, monopoly market failures, competitive matrix game theory, tax implementations, and collective welfare paradigms.',
    professor: 'Dr. Evelyn Sterling',
    schedule: 'MW @ 10:30',
    location: 'London Regional Hub',
    enrolled: 72,
    status: 'upcoming',
    cluster: 'university',
    department: 'Social Sciences',
    level: 'Introductory',
    approvalStatus: 'approved',
    syllabus: {
      unit: 'Unit 1: Consumer Choice Mechanics & Market Optimization',
      weeks: [
        'Session 1.1: Marginal Utility, Opportunity Cost & Resource Ratios',
        'Session 1.2: Cournot Duopolies and Perfect Nash Equilibria'
      ],
      objectives: [
        'Calculate utility indifference boundaries mathematically.',
        'Isolate negative social externalities and policy levers.'
      ],
      hcsMapped: ['#variables', '#modeling', '#decisionheuristics']
    }
  },

  // --- K12 (CLUSTER 1 - AVENUES THE WORLD SCHOOL STYLE) ---
  {
    id: 'av101',
    code: 'AV101',
    title: 'Visual Game Mechanics & Narrative Design',
    description: 'A project-driven visual introduction following the Avenues World School core blueprint. Younger scholars learn storytelling, rule creation, and interactive game board construction.',
    professor: 'Coach Alexis Vance',
    schedule: 'TTh @ 10:00',
    location: 'Online Discovery Lab',
    enrolled: 24,
    status: 'active',
    cluster: 'k12',
    department: 'Arts',
    level: 'Introductory',
    approvalStatus: 'approved',
    syllabus: {
      unit: 'Unit 1: Creative Storyboards & Action Rulebooks',
      weeks: [
        'Session 1.1: Character Arcs, Settings and Spark Prompts',
        'Session 1.2: Mechanical Boundaries: Crafting Constraints and Challenges'
      ],
      objectives: [
        'Create a fully playable 3-act quest map storyboard.',
        'Define key rules utilizing spatial constraints.'
      ],
      hcsMapped: ['#analogies', '#constraints', '#creativeheuristics']
    }
  },
  {
    id: 'av202',
    code: 'AV202',
    title: 'Biomimicry & Cardboard Engineering Models',
    description: 'Research botanical cells, honeybee hexagon space optimization, and marine hydrodynamic skin curves. Design and test scale-model wings and structural panels.',
    professor: 'Coach Alexis Vance',
    schedule: 'MW @ 13:30',
    location: 'San Francisco Hub',
    enrolled: 18,
    status: 'active',
    cluster: 'k12',
    department: 'STEM',
    level: 'Intermediate',
    approvalStatus: 'approved',
    syllabus: {
      unit: 'Unit 1: Aerodynamics of Cellular Flight',
      weeks: [
        'Session 1.1: Avian Skeletal Densities and Aspect Ratios',
        'Session 1.2: Plant Capillary Flow & Syphon Abstractions'
      ],
      objectives: [
        'Identify structural optimization triggers from biological blueprints.',
        'Build cardboard scales capable of proportional structural tension.'
      ],
      hcsMapped: ['#observation', '#modeling', '#creativeheuristics']
    }
  },
  {
    id: 'av250',
    code: 'AV250',
    title: 'Systems & Playable Civilizations Map',
    description: 'A cooperative simulation game where young thinkers research transit systems, clean energy grids, and resource pipelines, designing blueprints for resilient cities.',
    professor: 'Dean Gregory Hunt',
    schedule: 'Friday @ 14:00',
    location: 'Global Online Lab',
    enrolled: 15,
    status: 'upcoming',
    cluster: 'k12',
    department: 'Social Sciences',
    level: 'Intermediate',
    approvalStatus: 'approved',
    syllabus: {
      unit: 'Unit 2: Interconnected Carbon Circuits & Recycling Loop',
      weeks: [
        'Session 2.1: Municipal Solid Waste Flow pipelines',
        'Session 2.2: Supply and Demand Loops in Smart Grids simulation'
      ],
      objectives: [
        'Draft causal flow diagrams representing community systems.',
        'Express resource allocation gaps using #breakitdown.'
      ],
      hcsMapped: ['#breakitdown', '#modeling', '#gapanalysis']
    }
  },

  // --- SENIORS (CLUSTER 3 - IN DEVELOPMENT) ---
  {
    id: 'sr501',
    code: 'SR501',
    title: 'Active Memoir Archiving & Photographic History',
    description: 'For seniors dedicated to digital preservation. Acquire standard historical documentation techniques, scan personal archives, and edit photographic memory trails.',
    professor: 'Dr. Evelyn Sterling',
    schedule: 'TTh @ 11:15',
    location: 'Retirement Center Plaza',
    enrolled: 12,
    status: 'active',
    cluster: 'seniors',
    department: 'Humanities',
    level: 'Intermediate',
    approvalStatus: 'approved',
    syllabus: {
      unit: 'Unit 1: The Historiography of Local Memoirs',
      weeks: [
        'Session 1.1: Oral Interviews, Audio Splicing & Speech Transcription',
        'Session 1.2: Archiving Photographic Slides & Context Tagging'
      ],
      objectives: [
        'Establish validated chronologies for oral timelines.',
        'Apply metadata standards to private photographic papers.'
      ],
      hcsMapped: ['#observation', '#epistemology', '#analogies']
    }
  },
  {
    id: 'sr520',
    code: 'SR520',
    title: 'Aesthetic Structure of Orchestral Motifs',
    description: 'An interactive seminar identifying compositional motifs across historical eras. Trace Sonata-Allegro bounds from Austrian classicism to modern microtonal structures.',
    professor: 'Prof. James Freeman',
    schedule: 'MW @ 15:00',
    location: 'London Concert Hall',
    enrolled: 30,
    status: 'upcoming',
    cluster: 'seniors',
    department: 'Arts',
    level: 'Advanced',
    approvalStatus: 'approved',
    syllabus: {
      unit: 'Unit 1: The architecture of classical development',
      weeks: [
        'Session 1.1: Tonal Cadences, Shifts, and Dynamic Variations',
        'Session 1.2: Modernist Disruptions: Stravinsky and Serial Composition'
      ],
      objectives: [
        'Identify harmonic shifts aurally in real-time.',
        'Deconstruct social constraints on historic composition commissions.'
      ],
      hcsMapped: ['#epistemology', '#critique', '#analogies']
    }
  },

  // --- ADMIN PROPOSED CURATION QUEUE ---
  {
    id: 'prop1',
    code: 'NS210',
    title: 'Astrobiology & Organic Extraterrestrial Materials',
    description: 'Proposed curriculum evaluating life markers inside Saturnian moons, Martian soil profiles, and deep extrasolar spectroscopy metrics.',
    professor: 'Prof. James Freeman',
    schedule: 'TTh @ 16:30',
    location: 'Astrophysics Hub',
    enrolled: 2,
    status: 'upcoming',
    cluster: 'university',
    department: 'STEM',
    level: 'Advanced',
    approvalStatus: 'pending_approval',
    syllabus: {
      unit: 'Unit 1: Spectroscopic Methane Analysis & Biosignature Filters',
      weeks: [
        'Session 1.1: Titan Methane Sea Evaporation Rates',
        'Session 1.2: Enceladus Hydrothermal Plume Speeds'
      ],
      objectives: [
        'Characterize infrared spectroscopy peaks objectively.',
        'Contrast prebiotic biochemistry pathways with inorganic kinetics.'
      ],
      hcsMapped: ['#testability', '#hypothesisdriven', '#variables']
    }
  },
  {
    id: 'prop2',
    code: 'AH150',
    title: 'Digital Humanities & Archival Data Ethics',
    description: 'Proposed curriculum exploration on the ethical boundaries of digitizing historical indigenous letters, using algorithmic data models, and mapping ancient cartographic artifacts.',
    professor: 'Dr. Gregory Hunt',
    schedule: 'Mon @ 14:00',
    location: 'Stanford Virtual Archives',
    enrolled: 5,
    status: 'upcoming',
    cluster: 'university',
    department: 'Humanities',
    level: 'Intermediate',
    approvalStatus: 'pending_approval',
    syllabus: {
      unit: 'Unit 1: Text Corpora Cleaning & Semantic Weighting',
      weeks: [
        'Session 1.1: Mining 19th-Century Colonial Pamphlets',
        'Session 1.2: Geographical Information Systems (GIS) for Historiography'
      ],
      objectives: [
        'Deconstruct biased colonial datasets with critical heuristics.',
        'Synthesize interdisciplinary digital interactive storyboards.'
      ],
      hcsMapped: ['#epistemology', '#critique', '#observation']
    }
  }
];

interface CoursesModuleProps {
  onEnterLiveClassroom: () => void;
  onSelectCourse?: (courseCode: string) => void;
  userRole?: 'faculty' | 'student' | 'researcher' | 'admin';
  userCluster?: LearningCluster;
  setUserCluster?: (cluster: LearningCluster) => void;
}

export default function CoursesModule({ 
  onEnterLiveClassroom, 
  onSelectCourse, 
  userRole = 'faculty', 
  userCluster = 'university',
  setUserCluster
}: CoursesModuleProps) {
  
  // Real LocalStorage-backed State for the comprehensive Yale Catalog
  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem('artemis_catalog_v5');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error reading course catalog, using default:", e);
      }
    }
    return INITIAL_YALE_COURSES;
  });

  useEffect(() => {
    localStorage.setItem('artemis_catalog_v5', JSON.stringify(courses));
  }, [courses]);

  // View state filters
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'upcoming' | 'past'>('all');
  const [activeDepartment, setActiveDepartment] = useState<'all' | 'Humanities' | 'Social Sciences' | 'STEM' | 'Arts'>('all');
  const [activeLevel, setActiveLevel] = useState<'all' | 'Introductory' | 'Intermediate' | 'Advanced'>('all');
  const [selectedClusterFilter, setSelectedClusterFilter] = useState<'all' | LearningCluster>(userCluster || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Update internal cluster selection if props update
  useEffect(() => {
    if (userCluster) {
      setSelectedClusterFilter(userCluster);
    }
  }, [userCluster]);

  const [selectedCourseId, setSelectedCourseId] = useState<string>('ss110');
  const [registeredCourseIds, setRegisteredCourseIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('artemis_registered_courses');
    return saved ? JSON.parse(saved) : ['ss110'];
  });

  useEffect(() => {
    localStorage.setItem('artemis_registered_courses', JSON.stringify(registeredCourseIds));
  }, [registeredCourseIds]);

  // Admin and editing states
  const [editCourseId, setEditCourseId] = useState<string | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  
  // Admin Form States
  const [formCode, setFormCode] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formProfessor, setFormProfessor] = useState('');
  const [formSchedule, setFormSchedule] = useState('');
  const [formLocation, setFormLocation] = useState('');
  const [formDepartment, setFormDepartment] = useState<'Humanities' | 'Social Sciences' | 'STEM' | 'Arts' | 'Interdisciplinary'>('STEM');
  const [formLevel, setFormLevel] = useState<'Introductory' | 'Intermediate' | 'Advanced'>('Introductory');
  const [formCluster, setFormCluster] = useState<LearningCluster>('university');
  const [formHcs, setFormHcs] = useState('#breakitdown');
  const [formObjectives, setFormObjectives] = useState('Determine core elements of inquiry\nApply hypothesis testing logic');
  const [formWeeks, setFormWeeks] = useState('Overview in Context\nDeep Practice Session\nPeer Review Critique');

  // Load course into editor form
  const handleEditClick = (course: Course) => {
    setEditCourseId(course.id);
    setIsCreatingNew(false);
    setFormCode(course.code);
    setFormTitle(course.title);
    setFormDesc(course.description);
    setFormProfessor(course.professor);
    setFormSchedule(course.schedule);
    setFormLocation(course.location);
    setFormDepartment(course.department);
    setFormLevel(course.level);
    setFormCluster(course.cluster);
    setFormHcs(course.syllabus.hcsMapped.join(', '));
    setFormObjectives(course.syllabus.objectives.join('\n'));
    setFormWeeks(course.syllabus.weeks.join('\n'));
  };

  const handleCreateClick = () => {
    setIsCreatingNew(true);
    setEditCourseId(null);
    setFormCode('YALE 101');
    setFormTitle('Introduction to Analytical Investigation');
    setFormDesc('Deconstruct variables and draft structural causal diagrams to study complex outcomes in modern physical or historical clusters.');
    setFormProfessor('Prof. James Freeman');
    setFormSchedule('TTh @ 15:45');
    setFormLocation('London Regional Hub');
    setFormDepartment('Interdisciplinary');
    setFormLevel('Intermediate');
    setFormCluster(userCluster || 'university');
    setFormHcs('#breakitdown, #constraints, #analogies');
    setFormObjectives('Isolate independent, dependent, and confounding variables.\nSubdivide broad analytical questions into testable matrices.');
    setFormWeeks('Session 1.1: Foundations of Deconstruction\nSession 1.2: Boundary Systems & Mapping\nSession 2.1: The Critical Dialogue Core');
  };

  const saveAdminCourse = (e: React.FormEvent) => {
    e.preventDefault();
    const hcsArray = formHcs.split(',').map(s => s.trim()).filter(s => s.startsWith('#'));
    const objectivesArray = formObjectives.split('\n').map(s => s.trim()).filter(s => s.length > 0);
    const weeksArray = formWeeks.split('\n').map(s => s.trim()).filter(s => s.length > 0);

    if (isCreatingNew) {
      const newCourse: Course = {
        id: `course_${Date.now()}`,
        code: formCode,
        title: formTitle,
        description: formDesc,
        professor: formProfessor,
        schedule: formSchedule,
        location: formLocation,
        enrolled: 0,
        status: 'upcoming',
        cluster: formCluster,
        department: formDepartment === 'Interdisciplinary' ? 'STEM' : formDepartment,
        level: formLevel,
        approvalStatus: 'approved', // Admin creations are pre-approved
        syllabus: {
          unit: 'Unit 1: Core Fundamentals of Active Inquiries',
          weeks: weeksArray.length ? weeksArray : ['Session 1: Introduction Outline'],
          objectives: objectivesArray.length ? objectivesArray : ['Isolate core system components'],
          hcsMapped: hcsArray.length ? hcsArray : ['#breakitdown']
        }
      };

      setCourses(prev => [...prev, newCourse]);
      setSelectedCourseId(newCourse.id);
      setIsCreatingNew(false);
    } else if (editCourseId) {
      setCourses(prev => prev.map(c => {
        if (c.id === editCourseId) {
          return {
            ...c,
            code: formCode,
            title: formTitle,
            description: formDesc,
            professor: formProfessor,
            schedule: formSchedule,
            location: formLocation,
            cluster: formCluster,
            department: formDepartment === 'Interdisciplinary' ? 'STEM' : formDepartment,
            level: formLevel,
            syllabus: {
              ...c.syllabus,
              weeks: weeksArray.length ? weeksArray : c.syllabus.weeks,
              objectives: objectivesArray.length ? objectivesArray : c.syllabus.objectives,
              hcsMapped: hcsArray.length ? hcsArray : c.syllabus.hcsMapped
            }
          };
        }
        return c;
      }));
      setEditCourseId(null);
    }
  };

  const handleApprove = (id: string) => {
    setCourses(prev => prev.map(c => {
      if (c.id === id) {
        return { ...c, approvalStatus: 'approved' };
      }
      return c;
    }));
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to remove this course from the catalogue?")) {
      setCourses(prev => prev.filter(c => c.id !== id));
      if (selectedCourseId === id) {
        setSelectedCourseId('ss110');
      }
    }
  };

  // Yale filter function
  const filteredCourses = courses.filter(course => {
    // Basic status filter (active/upcoming/past)
    const matchesStatus = activeFilter === 'all' || course.status === activeFilter;
    
    // Cluster filter: Either match selectClusterFilter or, if 'all', match anything
    const matchesCluster = selectedClusterFilter === 'all' || course.cluster === selectedClusterFilter;
    
    // Department filter
    const matchesDept = activeDepartment === 'all' || course.department === activeDepartment;

    // Level Filter
    const matchesLevel = activeLevel === 'all' || course.level === activeLevel;

    // Search query
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      course.title.toLowerCase().includes(query) ||
      course.code.toLowerCase().includes(query) ||
      course.description.toLowerCase().includes(query) ||
      course.professor.toLowerCase().includes(query) ||
      course.location.toLowerCase().includes(query);

    // Hide unapproved courses from non-admins / non-faculty
    const isSpecialPrivileged = userRole === 'admin' || userRole === 'faculty';
    const isApprovedOrAuthorized = course.approvalStatus === 'approved' || isSpecialPrivileged;

    return matchesStatus && matchesCluster && matchesDept && matchesLevel && matchesSearch && isApprovedOrAuthorized;
  });

  const selectedCourse = courses.find(c => c.id === selectedCourseId) || courses[0] || INITIAL_YALE_COURSES[0];
  const isRegistered = registeredCourseIds.includes(selectedCourse.id);

  return (
    <div id="courses-module-root" className="flex flex-col lg:flex-row h-full w-full overflow-y-auto lg:overflow-hidden bg-[#F3F4F6] text-[#334155] font-sans antialiased">
      
      {/* LEFT PANEL: ADVANCED YALE SEARCH FILTERS & INDEX */}
      <div id="courses-list-panel" className="w-full lg:w-96 flex flex-col border-b lg:border-b-0 lg:border-r border-slate-350 bg-[#EBEFF5] shrink-0 h-auto lg:h-full">
        
        {/* HEADER */}
        <div className="p-5 border-b border-slate-300">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold tracking-widest text-[#152A63] uppercase font-mono flex items-center gap-1.5">
              <BookOpen className="w-4.5 h-4.5 text-indigo-700" />
              <span>Yale Search Index</span>
            </h2>
            <div className="flex items-center space-x-1">
              {setUserCluster && (
                <select
                  value={userCluster}
                  onChange={(e) => {
                    const next = e.target.value as LearningCluster;
                    setUserCluster(next);
                    setSelectedClusterFilter(next);
                  }}
                  className="bg-zinc-800 text-white text-[9px] font-mono border border-zinc-700 rounded px-1.5 py-0.5"
                  title="Switch Cluster Boundary Preview"
                >
                  <option value="k12">Cluster 1 (K12)</option>
                  <option value="university">Cluster 2 (Univ)</option>
                  <option value="seniors">Cluster 3 (Senior)</option>
                </select>
              )}
            </div>
          </div>
          
          {/* SEARCH BAR */}
          <div className="relative mt-4">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search code, title, professor, region..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white text-slate-800 border border-slate-300 rounded-lg text-xs font-semibold placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
            />
          </div>

          {/* CLUSTER SELECTION SWITCHER */}
          <div className="mt-3.5 space-y-1">
            <label className="text-[9px] font-mono uppercase tracking-widest text-slate-500 font-bold block">
              Infinite Learning Division Filter
            </label>
            <div className="grid grid-cols-4 gap-1">
              {(['all', 'k12', 'university', 'seniors'] as const).map(c => (
                <button
                  key={c}
                  onClick={() => setSelectedClusterFilter(c)}
                  className={`py-1 rounded text-[8px] font-mono font-bold border truncate ${
                    selectedClusterFilter === c
                      ? 'bg-indigo-600 text-white border-indigo-700'
                      : 'bg-white text-slate-600 border-slate-205 hover:bg-slate-50'
                  }`}
                >
                  {c === 'all' ? 'Browse All' : c.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* ADVANCED MULTI-TIER FILTERS */}
          <div className="mt-3.5 pt-3 border-t border-slate-200 grid grid-cols-2 gap-2">
            <div>
              <label className="text-[8px] font-mono text-slate-500 uppercase tracking-widest font-extrabold block mb-1">
                Department
              </label>
              <select
                value={activeDepartment}
                onChange={(e) => setActiveDepartment(e.target.value as any)}
                className="w-full text-[10px] bg-white border border-slate-250 rounded p-1 outline-none text-slate-700 font-semibold"
              >
                <option value="all">All Fields</option>
                <option value="STEM">Science & Tech</option>
                <option value="Social Sciences">Social Sciences</option>
                <option value="Humanities">Humanities</option>
                <option value="Arts">The Arts</option>
              </select>
            </div>

            <div>
              <label className="text-[8px] font-mono text-slate-500 uppercase tracking-widest font-extrabold block mb-1">
                Course Level
              </label>
              <select
                value={activeLevel}
                onChange={(e) => setActiveLevel(e.target.value as any)}
                className="w-full text-[10px] bg-white border border-slate-250 rounded p-1 outline-none text-slate-700 font-semibold"
              >
                <option value="all">All Levels</option>
                <option value="Introductory">Intro 100-lvl</option>
                <option value="Intermediate">Intermed 200-lvl</option>
                <option value="Advanced">Advanced 300-lvl</option>
              </select>
            </div>
          </div>

          {/* ACTIVE / UPCOMING FILTERS */}
          <div className="flex gap-1 mt-3 select-none">
            {(['all', 'active', 'upcoming', 'past'] as const).map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`flex-1 text-center py-1 rounded text-[8px] uppercase font-mono tracking-wider transition font-bold border ${
                  activeFilter === f
                    ? 'bg-amber-500/10 border-amber-500/40 text-amber-700 font-bold'
                    : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* ADMIN ACTION: TRIGGER CREATION */}
          {(userRole === 'admin' || userRole === 'faculty') && (
            <button
              onClick={handleCreateClick}
              className="w-full mt-3.5 py-1.5 bg-zinc-950 hover:bg-zinc-900 border border-zinc-900 text-white rounded-lg text-[10px] font-mono font-bold uppercase tracking-widest flex items-center justify-center space-x-1.5 transition active:scale-98 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-orange-400 shrink-0" />
              <span>Draft Proposed Class</span>
            </button>
          )}

        </div>

        {/* LIST OUTLET */}
        <div className="flex-grow overflow-y-auto p-4 space-y-3 custom-scrollbar">
          
          {/* Pending Approval Headers for Admins/Faculty */}
          {(userRole === 'admin' || userRole === 'faculty') && courses.some(c => c.approvalStatus === 'pending_approval') && (
            <div className="space-y-2 mb-4 bg-orange-50 border border-orange-200.5 p-3.5 rounded-xl border border-orange-250">
              <span className="text-[8.5px] font-mono font-bold text-orange-700 uppercase tracking-widest flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Curation Proposals ({courses.filter(c => c.approvalStatus === 'pending_approval').length})</span>
              </span>
              <p className="text-[10px] font-medium text-orange-850 leading-snug">
                Review academic proposals submitted for public catalog synchronization.
              </p>
            </div>
          )}

          {filteredCourses.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs font-mono">
              No index matches. Revise search parameters.
            </div>
          ) : (
            filteredCourses.map(course => {
              const itemIsRegistered = registeredCourseIds.includes(course.id);
              const isPending = course.approvalStatus === 'pending_approval';
              return (
                <button
                  key={course.id}
                  onClick={() => {
                    setSelectedCourseId(course.id);
                    setIsCreatingNew(false);
                    setEditCourseId(null);
                    if (onSelectCourse) onSelectCourse(course.code);
                  }}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex flex-col justify-between relative ${
                    selectedCourseId === course.id
                      ? 'bg-white border-indigo-600 ring-1 ring-indigo-500/20 shadow-md'
                      : isPending 
                        ? 'bg-amber-50/60 border-amber-300 hover:border-amber-450'
                        : 'bg-white border-slate-205 hover:border-slate-350 shadow-xs hover:shadow transition duration-150'
                  }`}
                >
                  <div className="w-full">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-mono tracking-widest font-extrabold text-[#152A63] uppercase">
                        {course.code}
                      </span>
                      <div className="flex items-center space-x-1">
                        <span className={`text-[8.2px] font-bold px-1.5 py-0.2 rounded font-mono uppercase ${
                          course.cluster === 'k12' 
                            ? 'bg-emerald-50 text-emerald-750 border border-emerald-250'
                            : course.cluster === 'seniors'
                              ? 'bg-indigo-55 bg-indigo-50 border border-indigo-200 text-indigo-750'
                              : 'bg-neutral-50 border border-neutral-250 text-neutral-700'
                        }`}>
                          {course.cluster === 'k12' ? 'K12' : course.cluster === 'seniors' ? 'Senior' : 'Univ'}
                        </span>
                        {itemIsRegistered && (
                          <span className="bg-sky-50 text-sky-700 font-bold font-mono text-[7px] border border-sky-305 px-1.5 py-0.2 rounded">
                            REGISTERED
                          </span>
                        )}
                        {isPending && (
                          <span className="bg-amber-50 text-amber-800 font-bold font-mono text-[7px] border border-amber-300 px-1.5 py-0.2 rounded">
                            PROPOSAL
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <h3 className="text-xs font-serif font-bold text-slate-800 tracking-tight mt-1.5 line-clamp-1 leading-normal">
                      {course.title}
                    </h3>
                    
                    <p className="text-[10.5px] text-slate-500 font-sans mt-1.5 font-medium line-clamp-2 leading-relaxed">
                      {course.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-150 pt-3 mt-3 font-mono text-[8.5px] text-slate-400 font-bold">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-500 shrink-0" />
                      <span>{course.schedule}</span>
                    </span>
                    <span className="text-slate-550 border border-slate-200 px-1 rounded hover:bg-slate-100 transition truncate max-w-[120px]">
                      {course.location}
                    </span>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* RIGHT PANEL: MAIN CATALOG VIEW OR ADMIN ACTIONS */}
      <div id="course-details-panel" className="flex-grow flex flex-col bg-[#F3F4F6] h-auto lg:h-full lg:overflow-hidden relative">
        
        {/* UPPER TITLE HEADER AND WORKSPACE CONTROLS */}
        {(editCourseId || isCreatingNew) ? (
          /* ADMIN COURSE EDITOR VIEW */
          <div className="flex-grow p-6 md:p-10 overflow-y-auto">
            <div className="max-w-3xl mx-auto bg-white rounded-3xl p-6 md:p-8 border border-neutral-200 shadow-xl space-y-6">
              
              <div className="border-b border-slate-150 pb-4 flex items-center justify-between">
                <div>
                  <span className="text-[9.5px] font-mono font-bold uppercase text-orange-600 pb-0.5 block tracking-widest">
                    Artemis Curriculum Authority
                  </span>
                  <h2 className="text-lg md:text-xl font-serif font-bold text-slate-900 tracking-tight">
                    {isCreatingNew ? 'Publish New Course Blueprint' : `Configure Syllabus: ${formCode}`}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => { setEditCourseId(null); setIsCreatingNew(false); }}
                  className="px-3.5 py-1.5 border border-slate-250 bg-slate-50 rounded-lg text-xs font-mono font-bold cursor-pointer hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
              </div>

              <form onSubmit={saveAdminCourse} className="space-y-4 text-xs font-sans">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-mono text-[10px] text-slate-500 tracking-wider uppercase font-bold">Course Catalog Code *</label>
                    <input
                      type="text"
                      required
                      value={formCode}
                      onChange={(e) => setFormCode(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-250 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono text-xs"
                      placeholder="e.g. CPSC 201"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-mono text-[10px] text-slate-500 tracking-wider uppercase font-bold">Course Title *</label>
                    <input
                      type="text"
                      required
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-250 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      placeholder="e.g. Introductory Algorithmic Science"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-[10px] text-slate-500 tracking-wider uppercase font-bold">Curriculum Syllabus Description *</label>
                  <textarea
                    required
                    rows={3}
                    value={formDesc}
                    onChange={(e) => setFormDesc(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-250 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-700 font-medium"
                    placeholder="Provide a comprehensive academic catalog overview."
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="font-mono text-[10px] text-slate-500 tracking-wider uppercase font-bold">Authorized Professor</label>
                    <input
                      type="text"
                      value={formProfessor}
                      onChange={(e) => setFormProfessor(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-250 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-505"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-mono text-[10px] text-slate-500 tracking-wider uppercase font-bold">Rotational Hub</label>
                    <input
                      type="text"
                      value={formLocation}
                      onChange={(e) => setFormLocation(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-250 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-505 font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-mono text-[10px] text-slate-500 tracking-wider uppercase font-bold">Schedule Day/Time</label>
                    <input
                      type="text"
                      value={formSchedule}
                      onChange={(e) => setFormSchedule(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-250 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-505 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="font-mono text-[10px] text-slate-500 tracking-wider uppercase font-bold">Infinite Continuum Cluster</label>
                    <select
                      value={formCluster}
                      onChange={(e) => setFormCluster(e.target.value as LearningCluster)}
                      className="w-full p-2 bg-slate-50 border border-slate-250 rounded-lg focus:outline-none"
                    >
                      <option value="k12">Cluster 1: K-12 (Avenues)</option>
                      <option value="university">Cluster 2: University (Collegiate)</option>
                      <option value="seniors">Cluster 3: Seniors (Coming Soon)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-mono text-[10px] text-slate-500 tracking-wider uppercase font-bold">Yale Department</label>
                    <select
                      value={formDepartment}
                      onChange={(e) => setFormDepartment(e.target.value as any)}
                      className="w-full p-2 bg-slate-50 border border-slate-250 rounded-lg focus:outline-none"
                    >
                      <option value="STEM">Science & Tech (STEM)</option>
                      <option value="Social Sciences">Social Sciences</option>
                      <option value="Humanities">Humanities</option>
                      <option value="Arts">The Arts</option>
                      <option value="Interdisciplinary">Interdisciplinary</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-mono text-[10px] text-slate-500 tracking-wider uppercase font-bold">Academic Tier (Level)</label>
                    <select
                      value={formLevel}
                      onChange={(e) => setFormLevel(e.target.value as any)}
                      className="w-full p-2 bg-slate-50 border border-slate-255 rounded-lg focus:outline-none"
                    >
                      <option value="Introductory">Introductory 100-style</option>
                      <option value="Intermediate">Intermediate 200-style</option>
                      <option value="Advanced">Advanced 300-style</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-slate-150">
                  <label className="font-mono text-[10.5px] text-slate-655 tracking-wider uppercase font-extrabold block">
                    Syllabus Configuration Matrices
                  </label>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-mono text-[9px] text-slate-500 block uppercase">Mapped Cornerstone HCs (comma-separated)</label>
                      <input
                        type="text"
                        value={formHcs}
                        onChange={(e) => setFormHcs(e.target.value)}
                        className="w-full p-2 bg-slate-50 border border-slate-250 rounded-lg font-mono text-xs"
                        placeholder="e.g. #breakitdown, #constraints"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-mono text-[9px] text-slate-500 block uppercase">Weekly Sessions Chronology (one per line)</label>
                      <textarea
                        rows={2}
                        value={formWeeks}
                        onChange={(e) => setFormWeeks(e.target.value)}
                        className="w-full p-2 bg-slate-50 border border-slate-250 rounded-lg font-mono text-[10.5px]"
                        placeholder="e.g. Session 1.1: Foundations of Study"
                      />
                    </div>
                  </div>

                  <div className="space-y-1 block mt-2">
                    <label className="font-mono text-[9px] text-slate-500 block uppercase">Core Course Learning Objectives (one per line)</label>
                    <textarea
                      rows={2}
                      value={formObjectives}
                      onChange={(e) => setFormObjectives(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-250 rounded-lg font-mono text-[10.5px]"
                      placeholder="e.g. Calculate systemic oxidation curves"
                    />
                  </div>
                </div>

                <div className="flex pt-4 justify-end space-x-3 border-t border-slate-150">
                  <button
                    type="button"
                    onClick={() => { setEditCourseId(null); setIsCreatingNew(false); }}
                    className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition cursor-pointer"
                  >
                    Discard Changes
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-indigo-650 hover:bg-indigo-700 text-white font-mono font-bold uppercase tracking-wider rounded-xl transition shadow-md active:scale-98 cursor-pointer bg-indigo-700"
                  >
                    Publish Course Integration
                  </button>
                </div>
              </form>

            </div>
          </div>
        ) : (
          /* REGULAR SELECTION OR placeholder VIEW */
          <div className="h-full flex flex-col">
            
            {/* DYNAMIC BACKDROP BANNER */}
            <div className="p-6 md:p-8 bg-[#111827] border-b border-rose-950/20 shrink-0 relative overflow-hidden">
              {/* Banner ocean waves gradient simulation */}
              <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-[#1F222D]/95 to-slate-900/95 pointer-events-none" />
              <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none" />
              
              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="bg-orange-600 text-white text-[9px] font-mono font-bold tracking-widest px-2.5 py-0.5 rounded">
                      {selectedCourse.code}
                    </span>
                    <span className={`text-[9px] font-mono font-bold px-2.5 py-0.5 rounded ${
                      selectedCourse.cluster === 'k12' 
                        ? 'bg-emerald-900 border border-emerald-850 text-emerald-300'
                        : selectedCourse.cluster === 'seniors'
                          ? 'bg-indigo-900 border border-indigo-850 text-indigo-300'
                          : 'bg-zinc-800 border border-zinc-700 text-zinc-300'
                    }`}>
                      {selectedCourse.cluster === 'k12' && 'CLUSTER 1: K-12 (Avenues Model)'}
                      {selectedCourse.cluster === 'university' && 'CLUSTER 2: University Curriculum'}
                      {selectedCourse.cluster === 'seniors' && 'CLUSTER 3: Seniors (Coming Soon)'}
                    </span>
                    <span className="text-sky-200/85 font-mono text-[10.5px]">| Enrolled: {selectedCourse.enrolled} Scholars</span>
                  </div>
                  
                  <h1 className="text-xl md:text-2xl font-serif text-white tracking-tight font-bold">
                    {selectedCourse.title}
                  </h1>
                  
                  <div className="text-[11px] text-sky-100/75 font-sans font-medium">
                    Syllabus managed under <span className="text-white font-semibold">{selectedCourse.professor}</span> &bull; Regional Rotational Hub: <span className="text-orange-400 font-mono font-bold uppercase">{selectedCourse.location}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2.5 shrink-0">
                  {/* ADMIN EDIT BUTTONS */}
                  {(userRole === 'admin' || userRole === 'faculty') && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditClick(selectedCourse)}
                        className="bg-zinc-800 hover:bg-zinc-755 hover:bg-zinc-700 text-white px-3.5 py-2.5 border border-zinc-703 border-zinc-700 rounded-xl font-bold font-sans text-xs flex items-center space-x-1.5 transition active:scale-98 cursor-pointer"
                        title="Edit Syllabus Definition"
                      >
                        <Edit className="w-4.5 h-4.5 text-zinc-300 shrink-0" />
                        <span>Edit Course</span>
                      </button>

                      {courses.length > 3 && (
                        <button
                          onClick={() => handleDelete(selectedCourse.id)}
                          className="bg-red-952 bg-red-950/40 hover:bg-red-950/70 border border-red-900 text-rose-350 p-2.5 rounded-xl transition cursor-pointer"
                          title="Archive Course entry"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}

                      {selectedCourse.approvalStatus === 'pending_approval' && (
                        <button
                          onClick={() => handleApprove(selectedCourse.id)}
                          className="bg-emerald-600 hover:bg-emerald-550 text-white px-4 py-2.5 rounded-xl font-mono font-bold text-xs uppercase tracking-wide flex items-center space-x-1 transition shadow-md cursor-pointer"
                        >
                          <Check className="w-4 h-4 shrink-0" />
                          <span>Approve & Publish</span>
                        </button>
                      )}
                    </div>
                  )}

                  {/* USER REGISTRATION STATE CONTROLS */}
                  {selectedCourse.approvalStatus === 'approved' && (
                    <div className="flex gap-2.5">
                      {isRegistered ? (
                        selectedCourse.id === 'ss110' ? (
                          <button
                            id="launch-classroom-btn"
                            onClick={onEnterLiveClassroom}
                            className="bg-orange-600 hover:bg-orange-500 text-white px-5 py-2.5 rounded-xl font-bold font-sans text-xs tracking-wide flex items-center space-x-2 transition shadow-lg shadow-orange-950/20 shrink-0 active:scale-98 cursor-pointer"
                          >
                            <Play className="w-4 h-4 fill-current shrink-0" />
                            <span>Launch Live Classroom</span>
                          </button>
                        ) : (
                          <button
                            disabled
                            className="bg-white/10 text-slate-300 px-5 py-2.5 rounded-xl font-bold font-sans text-xs tracking-wide flex items-center space-x-2 shrink-0 select-none border border-white/10"
                          >
                            <span>Lesson In Scheduling</span>
                          </button>
                        )
                      ) : (
                        <button
                          onClick={() => setRegisteredCourseIds(prev => [...prev, selectedCourse.id])}
                          className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-bold font-sans text-xs tracking-wide flex items-center space-x-2 transition shadow-lg shadow-sky-900/20 shrink-0 active:scale-98 cursor-pointer bg-indigo-700"
                        >
                          <BookOpen className="w-4 h-4 shrink-0" />
                          <span>{selectedCourse.cluster === 'seniors' ? 'Register Interest in Oasis' : `Register for Class`}</span>
                        </button>
                      )}
                      
                      {isRegistered && selectedCourse.id !== 'ss110' && (
                        <button
                          onClick={() => setRegisteredCourseIds(prev => prev.filter(id => id !== selectedCourse.id))}
                          className="bg-slate-800 hover:bg-slate-705 hover:bg-slate-700 text-white px-5 py-2.5 rounded-xl font-bold font-sans text-xs tracking-wide flex items-center space-x-2 transition active:scale-98 cursor-pointer border border-slate-700"
                        >
                          <span>Drop Class</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* DETAILS PANELS OR COMING SOON SENIORS NOTICE */}
            {selectedCourse.cluster === 'seniors' ? (
              /* COMING SOON PLACEHOLDER INTEGRATION FOR SENIORS COURSES */
              <div className="flex-grow overflow-y-auto p-6 md:p-10 flex flex-col justify-center items-center text-center space-y-6">
                <div className="w-16 h-16 rounded-3xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-3xl shadow-md text-indigo-700">
                  👵👴
                </div>
                <div className="space-y-2 max-w-lg">
                  <span className="bg-indigo-100 text-indigo-800 border border-indigo-200 text-[10px] font-mono font-bold tracking-widest px-3 py-1 rounded-full uppercase">
                    Cluster 3 (Seniors Plan) • Active Mind Oasis
                  </span>
                  <h2 className="text-xl md:text-2xl font-serif font-bold text-slate-800 tracking-tight leading-snug">
                    Infinite Learning Continuum for Lifelong Scholar Seniors
                  </h2>
                  <p className="text-xs text-slate-500 leading-relaxed font-sans font-medium">
                    This high-fidelity model is currently under scheduled development. Our Seniors active program targets cognitive longevity, memoirs publication, classical orchestral appreciation, and friendly digital AI co-pilots study circles.
                  </p>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-5 max-w-md shadow-xs space-y-3">
                  <h4 className="text-xs font-mono font-bold text-slate-700 uppercase tracking-wider">
                    Seniors Early Registration Queue
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-normal">
                    Registering interest lists your scholar index on our registrar preorder directory. We will coordinate early-access invitation briefs automatically.
                  </p>
                  
                  <button
                    onClick={() => {
                      if (!isRegistered) {
                        setRegisteredCourseIds(prev => [...prev, selectedCourse.id]);
                      }
                      alert("You have joined the Cluster 3 senior early enrollment list!");
                    }}
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-650 text-white font-mono text-[9.5px] font-bold uppercase tracking-widest rounded-xl transition"
                  >
                    {isRegistered ? '✓ Joined Senior Registrant Queue' : 'Register Pre-Enrollment Interest'}
                  </button>
                </div>

                <div className="text-[10px] font-mono text-slate-400">
                  Scheduled Beta Release: October 2026 &bull; Artemis Registrar Office
                </div>
              </div>
            ) : (
              /* REGULAR INTERACTIVE COURSE LEVEL DETAILS */
              <div className="flex-grow overflow-y-auto p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 custom-scrollbar">
                
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
                    <ul className="space-y-2.5 font-sans text-xs font-medium text-slate-700">
                      {selectedCourse.syllabus.objectives.map((obj, i) => (
                        <li key={i} className="flex items-start gap-2.5 bg-white p-3 rounded-lg border border-slate-200 shadow-xs">
                          <span className="w-5 h-5 rounded bg-orange-50 text-orange-600 border border-orange-200 text-[10px] flex items-center justify-center font-mono font-bold shrink-0 mt-0.5">
                            0{i+1}
                          </span>
                          <span className="leading-normal font-sans font-medium">{obj}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* ROSTER STATISTICS OR LEVEL HIGHLIGHT */}
                  <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs">
                    <h3 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
                      Module Details & Tier Information
                    </h3>
                    
                    <div className="grid grid-cols-3 gap-3">
                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-center">
                        <span className="block text-slate-400 text-[9px] font-mono tracking-wider uppercase">Enrolled</span>
                        <span className="block text-slate-800 text-sm font-bold font-mono mt-0.5">{selectedCourse.enrolled}</span>
                      </div>
                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-center">
                        <span className="block text-slate-400 text-[9px] font-mono tracking-wider uppercase">Level</span>
                        <span className="block text-slate-800 text-xs font-bold font-mono mt-0.5">{selectedCourse.level}</span>
                      </div>
                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-center">
                        <span className="block text-slate-400 text-[9px] font-mono tracking-wider uppercase">Field</span>
                        <span className="block text-indigo-700 text-[10px] font-bold font-mono mt-0.5 whitespace-nowrap overflow-hidden overflow-ellipsis">{selectedCourse.department}</span>
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
                          <div className="flex items-center space-x-2.5 min-w-0">
                            <Book className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="text-slate-700 font-sans font-medium text-xs truncate">{week}</span>
                          </div>
                          <span className="text-[8.5px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-500 shrink-0 ml-1">
                            SESSION {idx+1}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* MAPPED HABITS OF MIND (HCs) */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest border-b border-slate-250 pb-2 border-slate-200">
                      Mapped Habits of Mind (HCs)
                    </h3>
                    
                    <div className="flex flex-wrap gap-2 pt-2.5">
                      {selectedCourse.syllabus.hcsMapped.length > 0 ? (
                        selectedCourse.syllabus.hcsMapped.map((hc, idx) => (
                          <span
                            key={idx}
                            className="p-2.5 bg-white border border-slate-200 text-orange-700 hover:text-orange-850 hover:border-orange-350 font-mono text-[10.5px] rounded-lg tracking-wider font-bold transition cursor-pointer shadow-xs"
                          >
                            {hc}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-400 font-mono font-bold">No critical HCs mapped directly.</span>
                      )}
                    </div>
                    
                    <p className="text-[10.5px] text-slate-500 leading-normal font-sans font-medium pt-3 leading-relaxed">
                      Artemis pedagogy replaces traditional exams with continuous formative feedback keyed directly to these mapped Cornerstone Habits of Mind. Faculty evaluates verbal argument submissions on 1-5 scales using context-anchored speech snippets.
                    </p>
                  </div>

                </div>

              </div>
            )}

          </div>
        )}

      </div>

    </div>
  );
}
