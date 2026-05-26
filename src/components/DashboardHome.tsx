import React, { useState } from "react";
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
  X,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  FileText,
  Mail,
  Sliders,
  MessageSquare,
  PlayCircle,
  Hash,
  Briefcase,
  Check,
  Star,
  ShieldAlert
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { LearningCluster } from "../types";
// @ts-ignore
import samParkPortrait from "../assets/images/sam_park_portrait_1779525113452.png";

interface DashboardHomeProps {
  role: "faculty" | "student" | "researcher" | "admin";
  userInfo: {
    name: string;
    email: string;
    avatarColor: string;
  };
  onNavigate: (tab: any) => void;
  allowedTabs: string[];
  userCluster?: LearningCluster;
  setUserCluster?: (cluster: LearningCluster) => void;
}

// Highly stylized data structures
interface ProjectEvidence {
  title: string;
  type: "video" | "design" | "report";
  desc: string;
}

interface SkillDetails {
  id: string;
  name: string;
  count: number;
  countLabel: string;
  colorClass: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
  icon: React.ComponentType<{ className?: string }>;
  projects: ProjectEvidence[];
  metacognitiveSummary: string;
  facultyFeedback: {
    facultyName: string;
    grade: string;
    comment: string;
  };
}

export default function DashboardHome({
  role,
  userInfo,
  onNavigate,
  allowedTabs,
  userCluster = "university",
  setUserCluster
}: DashboardHomeProps) {
  // --- INTEGRATED PORTFOLIO STATES ---
  const [activePortfolioTab, setActivePortfolioTab] = useState<"portfolio" | "reflections" | "transcript" | "graduation-audit">("portfolio");
  const [isMajorExpanded, setIsMajorExpanded] = useState(true);
  const [activeSkillId, setActiveSkillId] = useState<string>("communication");
  
  const [timeframes, setTimeframes] = useState({
    skills: "last_2_years",
    character: "last_6_months",
    experience: "last_2_years"
  });

  const [selectedProjectDetail, setSelectedProjectDetail] = useState<{
    skillName: string;
    project: ProjectEvidence;
    reflection: string;
    metrics: string[];
  } | null>(null);

  // Editable faculty comments for Faculty/Admin mode
  const [facultyFeedbackComment, setFacultyFeedbackComment] = useState(
    "Sam demonstrates a rare and extremely mature capacity to translate raw academic statistics into visual assets without losing operational accuracy."
  );
  const [isCommentEditing, setIsCommentEditing] = useState(false);

  // --- COMPATIBILITY AI COMPANION STATES ---
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [activeChip, setActiveChip] = useState<string>("");

  // --- COMPATIBILITY TIMELINE FEED STATES ---
  const [streamPlaying, setStreamPlaying] = useState(true);
  const [selectedFeedFilter, setSelectedFeedFilter] = useState<"all" | "breakout" | "grading" | "system">("all");

  // New floating Assistant and pacing ticker states
  const [tickerIndex, setTickerIndex] = useState(0);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

  const [feedEvents, setFeedEvents] = useState([
    { id: 1, type: "breakout", time: "1m ago", desc: "Marika Alvarez triggered #critique hashtag in breakout team 3.", icon: Presentation, category: "Seminar Action" },
    { id: 2, type: "grading", time: "3m ago", desc: "AI Diagnostic advised Student Paul on #breakitdown study metrics.", icon: CheckSquare, category: "Advising Alert" },
    { id: 3, type: "system", time: "12m ago", desc: "Syllabus content on 'Oxidation-Reduction' re-indexed by curriculum core.", icon: Layout, category: "Curriculum Update" },
    { id: 4, type: "breakout", time: "18m ago", desc: "Active Speakers audio spectrum balanced: David (04:15m) • Sharon (03:50m).", icon: Users, category: "Telemetry Sync" },
    { id: 5, type: "grading", time: "30m ago", desc: "Grading deadline warning dispatched for assignment 'NS111 Continuous Session Quiz'.", icon: CheckSquare, category: "Absences Control" }
  ]);

  // --- COMPATIBILITY ADMINISTRATIVE HUB STATES (CRITICAL AT END) ---
  const [adminCourses, setAdminCourses] = useState([
    { code: "CS101", name: "Introduction to Computer Science", credits: 4, status: "Active" },
    { code: "MATH202", name: "Linear Algebra & Applications", credits: 3, status: "Active" },
    { code: "LIT305", name: "Memoirs & Creative Narrative", credits: 3, status: "Pending Review" },
    { code: "BIO410", name: "Biomimicry & Capillary Flow Models", credits: 4, status: "Active" }
  ]);

  const [adminProposals, setAdminProposals] = useState([
    { id: 1, title: "Syllabus Revision: AV202 Natural Science Design", submitter: "Prof. James Freeman", status: "Pending", date: "2 hours ago" },
    { id: 2, title: "Grade Waiver: SS110 Alternate Assessment", submitter: "Advisor Marika Alvarez", status: "Pending", date: "1 day ago" },
    { id: 3, title: "Active Memoir Chapter 3 Grant Access", submitter: "Dr. Evelyn Sterling", status: "Pending", date: "3 days ago" }
  ]);

  const [termMetadata, setTermMetadata] = useState({
    name: "Fall 2026 Academic Term",
    weeksCount: 16,
    activeIndex: "Term B",
    gradingSystem: "Cornerstone HCs Standard 1.0-5.0",
    enrolledLearners: 1244
  });

  const [newCourseCode, setNewCourseCode] = useState("");
  const [newCourseName, setNewCourseName] = useState("");
  const [newCourseCredits, setNewCourseCredits] = useState(3);
  const [showAddCourse, setShowAddCourse] = useState(false);

  // Suggested prompts
  const suggestedClusterPrompts: Record<LearningCluster, Array<{ id: string; label: string; prompt: string }>> = {
    k12: [
      { id: "k1", label: "Suggest a cool nature analogy for model rocket designs", prompt: "Give me a fun nature analogy (#analogies) for building model toy spaceships, focusing on lift and capillary flow." },
      { id: "k2", label: "Help me break down a visual board game project", prompt: "Help me use the system thinking method #breakitdown to plan out a cardboard arcade board game about climate loop recycling." },
      { id: "k3", label: "Create a fun drawing observation prompt", prompt: "Create 3 quick, fun drawing challenges that build active observation habits (#observation) for younger students exploring backyard bird nests." }
    ],
    university: [
      { id: "u1", label: "Draft Cognitive Psychology challenge outline", prompt: "Create an Active Learning lesson plan section focusing on the concept of Cognitive Constraints in problem solving." },
      { id: "u2", label: "Diagnose student dialogue logs with Low HCs", prompt: "Act as a cognitive coach. Provide structured, academic, developmental study advice for a student struggling with #analogies and #breakitdown." },
      { id: "u3", label: "Outline dialogue questions for Sensation vs. Perception", prompt: "Create 3 dialogue prompts designed to help collegiate scholars contrast sensation and perception using #observation." }
    ],
    seniors: [
      { id: "sr1", label: "Explain digital safety settings using analogies", prompt: "Explain the concept of Web Firewalls and digital data safety using comfortable physical analogies (#analogies) like neighborhood gates." },
      { id: "sr2", label: "Draft structured memory-lane questions", prompt: "Create 4 engaging biographical questions that help lifelong senior members recall structured memories for their autobiography archives." },
      { id: "sr3", label: "Critique the Sonata-Allegro composition motifs", prompt: "Provide an aesthetic critique (#critique) of Haydn vs Beethoven dynamic musical shifts in early symphonies." }
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
      const res = await fetch("/api/gemini/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Profile Cluster: ${userCluster.toUpperCase()}. Role: ${role}. Request: "${promptToSend}"`
        })
      });

      const data = await res.json();
      if (data.reply) {
        setAiResponse(data.reply);
      } else {
        setAiResponse(`Failed to synthesize answer: ${data.error || "Unknown error"}`);
      }
    } catch (err: any) {
      setTimeout(() => {
        if (userCluster === "k12") {
          setAiResponse(`✨ [Artemis Junior Explorer Advisory] ✨
          
Hi Explorer ${userInfo.name}! Let's tackle your quest applying our super-skills!

1. **Breaking Things Down (#breakitdown)**:
   We can split your giant challenge into three mini-steps. It's like building with LEGO bricks. Let's write them on your adventure map!
2. **Looking Closely (#observation)**:
   Notice the little shapes, colors, and repeating natural honeycomb pattern grids.
3. **Making Connections (#analogies)**:
   It works just like a physical water pump or sliding toy!

Keep up the awesome exploring! 🚀`);
        } else if (userCluster === "seniors") {
          setAiResponse(`👵👴 [Artemis Active Mind Oasis Reflection]
          
Greetings Lifetime Scholar ${userInfo.name}, reviewing your conceptual query: "${promptToSend.slice(0, 50)}..."

1. **Narrative Sourcing (#observation)**:
   We value lifetime experiences and archives. Look for emotional primary events and organize them within chronological files.
2. **Cognitive Analogy (#analogies)**:
   Tying intricate tech terms to historical, comfortable physical concepts simplifies digital navigation loops.
3. **Aesthetic Form (#critique)**:
   We encourage discussing symmetrical progressions and compositions with peers during our afternoon study circles.

Be well, and continue practicing structural lifelong curiosity.`);
        } else {
          setAiResponse(`[Artemis University Adaptive Intelligence]
          
Reviewing inquiry: "${promptToSend.slice(0, 75)}..." keyed under academic profile registries.

1. **Systematic Analysis (#breakitdown)**:
   Structuring computational or regulatory bottlenecks into granular sub-boundaries. This reduces empirical cognitive bias.
2. **Operational Constraints (#constraints)**:
   Identify independent vs confounding factors under active term grids.
3. **Formative Evaluation**:
   Formulate robust, transcript-grounded causal loop models to support peer grading queues.

"Sapiens et Veritas — Wisdom and Truth."`);
        }
      }, 500);
    } finally {
      setAiLoading(false);
    }
  };

  const addNewEvent = () => {
    const studentNames = ["Sharon", "Paul", "Grace", "Nancy", "Matthew", "James"];
    const selectedName = studentNames[Math.floor(Math.random() * studentNames.length)];
    const hcs = ["#variables", "#analogies", "#constraints", "#gapanalysis", "#critique"];
    const chosenHc = hcs[Math.floor(Math.random() * hcs.length)];
    
    const newEv = {
      id: Date.now(),
      type: "breakout" as const,
      time: "Just now",
      desc: `Student ${selectedName} submitted a live verbal reflection applying ${chosenHc} in seminar breakout room. Check rating queue.`,
      icon: CheckSquare,
      category: "Session Update"
    };
    
    setFeedEvents([newEv, ...feedEvents.slice(0, 4)]);
  };

  const selectFilters = feedEvents.filter(ev => {
    if (selectedFeedFilter === "all") return true;
    return ev.type === selectedFeedFilter;
  });

  // Auto-pacing effect for the live telemetry banner
  React.useEffect(() => {
    if (!streamPlaying) return;
    const interval = setInterval(() => {
      setTickerIndex((prev) => {
        if (selectFilters.length === 0) return 0;
        return (prev + 1) % selectFilters.length;
      });
    }, 7000);
    return () => clearInterval(interval);
  }, [streamPlaying, selectFilters.length]);

  // Handle resetting the ticker index when filters change to avoid index overflow
  React.useEffect(() => {
    setTickerIndex(0);
  }, [selectedFeedFilter]);

  const getModuleAccessState = (moduleTab: string) => {
    const isAllowed = allowedTabs.includes(moduleTab);
    if (isAllowed) {
      if (role === "student" && moduleTab === "grading-advisees") {
        return { label: "My Academic Progress", color: "bg-indigo-50 text-indigo-700 border-indigo-200" };
      }
      return { label: "Accessible", color: "bg-emerald-50 text-emerald-600 border-emerald-100 font-bold" };
    } else {
      let desc = "Restricted";
      if (role === "student") desc = "Faculty & Admin Only";
      return { label: desc, color: "bg-zinc-100 text-zinc-400 border-zinc-250 font-semibold" };
    }
  };

  // Portfolio Data Matching the Image Precisely
  const skillShowcases: Record<string, SkillDetails> = {
    communication: {
      id: "communication",
      name: "Communication Strategy",
      count: 12,
      countLabel: "projects where I designed communications assets and processes",
      colorClass: "bg-emerald-700/90 text-white",
      bgClass: "bg-[#438260] text-emerald-50 border-emerald-800",
      textClass: "text-[#EBFDF5]",
      borderClass: "border-emerald-600/35",
      icon: MessageSquare,
      projects: [
        {
          title: "Voter referendum info pamphlet",
          type: "video",
          desc: "Designed direct mail and digital leaflets for the King County community referendum, distilling municipal density provisions into visual icons."
        },
        {
          title: "Trade magazine full-page spread",
          type: "design",
          desc: "Authored and directed graphic layout for environmental policy advocate journal focusing on oceanic microplastic filtration timelines."
        },
        {
          title: "Product team reporting system",
          type: "report",
          desc: "Constructed standard operating procedure schemas and automated email briefs for multi-disciplinary urban planning modules."
        }
      ],
      metacognitiveSummary: "Distilling complex quantitative research plans into public-facing media is the focal point of my communication methodology. Over the past two years, I have balanced graphic density with strict behavioral psychology hooks to optimize civic participation.",
      facultyFeedback: {
        facultyName: "Prof. James Freeman",
        grade: "A (4.8/5.0)",
        comment: facultyFeedbackComment
      }
    },
    thinking: {
      id: "thinking",
      name: "Systems Thinking",
      count: 5,
      countLabel: "projects mapping critical causal feedbacks and global flows",
      colorClass: "bg-[#D08B48] text-white",
      bgClass: "bg-[#C48443] text-amber-50 border-amber-800",
      textClass: "text-[#FEF3C7]",
      borderClass: "border-amber-600/35",
      icon: Layers,
      projects: [
        {
          title: "Urban transit congestion loop model",
          type: "report",
          desc: "Developed a structural dynamic flowchart of Seattle public transit grids to identify key operational delays linked to highway expansions."
        },
        {
          title: "Global food supply chain resiliencies",
          type: "design",
          desc: "Mapped geographical dependency trees and alternative shipment ports under climate disruptions for agricultural distribution."
        }
      ],
      metacognitiveSummary: "Identifying emergent loop feedbacks is second nature to me. Systems are rarely linear; my projects showcase multi-variable connections that resist default structural simplifications.",
      facultyFeedback: {
        facultyName: "Dr. Evelyn Sterling",
        grade: "A (4.9/5.0)",
        comment: "Her structural delay model for transit congestion is fully calibrated. Her use of feedback loops in causal layouts holds professional-grade modeling weight."
      }
    },
    research: {
      id: "research",
      name: "Research Design",
      count: 4,
      countLabel: "empirical survey designs and controlled study structures",
      colorClass: "bg-rose-800/95 text-white",
      bgClass: "bg-[#BA4A49] text-rose-50 border-rose-900",
      textClass: "text-[#FFE4E6]",
      borderClass: "border-rose-600/35",
      icon: ExternalLink,
      projects: [
        {
          title: "Clean energy consumer preference survey",
          type: "report",
          desc: "Engineered randomized double-blind survey structures to analyze local citizen willingness-to-pay margins under clean air benchmarks."
        },
        {
          title: "Longitudinal microplastic field analysis",
          type: "report",
          desc: "Structured rigid sampling schedules across 14 beachfront stations, defining systematic controls for humidity and container cross-contamination."
        }
      ],
      metacognitiveSummary: "Excellent research is founded on rigorous controls. I design study methods that prioritize external validity, constructing detailed double-random grids to counter systemic cognitive bias.",
      facultyFeedback: {
        facultyName: "Dr. Rachel Thorne",
        grade: "A (4.7/5.0)",
        comment: "Excellent rigor shown on field sampling layouts. Sam proactively handles sample cross-contamination vectors, ensuring credible environmental policy research."
      }
    }
  };

  const handleOpenProjectDetail = (skillName: string, proj: ProjectEvidence) => {
    let reflectionText = "";
    let keyMetrics: string[] = [];

    if (proj.title.includes("voter")) {
      reflectionText = "Civic media often suffers from deep informational clutter. My goal was reducing high-level legislation to a grade-6 readability level while maintaining the absolute legal parameters of the referendum. I conducted 4 rounds of heuristic testing with a sample size of 24 participants, finding a 37% improvement in policy retention metrics.";
      keyMetrics = ["Readability Level: Grade 6.2F", "User Focus Trial: N=24", "Information Density Ratio: 12%"];
    } else if (proj.title.includes("magazine")) {
      reflectionText = "I balanced traditional graphic guidelines with scientific credibility. The main spread integrates dense longitudinal chemical charts within an elegant, minimal grid system that captured first place at the Undergraduate Research Symposium of 2024.";
      keyMetrics = ["Grid Ratio: 12-Column Modular", "Symposium Accolade: Best Visual Output", "Acoustic Attenuation Quotient: 0.94"];
    } else {
      reflectionText = "Constructed automated reports to bridge the operational gap between scientific analysts and executive municipal leads. Developed simplified markdown structures that dynamically sync data to team slack arrays.";
      keyMetrics = ["Automated Syncs: Pro-active Slack webhook", "Read Time: ~2.5 Minutes", "Operational Alignment Audit: 100%"];
    }

    setSelectedProjectDetail({
      skillName,
      project: proj,
      reflection: reflectionText,
      metrics: keyMetrics
    });
  };

  return (
    <div className={`min-h-full selection:bg-zinc-200/60 font-sans tracking-tight antialiased transition-colors duration-300 ${
      userCluster === "k12" 
        ? "bg-[#F4FAF6]" 
        : userCluster === "seniors"
          ? "bg-[#FAFAF6]"
          : "bg-[#FAF9F5]"
    }`}>
      
      {/* CENTRAL BOUNDED CONTAINER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 space-y-8 md:space-y-10">
        
        {/* INFINITE LEARNING CONTINUUM DYNAMIC ONBOARDING CLUSTER SWITCHER */}
        <div id="learning-continuum-selector-board" className="bg-white rounded-[24px] border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="flex items-center space-x-4">
            <div className="w-11 h-11 bg-[#152A63] text-white flex items-center justify-center rounded-2xl text-xl font-bold font-mono">
              ∞
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-mono font-extrabold text-[#152A63] uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded border border-indigo-150">
                  Infinite Continuum Framework
                </span>
                <span className="text-[10px] text-zinc-400 uppercase font-mono">Lifelong Learning (Ages 3-80+)</span>
              </div>
              <h3 className="text-sm font-serif font-bold text-slate-800 tracking-tight mt-1 leading-normal">
                Lifelong Learning divisions that adapt organically to each life stage
              </h3>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 justify-end">
            {([ "k12", "university", "seniors" ] as const).map(c => (
              <button
                key={c}
                id={`cluster-onboarding-switch-${c}`}
                onClick={() => setUserCluster && setUserCluster(c)}
                className={`px-4 py-2 rounded-xl text-[10.5px] font-mono font-bold uppercase tracking-wider transition ${
                  userCluster === c
                    ? "bg-[#152A63] text-white shadow-md shadow-indigo-950/20"
                    : "bg-[#F3F4F6] hover:bg-[#E5E7EB] text-slate-650"
                }`}
              >
                {c === "k12" ? "Cluster 1 (K-12)" : c === "university" ? "Cluster 2 (Univ)" : "Cluster 3 (Seniors Plan)"}
              </button>
            ))}
          </div>
        </div>

        {/* ================= PACED REAL-TIME TELEMETRY STATUS BAR TICKER ================= */}
        <div id="paced-telemetry-status-banner" className="bg-white rounded-2xl border border-slate-200 p-3 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4 font-sans select-none animate-fade-in">
          
          {/* Pulse Signal & Label Info */}
          <div className="flex items-center space-x-3 shrink-0">
            <span className="relative flex h-2.5 w-2.5">
              {streamPlaying && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              )}
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
            </span>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono font-extrabold text-[#152A63] uppercase tracking-widest bg-indigo-50 border border-indigo-150 px-2 py-0.5 rounded">
                Live Telemetry
              </span>
              <span className="text-[10px] text-zinc-400 uppercase font-mono font-bold">Auto-Pacing</span>
            </div>
          </div>

          {/* Filtering category chips */}
          <div className="flex flex-wrap gap-1 items-center shrink-0">
            {([ "all", "breakout", "grading", "system" ] as const).map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedFeedFilter(tag)}
                className={`px-2.5 py-0.5 rounded-md text-[9px] font-mono font-extrabold tracking-wider uppercase border transition cursor-pointer select-none ${
                  selectedFeedFilter === tag
                    ? "bg-[#EA580C] border-[#EA580C] text-white"
                    : "bg-zinc-50 border-zinc-200 text-zinc-500 hover:bg-zinc-100"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Active pacing event item display */}
          <div className="flex-1 min-w-0 flex items-center bg-zinc-50/50 border border-slate-150 rounded-xl px-4 py-1.5 h-10 overflow-hidden text-xs relative">
            <AnimatePresence mode="wait">
              {selectFilters.length > 0 ? (
                (() => {
                  // Bound-safe event index
                  const currentIdx = tickerIndex % selectFilters.length;
                  const currentEvent = selectFilters[currentIdx] || selectFilters[0];
                  const EvIcon = currentEvent.icon;
                  return (
                    <motion.div
                      key={`${currentEvent.id}-${currentIdx}`}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.22, ease: "easeInOut" }}
                      className="flex items-center space-x-2.5 min-w-0 w-full"
                    >
                      <div className="p-1 rounded-md bg-white border border-slate-200 text-indigo-700 font-mono text-[9px] font-bold shrink-0">
                        <EvIcon className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col md:flex-row md:items-center justify-between gap-1">
                        <p className="text-slate-800 font-medium truncate font-sans text-[11px] leading-tight">
                          {currentEvent.desc}
                        </p>
                        <div className="flex items-center space-x-1.5 shrink-0 text-[10px] font-mono text-slate-400 font-bold uppercase">
                          <span className="text-indigo-600 bg-indigo-50/70 border border-indigo-100 px-1 py-0.2 rounded-sm">{currentEvent.category}</span>
                          <span>•</span>
                          <span>{currentEvent.time}</span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })()
              ) : (
                <div className="text-slate-450 font-mono text-[10px] italic animate-pulse">No telemetry logs matched filter.</div>
              )}
            </AnimatePresence>
          </div>

          {/* Controls: Pause / Play & Simulate log button */}
          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => setStreamPlaying(!streamPlaying)}
              className="p-1.5 px-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-650 transition cursor-pointer flex items-center space-x-1 text-[10.5px] font-mono font-bold"
              title={streamPlaying ? "Pause loop" : "Begin live auto-flow"}
            >
              {streamPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 text-red-500 shrink-0 animate-pulse" />
                  <span>Resume</span>
                </>
              )}
            </button>

            <button
              onClick={addNewEvent}
              className="p-1.5 px-3 rounded-lg bg-[#152A63] hover:bg-[#0e2050] text-white transition cursor-pointer flex items-center space-x-1 text-[10.5px] font-mono font-bold"
              title="Add simulated live student verbal log"
            >
              <Plus className="w-3.5 h-3.5 shrink-0" />
              <span>Simulate Record</span>
            </button>
          </div>

        </div>

        {/* ================= CLONED GORGEOUS LEARNER PORTFOLIO (THE MAIN INTERACTIVE WORKSPACE) ================= */}
        <div id="central-learner-portfolio-workspace" className="space-y-6">
          
          {/* Header Bar within Portfolio */}
          <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-200 pb-4 gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="bg-orange-600 text-white text-[9px] font-extrabold font-mono tracking-widest px-2.5 py-0.5 rounded-md uppercase">
                  {role === "student" ? "My Personal Portfolio" : "Adviser Dossier Workspace"}
                </span>
                <span className="bg-slate-100 text-slate-800 border border-slate-200 text-[10px] font-medium font-mono px-2 py-0.5 rounded-full">
                  Class of June 2025 Ledger
                </span>
              </div>
              <h2 className="text-xl font-serif font-extrabold text-neutral-900 tracking-tight mt-1.5 flex items-center gap-2">
                <span>Sam Park's Digital Portfolio & Metacognitive Ledger</span>
                <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 font-mono font-bold">✓ Certified</span>
              </h2>
            </div>

            {/* Role Helper Info Callout */}
            <div className="flex items-center space-x-2 bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <p className="font-semibold text-slate-600">
                {role === "faculty" && "Viewing as Faculty Advisor. Appraisal commentary edit modes enabled."}
                {role === "admin" && "Viewing as Administrator. Institutional ledger modification privileges active."}
                {role === "student" && "Viewing as Student. Real-time criteria trackers are active."}
                {role === "researcher" && "Viewing as External Academic Researcher. Double-blind records active."}
              </p>
            </div>
          </div>

          {/* MAIN 2-COLUMN GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* ========= LEFT PORTFOLIO COLUMN (Width 4/12) ========= */}
            <aside className="lg:col-span-4 space-y-6">
              
              {/* Profile Card */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <div className="space-y-1">
                  <h1 className="text-3xl font-serif font-extrabold tracking-tight text-[#111827]">
                    Sam Park
                  </h1>
                  <p className="text-xs font-semibold text-slate-500 font-sans uppercase tracking-wider">
                    B.A. expected June 2025
                  </p>
                  <p className="text-xs font-medium text-indigo-600 font-mono">
                    World University • Yale Cohort
                  </p>
                </div>

                {/* Bio quote */}
                <p className="mt-4 text-xs text-slate-600 leading-relaxed font-sans font-medium border-l-2 border-slate-200 pl-3 italic">
                  "I am passionate about empirically-driven approaches to understanding and influencing public attitudes. My target job would be in an environmental policy research organization, with a role in public understanding and sentiment."
                </p>

                {/* Styled Photo Box */}
                <div className="mt-5 relative group overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-sm">
                  <img
                    src={samParkPortrait}
                    alt="Sam Park Student Portrait"
                    referrerPolicy="no-referrer"
                    className="w-full h-80 object-cover object-top transition duration-500 group-hover:scale-102"
                  />
                  <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-xs text-white px-2 py-0.5 rounded-md text-[9px] font-mono tracking-wide flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Verified Audit</span>
                  </div>
                </div>
              </div>

              {/* Major & Concentration Collapsible */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <button
                  onClick={() => setIsMajorExpanded(!isMajorExpanded)}
                  className="w-full flex items-center justify-between px-5 py-4 bg-slate-50 hover:bg-slate-100/70 border-b border-slate-200 transition text-left cursor-pointer"
                >
                  <div className="flex items-center space-x-2">
                    <GraduationCap className="w-4.5 h-4.5 text-indigo-600" />
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">
                      Major & Concentration
                    </span>
                  </div>
                  {isMajorExpanded ? (
                    <ChevronUp className="w-4 h-4 text-slate-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-500" />
                  )}
                </button>

                <AnimatePresence initial={false}>
                  {isMajorExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.18 }}
                      className="overflow-hidden bg-white"
                    >
                      <div className="p-5 space-y-4 text-xs text-slate-600 font-sans font-medium">
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-mono">Degree Program</span>
                          <p className="text-slate-800 font-bold mt-0.5">B.A. in Environmental Policy & Governance</p>
                        </div>
                        
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-mono">Sub-Specialties</span>
                          <div className="flex flex-wrap gap-1.5 mt-1.5">
                            <span className="bg-indigo-50 text-indigo-700 text-[10px] font-semibold font-mono px-2 py-0.5 rounded-md border border-indigo-100">
                              Empirical Data Science
                            </span>
                            <span className="bg-amber-50 text-amber-700 text-[10px] font-semibold font-mono px-2 py-0.5 rounded-md border border-amber-100 font-mono">
                              Systems Analysis
                            </span>
                            <span className="bg-emerald-50 text-emerald-700 text-[10px] font-semibold font-mono px-2 py-0.5 rounded-md border border-emerald-100">
                              Civic Advocacy
                            </span>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-4">
                          <div>
                            <span className="text-[9px] text-slate-400 uppercase tracking-widest block font-mono">Cumulative GPA</span>
                            <span className="text-slate-800 text-sm font-bold font-mono">3.92 / 4.00</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-slate-400 uppercase tracking-widest block font-mono">Completed Credits</span>
                            <span className="text-slate-800 text-sm font-bold font-mono">118 / 120 Units</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Lecosystem Verification Card */}
              <div className="bg-gradient-to-br from-[#121420] via-[#1E293B] to-[#0F172A] text-slate-300 rounded-2xl p-5 border border-slate-800 shadow-md">
                <div className="flex items-center space-x-2 mb-3">
                  <Award className="w-4 h-4 text-amber-500 animate-pulse" />
                  <h3 className="text-[11px] font-bold tracking-widest uppercase font-mono text-slate-300">
                    Lecosystem Verification
                  </h3>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed font-sans font-medium">
                  This portfolio is dynamically ledgered on the World University continuous learning ecosystem. External assessors, global professors, and corporate partners can inspect live verified milestone telemetry.
                </p>
                <div className="mt-4 space-y-2 pt-3 border-t border-slate-800">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-mono">Tutor Rating Index</span>
                    <span className="text-emerald-400 font-bold font-mono">Perfect (100%)</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-mono">L.O. Submissions</span>
                    <span className="text-indigo-400 font-bold font-mono">124 checked</span>
                  </div>
                </div>
              </div>

            </aside>

            {/* ========= RIGHT PORTFOLIO COLUMN (Width 8/12) ========= */}
            <main className="lg:col-span-8 space-y-6 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
              
              {/* 1. TABS HEADER */}
              <div className="border-b border-slate-200">
                <nav className="flex space-x-6 text-xs font-mono font-bold tracking-wider text-slate-400 select-none overflow-x-auto pb-px">
                  <button
                    onClick={() => setActivePortfolioTab("portfolio")}
                    className={`flex items-center space-x-2 py-3 border-b-2 font-extrabold transition cursor-pointer shrink-0 ${
                      activePortfolioTab === "portfolio"
                        ? "border-indigo-600 text-indigo-600 font-black"
                        : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
                    }`}
                  >
                    <Award className="w-4 h-4" />
                    <span>Skills Portfolio</span>
                  </button>

                  <button
                    onClick={() => setActivePortfolioTab("reflections")}
                    className={`flex items-center space-x-2 py-3 border-b-2 font-extrabold transition cursor-pointer shrink-0 ${
                      activePortfolioTab === "reflections"
                        ? "border-indigo-600 text-indigo-600 font-black"
                        : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                    <span>Metacognitive Logs</span>
                  </button>

                  <button
                    onClick={() => setActivePortfolioTab("transcript")}
                    className={`flex items-center space-x-2 py-3 border-b-2 font-extrabold transition cursor-pointer shrink-0 ${
                      activePortfolioTab === "transcript"
                        ? "border-indigo-600 text-indigo-600 font-black"
                        : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
                    }`}
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Official Transcript</span>
                  </button>

                  <button
                    onClick={() => setActivePortfolioTab("graduation-audit")}
                    className={`flex items-center space-x-2 py-3 border-b-2 font-extrabold transition cursor-pointer shrink-0 ${
                      activePortfolioTab === "graduation-audit"
                        ? "border-indigo-600 text-indigo-600 font-black"
                        : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Graduation Audit</span>
                  </button>

                  {allowedTabs.includes("grading-advisees") && (
                    <button
                      onClick={() => onNavigate("grading-advisees")}
                      className="flex items-center space-x-2 py-3 border-b-2 font-extrabold transition cursor-pointer shrink-0 border-transparent text-slate-500 hover:text-slate-850 hover:border-slate-300 font-semibold"
                      title="Open Degree Progress Planner canvas"
                    >
                      <GraduationCap className="w-4 h-4 text-[#EA580C]" />
                      <span>Degree Planner</span>
                    </button>
                  )}
                </nav>
              </div>

              {/* Dynamic rendering depending on active tab */}
              <AnimatePresence mode="wait">
                {activePortfolioTab === "portfolio" && (
                  <motion.div
                    key="portfolio-subtab"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.15 }}
                    className="space-y-6"
                  >
                    {/* Skills Header */}
                    <div className="flex flex-wrap items-center justify-between gap-3 select-none">
                      <div>
                        <h2 className="text-md font-serif font-extrabold text-[#111827] tracking-tight">
                          Showcased Masteries
                        </h2>
                        <p className="text-[11px] text-slate-400 font-sans">Click on any core mastery block to expand sub-projects and essays.</p>
                      </div>
                      
                      <div className="flex items-center space-x-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl shadow-xs">
                        <span className="text-[9px] font-mono uppercase tracking-wider text-slate-400">Timeframe:</span>
                        <select
                          value={timeframes.skills}
                          onChange={(e) => setTimeframes(prev => ({ ...prev, skills: e.target.value }))}
                          className="bg-transparent border-0 ring-0 focus:ring-0 text-[10px] font-mono font-bold text-slate-750 py-0 cursor-pointer outline-none"
                        >
                          <option value="last_2_years">Past 2 Years</option>
                          <option value="last_1_year">Past 1 Year</option>
                          <option value="all_time font-mono">Full Enrollment</option>
                        </select>
                      </div>
                    </div>

                    {/* Highly interactive modular skill cards */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                      {Object.values(skillShowcases).map((skill) => {
                        const isActive = activeSkillId === skill.id;
                        const SkillIcon = skill.icon;
                        
                        return (
                          <div
                            key={skill.id}
                            onClick={() => setActiveSkillId(skill.id)}
                            className={`rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden p-5 flex flex-col justify-between select-none ${
                              isActive
                                ? `${skill.bgClass} md:col-span-12 lg:col-span-12 shadow-md min-h-[260px]`
                                : "bg-slate-50/50 text-slate-500 hover:text-slate-800 border-slate-200 hover:border-indigo-200 hover:bg-white md:col-span-6 lg:col-span-4 min-h-[140px]"
                            }`}
                          >
                            <div>
                              <div className="flex items-center justify-between gap-2">
                                <h3 className={`text-[10px] font-bold uppercase tracking-wider font-mono ${isActive ? skill.textClass : "text-slate-600 font-black"}`}>
                                  {skill.name}
                                </h3>
                                <div className={`p-1.5 rounded-lg ${isActive ? "bg-white/10" : "bg-slate-100"}`}>
                                  <SkillIcon className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-slate-500"}`} />
                                </div>
                              </div>

                              <div className="mt-3 flex items-baseline">
                                <span className={`text-4xl font-serif font-extrabold tracking-tight ${isActive ? "text-white" : "text-slate-800"}`}>
                                  {skill.count}
                                </span>
                                {isActive ? (
                                  <span className={`text-[10.5px] leading-snug font-semibold max-w-[280px] ml-2 ${skill.textClass}`}>
                                    {skill.countLabel}
                                  </span>
                                ) : (
                                  <span className="text-[9px] font-mono font-bold text-slate-400 ml-1.5 uppercase">
                                    projects
                                  </span>
                                )}
                              </div>

                              {isActive && (
                                <div className="mt-4 pt-4 border-t border-white/10 space-y-3.5">
                                  <p className="text-[11px] leading-relaxed font-sans font-medium opacity-90 mb-2">
                                    {skill.metacognitiveSummary}
                                  </p>
                                  
                                  <div className="space-y-2">
                                    {skill.projects.map((proj, idx) => (
                                      <div
                                        key={idx}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleOpenProjectDetail(skill.name, proj);
                                        }}
                                        className="group/item flex items-center justify-between p-2.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-[0.99] border border-white/5 hover:border-white/12 transition text-left"
                                      >
                                        <div className="flex items-center space-x-2.5 min-w-0">
                                          {proj.type === "video" ? (
                                            <PlayCircle className="w-3.5 h-3.5 shrink-0 text-white/80" />
                                          ) : (
                                            <FileText className="w-3.5 h-3.5 shrink-0 text-white/80" />
                                          )}
                                          <span className="text-[11px] font-mono leading-none font-extrabold truncate text-white">
                                            {proj.title}
                                          </span>
                                        </div>
                                        <span className="text-[9px] uppercase font-mono tracking-widest text-white/60 group-hover/item:text-amber-200 group-hover/item:underline font-black select-none shrink-0 pl-2">
                                          Launch Detail →
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>

                            {isActive ? (
                              <div
                                onClick={(e) => {
                                  e.stopPropagation();
                                  alert(`Mastery Focus:\n\nCommunication Strategy covers graphical density metrics, behavioral audit surveys, public policy information layouts.`);
                                }}
                                className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[10px] font-mono font-bold hover:underline select-none"
                              >
                                <span className="text-white">Review learning sequence roadmap...</span>
                                <ExternalLink className="w-3 h-3" />
                              </div>
                            ) : (
                              <div className="text-[8px] font-mono uppercase tracking-widest text-slate-400 mt-3 select-none">
                                Expand Core Projects
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Character Metacognition Sections */}
                    <div className="space-y-3 pb-2 pt-2">
                      <h3 className="text-xs font-mono font-black text-slate-400 uppercase tracking-widest">Metacognitive Indicators</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        
                        <div
                          onClick={() => alert("Collaboration Metacognitive Index:\n\nSam has scored 5/5 stars in all team integration criteria. She actively resolves organizational conflicts and balances work split loads.")}
                          className="bg-slate-50 hover:bg-slate-100/70 border border-slate-200 rounded-xl p-4 transition duration-150 cursor-pointer select-none"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-slate-700">Collaboration</span>
                            <Users className="w-3.5 h-3.5 text-indigo-600" />
                          </div>
                          <div className="flex items-baseline mt-2.5">
                            <span className="text-3xl font-serif font-black text-neutral-800">87%</span>
                            <span className="text-[8px] text-slate-400 font-mono font-bold uppercase ml-1">Engagement</span>
                          </div>
                        </div>

                        <div
                          onClick={() => alert("Professionalism Audit:\n\n96% on-time submission rate. Exemplary research records.")}
                          className="bg-slate-50 hover:bg-slate-100/70 border border-slate-200 rounded-xl p-4 transition duration-150 cursor-pointer select-none"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-slate-700">Professionalism</span>
                            <Sliders className="w-3.5 h-3.5 text-indigo-600" />
                          </div>
                          <div className="flex items-baseline mt-2.5">
                            <span className="text-3xl font-serif font-black text-neutral-800">96%</span>
                            <span className="text-[8px] text-slate-400 font-mono font-bold uppercase ml-1">Punctuality</span>
                          </div>
                        </div>

                        <div
                          onClick={() => alert("Versatility Index:\n\nSam applied continuous formative systems to alternative civic modules 8 unique times.")}
                          className="bg-slate-50 hover:bg-slate-100/70 border border-slate-200 rounded-xl p-4 transition duration-150 cursor-pointer select-none"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-slate-700">Versatility</span>
                            <Hash className="w-3.5 h-3.5 text-indigo-600" />
                          </div>
                          <div className="flex items-baseline mt-2.5">
                            <span className="text-3xl font-serif font-black text-neutral-800">8 LOs</span>
                            <span className="text-[8px] text-slate-400 font-mono font-bold uppercase ml-1">Unprompted Expansions</span>
                          </div>
                        </div>

                      </div>
                    </div>

                    {/* Class Experience Sections */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      <div className="bg-slate-50/70 rounded-xl p-4 border border-slate-200">
                        <div className="flex items-center space-x-2 pb-2 mb-3 border-b border-slate-200">
                          <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                          <h4 className="text-[10px] font-bold font-mono uppercase text-slate-700">Advanced Coursework</h4>
                        </div>
                        <div className="space-y-2.5 text-xs">
                          <div className="flex justify-between items-center bg-white p-2 rounded border border-slate-100">
                            <div>
                              <span className="text-slate-800 font-bold block">Statistics for Marketing</span>
                              <span className="text-[9.5px] text-slate-400 font-mono">Regression & Survey Control</span>
                            </div>
                            <span className="text-[9px] font-mono text-zinc-500 bg-slate-50 px-2 py-0.5 rounded font-bold">Fall 2024</span>
                          </div>
                          <div className="flex justify-between items-center bg-white p-2 rounded border border-slate-100">
                            <div>
                              <span className="text-slate-800 font-bold block">Empirical Policy Analysis</span>
                              <span className="text-[9.5px] text-slate-400 font-mono">Microstructure Forecast Model</span>
                            </div>
                            <span className="text-[9px] font-mono text-zinc-500 bg-slate-50 px-2 py-0.5 rounded font-bold">Fall 2024</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-slate-50/70 rounded-xl p-4 border border-slate-200">
                        <div className="flex items-center space-x-2 pb-2 mb-3 border-b border-slate-200">
                          <Briefcase className="w-3.5 h-3.5 text-slate-500" />
                          <h4 className="text-[10px] font-bold font-mono uppercase text-slate-700">Civic Internships</h4>
                        </div>
                        <div className="space-y-2.5 text-xs">
                          <div className="flex justify-between items-center bg-white p-2 rounded border border-slate-100">
                            <div>
                              <span className="text-slate-800 font-bold block">Seattle Mayor's Office</span>
                              <span className="text-[9.5px] text-slate-400 font-mono">Transit Density Leaflet</span>
                            </div>
                            <span className="text-[9px] font-mono text-zinc-500 bg-slate-50 px-2 py-0.5 rounded font-bold">Fall 2024</span>
                          </div>
                          <div className="flex justify-between items-center bg-white p-2 rounded border border-slate-100">
                            <div>
                              <span className="text-slate-800 font-bold block">Cascade Watershed Alliance</span>
                              <span className="text-[9.5px] text-slate-400 font-mono">Ocean Microplastics Audit</span>
                            </div>
                            <span className="text-[9px] font-mono text-zinc-500 bg-slate-50 px-2 py-0.5 rounded font-bold">Summer 2024</span>
                          </div>
                        </div>
                      </div>

                    </div>
                  </motion.div>
                )}

                {activePortfolioTab === "reflections" && (
                  <motion.div
                    key="reflections-subtab"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.15 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center justify-between border-b pb-2 mb-1">
                      <div>
                        <h3 className="text-md font-serif font-black text-slate-900">Metacognitive Reflection Logs</h3>
                        <p className="text-xs text-slate-500">Official archived developmental logs index.</p>
                      </div>
                      <span className="text-[9px] font-mono bg-indigo-50 text-indigo-700 px-2 py-0.5 border border-indigo-100 rounded-full">16 logs recorded</span>
                    </div>

                    <div className="space-y-3">
                      {[
                        { title: "Empirical Framing Loops on Public Demography", date: "April 2025", desc: "How I designed statistical survey models of Seattle neighborhoods without inducing spatial demographic bias.", tag: "#observation" },
                        { title: "Chemical Longitudinal Controls on Salish Sea beachfronts", date: "January 2025", desc: "A reflective audit on eliminating environmental sample microplastic cross-contaminations.", tag: "#breakitdown" },
                        { title: "Causal Loops in Transit Congestion Feedbacks", date: "October 2024", desc: "Modeling highway expansions and consumer decision dynamics under supply chain delay regimes.", tag: "#analogies" }
                      ].map((item, idx) => (
                        <div
                          key={idx}
                          onClick={() => alert(`Self-reflective log detail preview:\n\n"${item.title}" (${item.date})\n\nSam's key critical realization: Systemic feedbacks can be modeled through structured, heuristic checklists. Under rigorous study controls, behavioral trends emerge with pristine visual clarity.`)}
                          className="p-4 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200 transition duration-150 cursor-pointer text-xs"
                        >
                          <div className="flex items-center justify-between font-mono text-[9px] text-[#EA580C] font-extrabold mb-1 uppercase tracking-wider">
                            <span>{item.tag}</span>
                            <span>{item.date}</span>
                          </div>
                          <h4 className="font-bold text-slate-800 text-sm mb-1">{item.title}</h4>
                          <p className="text-slate-550 leading-relaxed font-sans">{item.desc}</p>
                          <span className="text-[9.5px] font-mono text-indigo-600 block mt-2 font-black">Read preserved metacognitive essay...</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activePortfolioTab === "transcript" && (
                  <motion.div
                    key="transcript-subtab"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.15 }}
                    className="space-y-4"
                  >
                    <div className="border-b pb-2.5">
                      <h3 className="text-md font-serif font-black text-slate-900">Digital Cryptographic Scholar Transcript</h3>
                      <p className="text-xs text-slate-500">Direct wallet linkage: wu-sam-ledger-2025. Immutable verification state: Passed.</p>
                    </div>

                    <div className="space-y-2">
                      {[
                        { code: "EV-310", title: "Environmental Policy & Civic Governance Models", grade: "H (Excellent / 5.0)", term: "Spring 2025" },
                        { code: "DS-204", title: "Quantitative Methods & Regression Schemas", grade: "H (Excellent / 4.9)", term: "Fall 2024" },
                        { code: "MH-102", title: "Historical Archives & Decolonial Oral Studies", grade: "H (Excellent / 4.8)", term: "Spring 2024" },
                        { code: "SYS-401", title: "Causal Feedbacks in Complex Municipal Systems", grade: "H (Excellent / 5.0)", term: "Fall 2024" }
                      ].map((c, i) => (
                        <div key={i} className="flex justify-between items-center p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                          <div>
                            <span className="font-mono text-[9px] bg-slate-200 px-1.5 py-0.5 rounded mr-1.5 font-bold text-slate-700">{c.code}</span>
                            <span className="font-bold text-slate-800">{c.title}</span>
                          </div>
                          <div className="text-right">
                            <span className="font-mono text-[10px] font-bold block text-indigo-700">{c.grade}</span>
                            <span className="text-[9px] text-slate-400 block font-mono uppercase">{c.term}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activePortfolioTab === "graduation-audit" && (
                  <motion.div
                    key="audit-subtab"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.15 }}
                    className="space-y-4"
                  >
                    <div className="border-b pb-2">
                      <h3 className="text-md font-serif font-black text-slate-900">Yale & World University Graduation Audit Console</h3>
                      <p className="text-xs text-slate-500">Degree candidate: Sam Park. Graduation date: June 15, 2025.</p>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-lg flex items-start space-x-3">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-emerald-950 block">Requirement 1: Cumulative Units Completed</span>
                          <p className="text-slate-600 leading-normal mt-0.5">118 units verified out of 120 required. Sam's current pre-enrolled course 'EV-310' (3 Units) completes other units upon final June evaluation check.</p>
                        </div>
                      </div>

                      <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-lg flex items-start space-x-3">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-emerald-950 block">Requirement 2: Habits of Mind (HCs Verification)</span>
                          <p className="text-slate-600 leading-normal mt-0.5">All 3 categories (Communication strategy, systems thinking, dynamic design) have been rigorously verified by certified professors.</p>
                        </div>
                      </div>

                      <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-lg flex items-start space-x-3">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-emerald-950 block">Requirement 3: Institutional Clearance</span>
                          <p className="text-slate-600 leading-normal mt-0.5">World University Registrar office verified no outstanding academic fees or system clearance alerts.</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* FACULTY / ADMIN APPRAISAL EDITABLE CARD (Rendered for faculty or admin mode) */}
              {(role === "faculty" || role === "admin") && (
                <div id="faculty-appraisal-live-editor" className="mt-6 border border-amber-200 bg-amber-50/35 p-5 rounded-2xl space-y-3.5">
                  <div className="flex items-center justify-between pb-2 border-b border-amber-100">
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-[#EA580C] fill-[#EA580C]" />
                      <span className="text-xs font-bold font-sans text-neutral-800 uppercase tracking-widest">
                        Adviser Live appraisal comments desk
                      </span>
                    </div>
                    <span className="text-[10px] font-mono bg-[#EA580C]/10 text-[#EA580C] border border-[#EA580C]/20 px-2 py-0.5 rounded font-black uppercase">
                      Class Level 1 Audit
                    </span>
                  </div>

                  {isCommentEditing ? (
                    <div className="space-y-2">
                      <textarea
                        value={facultyFeedbackComment}
                        onChange={(e) => setFacultyFeedbackComment(e.target.value)}
                        className="w-full min-h-[80px] p-3 text-xs bg-white border border-amber-200 rounded-lg focus:outline-none placeholder-slate-450"
                        placeholder="Write constructive advice..."
                      />
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => {
                            setFacultyFeedbackComment("Sam demonstrates a rare and extremely mature capacity to translate raw academic statistics into visual assets without losing operational accuracy.");
                            setIsCommentEditing(false);
                          }}
                          className="px-2.5 py-1.5 text-[10px] font-mono text-zinc-500 cursor-pointer hover:underline"
                        >
                          Reset Default
                        </button>
                        <button
                          onClick={() => setIsCommentEditing(false)}
                          className="px-3 py-1.5 text-[10px] font-mono bg-indigo-750 text-white hover:bg-indigo-850 rounded-lg cursor-pointer"
                        >
                          Save comment changes
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-xs text-slate-700 leading-relaxed font-sans font-medium italic">
                        "{facultyFeedbackComment}"
                      </p>
                      <div className="flex items-center justify-between text-[10.5px]">
                        <span className="font-mono font-bold text-amber-800 uppercase">Prof. James Freeman (Assigned Evaluator)</span>
                        <button
                          onClick={() => setIsCommentEditing(true)}
                          className="text-[10px] font-mono font-extrabold text-[#EA580C] hover:text-[#EA580C]/80 cursor-pointer underline hover:no-underline"
                        >
                          Edit Comment
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

            </main>

          </div>

        </div>



        {/* ADMINISTRATIVE HUB CARD (Rendered conditionally for super admin role) */}
        {role === "admin" && (
          <div id="administrative-hub" className="bg-slate-50/80 border border-zinc-200 rounded-[28px] p-6 md:p-8 space-y-6 shadow-sm max-w-6xl mx-auto my-6 animate-fade-in text-neutral-800">
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-zinc-200 pb-5 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="p-1 px-2 bg-red-50 text-red-650 rounded-md border border-red-100 text-[9px] font-mono font-black tracking-widest uppercase">
                    Admin Privilege Level
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                </div>
                <h3 className="text-lg font-bold font-sans text-slate-900 tracking-tight flex items-center gap-2">
                  🛡️ Active Administrative Hub Core
                </h3>
                <p className="text-xs text-zinc-500 max-w-2xl font-sans">
                  Configure systemic academic parameters, curate global continuous courses indexes, and arbitrate curriculum waiver request proposals.
                </p>
              </div>
              
              <div className="flex items-center gap-2 font-mono text-[10.5px]">
                <span className="text-zinc-400 uppercase font-black tracking-widest">Metadata Sync:</span>
                <span className="text-green-600 bg-green-50 border border-green-150 px-2 py-0.5 rounded font-bold">100% Core Aligned</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Box 1: Course Catalog Manager */}
              <div className="bg-white border border-zinc-150 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-zinc-900 uppercase font-mono tracking-wider flex items-center gap-1.5">
                      📚 Course Catalog Matrix
                    </h4>
                    <button 
                      onClick={() => setShowAddCourse(!showAddCourse)}
                      className="text-[10px] font-bold font-mono text-[#EA580C] hover:text-orange-700 transition flex items-center gap-1 cursor-pointer"
                    >
                      {showAddCourse ? "✖ Cancel" : "➕ Add Course"}
                    </button>
                  </div>

                  {showAddCourse ? (
                    <div className="space-y-2.5 bg-slate-50 p-3 rounded-xl border border-zinc-200 text-xs animate-fade-in">
                      <div className="font-bold text-[10px] uppercase font-mono text-zinc-500">Insert Catalog Entry</div>
                      <div>
                        <label className="block text-[8.5px] font-mono uppercase text-zinc-550 mb-1 font-extrabold">Course Code</label>
                        <input 
                          type="text" 
                          placeholder="CS101" 
                          value={newCourseCode}
                          onChange={(e) => setNewCourseCode(e.target.value.toUpperCase())}
                          className="w-full h-8 px-2 bg-white border border-zinc-200 rounded text-xs text-zinc-900 uppercase font-mono tracking-wider"
                        />
                      </div>
                      <div>
                        <label className="block text-[8.5px] font-mono uppercase text-zinc-550 mb-1 font-extrabold">Course Title</label>
                        <input 
                          type="text" 
                          placeholder="Theoretical Computer Science" 
                          value={newCourseName}
                          onChange={(e) => setNewCourseName(e.target.value)}
                          className="w-full h-8 px-2 bg-white border border-zinc-200 rounded text-xs text-zinc-900"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[8.5px] font-mono uppercase text-zinc-550 mb-1 font-extrabold">Credits (1-5)</label>
                          <input 
                            type="number" 
                            min="1" 
                            max="5" 
                            value={newCourseCredits}
                            onChange={(e) => setNewCourseCredits(parseInt(e.target.value) || 3)}
                            className="w-full h-8 px-2 bg-white border border-zinc-200 rounded text-xs text-zinc-900"
                          />
                        </div>
                        <div className="flex items-end">
                          <button
                            onClick={() => {
                              if (!newCourseCode || !newCourseName) return;
                              setAdminCourses([
                                ...adminCourses, 
                                { code: newCourseCode, name: newCourseName, credits: newCourseCredits, status: "Active" }
                              ]);
                              setNewCourseCode("");
                              setNewCourseName("");
                              setShowAddCourse(false);
                            }}
                            className="w-full h-8 bg-[#152A63] hover:bg-[#0e2050] text-white rounded text-xs font-bold leading-none cursor-pointer"
                          >
                            Save Code
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1.5 max-h-[175px] overflow-y-auto pr-1">
                      {adminCourses.map((c) => (
                        <div key={c.code} className="flex items-center justify-between p-2.5 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-zinc-150 transition select-none">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono text-[9.5px] font-black text-indigo-700 tracking-tight bg-indigo-50 border border-indigo-100 px-1 py-0.5 rounded">{c.code}</span>
                              <span className="font-mono text-[9px] text-zinc-400 font-semibold">{c.credits} Credits</span>
                            </div>
                            <div className="text-[11px] font-bold text-zinc-900 line-clamp-1 mt-0.5">{c.name}</div>
                          </div>
                          <button
                            onClick={() => {
                              setAdminCourses(adminCourses.map(item => 
                                item.code === c.code 
                                  ? { ...item, status: item.status === "Active" ? "Archived" : "Active" }
                                  : item
                              ));
                            }}
                            className={`text-[8.5px] font-mono uppercase px-2 py-0.5 rounded font-black border transition ${
                              c.status === "Active" 
                                ? "bg-green-50 text-green-700 border-green-150 hover:bg-orange-50 hover:text-orange-700 hover:border-orange-255"
                                : "bg-zinc-100 text-zinc-500 border-zinc-200 hover:bg-green-50 hover:text-green-700 hover:border-green-150"
                            }`}
                          >
                            {c.status}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="text-[9px] font-mono text-zinc-400">
                  Total Courses: {adminCourses.length} Registered entries.
                </div>
              </div>

              {/* Box 2: Academic Term Metadata Control */}
              <div className="bg-white border border-zinc-150 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-zinc-900 uppercase font-mono tracking-wider flex items-center gap-1.5">
                    ⚙️ Active Academic Term Metadata
                  </h4>

                  <div className="space-y-2 text-xs">
                    <div>
                      <label className="block text-[8.5px] font-mono uppercase text-zinc-550 font-extrabold mb-1">
                        Active Term Catalog Header
                      </label>
                      <input 
                        type="text" 
                        value={termMetadata.name}
                        onChange={(e) => setTermMetadata({ ...termMetadata, name: e.target.value })}
                        className="w-full h-8 px-2.5 bg-slate-50 border border-zinc-200 rounded text-xs text-zinc-905 font-bold"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[8.5px] font-mono uppercase text-zinc-550 font-extrabold mb-1">Term Code</label>
                        <select 
                          value={termMetadata.activeIndex}
                          onChange={(e) => setTermMetadata({ ...termMetadata, activeIndex: e.target.value })}
                          className="w-full h-8 px-2 bg-slate-50 border border-zinc-200 rounded text-xs text-[#152A63] font-mono font-bold outline-none"
                        >
                          <option value="Term A">Term A</option>
                          <option value="Term B">Term B</option>
                          <option value="Term C">Term C</option>
                          <option value="Semester Alpha">Semester Alpha</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[8.5px] font-mono uppercase text-zinc-550 font-extrabold mb-1 font-sans">Weeks Tracked</label>
                        <input 
                          type="number" 
                          min="1" 
                          max="24"
                          value={termMetadata.weeksCount}
                          onChange={(e) => setTermMetadata({ ...termMetadata, weeksCount: parseInt(e.target.value) || 16 })}
                          className="w-full h-8 px-2 bg-slate-50 border border-zinc-200 rounded text-xs text-zinc-900"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[8.5px] font-mono uppercase text-zinc-550 font-extrabold mb-1">Active Core Grading Structure</label>
                      <div className="p-2 bg-indigo-50 border border-indigo-150 rounded font-mono text-[10px] text-[#152A63] font-bold text-center">
                        {termMetadata.gradingSystem}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] font-semibold text-zinc-650 border-t border-zinc-100 pt-3 select-none">
                  <span className="font-mono text-[9px] uppercase tracking-wide">Registry Check Sum</span>
                  <span className="font-mono text-zinc-900 text-xs font-black">{termMetadata.weeksCount * termMetadata.enrolledLearners} IDCS</span>
                </div>
              </div>

              {/* Box 3: Proposal Decision Desk */}
              <div className="bg-white border border-zinc-150 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-zinc-900 uppercase font-mono tracking-wider flex items-center gap-1.5">
                    🗃️ Pending Curricular Proposals
                  </h4>

                  <div className="space-y-2 max-h-[175px] overflow-y-auto pr-1">
                    {adminProposals.map((p) => (
                      <div 
                        key={p.id} 
                        className={`p-2.5 rounded-xl border transition ${
                          p.status === "Approved"
                            ? "bg-green-50/50 border-green-200 text-green-900"
                            : p.status === "Rejected"
                            ? "bg-red-50/50 border-red-200 text-red-900"
                            : "bg-slate-50 border-zinc-150 text-zinc-905"
                        }`}
                      >
                        <div className="flex items-center justify-between text-[9px] font-mono text-zinc-400 font-bold mb-1">
                          <span>{p.submitter}</span>
                          <span className="font-black">{p.date}</span>
                        </div>
                        <div className="text-[11px] font-bold leading-snug line-clamp-2">{p.title}</div>
                        
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-dotted border-zinc-200">
                          <span className={`text-[8.5px] font-mono uppercase px-1.5 py-0.5 rounded font-black border ${
                            p.status === "Approved"
                              ? "bg-green-100 text-green-800 border-green-200"
                              : p.status === "Rejected"
                              ? "bg-red-100 text-red-800 border-red-200"
                              : "bg-zinc-100 text-zinc-600 border-zinc-200"
                          }`}>
                            Status: {p.status}
                          </span>

                          {p.status === "Pending" && (
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => {
                                  setAdminProposals(adminProposals.map(item => 
                                    item.id === p.id ? { ...item, status: "Approved" } : item
                                  ));
                                }}
                                className="px-2 h-5 text-[9px] font-bold font-mono text-emerald-800 bg-emerald-100 hover:bg-emerald-200 active:scale-95 rounded border border-emerald-300 transition cursor-pointer"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => {
                                  setAdminProposals(adminProposals.map(item => 
                                    item.id === p.id ? { ...item, status: "Rejected" } : item
                                  ));
                                }}
                                className="px-2 h-5 text-[9px] font-bold font-mono text-red-800 bg-red-100 hover:bg-red-200 active:scale-95 rounded border border-red-300 transition cursor-pointer"
                              >
                                Reject
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-[9px] font-mono text-zinc-400 select-none">
                  Decision desk: {adminProposals.filter(p => p.status === "Pending").length} Items pending review.
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ================= EPILOGUE FOOTER ================= */}
        <div className="pt-8 border-t border-zinc-200 text-center text-[10px] font-mono tracking-widest text-zinc-450 uppercase space-y-1 select-none">
          <div>ARTEMIS FORUM • POWERED BY VERIFIED PORTFOLIOS</div>
          <div className="text-[9px] lowercase font-light text-zinc-400 tracking-normal">&copy; 2026 Artemis Academic Systems. All privileges reserved.</div>
        </div>

      </div>

      {/* ================= HIGH-fidelity project launcher modal ================= */}
      <AnimatePresence>
        {selectedProjectDetail && (
          <div id="project-detail-modal-overlay" className="fixed inset-0 bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 text-xs text-slate-700">
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="bg-white border border-slate-350 w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="bg-[#1C1D2A] text-slate-200 px-6 py-4 flex items-center justify-between border-b border-neutral-900 shrink-0 select-none">
                <div>
                  <span className="text-[9.5px] font-mono uppercase tracking-widest text-[#93C5FD] block">
                    {selectedProjectDetail.skillName} Evidence
                  </span>
                  <h3 className="text-sm font-bold text-white font-sans mt-0.5">
                    {selectedProjectDetail.project.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedProjectDetail(null)}
                  className="p-1.5 rounded-lg bg-[#2D2E3E] hover:bg-[#3D3E4F] text-zinc-400 hover:text-white transition cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Modal Body / Scrollable Info */}
              <div className="p-6 space-y-5 overflow-y-auto custom-scrollbar">
                
                {/* Description */}
                <div>
                  <h4 className="text-[10px] uppercase font-mono tracking-widest text-slate-400 block mb-1 font-bold">
                    Context Reflection
                  </h4>
                  <p className="text-slate-600 leading-relaxed font-sans font-medium">
                    {selectedProjectDetail.project.desc}
                  </p>
                </div>

                {/* Cognitive Evaluation Reflection */}
                <div>
                  <h4 className="text-[10px] uppercase font-mono tracking-widest text-slate-400 block mb-1 font-bold">
                    Student Reflection Summary
                  </h4>
                  <p className="text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200/60 font-medium italic">
                    "{selectedProjectDetail.reflection}"
                  </p>
                </div>

                {/* Dynamic Metrics */}
                {selectedProjectDetail.metrics.length > 0 && (
                  <div>
                    <h4 className="text-[10px] uppercase font-mono tracking-widest text-slate-400 block mb-2 font-bold select-none">
                      Performance Telemetry Indicators
                    </h4>
                    <div className="grid grid-cols-2 gap-2 select-none">
                      {selectedProjectDetail.metrics.map((m, i) => (
                        <div key={i} className="bg-indigo-50/50 border border-indigo-100 rounded-lg p-2 flex items-center space-x-2">
                          <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                          <span className="font-mono text-[9.5px] font-bold text-indigo-950 truncate">{m}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Faculty Evaluation Card */}
                {Object.values(skillShowcases).find(s => s.name === selectedProjectDetail.skillName)?.facultyFeedback && (
                  <div className="bg-emerald-50/40 border border-emerald-150 p-4 rounded-xl">
                    <div className="flex items-center justify-between pb-2.5 border-b border-emerald-100/60 select-none">
                      <div className="flex items-center space-x-2">
                        <Star className="w-4 h-4 text-emerald-600 fill-emerald-500 animate-pulse" />
                        <span className="text-[10.5px] font-sans font-extrabold text-[#111827]">
                          Certified Faculty Appraisal
                        </span>
                      </div>
                      <span className="text-[9.5px] font-mono font-extrabold px-1.5 bg-emerald-100 text-emerald-800 rounded">
                        {Object.values(skillShowcases).find(s => s.name === selectedProjectDetail.skillName)?.facultyFeedback.grade}
                      </span>
                    </div>
                    <p className="text-[11.5px] text-slate-600 leading-relaxed mt-2.5 font-medium italic">
                      "{Object.values(skillShowcases).find(s => s.name === selectedProjectDetail.skillName)?.facultyFeedback.comment}"
                    </p>
                    <span className="text-[9.5px] font-mono text-emerald-700 block mt-2 font-bold uppercase tracking-wider">
                      — {Object.values(skillShowcases).find(s => s.name === selectedProjectDetail.skillName)?.facultyFeedback.facultyName}
                    </span>
                  </div>
                )}

              </div>

              {/* Modal Footer */}
              <div className="bg-slate-50 border-t border-slate-200 px-6 py-3.5 flex items-center justify-between shrink-0 select-none">
                <span className="text-[9.5px] font-mono text-slate-400">Ledger Index: wu-sam-2025</span>
                <button
                  type="button"
                  onClick={() => setSelectedProjectDetail(null)}
                  className="py-1.5 px-3.5 text-[11px] font-sans font-extrabold bg-slate-800 hover:bg-slate-900 text-white transition rounded-lg shadow-sm cursor-pointer"
                >
                  Accept & Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= FLOATING ACTION ASSISTANT & CHAT DRAWER ================= */}
      {/* Floating Sparkle Trigger Button with active green pulse and glowing indicator */}
      <div className="fixed bottom-6 right-6 z-40 selection:bg-slate-200 shadow-xl rounded-full">
        <button
          onClick={() => setIsAssistantOpen(true)}
          className="bg-[#EA580C] hover:bg-[#d54e08] text-white px-5 py-3.5 rounded-full shadow-2xl flex items-center space-x-2.5 transition duration-200 hover:scale-105 active:scale-95 group focus:outline-none border border-orange-500 font-sans cursor-pointer font-bold"
        >
          <div className="relative flex">
            <span className="animate-ping absolute inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400 opacity-75" />
            <Sparkles className="w-5 h-5 text-white shrink-0 animate-pulse relative" />
          </div>
          <span className="text-[11px] font-bold font-mono uppercase tracking-wider pr-1">
            {userCluster === "k12" ? "Artemis Companion" : userCluster === "seniors" ? "Serene Oasis" : "Artemis Assistant"}
          </span>
          <span className="h-2 w-2 rounded-full bg-emerald-400 border border-white shrink-0 animate-pulse" />
        </button>
      </div>

      {/* Floating Slide-over Control Drawer */}
      <AnimatePresence>
        {isAssistantOpen && (
          <>
            {/* Backdrop block overlay with smooth blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAssistantOpen(false)}
              className="fixed inset-0 bg-black/60 z-50 backdrop-blur-xs cursor-pointer"
            />

            {/* Slide-over Drawer Pane */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 220 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white border-l border-slate-250 z-51 shadow-2xl flex flex-col justify-between overflow-hidden font-sans text-neutral-800"
            >
              
              {/* Drawer Header Segment */}
              <div className="p-5 border-b border-zinc-150 bg-slate-50 flex items-center justify-between select-none">
                <div className="space-y-1 mt-1">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4.5 h-4.5 text-orange-600 shrink-0" />
                    <h3 className="text-[13.5px] font-sans font-extrabold text-[#152A63] uppercase tracking-wide">
                      {userCluster === "k12" ? "Companion Assistant Coach" : userCluster === "seniors" ? "Serene Mind Advisor" : "Artemis Spotlight Assistant"}
                    </h3>
                  </div>
                  <p className="text-[10px] text-zinc-400 uppercase font-mono font-bold tracking-wider">
                    Powered by Lifelong Intelligent Tutoring
                  </p>
                </div>
                <button
                  onClick={() => setIsAssistantOpen(false)}
                  className="p-1.5 rounded-full hover:bg-slate-200 text-zinc-500 hover:text-zinc-805 transition cursor-pointer"
                  title="Hide tutor overlay"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              {/* Drawer Body Scroll Content */}
              <div className="flex-grow overflow-y-auto p-5 space-y-5 bg-slate-50/30">
                
                {/* Status Indicator Bar */}
                <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between shadow-xs">
                  <div className="space-y-0.5 whitespace-nowrap overflow-hidden">
                    <div className="text-[8.5px] font-mono text-zinc-400 font-extrabold uppercase tracking-wider">System Cluster Status</div>
                    <div className="text-[11px] font-sans font-bold text-slate-900 truncate">
                      {userCluster === "k12" ? "K-12 Playful Exploration Active" : userCluster === "seniors" ? "Oasis Reflection Active" : "University Study Active"}
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 shrink-0 ml-3">
                    <span className="h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[8.5px] font-mono font-extrabold text-green-600 uppercase bg-green-50 border border-green-150 px-1.5 py-0.2 rounded">Core Live</span>
                  </div>
                </div>

                <p className="text-[11.5px] text-zinc-500 leading-relaxed font-semibold">
                  {userCluster === "k12" && "Ask your Companion Coach any question about your board game or nature projects!"}
                  {userCluster === "university" && "Query the underlying tutoring core for adaptive advice based on Cornerstone HCs."}
                  {userCluster === "seniors" && "Inquire about classical orchestral symphony form, memory transcribing, or ask tech tips."}
                </p>

                {/* Intelligent chips prompt suggestions */}
                <div className="space-y-2">
                  <div className="text-[9px] font-mono font-bold uppercase tracking-wider text-zinc-400">Recommended Guidance Prompts</div>
                  <div className="flex flex-col gap-1.5">
                    {(suggestedClusterPrompts[userCluster] || suggestedClusterPrompts.university).map((itm) => (
                      <button
                        key={itm.id}
                        onClick={() => handlePromptClick(itm.prompt, itm.id)}
                        className={`p-3 text-left text-[11px] leading-relaxed rounded-xl transition duration-150 border cursor-pointer ${
                          activeChip === itm.id
                            ? "bg-[#EA580C] text-white border-[#EA580C] font-bold shadow-xs scale-[0.99]"
                            : "bg-white border-zinc-200 text-zinc-650 hover:bg-slate-50 hover:text-zinc-900"
                        }`}
                      >
                        {itm.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Response Visual Panel */}
                {aiResponse ? (
                  <div className="bg-white rounded-xl border border-zinc-200 p-4.5 space-y-3 animate-fade-in relative transition-all">
                    <div className="flex items-center justify-between border-b border-zinc-200 pb-2">
                      <div className="flex items-center space-x-1.5">
                        <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full" />
                        <span className="text-[9px] font-mono tracking-wider font-extrabold text-indigo-700 uppercase">
                          {userCluster === "k12" ? "ADVENTURE LOG TIPS" : userCluster === "seniors" ? "STUDY ESSAY SHIELD" : "ACTIVE ADVISORY SHEET"}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          setAiResponse(null);
                          setActiveChip("");
                        }}
                        className="p-1 text-zinc-455 hover:text-zinc-800 transition rounded-full hover:bg-zinc-200"
                        title="Clear output"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="text-zinc-700 leading-relaxed font-serif text-[12.5px] whitespace-pre-wrap select-text font-medium">
                      {aiResponse}
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-100/50 border border-dashed border-slate-250 rounded-xl p-5 text-center select-none">
                    <Sparkles className="w-6 h-6 text-slate-350 mx-auto mb-2 animate-pulse" />
                    <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest leading-none">Awaiting Tutor Queries</p>
                    <p className="text-[10.5px] text-slate-400 mt-1 leading-normal">Select an onboarding prompt above or type a custom question below to consult Artemis.</p>
                  </div>
                )}

              </div>

              {/* Drawer Footer Input Area */}
              <div className="p-4 border-t border-zinc-200 bg-white space-y-3 shrink-0">
                
                {/* Input Capsule */}
                <div className="h-11 border border-slate-200 focus-within:border-orange-500 rounded-xl flex items-center px-3 gap-2 bg-slate-50 focus-within:bg-white transition-all">
                  <Search className="w-4 h-4 text-zinc-450 shrink-0" />
                  <input
                    type="text"
                    placeholder={userCluster === "k12" ? "Ask me how to break down plans... " : "Query strategies, music motifs..."}
                    className="flex-grow min-w-0 bg-transparent text-zinc-900 text-xs font-sans outline-none placeholder-zinc-450 font-semibold"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        if (aiPrompt.trim() && !aiLoading) executeAiQuery();
                      }
                    }}
                  />
                  <button
                    onClick={() => executeAiQuery()}
                    disabled={aiLoading || !aiPrompt.trim()}
                    className="bg-[#152A63] hover:bg-[#0e2050] text-white disabled:bg-zinc-205 disabled:text-zinc-400 font-extrabold px-3.5 h-7 rounded-lg text-xs transition shrink-0 cursor-pointer"
                  >
                    {aiLoading ? "Thinking..." : "Run"}
                  </button>
                </div>
                
                <div className="flex items-center justify-between text-[8px] font-mono text-zinc-400 uppercase font-bold select-none pr-1">
                  <span>Ledger State: Secure</span>
                  <span>Session: active-tutoring-v2</span>
                </div>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
