import React, { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import {
  Settings,
  HelpCircle,
  Cloud,
  ChevronDown,
  ChevronRight,
  Plus,
  Trash2,
  ListPlus,
  Compass,
  FileText,
  User,
  ExternalLink,
  Sliders,
  Play,
  Share2,
  Calendar,
  Grid,
  Sparkles,
  Search,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";

// Preset lesson structures for multi-activity navigation
interface ActivityStep {
  id: string;
  name: string;
  layout: string;
  mode: string;
  duration: string;
}

interface LessonNode {
  id: string;
  title: string;
  duration: string;
  notes: string;
  learningGoals: string;
  featureUser: string;
  focusQuestions: string[];
  tags: string[];
  trackableObjectives: string[];
  steps: ActivityStep[];
}

interface CourseBuilderProps {
  onBackToDashboard?: () => void;
}

export default function CourseBuilder({
  onBackToDashboard,
}: CourseBuilderProps = {}) {
  const [activeSidebarTab, setActiveSidebarTab] = useState<
    "activities" | "steps" | "elements" | "resources"
  >("activities");

  // Selected node in middle-left catalog list
  const [selectedNodeId, setSelectedNodeId] = useState<string>("act2"); // Matches "Activity #2" from screenshot

  // Custom feedback/alert notification
  const [notification, setNotification] = useState<string | null>(null);

  // Lesson Outline State
  const [lessonNodes, setLessonNodes] = useState<LessonNode[]>([
    {
      id: "intro",
      title:
        "Class Introduction: Unit / BQ / HC Context and Lesson Introduction",
      duration: "10m",
      featureUser: "Quiet Student",
      focusQuestions: [
        "How do we identify primary modes of multimodal media?",
        "What constraints define immediate sensory feedback loops?",
      ],
      tags: ["Multimodal Media", "Communication"],
      trackableObjectives: ["OBJ-1: Identify Multimodal Signals"],
      notes:
        "Introduce class objectives, evaluate the syllabus context, and present current dynamic Habits of Mind.",
      learningGoals:
        "Identify historical precedence of multimodal signaling in active mass campaigns.",
      steps: [
        {
          id: "step-i1",
          name: "Introduction",
          layout: "LAYOUT: 2-UP",
          mode: "infotransfer",
          duration: "5m",
        },
        {
          id: "step-i2",
          name: "HC Overview",
          layout: "LAYOUT: Full Screen",
          mode: "quiz",
          duration: "5m",
        },
      ],
    },
    {
      id: "prep",
      title: "Preparatory Assessment",
      duration: "15m",
      featureUser: "Random Active Student",
      focusQuestions: [
        "Can citizens override systematic misinformation networks?",
        "Does nonviolent intervention decrease overall counter-repression costs?",
      ],
      tags: ["Misinformation", "Nonviolent Intervention"],
      trackableObjectives: ["OBJ-2: Differentiate Vectors"],
      notes:
        "Initiate preparatory polls A, B, C, and D. Compare students responses live against last years data benchmarks.",
      learningGoals:
        "Differentiate core statistical correlation vectors under diverse geopolitical strategies.",
      steps: [
        {
          id: "step-p1",
          name: "Poll A Strategy Selector",
          layout: "LAYOUT: 3-UP",
          mode: "quiz",
          duration: "3m",
        },
        {
          id: "step-p2",
          name: "Poll B Counter-Backfire",
          layout: "LAYOUT: 3-UP",
          mode: "quiz",
          duration: "4m",
        },
        {
          id: "step-p3",
          name: "Poll C & D Reflection Summary",
          layout: "LAYOUT: Full Screen",
          mode: "discussion",
          duration: "8m",
        },
      ],
    },
    {
      id: "act1",
      title: "Activity #1: Developing Thesis Statements",
      duration: "25m",
      featureUser: "Least Talkative Student",
      focusQuestions: [
        "Evaluate the structural constraints inside our Strategy 6 campaign map.",
        "What analogies reinforce direct citizen actions?",
      ],
      tags: ["Thesis Formulation", "Structural Constraints"],
      trackableObjectives: ["OBJ-3: Evaluate Effectiveness"],
      notes:
        "Group students into breakouts. Instruct them to draft initial thesis structures referencing empirical nonviolence datasets.",
      learningGoals:
        "Formulate thesis statements evaluating the statistical effectiveness of mass protests.",
      steps: [
        {
          id: "step-a1-1",
          name: "Breakout Assembly",
          layout: "LAYOUT: 2-UP",
          mode: "breakout",
          duration: "15m",
        },
        {
          id: "step-a1-2",
          name: "Peer Evidentiary Critique",
          layout: "LAYOUT: 3-UP",
          mode: "discussion",
          duration: "10m",
        },
      ],
    },
    {
      id: "act2", // Currently viewed in screenshot!
      title: "Activity #2: Outlining an Argument",
      duration: "31m",
      featureUser: "Quiet Student",
      focusQuestions: [
        "How does moral legitimacy optimize volunteer safety rates?",
        "Can we measure structural elasticity values in modern digital forums?",
      ],
      tags: ["Argument Outline", "Moral Legitimacy"],
      trackableObjectives: ["OBJ-4: Organize Support"],
      notes:
        "Students work in groups to outline the argument that follows from one of the thesis statements created in the last activity. They organize the outline and provide support for the thesis.\n\nIMPORTANT: Before class, set up the breakout groups for this activity so that they match the groups from Activity 1.",
      learningGoals:
        "Outline an effective argument for a thesis statement using appropriate organization and support.",
      steps: [
        {
          id: "step-a2-1",
          name: "Introduction",
          layout: "LAYOUT: 2-UP",
          mode: "infotransfer",
          duration: "1m",
        },
        {
          id: "step-a2-2",
          name: "Breakout Outlining Frameworks",
          layout: "LAYOUT: 3-UP",
          mode: "breakout",
          duration: "15m",
        },
        {
          id: "step-a2-3",
          name: "Debrief: Evaluating Outlines",
          layout: "LAYOUT: Full Screen",
          mode: "discussion",
          duration: "10m",
        },
        {
          id: "step-a2-4",
          name: "Activity Summary",
          layout: "LAYOUT: 2-UP",
          mode: "infotransfer",
          duration: "5m",
        },
      ],
    },
    {
      id: "wrapup",
      title: "Wrap-up: Session Reflections & Summary",
      duration: "14m",
      featureUser: "High Contributor Profile",
      focusQuestions: [
        "How will you incorporate modern peer review heuristics in your capstone work?",
      ],
      tags: ["Reflections", "Peer Review"],
      trackableObjectives: ["OBJ-5: Integrate Feedback Models"],
      notes:
        "Trigger final reflection course poll, complete student feedback loops, and distribute reading assignments for Session 13.3.",
      learningGoals:
        "Integrate multi-modal feedback models into regular academic drafting.",
      steps: [
        {
          id: "step-w1",
          name: "Reflection Poll",
          layout: "LAYOUT: Full Screen",
          mode: "quiz",
          duration: "5m",
        },
        {
          id: "step-w2",
          name: "Session Summary",
          layout: "LAYOUT: 2-UP",
          mode: "infotransfer",
          duration: "9m",
        },
      ],
    },
  ]);

  // Sidebar activity templates
  const activityTemplates = [
    {
      title: "Blank Activity",
      subtitle: "Adds an unconfigured spacer canvas with raw guidelines",
    },
    {
      title: "Class Introduction",
      subtitle: "Unit / Topic / LO Context. Preset for 2-UP layout view",
    },
    {
      title: "Hook",
      subtitle: "Designed to capture student focus via video inputs",
    },
    {
      title: "Preparatory Assessment",
      subtitle: "Integrated multi-stage poll arrays (A-D series)",
    },
    {
      title: "Common Confusions / Explanations",
      subtitle: "Instructors guide resolving key student cognitive blockers",
    },
    {
      title: "Simple Discussion",
      subtitle: "Introduction, live speech discourse, and closure moment",
    },
    {
      title: "Task-based discussion",
      subtitle: "Breakout tasks followed by feedback debrief charts",
    },
    {
      title: "Poll-based discussion",
      subtitle: "Live opinion feedback scales paired with group critique",
    },
  ];

  // Steps preset blocks
  const stepPresets = [
    {
      name: "Breakouts Work",
      layout: "LAYOUT: 3-UP",
      mode: "breakout",
      duration: "15m",
    },
    {
      name: "Poll Survey Arena",
      layout: "LAYOUT: Full Screen",
      mode: "quiz",
      duration: "5m",
    },
    {
      name: "Debrief Session",
      layout: "LAYOUT: 2-UP",
      mode: "discussion",
      duration: "10m",
    },
    {
      name: "Lecture Block",
      layout: "LAYOUT: Full Screen",
      mode: "infotransfer",
      duration: "8m",
    },
  ];

  // Focus User Profiles
  const userProfiles = [
    "Quiet Student",
    "Least Talkative Student",
    "Highly Volatile Participant",
    "Random Active Student",
    "High Contributor Profile",
    "Instructor Co-facilitator",
  ];

  // Persistent Database State Syncer for Course Builder
  const [isFirebaseLoaded, setIsFirebaseLoaded] = useState(false);

  useEffect(() => {
    async function loadFirebaseLessons() {
      try {
        const docRef = doc(db, "courses", "lesson-plan-builder");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().nodes) {
          setLessonNodes(docSnap.data().nodes);
        }
      } catch (err) {
        console.error("Firestore loading error:", err);
      } finally {
        setIsFirebaseLoaded(true);
      }
    }
    loadFirebaseLessons();
  }, []);

  useEffect(() => {
    if (!isFirebaseLoaded) return;
    async function saveFirebaseLessons() {
      try {
        const docRef = doc(db, "courses", "lesson-plan-builder");
        await setDoc(docRef, { nodes: lessonNodes });
      } catch (err) {
        console.error("Firestore saving error:", err);
      }
    }
    saveFirebaseLessons();
  }, [lessonNodes, isFirebaseLoaded]);

  // Helper to load selected node
  const activeNode =
    lessonNodes.find((item) => item.id === selectedNodeId) || lessonNodes[0];

  // Modify currently loaded active node fields
  const handleUpdateNode = (updated: Partial<LessonNode>) => {
    setLessonNodes((prev) =>
      prev.map((node) => {
        if (node.id === selectedNodeId) {
          return { ...node, ...updated };
        }
        return node;
      }),
    );
  };

  // Add a focus question to currently selected node
  const handleAddFocusQuestion = () => {
    const updatedQuestions = [
      ...activeNode.focusQuestions,
      "New Focus Question Guideline...",
    ];
    handleUpdateNode({ focusQuestions: updatedQuestions });
    triggerNotification("Focus question added! Edit it inline.");
  };

  // Remove a focus question
  const handleRemoveFocusQuestion = (index: number) => {
    const updatedQuestions = activeNode.focusQuestions.filter(
      (_, idx) => idx !== index,
    );
    handleUpdateNode({ focusQuestions: updatedQuestions });
    triggerNotification("Focus question removed.");
  };

  // Edit a focus question inline
  const handleEditFocusQuestion = (index: number, val: string) => {
    const updatedQuestions = [...activeNode.focusQuestions];
    updatedQuestions[index] = val;
    handleUpdateNode({ focusQuestions: updatedQuestions });
  };

  // Append step inside active node
  const handleAddStepToNode = (
    name: string,
    layout: string,
    mode: string,
    duration: string,
  ) => {
    const list = [...activeNode.steps];
    const newId = `step-new-${Date.now()}`;
    list.push({ id: newId, name, layout, mode, duration });
    handleUpdateNode({ steps: list });
    recalculateNodeDuration(list);
    triggerNotification(`Added new step: "${name}"`);
  };

  // Remove step from node
  const handleRemoveStepFromNode = (stepId: string) => {
    const list = activeNode.steps.filter((s) => s.id !== stepId);
    handleUpdateNode({ steps: list });
    recalculateNodeDuration(list);
    triggerNotification("Step removed from activity.");
  };

  // Edit duration or description of a step
  const handleEditStepField = (
    stepId: string,
    updatedField: Partial<ActivityStep>,
  ) => {
    const list = activeNode.steps.map((s) => {
      if (s.id === stepId) {
        return { ...s, ...updatedField };
      }
      return s;
    });
    handleUpdateNode({ steps: list });
    recalculateNodeDuration(list);
  };

  // Utility to parse individual durations and sum up total minutes
  const recalculateNodeDuration = (stepsList: ActivityStep[]) => {
    let totalMinutes = 0;
    stepsList.forEach((s) => {
      const mins = parseInt(s.duration.replace(/[^0-9]/g, ""), 10);
      if (!isNaN(mins)) {
        totalMinutes += mins;
      }
    });
    handleUpdateNode({ duration: `${totalMinutes}m` });
  };

  // Trigger feedback banner
  const triggerNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  // Insert custom new Activity group into workspace outline
  const handleInsertNewActivity = (title: string) => {
    const newId = `act-user-${Date.now()}`;
    const newAct: LessonNode = {
      id: newId,
      title: title,
      duration: "10m",
      featureUser: "Quiet Student",
      focusQuestions: [
        "How can we apply our foundational habits of mind to this activity?",
      ],
      tags: [],
      trackableObjectives: [],
      notes:
        "Add custom instructional notes here to facilitate seamless classroom delivery...",
      learningGoals: "Define learning objectives clearly for evaluation.",
      steps: [
        {
          id: `step-new-${Date.now()}`,
          name: "Introduction",
          layout: "LAYOUT: 2-UP",
          mode: "infotransfer",
          duration: "5m",
        },
        {
          id: `step-new2-${Date.now()}`,
          name: "Discussion Debrief",
          layout: "LAYOUT: Full Screen",
          mode: "discussion",
          duration: "5m",
        },
      ],
    };
    setLessonNodes((prev) => [...prev, newAct]);
    setSelectedNodeId(newId);
    triggerNotification(`Created new section: "${title}"`);
  };

  // Gemini AI Lesson Plan Generator
  const [isLessonPlanModalOpen, setIsLessonPlanModalOpen] = useState(false);
  const [courseNameInput, setCourseNameInput] = useState("AH50");
  const [topicInput, setTopicInput] = useState("Multimodal Communications");
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);

  const handleGenerateLessonPlan = async () => {
    setIsGeneratingPlan(true);
    try {
      const response = await fetch("/api/gemini/generate-lesson", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: topicInput,
          courseName: courseNameInput,
        }),
      });
      const data = await response.json();
      if (response.ok && data.lessonTimeline) {
        let parsed = data.lessonTimeline;
        
        if (Array.isArray(parsed) && parsed.length > 0) {
            const list = parsed.map((item: any, idx: number) => ({
                id: `ai-step-${Date.now()}-${idx}`,
                name: item.title || "Activity Step",
                layout: item.layout || "LAYOUT: Full Screen",
                mode: item.type || "discussion",
                duration: item.duration || "10m"
            }));
            handleUpdateNode({ steps: list });
            recalculateNodeDuration(list);
            
            if (data.recommendedHCs && data.recommendedHCs.length > 0) {
              const currentTags = [...activeNode.tags, ...data.recommendedHCs.slice(0, 2)];
              handleUpdateNode({ tags: Array.from(new Set(currentTags)) });
            }
            
            triggerNotification(`Action plan generated for ${topicInput}`);
        }
      } else {
        triggerNotification("Failed to parse standard structure. Using fallback.");
      }
    } catch (e) {
      console.error(e);
      triggerNotification("Error generating lesson plan.");
    } finally {
      setIsGeneratingPlan(false);
      setIsLessonPlanModalOpen(false);
    }
  };

  // Gemini AI Smart suggestion generator
  const [promptInput, setPromptInput] = useState(
    "Suggest 3 argumentative focus questions for Multimodal Communications",
  );
  const [isSynthesizing, setIsSynthesizing] = useState(false);

  const handleGeminiSynthesize = async () => {
    setIsSynthesizing(true);
    try {
      const response = await fetch("/api/gemini/discuss", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: `Recommend Artemis style active learning focus questions or instructions for this prompt: "${promptInput}". Return an exciting JSON-array like string or bullet outline of elements.`,
          activeStudent: "Ai Curriculum Buddy",
          previousMessages: [],
        }),
      });
      const data = await response.json();
      if (response.ok && data.text) {
        // Strip or read points
        const lines = data.text
          .split("\n")
          .filter((l: string) => l.trim().length > 3)
          .slice(0, 3);
        const formattedQuestions = lines.map((l: string) =>
          l.replace(/^[-\d.\s*]+/, "").trim(),
        );

        // Append these focus questions to the active activity
        const currentQuestions = [
          ...activeNode.focusQuestions,
          ...formattedQuestions,
        ];
        handleUpdateNode({ focusQuestions: currentQuestions });
        triggerNotification("Gemini synthesized questions added successfully!");
      }
    } catch (e) {
      console.error(e);
      // Fallback if network issue
      const fallback = [
        `What structural limits affect "${promptInput}"?`,
        `Synthesize core feedback criteria for modern communication channels.`,
      ];
      handleUpdateNode({
        focusQuestions: [...activeNode.focusQuestions, ...fallback],
      });
      triggerNotification("Appended smart preset outline.");
    } finally {
      setIsSynthesizing(false);
    }
  };

  return (
    <div className="flex flex-col bg-[#F3F4F6] text-gray-800 min-h-screen font-sans select-none">


      {/* Floating notification alert */}
      {notification && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#1e293b] text-white px-4 py-2.5 rounded-xl shadow-2xl border border-indigo-500/30 flex items-center space-x-2 animate-fade-in-up text-xs font-medium">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* 2. Main Workspace Layout */}
      <div className="flex flex-1 min-h-0 overflow-hidden flex-col lg:flex-row">
        {/* ================= COLUMN 1: LEFT DARK SLATE SIDEBAR (TEMPLATES) ================= */}
        <div className="w-full lg:w-72 bg-[#2D2E36] text-white flex flex-col shrink-0 border-r border-[#1E1F24] select-none">
          {/* Vertical tabs rail top header bar inside column 1 */}
          <div className="bg-[#1E1F24] px-3.5 py-4 border-b border-[#121316]">
            <div className="grid grid-cols-4 gap-1 text-center">
              {[
                { id: "activities", label: "ACTIVITIES", icon: FolderTextIcon },
                { id: "steps", label: "STEPS", icon: ListPlus },
                { id: "elements", label: "ELEMENTS", icon: Sliders },
                { id: "resources", label: "RESOURCES", icon: Compass },
              ].map((tab) => {
                const isSelected = activeSidebarTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveSidebarTab(tab.id as any)}
                    className={`py-2 rounded px-1 flex flex-col items-center justify-center gap-1 transition ${
                      isSelected
                        ? "bg-[#33353F] text-white border-b-2 border-orange-500 font-bold"
                        : "text-neutral-400 hover:text-white hover:bg-neutral-800/40"
                    }`}
                  >
                    <tab.icon className="w-3.5 h-3.5" />
                    <span className="text-[9px] tracking-wide font-medium">
                      {tab.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-4 bg-[#23242A] border-b border-[#1E1F24]">
            <span className="text-[10px] font-semibold text-orange-400 tracking-wider uppercase block font-mono">
              ★ Drag or Click to Add
            </span>
            <div className="h-[1px] bg-orange-500/40 w-full mt-1.5" />
          </div>

          {/* Draggable/Clickable template lists */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#2D2E36] scrollbar-thin">
            {activeSidebarTab === "activities" && (
              <>
                <p className="text-[10.5px] italic text-neutral-400 pb-1">
                  Click any blueprint element below to append it to your active
                  class schedule tree:
                </p>

                {activityTemplates.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleInsertNewActivity(item.title)}
                    className="group relative p-3 bg-[#383A45] hover:bg-[#434654] rounded-lg border-2 border-dashed border-[#505364] hover:border-orange-400/60 transition cursor-pointer select-none"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-neutral-100">
                        {item.title}
                      </span>
                      <Plus className="w-3.5 h-3.5 text-neutral-400 group-hover:text-orange-400 group-hover:scale-110 transition" />
                    </div>
                    <p className="text-[10px] text-neutral-400 mt-1 leading-snug">
                      {item.subtitle}
                    </p>
                  </div>
                ))}
              </>
            )}

            {activeSidebarTab === "steps" && (
              <>
                <p className="text-[10.5px] italic text-neutral-400 pb-1">
                  Inject active exercise intervals directly into the loaded
                  activity steps editor:
                </p>

                {stepPresets.map((preset, idx) => (
                  <div
                    key={idx}
                    onClick={() =>
                      handleAddStepToNode(
                        preset.name,
                        preset.layout,
                        preset.mode,
                        preset.duration,
                      )
                    }
                    className="p-3 bg-[#333540] hover:bg-[#3D404F] rounded-lg border border-[#494C5C] hover:border-emerald-400 transition cursor-pointer flex items-center justify-between"
                  >
                    <div>
                      <span className="text-xs text-white font-medium block">
                        {preset.name}
                      </span>
                      <div className="flex space-x-2 text-[9px] text-neutral-400 mt-0.5 font-mono">
                        <span>{preset.layout}</span>
                        <span>•</span>
                        <span>{preset.duration}</span>
                      </div>
                    </div>
                    <Plus className="w-4 h-4 text-emerald-400 hover:scale-110 transition" />
                  </div>
                ))}
              </>
            )}

            {activeSidebarTab === "elements" && (
              <div className="space-y-2.5">
                <p className="text-[10.5px] italic text-neutral-400">
                  Configure visual blocks to feed content formats:
                </p>

                <div
                  onClick={() =>
                    handleAddStepToNode(
                      "Interactive Map Analysis",
                      "LAYOUT: 3-UP",
                      "infotransfer",
                      "12m",
                    )
                  }
                  className="p-2.5 bg-[#383A45] rounded border border-neutral-700 hover:border-blue-400 cursor-pointer text-xs"
                >
                  🗺️ Shared Resource Map (12m)
                </div>

                <div
                  onClick={() =>
                    handleAddStepToNode(
                      "Rapid Poll Voting Arena",
                      "LAYOUT: Full Screen",
                      "quiz",
                      "4m",
                    )
                  }
                  className="p-2.5 bg-[#383A45] rounded border border-neutral-700 hover:border-blue-400 cursor-pointer text-xs"
                >
                  🗳️ Live Classroom Vote (4m)
                </div>

                <div
                  onClick={() =>
                    handleAddStepToNode(
                      "Collaborative Canvas Markup",
                      "LAYOUT: 3-UP",
                      "breakout",
                      "20m",
                    )
                  }
                  className="p-2.5 bg-[#383A45] rounded border border-neutral-700 hover:border-blue-400 cursor-pointer text-xs"
                >
                  🎨 Student Sketchpad (20m)
                </div>
              </div>
            )}

            {activeSidebarTab === "resources" && (
              <div className="space-y-3 min-h-0 text-center py-6">
                <FileText className="w-8 h-8 mx-auto text-neutral-500" />
                <span className="text-neutral-300 text-xs block">
                  Document Vault
                </span>
                <p className="text-[10px] text-neutral-400 px-2 leading-relaxed">
                  No additional file attachment requested. All current cases
                  automatically referenced in Google Workspace sync.
                </p>
              </div>
            )}
          </div>

            {/* Quick AI Buddy generator input embedded in sidebar */}
            <div className="p-4 bg-[#212228] border-t border-[#1E1F24]">
              <div className="flex items-center space-x-1.5 mb-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span className="text-[10px] font-bold text-neutral-200 uppercase font-mono tracking-wider">
                  Gemini AI Generation
                </span>
              </div>
              
              <button
                onClick={() => setIsLessonPlanModalOpen(true)}
                className="mt-2 mb-4 w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-[10.5px] font-semibold rounded flex items-center justify-center space-x-1.5 transition cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Generate Full Lesson Plan</span>
              </button>

              <div className="text-[10px] font-bold text-neutral-200 uppercase font-mono tracking-wider mb-1.5 border-t border-[#33353F] pt-3">
                Focus Questions Aid
              </div>
              <textarea
                rows={2}
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                className="w-full text-[10.5px] p-2 rounded bg-[#2C2D35] border border-neutral-700 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
                placeholder="Ask Gemini to draft session bullet points..."
              />

              <button
                onClick={handleGeminiSynthesize}
                disabled={isSynthesizing}
                className="mt-2 w-full py-1 bg-neutral-700 hover:bg-neutral-600 border border-neutral-600 disabled:bg-neutral-800 text-white text-[10.5px] font-semibold rounded flex items-center justify-center space-x-1.5 transition cursor-pointer"
              >
                <span>
                  {isSynthesizing
                    ? "Drafting suggestions..."
                    : "Synthesize Focus Areas"}
                </span>
              </button>
            </div>
          </div>

        {/* ================= COLUMN 2: MIDDLE-LEFT PALE GREY TREE OUTLINE ================= */}
        <div className="w-full lg:w-64 bg-[#EBEFF5] text-[#334155] p-4 flex flex-col shrink-0 border-r border-neutral-300 select-none">
          <div className="pb-3 border-b border-neutral-300 mb-3.5">
            <h3 className="text-[11px] font-bold text-slate-500 tracking-wider font-mono uppercase">
              SESSION INDEX OUTLINE
            </h3>
          </div>

          {/* Interactive tree structure nodes */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin text-xs text-left">
            {/* General Header Section */}
            <div>
              <h4 className="font-bold text-slate-700 mb-1.5 text-[11px]">
                Basic class information
              </h4>
              <ul className="space-y-1.5 pl-3 border-l-2 border-slate-300 text-[11px] text-slate-600">
                <li className="hover:text-amber-600 cursor-pointer transition flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                  <span>Readings</span>
                </li>
                <li className="hover:text-amber-600 cursor-pointer transition flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                  <span>Pre-class work</span>
                </li>
                <li className="hover:text-amber-600 cursor-pointer transition flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                  <span>Faculty readings</span>
                </li>
                {/* Underlined "Classroom activities" matching the screenshot */}
                <li className="text-indigo-600 font-bold underline cursor-pointer transition flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                  <span>Classroom activities</span>
                </li>
              </ul>
            </div>

            {/* Dynamic Interactive Active Tree Node Renderer */}
            <div className="space-y-2 mt-4">
              <h4 className="font-bold text-slate-700 text-[11px] mb-1">
                Interactive Lesson Path
              </h4>

              <div className="space-y-1.5 pl-1">
                {lessonNodes.map((node) => {
                  const isSelected = node.id === selectedNodeId;

                  return (
                    <div
                      key={node.id}
                      onClick={() => setSelectedNodeId(node.id)}
                      className={`group p-2 rounded-lg cursor-pointer transition text-left flex items-start space-x-2 ${
                        isSelected
                          ? "bg-white shadow border-l-4 border-indigo-600 font-bold text-indigo-950 scale-[1.02]"
                          : "hover:bg-slate-200/80 text-slate-700"
                      }`}
                    >
                      {isSelected ? (
                        <ChevronRight className="w-3.5 h-3.5 mt-0.5 text-indigo-600" />
                      ) : (
                        <div className="w-3.5 h-3.5 rounded-full border border-slate-400 mt-0.5 flex items-center justify-center text-[8px] group-hover:bg-indigo-100 group-hover:border-indigo-400 transition" />
                      )}

                      <div className="flex-1 min-w-0">
                        <span className="text-[11px] block leading-snug break-words">
                          {node.title}
                        </span>
                        <div className="flex items-center justify-between text-[9px] text-slate-500 font-mono mt-1">
                          <span>⏱️ {node.duration}</span>
                          {![
                            "intro",
                            "prep",
                            "act1",
                            "act2",
                            "wrapup",
                          ].includes(node.id) && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setLessonNodes((prev) =>
                                  prev.filter((n) => n.id !== node.id),
                                );
                                setSelectedNodeId("act2");
                                triggerNotification(
                                  "Section deleted from course tree.",
                                );
                              }}
                              className="text-red-500 hover:text-red-700 hover:scale-105 transition p-0.5 font-bold uppercase"
                              title="Delete Item"
                            >
                              [X]
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick action button inside index column */}
            <div className="pt-2">
              <button
                onClick={() =>
                  handleInsertNewActivity(
                    "Activity #" +
                      (lessonNodes.length - 2) +
                      ": Collaborative Synthesis",
                  )
                }
                className="w-full py-1.5 bg-slate-300 hover:bg-indigo-600 hover:text-white transition text-slate-700 text-[10px] uppercase font-mono tracking-wider font-bold rounded text-center border border-slate-400/50 cursor-pointer flex items-center justify-center space-x-1"
              >
                <Plus className="w-3 h-3" />
                <span>Add Custom Activity</span>
              </button>
            </div>
          </div>

          {/* Faux metadata display at the bottom */}
          <div className="p-3 bg-slate-200/50 rounded-lg border border-slate-300 mt-auto text-[10px] text-slate-500">
            <span className="font-mono block">Classroom Map Coordinates</span>
            <span className="block italic text-slate-600">
              AH50: Communication Vector 9.2
            </span>
          </div>
        </div>

        {/* ================= COLUMN 3: MAIN WHITE WORKSPACE (EDITOR CONTAINER) ================= */}
        <div className="flex-1 bg-white overflow-y-auto p-6 md:p-8 flex flex-col min-h-0 select-none">
          {/* Selected path identifier breadcrumb top */}
          <div className="flex items-center justify-between border-b border-neutral-200 pb-3 mb-4 shrink-0">
            <div className="flex items-center space-x-2 text-[11px] text-neutral-400 font-semibold font-mono uppercase">
              <span>Classroom activities</span>
              <span>/</span>
              <span className="text-indigo-600 font-serif font-bold text-xs sm:text-sm">{activeNode.title}</span>
            </div>

            <div className="flex items-center space-x-2">
              <span className="bg-amber-100 text-amber-800 text-[9px] px-2 py-0.5 rounded-full font-bold">
                Dynamic Sync Enabled
              </span>
            </div>
          </div>

          {/* Interactive Document Header card containing "Feature User" */}
          <div className="bg-[#FAFBFD] border border-neutral-200 rounded-xl p-5 mb-6 shadow-sm shrink-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              {/* Feature User Dropdown block matching top card in Screenshot */}
              <div>
                <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider block mb-2">
                  Feature User
                </label>

                <div className="relative">
                  <select
                    value={activeNode.featureUser}
                    onChange={(e) =>
                      handleUpdateNode({ featureUser: e.target.value })
                    }
                    className="w-full pl-3 pr-10 py-2.5 bg-white border border-neutral-300 rounded-lg text-xs font-medium text-neutral-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm appearance-none cursor-pointer"
                  >
                    {userProfiles.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-neutral-400">
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-[10px] text-neutral-400 mt-1.5 italic">
                  Determines which participation tier (e.g., quietest first) is
                  targeted for Cold Call or presentation prompts.
                </p>
              </div>

              {/* Dynamic Focus Questions card matching Screenshot */}
              <div className="flex flex-col h-full justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-neutral-500 uppercase tracking-widest block font-mono">
                      Focus Questions
                    </span>
                    <button
                      onClick={handleAddFocusQuestion}
                      className="text-[10px] font-bold text-orange-500 hover:text-orange-600 hover:underline transition cursor-pointer flex items-center space-x-0.5"
                    >
                      <Plus className="w-3 h-3" />
                      <span>+ Add another question</span>
                    </button>
                  </div>

                  <div className="space-y-2 max-h-36 overflow-y-auto pr-1 scrollbar-thin">
                    {activeNode.focusQuestions.map((q, idx) => (
                      <div
                        key={idx}
                        className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-lg border border-neutral-200 shadow-xs group"
                      >
                        <span className="text-[10.5px] font-mono text-neutral-400 font-bold">
                          {idx + 1}.
                        </span>
                        <input
                          type="text"
                          value={q}
                          onChange={(e) =>
                            handleEditFocusQuestion(idx, e.target.value)
                          }
                          className="flex-1 text-[11px] font-sans text-neutral-700 bg-transparent focus:outline-none focus:ring-1 focus:ring-indigo-100 rounded px-1 py-0.5 border border-transparent hover:border-neutral-100"
                        />
                        <button
                          onClick={() => handleRemoveFocusQuestion(idx)}
                          className="text-red-400 opacity-0 group-hover:opacity-100 hover:text-red-600 transition p-0.5 cursor-pointer"
                          title="Delete Focus Question"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Dotted templates Drop Zones matching Screenshot */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5 pt-4 border-t border-neutral-200">
              {/* Green Dashed drop zone box */}
              <div
                onClick={() =>
                  handleAddStepToNode(
                    "Dynamic Presentation Element",
                    "LAYOUT: Full Screen",
                    "infotransfer",
                    "5m",
                  )
                }
                className="group border-2 border-dashed border-[#22C55E]/60 hover:border-[#22C55E] bg-[#22C55E]/5 text-[#15803D] hover:bg-[#22C55E]/10 py-3.5 text-center rounded-lg transition cursor-pointer select-none"
              >
                <div className="flex items-center justify-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-ping" />
                  <span className="text-[10.5px] font-mono font-bold tracking-wide uppercase">
                    DRAG A NEW ELEMENT FROM THE LEFT COLUMN
                  </span>
                </div>
                <p className="text-[9.5px] text-[#166534] mt-0.5 opacity-80">
                  (Or click here to inject a standard elements presentation
                  block)
                </p>
              </div>

              {/* Orange Dashed drop zone box */}
              <div
                onClick={() =>
                  handleAddStepToNode(
                    "Breakout Synthesis Step",
                    "LAYOUT: 3-UP",
                    "breakout",
                    "15m",
                  )
                }
                className="group border-2 border-dashed border-orange-400 hover:border-orange-500 bg-orange-50/50 text-orange-700 hover:bg-orange-100/50 py-3.5 text-center rounded-lg transition cursor-pointer select-none"
              >
                <div className="flex items-center justify-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                  <span className="text-[10.5px] font-mono font-bold tracking-wide uppercase">
                    DRAG A NEW STEP FROM THE LEFT COLUMN
                  </span>
                </div>
                <p className="text-[9.5px] text-orange-850 mt-0.5 opacity-80">
                  (Or click here to inject a standard exercise Work/Breakout
                  block)
                </p>
              </div>
            </div>
          </div>

          {/* Separator thick divider line matching the visual layout of screenshot */}
          <div className="h-0.5 bg-neutral-200 w-full mb-6 shrink-0" />

          {/* 4. Lower Editable Activity Form section */}
          <div className="grid grid-cols-1 gap-5">
            {/* Title & Time allotted field side-by-side matches screenshot label style */}
            <div className="flex flex-col sm:flex-row items-baseline sm:items-center justify-between gap-4">
              <div className="flex-1 w-full">
                <span className="text-[10px] font-bold text-neutral-400 font-mono block uppercase">
                  TITLE
                </span>
                <input
                  type="text"
                  value={activeNode.title}
                  onChange={(e) => handleUpdateNode({ title: e.target.value })}
                  className="w-full border-b-2 border-neutral-200 hover:border-neutral-300 focus:border-indigo-600 focus:outline-none py-1.5 text-base font-bold text-neutral-850 font-sans"
                  placeholder="Activity Title Description..."
                />
              </div>

              <div className="w-32 shrink-0">
                <span className="text-[10px] font-bold text-neutral-400 font-mono block uppercase text-right">
                  TIME ALLOTTED
                </span>
                <div className="flex items-center justify-end">
                  <input
                    type="text"
                    value={activeNode.duration}
                    onChange={(e) =>
                      handleUpdateNode({ duration: e.target.value })
                    }
                    className="w-16 border-b-2 border-neutral-200 hover:border-neutral-300 focus:border-indigo-600 focus:outline-none text-right py-1.5 text-base font-bold text-indigo-950 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Notes for Faculty editable box matches exact image styling */}
            <div>
              <span className="text-[10.5px] font-bold text-neutral-400 font-mono block uppercase mb-1">
                NOTES FOR FACULTY
              </span>
              <div className="p-4 bg-[#F8FAFC] rounded-lg border border-neutral-200">
                <textarea
                  rows={4}
                  value={activeNode.notes}
                  onChange={(e) => handleUpdateNode({ notes: e.target.value })}
                  className="w-full bg-transparent resize-none text-[11px] leading-relaxed text-neutral-700 font-sans focus:outline-none"
                  placeholder="Provide pedagogical feedback rules for faculty instructions..."
                />
              </div>
            </div>

            {/* Learning Goals block */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-[10.5px] font-bold text-[#64748B] font-mono block uppercase mb-1">
                  ACTIVITY LEARNING GOALS
                </span>
                <div className="p-4 bg-white rounded-lg border border-neutral-200 shadow-inner">
                  <input
                    type="text"
                    value={activeNode.learningGoals}
                    onChange={(e) =>
                      handleUpdateNode({ learningGoals: e.target.value })
                    }
                    className="w-full text-[11px] font-semibold text-[#1E3A8A] focus:outline-none font-sans bg-transparent"
                    placeholder="Summarize target Habits of Mind benchmarks..."
                  />
                </div>
              </div>
              <div>
                <span className="text-[10.5px] font-bold text-[#64748B] font-mono block uppercase mb-1">
                  CROSS-CONTEXT TAGS & DISCIPLINE
                </span>
                <div className="p-4 bg-white rounded-lg border border-neutral-200 shadow-inner flex flex-wrap gap-2 items-center">
                  {(activeNode.tags || []).map((tag, idx) => (
                    <span
                      key={idx}
                      className="bg-indigo-100 text-indigo-800 text-[10px] px-2 py-1 flex items-center gap-1 rounded uppercase font-bold font-mono"
                    >
                      {tag}
                      <button
                        onClick={() => {
                          const newTags = [...activeNode.tags];
                          newTags.splice(idx, 1);
                          handleUpdateNode({ tags: newTags });
                        }}
                        className="hover:text-red-600"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && e.currentTarget.value) {
                        handleUpdateNode({
                          tags: [
                            ...(activeNode.tags || []),
                            e.currentTarget.value,
                          ],
                        });
                        e.currentTarget.value = "";
                      }
                    }}
                    className="flex-1 min-w-[100px] text-[11px] font-semibold text-slate-700 focus:outline-none font-sans bg-transparent"
                    placeholder="Add tag and press Enter..."
                  />
                </div>
              </div>
            </div>

            <div>
              <span className="text-[10.5px] font-bold text-[#64748B] font-mono block uppercase mb-1">
                SPECIFIC TRACKABLE OBJECTIVES
              </span>
              <div className="p-4 bg-white rounded-lg border border-neutral-200 shadow-inner flex flex-col gap-2">
                {(activeNode.trackableObjectives || []).map((obj, idx) => (
                  <div key={idx} className="flex items-center gap-2 group">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <input
                      type="text"
                      value={obj}
                      onChange={(e) => {
                        const newObjs = [...activeNode.trackableObjectives];
                        newObjs[idx] = e.target.value;
                        handleUpdateNode({ trackableObjectives: newObjs });
                      }}
                      className="flex-1 text-[11px] font-semibold text-slate-700 focus:outline-none font-sans bg-transparent border-b border-transparent hover:border-slate-200 focus:border-indigo-500"
                    />
                    <button
                      onClick={() => {
                        const newObjs = [...activeNode.trackableObjectives];
                        newObjs.splice(idx, 1);
                        handleUpdateNode({ trackableObjectives: newObjs });
                      }}
                      className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() =>
                    handleUpdateNode({
                      trackableObjectives: [
                        ...(activeNode.trackableObjectives || []),
                        "New trackable outcome...",
                      ],
                    })
                  }
                  className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 uppercase tracking-wider self-start mt-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Trackable Outcome
                </button>
              </div>
            </div>

            {/* Interactive Steps list inside loaded active activity */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-3.5 border-b border-neutral-100 pb-2">
                <h4 className="text-xs font-serif font-bold text-neutral-500 uppercase tracking-wide">
                  Step Outline Grid ({activeNode.steps.length} Steps Active)
                </h4>
                <div className="text-[10px] text-neutral-400 italic font-mono">
                  Sum total: {activeNode.duration}
                </div>
              </div>

              <div className="space-y-3">
                {activeNode.steps.map((st, sIdx) => (
                  <div
                    key={st.id}
                    className="flex flex-col md:flex-row items-start md:items-center justify-between p-3.5 bg-neutral-50 hover:bg-neutral-100/65 rounded-xl border border-neutral-250 transition"
                  >
                    {/* Expand/Collapse Chevron + Step index label */}
                    <div className="flex items-center space-x-3.5 flex-1 min-w-0">
                      <div className="text-slate-500 hover:text-indigo-600 cursor-pointer">
                        <ChevronRight className="w-4 h-4 transform rotate-90" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline space-x-2">
                          <span className="text-xs font-bold text-neutral-800 font-sans">
                            {st.name}
                          </span>
                          <span className="text-[10px] text-[#64748B] font-mono">
                            LAYOUT: {st.layout.replace("LAYOUT: ", "")}
                          </span>
                        </div>

                        <div className="flex items-center space-x-3 text-[10px] text-neutral-500 mt-1 font-mono">
                          <span className="bg-slate-200 text-slate-800 text-[8px] px-1.5 py-0.5 rounded font-bold uppercase">
                            {st.mode}
                          </span>
                          <span>•</span>
                          <span className="italic">
                            Classroom Visual Feed Element
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Step variables control */}
                    <div className="flex items-center space-x-4 mt-3 md:mt-0 w-full md:w-auto justify-end border-t md:border-transparent pt-2.5 md:pt-0">
                      {/* Interval duration timing */}
                      <div className="flex items-center space-x-1.5 bg-white border border-neutral-300 rounded px-2 py-1">
                        <span className="text-[9.5px] text-neutral-400 font-mono">
                          Duration:
                        </span>
                        <input
                          type="text"
                          value={st.duration}
                          onChange={(e) =>
                            handleEditStepField(st.id, {
                              duration: e.target.value,
                            })
                          }
                          className="w-10 text-[10.5px] font-bold text-indigo-950 text-center font-mono focus:outline-none"
                        />
                      </div>

                      {/* Layout configurator */}
                      <select
                        value={st.layout}
                        onChange={(e) =>
                          handleEditStepField(st.id, { layout: e.target.value })
                        }
                        className="text-[10px] bg-white border border-neutral-300 rounded px-1.5 py-1 text-slate-700 font-medium focus:outline-none cursor-pointer"
                      >
                        <option value="LAYOUT: 2-UP">2-UP split</option>
                        <option value="LAYOUT: 3-UP">3-UP grid</option>
                        <option value="LAYOUT: Full Screen">Full Screen</option>
                      </select>

                      {/* Step delete button */}
                      <button
                        onClick={() => handleRemoveStepFromNode(st.id)}
                        className="text-neutral-400 hover:text-red-500 transition p-1.5 hover:bg-neutral-200 rounded-full cursor-pointer"
                        title="Delete Step"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {isLessonPlanModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="text-sm font-bold text-slate-800 font-sans flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                Generate Lesson Plan
              </h3>
              <button 
                onClick={() => setIsLessonPlanModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer transition"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-4 text-left">
              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold text-slate-500 uppercase">Course Name</label>
                <input 
                  type="text"
                  value={courseNameInput}
                  onChange={e => setCourseNameInput(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="e.g. AH50 or Introduction to CS"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold text-slate-500 uppercase">Topic / Theme</label>
                <input 
                  type="text"
                  value={topicInput}
                  onChange={e => setTopicInput(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="e.g. Multimodal Communications"
                />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end space-x-2">
              <button
                onClick={() => setIsLessonPlanModalOpen(false)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerateLessonPlan}
                disabled={isGeneratingPlan || !courseNameInput.trim() || !topicInput.trim()}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-xs font-bold rounded-lg transition shadow-sm flex items-center space-x-2"
              >
                {isGeneratingPlan ? (
                  <>
                    <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin-slow"></span>
                    <span>Synthesizing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Generate Outline Steps</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Custom simple fallback wrapper icon
function FolderTextIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4" />
      <polyline points="14 2 14 8 20 8" />
      <path d="M2 15h10" />
      <path d="m9 18 3-3-3-3" />
    </svg>
  );
}
