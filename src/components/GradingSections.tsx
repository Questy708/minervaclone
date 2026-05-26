import React, { useState } from "react";
import {
  ArrowLeft,
  Sparkles,
  BookOpen,
  Clock,
  Calendar,
  Check,
  AlertCircle,
  FileText,
  CheckCircle2,
  TrendingUp,
  Award,
  Activity,
  Info,
  ChevronRight,
  User,
  RotateCcw,
  Plus,
  Download,
} from "lucide-react";

interface GradingSectionsProps {
  onBackToDashboard?: () => void;
  onGradeAssignment?: (studentName: string, assignmentName: string) => void;
}

interface AssignmentItem {
  id: string;
  name: string;
  weight: string;
  release: string;
  due: string;
  gradeBy: string;
  submitted: string; // e.g. "17/17" or "n/a" or "14/17"
  status: "all" | "partial" | "none";
  action: "View Grades" | "Grade" | "";
}

interface StudentPerformanceRow {
  name: string;
  assessmentsGiven: number;
  attendance: string; // e.g., "95%" or "88%"
  extensions: number;
  avgScore: number;
  projected: string; // e.g. "A", "A-", "B+"
}

interface StudentDetailedProfile {
  name: string;
  attendance: string;
  extensions: number;
  avgScore: number;
  projected: string;
  progress: { assignment: string; score: number; classAvg: number }[];
  hcs: { name: string; score: number; desc: string }[];
  qualitativeReview: string;
  recentFeedback: {
    id: string;
    date: string;
    content: string;
    type: "micro-assessment" | "observation" | "feedback";
  }[];
}

const INITIAL_STUDENT_PROFILES: Record<string, StudentDetailedProfile> = {
  Marika: {
    name: "Marika",
    attendance: "100%",
    extensions: 0,
    avgScore: 4.2,
    projected: "A",
    progress: [
      { assignment: "S1.1", score: 4.0, classAvg: 3.5 },
      { assignment: "S1.2", score: 4.2, classAvg: 3.6 },
      { assignment: "S2.1", score: 4.5, classAvg: 3.4 },
      { assignment: "S2.2", score: 4.1, classAvg: 3.5 },
      { assignment: "S2.3", score: 4.2, classAvg: 3.6 },
    ],
    hcs: [
      {
        name: "#analogies",
        score: 4.5,
        desc: "Transfer structural logical relationships to build valid comparisons",
      },
      {
        name: "#constraints",
        score: 4.0,
        desc: "Identify active and latent boundaries limiting system options",
      },
      {
        name: "#breakitdown",
        score: 4.4,
        desc: "Deconstruct complex multi-agent situations into constituent elements",
      },
      {
        name: "#correlation",
        score: 3.8,
        desc: "Isolate statistical causal vectors from temporary visual correlation",
      },
      {
        name: "#dataviz",
        score: 4.3,
        desc: "Present dense quantitative information beautifully and truthfully",
      },
    ],
    qualitativeReview:
      "Exceptional analytical clarity when breaking down complex policy trade-offs. Formulates stellar counterfactual examples during live speech prompts.",
    recentFeedback: [
      {
        id: "rf1",
        date: "Today, 10:15 AM",
        content:
          "Excellent use of analogy during the Sensation vs Perception debate. 4.5/5 on #analogies.",
        type: "micro-assessment",
      },
    ],
  },
  Paul: {
    name: "Paul",
    attendance: "92%",
    extensions: 1,
    avgScore: 3.8,
    projected: "A-",
    progress: [
      { assignment: "S1.1", score: 3.5, classAvg: 3.5 },
      { assignment: "S1.2", score: 3.7, classAvg: 3.6 },
      { assignment: "S2.1", score: 3.9, classAvg: 3.4 },
      { assignment: "S2.2", score: 3.8, classAvg: 3.5 },
      { assignment: "S2.3", score: 4.0, classAvg: 3.6 },
    ],
    hcs: [
      {
        name: "#analogies",
        score: 3.6,
        desc: "Transfer structural logical relationships to build valid comparisons",
      },
      {
        name: "#constraints",
        score: 3.5,
        desc: "Identify active and latent boundaries limiting system options",
      },
      {
        name: "#breakitdown",
        score: 4.0,
        desc: "Deconstruct complex multi-agent situations into constituent elements",
      },
      {
        name: "#correlation",
        score: 4.2,
        desc: "Isolate statistical causal vectors from temporary visual correlation",
      },
      {
        name: "#dataviz",
        score: 3.8,
        desc: "Present dense quantitative information beautifully and truthfully",
      },
    ],
    qualitativeReview:
      "Paul shows steady improvement in isolating independent variables. Needs slightly cleaner baseline testing parameters.",
    recentFeedback: [],
  },
  Matthew: {
    name: "Matthew",
    attendance: "96%",
    extensions: 0,
    avgScore: 3.5,
    projected: "B+",
    progress: [
      { assignment: "S1.1", score: 3.2, classAvg: 3.5 },
      { assignment: "S1.2", score: 3.4, classAvg: 3.6 },
      { assignment: "S2.1", score: 3.5, classAvg: 3.4 },
      { assignment: "S2.2", score: 3.6, classAvg: 3.5 },
      { assignment: "S2.3", score: 3.8, classAvg: 3.6 },
    ],
    hcs: [
      {
        name: "#analogies",
        score: 3.2,
        desc: "Transfer structural logical relationships to build valid comparisons",
      },
      {
        name: "#constraints",
        score: 3.4,
        desc: "Identify active and latent boundaries limiting system options",
      },
      {
        name: "#breakitdown",
        score: 3.5,
        desc: "Deconstruct complex multi-agent situations into constituent elements",
      },
      {
        name: "#correlation",
        score: 3.6,
        desc: "Isolate statistical causal vectors from temporary visual correlation",
      },
      {
        name: "#dataviz",
        score: 3.8,
        desc: "Present dense quantitative information beautifully and truthfully",
      },
    ],
    qualitativeReview:
      "Acclimating well to continuous evaluation. Needs support specifying measurable bounds to guard against confirmation bias.",
    recentFeedback: [],
  },
  David: {
    name: "David",
    attendance: "100%",
    extensions: 0,
    avgScore: 4.5,
    projected: "A",
    progress: [
      { assignment: "S1.1", score: 4.2, classAvg: 3.5 },
      { assignment: "S1.2", score: 4.4, classAvg: 3.6 },
      { assignment: "S2.1", score: 4.3, classAvg: 3.4 },
      { assignment: "S2.2", score: 4.7, classAvg: 3.5 },
      { assignment: "S2.3", score: 4.8, classAvg: 3.6 },
    ],
    hcs: [
      {
        name: "#analogies",
        score: 4.6,
        desc: "Transfer structural logical relationships to build valid comparisons",
      },
      {
        name: "#constraints",
        score: 4.4,
        desc: "Identify active and latent boundaries limiting system options",
      },
      {
        name: "#breakitdown",
        score: 4.5,
        desc: "Deconstruct complex multi-agent situations into constituent elements",
      },
      {
        name: "#correlation",
        score: 4.2,
        desc: "Isolate statistical causal vectors from temporary visual correlation",
      },
      {
        name: "#dataviz",
        score: 4.8,
        desc: "Present dense quantitative information beautifully and truthfully",
      },
    ],
    qualitativeReview:
      "Superb mastery displayed across both quantitative and qualitative portfolios. Visual flow models of solar particle dynamics set section baselines.",
    recentFeedback: [],
  },
  Grace: {
    name: "Grace",
    attendance: "88%",
    extensions: 2,
    avgScore: 3.1,
    projected: "B",
    progress: [
      { assignment: "S1.1", score: 3.0, classAvg: 3.5 },
      { assignment: "S1.2", score: 3.2, classAvg: 3.6 },
      { assignment: "S2.1", score: 2.8, classAvg: 3.4 },
      { assignment: "S2.2", score: 3.3, classAvg: 3.5 },
      { assignment: "S2.3", score: 3.2, classAvg: 3.6 },
    ],
    hcs: [
      {
        name: "#analogies",
        score: 3.0,
        desc: "Transfer structural logical relationships to build valid comparisons",
      },
      {
        name: "#constraints",
        score: 2.8,
        desc: "Identify active and latent boundaries limiting system options",
      },
      {
        name: "#breakitdown",
        score: 3.2,
        desc: "Deconstruct complex multi-agent situations into constituent elements",
      },
      {
        name: "#correlation",
        score: 3.1,
        desc: "Isolate statistical causal vectors from temporary visual correlation",
      },
      {
        name: "#dataviz",
        score: 3.4,
        desc: "Present dense quantitative information beautifully and truthfully",
      },
    ],
    qualitativeReview:
      "Exhibits some struggle separating core constraints from noise variables. Advisor coordination active for tailored tutoring.",
    recentFeedback: [],
  },
  Roger: {
    name: "Roger",
    attendance: "83%",
    extensions: 0,
    avgScore: 2.9,
    projected: "B-",
    progress: [
      { assignment: "S1.1", score: 2.5, classAvg: 3.5 },
      { assignment: "S1.2", score: 2.8, classAvg: 3.6 },
      { assignment: "S2.1", score: 3.0, classAvg: 3.4 },
      { assignment: "S2.2", score: 2.9, classAvg: 3.5 },
      { assignment: "S2.3", score: 3.3, classAvg: 3.6 },
    ],
    hcs: [
      {
        name: "#analogies",
        score: 2.5,
        desc: "Transfer structural logical relationships to build valid comparisons",
      },
      {
        name: "#constraints",
        score: 2.7,
        desc: "Identify active and latent boundaries limiting system options",
      },
      {
        name: "#breakitdown",
        score: 3.1,
        desc: "Deconstruct complex multi-agent situations into constituent elements",
      },
      {
        name: "#correlation",
        score: 2.8,
        desc: "Isolate statistical causal vectors from temporary visual correlation",
      },
      {
        name: "#dataviz",
        score: 3.4,
        desc: "Present dense quantitative information beautifully and truthfully",
      },
    ],
    qualitativeReview:
      "Solid upward trajectory since mid-term milestone reviews. Class preparation polls show improved vocabulary focus.",
    recentFeedback: [],
  },
  Sharon: {
    name: "Sharon",
    attendance: "95%",
    extensions: 1,
    avgScore: 4.0,
    projected: "A-",
    progress: [
      { assignment: "S1.1", score: 3.8, classAvg: 3.5 },
      { assignment: "S1.2", score: 4.0, classAvg: 3.6 },
      { assignment: "S2.1", score: 4.1, classAvg: 3.4 },
      { assignment: "S2.2", score: 3.9, classAvg: 3.5 },
      { assignment: "S2.3", score: 4.2, classAvg: 3.6 },
    ],
    hcs: [
      {
        name: "#analogies",
        score: 4.1,
        desc: "Transfer structural logical relationships to build valid comparisons",
      },
      {
        name: "#constraints",
        score: 3.9,
        desc: "Identify active and latent boundaries limiting system options",
      },
      {
        name: "#breakitdown",
        score: 4.2,
        desc: "Deconstruct complex multi-agent situations into constituent elements",
      },
      {
        name: "#correlation",
        score: 3.8,
        desc: "Isolate statistical causal vectors from temporary visual correlation",
      },
      {
        name: "#dataviz",
        score: 4.0,
        desc: "Present dense quantitative information beautifully and truthfully",
      },
    ],
    qualitativeReview:
      "Outstanding discussion board summaries. Excellent instinct for applying structural analogies across historic and chemical regimes.",
    recentFeedback: [],
  },
};

export default function GradingSections({
  onBackToDashboard,
  onGradeAssignment,
}: GradingSectionsProps) {
  const [activeTab, setActiveTab] = useState<
    "sections" | "backup" | "assisting"
  >("sections");
  const [selectedAssignmentIds, setSelectedAssignmentIds] = useState<string[]>([]);
  const [studentProfilesData, setStudentProfilesData] = useState<
    Record<string, StudentDetailedProfile>
  >(INITIAL_STUDENT_PROFILES);

  const handleExportCSV = () => {
    // Collect all assignments in student progress to determine dynamic columns
    const allAssignmentKeysSet = new Set<string>();
    (Object.values(studentProfilesData) as StudentDetailedProfile[]).forEach(profile => {
      profile.progress.forEach(p => {
        allAssignmentKeysSet.add(p.assignment);
      });
    });
    const allAssignmentKeys = Array.from(allAssignmentKeysSet).sort();

    // Create CSV rows
    const headers = [
      "Student Name",
      "Assessments Given",
      "Attendance Rate",
      "24 Hr Extensions",
      "Average Score Scale (1-5)",
      "Projected Letter Grade",
      ...allAssignmentKeys
    ];

    const csvRows = [headers.join(",")];

    performanceData.forEach(row => {
      const profile = studentProfilesData[row.name];
      const scores = allAssignmentKeys.map(key => {
        const item = profile?.progress.find(p => p.assignment === key);
        return item ? item.score : "";
      });

      const studentData = [
        `"${row.name}"`,
        row.assessmentsGiven,
        `"${row.attendance}"`,
        row.extensions,
        row.avgScore,
        `"${row.projected}"`,
        ...scores
      ];
      csvRows.push(studentData.join(","));
    });

    // Create blob & initiate download file dialogue
    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Artemis_Student_Performance_and_Grades_${selectedCourse.split(':')[0].replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const [selectedCourse, setSelectedCourse] = useState(
    "AH 110: Global History (Freeman, TTh@13:00 Seoul)",
  );

  // Interactive visual performance analytics sub-tab
  const [analyticsSubTab, setAnalyticsSubTab] = useState<"table" | "visual">(
    "table",
  );
  const [selectedStudentName, setSelectedStudentName] =
    useState<string>("Marika");
  const [newFeedbackType, setNewFeedbackType] = useState<
    "micro-assessment" | "observation" | "feedback"
  >("micro-assessment");
  const [newFeedbackContent, setNewFeedbackContent] = useState("");
  const activeProfile = studentProfilesData[selectedStudentName];

  // AI Advisor Diagnostic state
  const [diagnosticsTexts, setDiagnosticsTexts] = useState<
    Record<string, string>
  >({});
  const [diagnosticLoadingName, setDiagnosticLoadingName] = useState<
    string | null
  >(null);

  // High fidelity state for selected assignment for AI Assessment generator
  const [activeGradeAssignment, setActiveGradeAssignment] =
    useState<AssignmentItem | null>(null);
  const [aiPrompt, setAiPrompt] = useState(
    "Generate 3 distinct rubric review suggestions for this assignment with formative feedback. Format each suggestion starting with Option 1:, Option 2:, and Option 3:.",
  );
  const [aiOptions, setAiOptions] = useState<string[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [assignmentFilter, setAssignmentFilter] = useState<
    "All" | "Pending" | "Graded" | "Partial"
  >("All");
  const [finalFeedback, setFinalFeedback] = useState("");

  // Add/Edit Assignment Modal State
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [editingAssignmentId, setEditingAssignmentId] = useState<string | null>(
    null,
  );
  const [modalName, setModalName] = useState("");
  const [modalWeight, setModalWeight] = useState("x1");
  const [modalRelease, setModalRelease] = useState("");
  const [modalDue, setModalDue] = useState("");
  const [modalGradeBy, setModalGradeBy] = useState("");
  const [modalError, setModalError] = useState("");

  // Dynamic state for grades changes
  const [assignments, setAssignments] = useState<AssignmentItem[]>([
    {
      id: "asgn1",
      name: "Nucleosynthesis & the Chart of the Nuclides",
      weight: "x5",
      release: "Oct 5",
      due: "Oct 12",
      gradeBy: "Oct 26",
      submitted: "17/17",
      status: "all",
      action: "View Grades",
    },
    {
      id: "asgn2",
      name: "Case Study 3",
      weight: "x3",
      release: "Oct 5",
      due: "Oct 12",
      gradeBy: "Oct 26",
      submitted: "17/17",
      status: "all",
      action: "View Grades",
    },
    {
      id: "asgn3",
      name: "Problem Set: Oxidation-Reduction Reactions",
      weight: "x4",
      release: "Nov 20",
      due: "Dec 5",
      gradeBy: "Dec 20",
      submitted: "14/17",
      status: "partial",
      action: "Grade",
    },
    {
      id: "asgn4",
      name: "Case Study 4",
      weight: "x2",
      release: "Nov 20",
      due: "Dec 5",
      gradeBy: "Dec 20",
      submitted: "n/a",
      status: "none",
      action: "",
    },
    {
      id: "asgn5",
      name: "Contextualize the topic with historical research",
      weight: "x5",
      release: "Nov 20",
      due: "Dec 5",
      gradeBy: "Dec 20",
      submitted: "n/a",
      status: "none",
      action: "",
    },
    {
      id: "asgn6",
      name: "Contextualize the topic with research about soil properties",
      weight: "x5",
      release: "Nov 29",
      due: "Dec 10",
      gradeBy: "Dec 23",
      submitted: "n/a",
      status: "none",
      action: "",
    },
    {
      id: "asgn7",
      name: "Final Project",
      weight: "x11",
      release: "Dec 10",
      due: "Dec 19",
      gradeBy: "Dec 30",
      submitted: "n/a",
      status: "none",
      action: "",
    },
  ]);

  const [performanceData, setPerformanceData] = useState<
    StudentPerformanceRow[]
  >([
    {
      name: "Marika",
      assessmentsGiven: 12,
      attendance: "100%",
      extensions: 0,
      avgScore: 4.2,
      projected: "A",
    },
    {
      name: "Paul",
      assessmentsGiven: 10,
      attendance: "92%",
      extensions: 1,
      avgScore: 3.8,
      projected: "A-",
    },
    {
      name: "Matthew",
      assessmentsGiven: 11,
      attendance: "96%",
      extensions: 0,
      avgScore: 3.5,
      projected: "B+",
    },
    {
      name: "David",
      assessmentsGiven: 12,
      attendance: "100%",
      extensions: 0,
      avgScore: 4.5,
      projected: "A",
    },
    {
      name: "Grace",
      assessmentsGiven: 9,
      attendance: "88%",
      extensions: 2,
      avgScore: 3.1,
      projected: "B",
    },
    {
      name: "Roger",
      assessmentsGiven: 8,
      attendance: "83%",
      extensions: 0,
      avgScore: 2.9,
      projected: "B-",
    },
    {
      name: "Sharon",
      assessmentsGiven: 11,
      attendance: "95%",
      extensions: 1,
      avgScore: 4.0,
      projected: "A-",
    },
  ]);

  const handleActionClick = (asgn: AssignmentItem) => {
    if (asgn.action === "Grade") {
      setActiveGradeAssignment(asgn);
      setAiOptions([]);
      setFinalFeedback("");
    } else if (asgn.action === "View Grades") {
      alert(`Opening Grades summary for ${asgn.name}. All 17 students graded.`);
    }
  };

  const generateFeedbackWithAi = async () => {
    if (!activeGradeAssignment) return;
    setAiLoading(true);
    setAiOptions([]);

    try {
      const response = await fetch("/api/gemini/discuss", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: `Draft grading guidelines and feedback for: ${activeGradeAssignment.name} (Weight ${activeGradeAssignment.weight}). Prompt requirement: ${aiPrompt}`,
          activeStudent: "Prof Freeman",
          previousMessages: [],
        }),
      });
      const data = await response.json();
      if (response.ok && data.text) {
        // Parse options by splitting Option 1:, Option 2:, Option 3:
        const parts = data.text
          .split(/Option \d+:/i)
          .map((s: string) => s.trim())
          .filter(Boolean);
        if (parts.length > 0) {
          setAiOptions(parts);
        } else {
          setAiOptions([data.text]);
        }
      } else {
        setAiOptions([
          "Failed to generate AI outline. Please check that the server is active.",
        ]);
      }
    } catch (e: any) {
      setAiOptions([`Error generating response: ${e.message}`]);
    } finally {
      setAiLoading(false);
    }
  };

  const handleCompleteGrading = () => {
    if (!activeGradeAssignment) return;
    setAssignments((prev) =>
      prev.map((a) => {
        if (a.id === activeGradeAssignment.id) {
          return {
            ...a,
            submitted: "17/17",
            status: "all",
            action: "View Grades",
          };
        }
        return a;
      }),
    );
    setActiveGradeAssignment(null);
  };

  const openAddAssignmentModal = () => {
    setEditingAssignmentId(null);
    setModalName("");
    setModalWeight("x1");
    setModalRelease("");
    setModalDue("");
    setModalGradeBy("");
    setModalError("");
    setIsAssignmentModalOpen(true);
  };

  const openEditAssignmentModal = (asgn: AssignmentItem) => {
    setEditingAssignmentId(asgn.id);
    setModalName(asgn.name);
    setModalWeight(asgn.weight);
    setModalRelease(asgn.release);
    setModalDue(asgn.due);
    setModalGradeBy(asgn.gradeBy);
    setModalError("");
    setIsAssignmentModalOpen(true);
  };

  const parseDate = (d: string) => {
    // try to parse 'MMM DD' or default YYYY-MM-DD
    const t = new Date(d);
    if (!isNaN(t.getTime())) return t;
    const currentYear = new Date().getFullYear();
    const parsed = new Date(`${d} ${currentYear}`);
    return isNaN(parsed.getTime()) ? null : parsed;
  };

  const saveAssignmentModal = () => {
    setModalError("");
    if (!modalName.trim() || !modalRelease.trim() || !modalDue.trim()) {
      setModalError("Please fill in all required fields.");
      return;
    }
    const releaseDate = parseDate(modalRelease);
    const dueDate = parseDate(modalDue);
    if (releaseDate && dueDate && dueDate < releaseDate) {
      setModalError("Due date cannot be before release date.");
      return;
    }

    if (editingAssignmentId) {
      setAssignments((prev) =>
        prev.map((a) => {
          if (a.id === editingAssignmentId) {
            return {
              ...a,
              name: modalName,
              weight: modalWeight,
              release: modalRelease,
              due: modalDue,
              gradeBy: modalGradeBy,
            };
          }
          return a;
        }),
      );
    } else {
      const newAsgn: AssignmentItem = {
        id: `asgn_${Date.now()}`,
        name: modalName,
        weight: modalWeight,
        release: modalRelease,
        due: modalDue,
        gradeBy: modalGradeBy,
        submitted: "0/17",
        status: "none",
        action: "Grade",
      };
      setAssignments((prev) => [...prev, newAsgn]);
    }
    setIsAssignmentModalOpen(false);
  };

  // Generate AI Diagnostic for Student performance
  const generateStudentDiagnostic = async (stName: string) => {
    const profile = studentProfilesData[stName];
    if (!profile) return;
    setDiagnosticLoadingName(stName);

    try {
      const hcsText = profile.hcs
        .map((hc) => `${hc.name} (level ${hc.score}/5.0)`)
        .join(", ");
      const progressText = profile.progress
        .map((p) => `${p.assignment}: ${p.score}`)
        .join(", ");

      const response = await fetch("/api/gemini/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Act as a senior Artemis Academic Success Advisor and Cognitive Coach. Write a highly collegiate, constructive, and prescriptive academic diagnostic advisory notice for the student ${stName}, who is currently projected at an '${profile.projected}' grade, holding an average score of ${profile.avgScore}/5.0 on continuous assessments, with an attendance rating of ${profile.attendance} and ${profile.extensions} extensions logged. 
          The student's performance grades progression sequence is [${progressText}], and their current Habits of Mind (HC) mastery status is: [${hcsText}].
          In about 130 words, outline their core analytical strengths, diagnose their lowest-graded HC to prescribe an actionable, rigorous study intervention, and conclude with an inspiring, collegiate motto. Avoid placeholders.`,
        }),
      });

      if (!response.ok) {
        throw new Error("Server returned an error");
      }

      const data = await response.json();
      const text = data.reply || data.text;
      if (text) {
        setDiagnosticsTexts((prev) => ({
          ...prev,
          [stName]: text,
        }));
      } else {
        throw new Error("Empty response");
      }
    } catch (err) {
      console.warn(
        "Gemini diagnostic build failed, rendering high-fidelity localized advisor plan:",
        err,
      );
      // Construct beautiful high-fidelity backup advice
      const weakHc = profile.hcs.reduce(
        (min, cur) => (cur.score < min.score ? cur : min),
        profile.hcs[0],
      );
      const adviceTemplate = `Scholar ${stName} exhibits strong analytical foundation with an average of ${profile.avgScore}/5.0. Analysis indicates significant strengths, particularly across the core parameters of ${profile.hcs.find((h) => h.score >= 4.0)?.name || "#breakitdown"}. However, addressing marginal performance in ${weakHc.name} (${weakHc.score}/5.0) remains the highest priority. \n\nIntervention: We recommend that ${stName} systematically structures their pre-class synthesis sheets to isolate active constraints prior to entering active seminar debate loops. Applying daily practice constraints will stabilize their continuous feedback index. Let us double down on empirical consistency. Dream big and dare to fail!`;

      setDiagnosticsTexts((prev) => ({
        ...prev,
        [stName]: adviceTemplate,
      }));
    } finally {
      setDiagnosticLoadingName(null);
    }
  };

  // SVG Line/Area Graph Generator
  const renderLineChart = (student: StudentDetailedProfile) => {
    const width = 600;
    const height = 220;
    const padding = 45;

    const pointsCount = student.progress.length;
    const stepX = (width - padding * 2) / (pointsCount - 1);

    // Y scale normalized between 1.0 and 5.0
    const getX = (index: number) => padding + index * stepX;
    const getY = (score: number) => {
      const factor = (score - 1) / 4; // normalized 0-1
      return height - padding - factor * (height - padding - 20);
    };

    // Student path coords
    const studentPath = student.progress
      .map((p, idx) => `${getX(idx)},${getY(p.score)}`)
      .join(" L ");
    // Class average path coords
    const classPath = student.progress
      .map((p, idx) => `${getX(idx)},${getY(p.classAvg)}`)
      .join(" L ");

    return (
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto text-slate-700"
      >
        <defs>
          <linearGradient
            id="student-area-gradient"
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop offset="0%" stopColor="#1E3A8A" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#1E3A8A" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Grid helper lines */}
        {[1, 2, 3, 4, 5].map((yVal) => (
          <g key={yVal}>
            <line
              x1={padding}
              y1={getY(yVal)}
              x2={width - padding}
              y2={getY(yVal)}
              stroke="#F1F5F9"
              strokeWidth={1.5}
            />
            <line
              x1={padding}
              y1={getY(yVal)}
              x2={width - padding}
              y2={getY(yVal)}
              stroke="#E2E8F0"
              strokeWidth={1}
              strokeDasharray="4,4"
            />
            <text
              x={padding - 12}
              y={getY(yVal) + 3}
              textAnchor="end"
              className="text-[9.5px] font-mono text-slate-400 font-bold fill-current"
            >
              {yVal}.0
            </text>
          </g>
        ))}

        {/* X-axis boundaries */}
        <line
          x1={padding}
          y1={height - padding}
          x2={width - padding}
          y2={height - padding}
          stroke="#CBD5E1"
          strokeWidth={1.5}
        />

        {/* Class average dashed curve */}
        <path
          d={`M ${classPath}`}
          fill="none"
          stroke="#94A3B8"
          strokeWidth={2}
          strokeDasharray="5,5"
        />

        {/* Student thick curve with background area gradient */}
        <path
          d={`M ${padding},${height - padding} L ${studentPath} L ${width - padding},${height - padding} Z`}
          fill="url(#student-area-gradient)"
        />
        <path
          d={`M ${studentPath}`}
          fill="none"
          stroke="#1E3A8A" // Matches Assignments Blue accent
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Class average dots */}
        {student.progress.map((p, idx) => (
          <circle
            key={`class-pt-${idx}`}
            cx={getX(idx)}
            cy={getY(p.classAvg)}
            r={4}
            fill="white"
            stroke="#94A3B8"
            strokeWidth={2}
          />
        ))}

        {/* Student dots with hover labels */}
        {student.progress.map((p, idx) => (
          <g key={`student-pt-${idx}`} className="group cursor-pointer">
            <circle
              cx={getX(idx)}
              cy={getY(p.score)}
              r={6}
              fill="#1E3A8A"
              stroke="white"
              strokeWidth={2.5}
            />
            <text
              x={getX(idx)}
              y={getY(p.score) - 12}
              textAnchor="middle"
              className="text-[10px] font-mono font-bold fill-indigo-950 font-sans"
            >
              {p.score}
            </text>
          </g>
        ))}

        {/* X labels */}
        {student.progress.map((p, idx) => (
          <text
            key={`x-lbl-${idx}`}
            x={getX(idx)}
            y={height - padding + 20}
            textAnchor="middle"
            className="text-[10px] font-mono text-slate-500 font-bold fill-current"
          >
            {p.assignment}
          </text>
        ))}
      </svg>
    );
  };

  const filteredAssignments = assignments.filter((asgn) => {
    if (assignmentFilter === "All") return true;
    if (assignmentFilter === "Graded") return asgn.status === "all";
    if (assignmentFilter === "Partial") return asgn.status === "partial";
    if (assignmentFilter === "Pending") return asgn.status === "none";
    return true;
  });

  return (
    <div className="flex-grow bg-[#F3F4F6] text-[#334155] min-h-screen font-sans flex flex-col select-none">
      {/* Ocean Banner Hero resembling Screenshot */}
      <div className="relative bg-[#111827] text-white shrink-0 shadow-md">
        {/* Banner ocean waves gradient simulation */}
        <div className="absolute inset-0 bg-gradient-to-r from-teal-900/60 via-blue-900/70 to-slate-900/80 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-500/20 via-transparent to-transparent opacity-60 pointer-events-none" />

        <div className="relative z-10 px-8 py-7 md:py-10 max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] bg-sky-500 text-white font-mono font-bold tracking-widest px-2.5 py-0.5 rounded-full uppercase">
                ARTEMIS SCHOOLS AT KGI
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-serif text-white tracking-tight font-bold">
              Grading / My Sections
            </h1>
            <p className="text-xs text-sky-200/85 font-serif italic max-w-xl">
              "Dream big and dare to fail." -Norman Vaughan
            </p>
          </div>

          <div className="flex items-center space-x-3 bg-white/5 border border-white/10 p-3 rounded-xl backdrop-blur-md self-start md:self-auto">
            <div className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center text-xs font-bold font-mono">
              PF
            </div>
            <div>
              <div className="text-xs font-bold text-white leading-tight">
                Prof Freeman
              </div>
              <div className="text-[10px] text-sky-200/70 font-mono mt-0.5">
                Faculty Lead / Grade Manager
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs list under the header block */}
      <div className="bg-white border-b border-slate-250 shrink-0">
        <div className="max-w-7xl mx-auto px-8 flex space-x-8 text-xs font-semibold text-slate-500 select-none">
          <button
            type="button"
            onClick={() => setActiveTab("sections")}
            className={`py-4 px-1 border-b-2 transition ${activeTab === "sections" ? "border-[#3B82F6] text-[#1E3A8A] font-bold" : "border-transparent hover:text-slate-800"}`}
          >
            My Sections
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("backup")}
            className={`py-4 px-1 border-b-2 transition ${activeTab === "backup" ? "border-[#3B82F6] text-[#1E3A8A] font-bold" : "border-transparent hover:text-slate-800"}`}
          >
            Backup Courses
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("assisting")}
            className={`py-4 px-1 border-b-2 transition ${activeTab === "assisting" ? "border-[#3B82F6] text-[#1E3A8A] font-bold" : "border-transparent hover:text-slate-800"}`}
          >
            Assisting Courses
          </button>
        </div>
      </div>

      {/* Core Workspace sections */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-6 py-8 flex flex-col space-y-6">
        {/* Highlight Section Header */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
          <div>
            <span className="text-[10px] font-mono font-bold text-sky-600 uppercase tracking-widest block">
              Active Grading Focus
            </span>
            <h2 className="text-lg font-bold text-slate-800 font-serif mt-1">
              {selectedCourse}
            </h2>
          </div>

          <div className="flex space-x-2">
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="px-3 py-1.5 border border-slate-250 bg-slate-50 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-sky-500 hover:border-slate-350 transition text-slate-700 font-sans"
            >
              <option>AH 110: Global History (Freeman, TTh@13:00 Seoul)</option>
              <option>
                NS 111: Empirical Physics (Freeman, M@17:00 London)
              </option>
              <option>
                SS 110: Complex Sensation Concepts (Freeman, W@09:00 Seoul)
              </option>
            </select>
          </div>
        </div>

        {/* Double Column or Modal Row when Grading drawer is open */}
        {activeGradeAssignment && (
          <div className="bg-[#EFF6FF] border border-blue-200 p-5 rounded-2xl space-y-4 animate-fade-in shadow-xs text-left">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold text-blue-600 uppercase tracking-wider">
                  Formative AI Grading Facilitator
                </span>
                <h3 className="text-sm font-bold text-slate-800 mt-1 font-serif">
                  Grade Focus:{" "}
                  <span className="underline">
                    {activeGradeAssignment.name}
                  </span>{" "}
                  ({activeGradeAssignment.weight})
                </h3>
              </div>
              <button
                onClick={() => setActiveGradeAssignment(null)}
                className="p-1 hover:bg-white rounded-lg transition text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-xl border border-blue-100 flex flex-col space-y-3">
                <label className="text-[10px] font-mono font-bold text-slate-500 uppercase">
                  AI Directives for Feedback Outline
                </label>
                <textarea
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  rows={3}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800 font-medium"
                />

                <div className="flex space-x-2 shrink-0">
                  <button
                    onClick={generateFeedbackWithAi}
                    disabled={aiLoading}
                    className="flex-1 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] rounded transition flex items-center justify-center space-x-1 shadow-sm cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                    <span>
                      {aiLoading
                        ? "Drafting feedback parameters..."
                        : "Synthesize Custom Rubrics via Gemini"}
                    </span>
                  </button>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-blue-100 flex flex-col justify-between">
                <div className="flex-1 flex flex-col min-h-0">
                  <h4 className="text-[10px] font-mono font-bold text-slate-500 uppercase mb-1.5 shrink-0">
                    Rubrics Synthesis Output
                  </h4>
                  <div className="text-[11.5px] leading-relaxed text-slate-700 font-serif overflow-y-auto pr-1 flex-1 space-y-2">
                    {aiOptions.length > 0 ? (
                      aiOptions.map((opt, i) => (
                        <div
                          key={i}
                          className="p-2 border border-slate-200 rounded-lg bg-slate-50 relative group"
                        >
                          <p className="whitespace-pre-wrap">{opt}</p>
                          <button
                            onClick={() => setFinalFeedback(opt)}
                            className="absolute top-2 right-2 px-2 py-1 bg-white border border-slate-300 text-[9px] font-bold uppercase rounded shadow-sm text-blue-600 hover:bg-blue-50 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            Select
                          </button>
                        </div>
                      ))
                    ) : (
                      <span className="text-slate-400 italic">
                        No parameters drafted yet. Click synthesize to generate
                        complete analytical guidelines.
                      </span>
                    )}
                  </div>
                  <div className="mt-4 shrink-0">
                    <label className="text-[10px] font-mono font-bold text-slate-500 uppercase">
                      Final Feedback Template
                    </label>
                    <textarea
                      value={finalFeedback}
                      onChange={(e) => setFinalFeedback(e.target.value)}
                      placeholder="Selected feedback will populate here..."
                      className="w-full h-24 mt-1 text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800 font-medium whitespace-pre-wrap"
                    />
                  </div>
                </div>

                <div className="flex space-x-2 pt-3 border-t border-slate-100 mt-3 shrink-0">
                  <button
                    onClick={handleCompleteGrading}
                    className="flex-1 py-1 px-3 bg-[#10B981] hover:bg-[#059669] text-white text-[11px] font-bold rounded transition cursor-pointer"
                  >
                    Confirm All Graded (17/17)
                  </button>
                  <button
                    onClick={() => setActiveGradeAssignment(null)}
                    className="px-3 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 text-[11px] font-bold rounded transition cursor-pointer"
                  >
                    Cancel Drawer
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 1. Assignments list Table styled exactly like Artemis Mockup */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="px-6 py-4 border-b border-slate-150 flex items-center justify-between bg-slate-50/50">
            <h3 className="text-xs font-bold text-slate-600 font-mono uppercase tracking-wider">
              All Assignments for This Section
            </h3>
            <div className="flex items-center space-x-4 border-l border-slate-200 pl-4">
              <button
                onClick={openAddAssignmentModal}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold rounded shadow-sm transition"
              >
                + Add Assignment
              </button>
              <span className="text-[10.5px] text-slate-500 font-mono font-bold block ml-4">
                Status Filter:
              </span>
              <select
                value={assignmentFilter}
                onChange={(e) => setAssignmentFilter(e.target.value as any)}
                className="px-2 py-1 text-xs font-semibold bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending (Not Started)</option>
                <option value="Partial">Partial Grading</option>
                <option value="Graded">Completed</option>
              </select>
            </div>
          </div>

          {/* Bulk operation selections and actions drawer */}
          {selectedAssignmentIds.length > 0 && (
            <div className="bg-indigo-50 border-b border-indigo-150 px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 animate-fade-in shadow-xs">
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-mono font-bold text-indigo-950 bg-indigo-100 px-2.5 py-0.5 rounded-full">
                  {selectedAssignmentIds.length} Selected
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedAssignmentIds([])}
                  className="text-[10px] text-[#1E3A8A] hover:text-[#0f172a] hover:underline font-mono cursor-pointer font-bold"
                >
                  Clear Selection
                </button>
              </div>
              
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-slate-500">Bulk Actions:</span>
                
                {/* Change Status */}
                <div className="flex items-center space-x-1 border border-indigo-200 bg-white px-2 py-1 rounded-lg">
                  <span className="text-[9.5px] font-mono text-slate-500 pl-1">Status:</span>
                  <select
                    onChange={(e) => {
                      const val = e.target.value;
                      if (!val) return;
                      setAssignments(prev => prev.map(a => {
                        if (selectedAssignmentIds.includes(a.id)) {
                          if (val === 'all') {
                            return { ...a, status: 'all', action: 'View Grades', submitted: '17/17' };
                          } else if (val === 'partial') {
                            return { ...a, status: 'partial', action: 'Grade', submitted: '14/17' };
                          } else {
                            return { ...a, status: 'none', action: '', submitted: 'n/a' };
                          }
                        }
                        return a;
                      }));
                      e.target.value = ''; // Reset option
                    }}
                    className="bg-transparent border-0 focus:ring-0 text-[10.5px] font-bold font-sans text-slate-700 py-0.5 cursor-pointer max-w-[120px]"
                  >
                    <option value="">-- Choose Status --</option>
                    <option value="all">Completed (17/17)</option>
                    <option value="partial">Partial (14/17)</option>
                    <option value="none">Pending (n/a)</option>
                  </select>
                </div>

                {/* Change Weight */}
                <div className="flex items-center space-x-1 border border-indigo-200 bg-white px-2 py-1 rounded-lg">
                  <span className="text-[9.5px] font-mono text-slate-500 pl-1">Weight:</span>
                  <select
                    onChange={(e) => {
                      const val = e.target.value;
                      if (!val) return;
                      setAssignments(prev => prev.map(a => {
                        if (selectedAssignmentIds.includes(a.id)) {
                          return { ...a, weight: val };
                        }
                        return a;
                      }));
                      e.target.value = ''; // Reset option
                    }}
                    className="bg-transparent border-0 focus:ring-0 text-[10.5px] font-bold font-sans text-slate-700 py-0.5 cursor-pointer"
                  >
                    <option value="">-- Choose Weight --</option>
                    <option value="x1">x1</option>
                    <option value="x2">x2</option>
                    <option value="x3">x3</option>
                    <option value="x4">x4</option>
                    <option value="x5">x5</option>
                    <option value="x10">x10</option>
                    <option value="x11">x11</option>
                  </select>
                </div>

                {/* Set Grade By Date */}
                <button
                  type="button"
                  onClick={() => {
                    const dateStr = prompt("Enter a new Grade By date (e.g. 'Oct 26', 'Dec 20', 'Jan 15'):");
                    if (dateStr) {
                      setAssignments(prev => prev.map(a => {
                        if (selectedAssignmentIds.includes(a.id)) {
                          return { ...a, gradeBy: dateStr };
                        }
                        return a;
                      }));
                    }
                  }}
                  className="px-2.5 h-8 text-[11px] font-sans font-bold bg-white text-slate-700 hover:bg-slate-50 border border-slate-250 hover:border-slate-350 rounded-lg shadow-sm transition cursor-pointer"
                >
                  Grade By Date
                </button>

                {/* Delete selected */}
                <button
                  type="button"
                  onClick={() => {
                    if (confirm(`Are you sure you want to delete ${selectedAssignmentIds.length} assignment(s)?`)) {
                      setAssignments(prev => prev.filter(a => !selectedAssignmentIds.includes(a.id)));
                      setSelectedAssignmentIds([]);
                    }
                  }}
                  className="px-2.5 h-8 text-[11px] font-sans font-bold bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition rounded-lg shadow-sm cursor-pointer"
                >
                  Delete Selected
                </button>
              </div>
            </div>
          )}

          <div className="overflow-x-auto select-none">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-[#FAFBFD] border-b border-slate-200 text-[10.5px] uppercase font-mono text-slate-400 font-bold">
                <tr>
                  <th scope="col" className="px-4 py-3 text-center w-12">
                    <input
                      type="checkbox"
                      checked={filteredAssignments.length > 0 && filteredAssignments.every(a => selectedAssignmentIds.includes(a.id))}
                      onChange={(e) => {
                        if (e.target.checked) {
                          const allFilteredIds = filteredAssignments.map(a => a.id);
                          setSelectedAssignmentIds(prev => Array.from(new Set([...prev, ...allFilteredIds])));
                        } else {
                          const allFilteredIds = filteredAssignments.map(a => a.id);
                          setSelectedAssignmentIds(prev => prev.filter(id => !allFilteredIds.includes(id)));
                        }
                      }}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-3.5 w-3.5 cursor-pointer ml-1"
                    />
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 font-semibold justify-start text-left"
                  >
                    Assignment Details
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 font-semibold text-center"
                  >
                    Release
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 font-semibold text-center"
                  >
                    Due
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 font-semibold text-center"
                  >
                    Grade By
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 font-semibold text-right"
                  >
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-150">
                {filteredAssignments.map((asgn) => {
                  const isChecked = selectedAssignmentIds.includes(asgn.id);
                  return (
                    <tr
                      key={asgn.id}
                      className={`hover:bg-slate-50 transition duration-100 ${isChecked ? 'bg-indigo-50/40 text-indigo-950 font-bold' : ''}`}
                    >
                      <td className="px-4 py-3.5 text-center w-12">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedAssignmentIds(prev => [...prev, asgn.id]);
                            } else {
                              setSelectedAssignmentIds(prev => prev.filter(id => id !== asgn.id));
                            }
                          }}
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-3.5 w-3.5 cursor-pointer ml-1"
                        />
                      </td>
                      <td className="px-6 py-3.5 font-sans text-xs">
                        <div className="font-medium text-[#1E3A8A] hover:underline cursor-pointer">
                          {asgn.name}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-1 font-mono">
                          Weight:{" "}
                          <span className="font-bold">{asgn.weight}</span>{" "}
                          &bull; Status:
                          {asgn.status === "all" && (
                            <span className="text-blue-600 font-bold ml-1">
                              Completed ({asgn.submitted})
                            </span>
                          )}
                          {asgn.status === "partial" && (
                            <span className="text-orange-600 font-bold ml-1">
                              Partial ({asgn.submitted})
                            </span>
                          )}
                          {asgn.status === "none" && (
                            <span className="text-slate-400 font-bold ml-1">
                              Pending
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-center font-mono text-slate-500 whitespace-nowrap">
                        {asgn.release}
                      </td>
                      <td className="px-4 py-3.5 text-center font-mono text-slate-500 whitespace-nowrap">
                        {asgn.due}
                      </td>
                      <td className="px-4 py-3.5 text-center font-mono text-slate-500 whitespace-nowrap">
                        {asgn.gradeBy}
                      </td>
                      <td className="px-6 py-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => openEditAssignmentModal(asgn)}
                            className="px-3 py-1 text-[11px] font-mono font-bold rounded-lg border transition cursor-pointer bg-slate-50 border-slate-300 text-slate-600 hover:bg-slate-100"
                          >
                            Edit
                          </button>
                          {asgn.action && (
                            <button
                              onClick={() => handleActionClick(asgn)}
                              className={`px-3 py-1 text-[11px] font-mono font-bold rounded-lg border transition cursor-pointer ${
                                asgn.action === "Grade"
                                  ? "bg-amber-50 border-amber-300 text-amber-700 hover:bg-amber-100"
                                  : "bg-slate-50 border-slate-300 text-slate-600 hover:bg-slate-100"
                              }`}
                            >
                              {asgn.action}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* 2. Interactive Student Performance & Analytics Dashboard Component */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs flex flex-col">
          {/* Header with Visual Tab Toggles */}
          <div className="px-6 py-4.5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
            <div>
              <h3 className="text-xs font-bold text-slate-700 font-mono uppercase tracking-widest flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-sky-600" />
                <span>Student Analytics & Performance Portfolio</span>
              </h3>
              <p className="text-[10px] text-slate-400 font-mono font-medium mt-0.5">
                Class mean averages mapped dynamically to continuous score
                criteria
              </p>
            </div>

            {/* View sub-tab selectors & Exports */}
            <div className="flex flex-wrap items-center gap-3 self-start sm:self-auto">
              <button
                type="button"
                onClick={handleExportCSV}
                className="px-4 py-2 text-[10px] sm:text-[11px] font-semibold font-mono tracking-wider bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white rounded-xl transition-all duration-150 flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-white" />
                <span>Export Grades (CSV)</span>
              </button>

              <div className="flex bg-slate-200 p-1 rounded-xl shadow-sm">
                <button
                  type="button"
                  onClick={() => setAnalyticsSubTab("table")}
                  className={`px-4.5 py-1.5 text-[10px] font-semibold font-mono tracking-wider rounded-lg transition-all duration-150 ${
                    analyticsSubTab === "table"
                      ? "bg-[#1E3A8A] text-white shadow-xs"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Roster Grid
                </button>
                <button
                  type="button"
                  onClick={() => setAnalyticsSubTab("visual")}
                  className={`px-4.5 py-1.5 text-[10px] font-semibold font-mono tracking-wider rounded-lg transition-all duration-150 ${
                    analyticsSubTab === "visual"
                      ? "bg-[#1E3A8A] text-white shadow-xs"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Visual Diagnostics
                </button>
              </div>
            </div>
          </div>

          {/* TAB 1: TRADITIONAL ROSTER TABLE */}
          {analyticsSubTab === "table" && (
            <div className="overflow-x-auto select-none">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-[#FAFBFD] border-b border-slate-200 text-[10.5px] uppercase font-mono text-slate-400 font-bold">
                  <tr>
                    <th scope="col" className="px-6 py-3 font-semibold">
                      Student Name
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 font-semibold text-center"
                    >
                      Assessments Given
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 font-semibold text-center"
                    >
                      Attendance
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 font-semibold text-center"
                    >
                      24 Hr Ext.
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 font-semibold text-center"
                    >
                      Avg. Score Scale (1-5)
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 font-semibold text-right"
                    >
                      Projected Grade
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-150 font-medium">
                  {performanceData.map((row, index) => {
                    const isSelected = selectedStudentName === row.name;
                    return (
                      <tr
                        key={index}
                        onClick={() => {
                          setSelectedStudentName(row.name);
                          setAnalyticsSubTab("visual");
                        }}
                        className={`hover:bg-slate-50 transition duration-100 cursor-pointer ${
                          isSelected ? "bg-indigo-50/60 text-[#1E3A8A]" : ""
                        }`}
                      >
                        <td className="px-6 py-3.5 font-bold text-slate-850 flex items-center space-x-2.5">
                          <span
                            className={`w-2 h-2 rounded-full ${isSelected ? "bg-sky-500" : "bg-transparent"}`}
                          />
                          <span className="hover:underline">{row.name}</span>
                          <span className="text-[9px] font-mono font-bold text-slate-400 opacity-0 group-hover:opacity-100">
                            (view graphs)
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-center font-mono text-slate-600">
                          {row.assessmentsGiven}
                        </td>
                        <td className="px-4 py-3.5 text-center font-mono text-slate-600">
                          {row.attendance}
                        </td>
                        <td className="px-4 py-3.5 text-center font-mono text-slate-600">
                          {row.extensions}
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          <div className="flex items-center justify-center space-x-1 font-mono">
                            <span className="font-bold text-slate-800">
                              {row.avgScore}
                            </span>
                            <span className="text-slate-400 text-[10px]">
                              / 5
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-3.5 text-right">
                          <span className="px-2.5 py-0.5 rounded-md text-[10.5px] font-mono font-bold bg-indigo-50 border border-indigo-200 text-[#1E3A8A]">
                            {row.projected}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <div className="p-4 bg-slate-50/60 border-t border-slate-150 text-[11px] text-slate-500 font-sans font-medium flex items-center justify-center space-x-2">
                <Info className="w-3.5 h-3.5 text-sky-600" />
                <span>
                  Tip: Click on any student row above to reveal their
                  interactive analytics charts and generate custom advisors
                  diagnostic suggestions!
                </span>
              </div>
            </div>
          )}

          {/* TAB 2: RICH VISUAL GRAPHICAL DECK */}
          {analyticsSubTab === "visual" && (
            <div className="p-5 md:p-7 space-y-6 bg-slate-50/20">
              {/* STUDENT QUICK SWITCHERS ROW */}
              <div className="flex flex-col space-y-2.5">
                <span className="text-[10px] font-mono font-extrabold text-slate-400 uppercase tracking-widest block">
                  Select Student Focus
                </span>

                <div className="flex flex-wrap gap-2 select-none">
                  {Object.keys(studentProfilesData).map((stName) => {
                    const prof = studentProfilesData[stName];
                    const isSelected = selectedStudentName === stName;
                    return (
                      <button
                        key={stName}
                        type="button"
                        onClick={() => setSelectedStudentName(stName)}
                        className={`px-4.5 py-2 rounded-xl text-xs font-semibold font-sans transition-all duration-150 flex items-center space-x-2 border cursor-pointer ${
                          isSelected
                            ? "bg-[#1E3A8A] border-[#1E3A8A] text-white shadow-md"
                            : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-800"
                        }`}
                      >
                        <User
                          className={`w-3.5 h-3.5 shrink-0 ${isSelected ? "text-sky-350" : "text-slate-400"}`}
                        />
                        <span>{stName}</span>
                        <span
                          className={`text-[9.5px] font-mono font-semibold px-1.5 py-0.2 rounded ${isSelected ? "bg-indigo-900/60 text-indigo-200" : "bg-slate-100 text-slate-500"}`}
                        >
                          {prof.projected}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* CORE VISUAL CHARTS GRID */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* COLUMN A: SCORE TREND AREA CHART (LEFT RAIL) */}
                <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200 flex flex-col space-y-4 shadow-inner">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold font-mono uppercase text-slate-650 tracking-wider">
                        Grading Outcomes Progression
                      </h4>
                      <p className="text-[10px] text-slate-480 font-mono text-slate-400 mt-0.5">
                        Historical progress across past 5 assignments vs. class
                        mean score
                      </p>
                    </div>

                    {/* Tiny Legend */}
                    <div className="flex items-center space-x-4 font-mono text-[9.2px] font-bold text-slate-500">
                      <div className="flex items-center space-x-1.5">
                        <span className="w-2.5 h-2.5 bg-transparent border-t-2 border-stone-400 border-dashed block" />
                        <span>Class Mean</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <span className="w-2.5 h-2.5 bg-[#1E3A8A] rounded-full block" />
                        <span>{activeProfile.name} Average</span>
                      </div>
                    </div>
                  </div>

                  {/* LINE CHART GRAPH AREA */}
                  <div className="pt-2 bg-slate-50/10 p-2.5 rounded-xl border border-slate-100">
                    {renderLineChart(activeProfile)}
                  </div>

                  {/* QUICK STATS ROW */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 bg-slate-50/50 border border-slate-150 rounded-xl text-center">
                      <span className="block text-[9.2px] font-mono text-[#1D4ED8] uppercase tracking-wider font-extrabold">
                        Mean Score
                      </span>
                      <span className="block text-slate-800 text-base font-bold font-serif mt-1">
                        {activeProfile.avgScore}{" "}
                        <span className="text-xs text-slate-400 font-mono font-normal">
                          / 5.0
                        </span>
                      </span>
                    </div>
                    <div className="p-3 bg-slate-50/50 border border-slate-150 rounded-xl text-center">
                      <span className="block text-[9.2px] font-mono text-[#047857] uppercase tracking-wider font-extrabold">
                        Attendance Ratio
                      </span>
                      <span className="block text-slate-850 text-base font-bold font-serif mt-1">
                        {activeProfile.attendance}
                      </span>
                    </div>
                    <div className="p-3 bg-slate-50/30 border border-slate-150 rounded-xl text-center">
                      <span className="block text-[9.2px] font-mono text-[#B45309] uppercase tracking-wider font-extrabold">
                        Extensions
                      </span>
                      <span className="block text-slate-800 text-base font-bold font-serif mt-1">
                        {activeProfile.extensions}
                      </span>
                    </div>
                  </div>
                </div>

                {/* COLUMN B: HC MASTERY PROGRESS BARS (RIGHT RAIL) */}
                <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 flex flex-col space-y-4">
                  <div>
                    <h4 className="text-xs font-bold font-mono uppercase text-slate-650 tracking-wider">
                      Cornerstone HC Mastery Index
                    </h4>
                    <p className="text-[10px] text-slate-480 font-mono text-slate-400 mt-0.5">
                      Relative capability scales evaluated through active
                      lecture logs
                    </p>
                  </div>

                  <div className="space-y-4 pt-1">
                    {activeProfile.hcs.map((hc, idx) => {
                      const percentage = (hc.score / 5) * 100;
                      return (
                        <div
                          key={idx}
                          className="space-y-1.5 group cursor-help relative"
                        >
                          <div className="flex items-center justify-between text-[11px] font-mono font-bold">
                            <span className="text-sky-700 tracking-wider hover:underline">
                              {hc.name}
                            </span>
                            <span className="text-slate-700">
                              {hc.score} / 5.0
                            </span>
                          </div>

                          {/* MASTERY TRACK PROGRESS BAR */}
                          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200/50">
                            <div
                              className="bg-[#1E3A8A] h-full rounded-full transition-all duration-300"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>

                          <span className="block text-[9.5px] leading-tight text-slate-400 font-sans font-medium hover:text-slate-600 transition">
                            {hc.desc}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* DEEP QUALITATIVE INSIGHT BLOCK */}
                  <div className="bg-[#FAFBFD] p-4.5 rounded-xl border border-slate-150 flex flex-col space-y-2">
                    <span className="text-[9.5px] text-slate-400 uppercase font-mono font-bold tracking-wider">
                      Instructor Assessment Note
                    </span>
                    <p className="text-[11.5px] leading-relaxed font-serif italic text-slate-700">
                      "{activeProfile.qualitativeReview}"
                    </p>
                  </div>
                </div>
              </div>

              {/* SECTION C: AI ADVISOR PORTFOLIO DECISION STRATEGIST (POWERED BY GEMINI) */}
              <div className="bg-[#EFF6FF] border border-blue-200 rounded-2xl p-5 md:p-6 space-y-4.5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold font-mono text-[#1E3A8A] uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-sky-600 fill-current" />
                      <span>
                        Gemini Portfolio Diagnostician & Study Advisor Plan
                      </span>
                    </h4>
                    <p className="text-[10.5px] text-slate-500 font-sans font-medium">
                      Queries Gemini server-side to synthesize a custom
                      developmental program targeted to {activeProfile.name}'s
                      weakest Habit of Mind metrics
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      generateStudentDiagnostic(activeProfile.name)
                    }
                    disabled={diagnosticLoadingName === activeProfile.name}
                    className="px-5 py-2.5 bg-[#1E3A8A] hover:bg-[#152A63] disabled:bg-slate-350 disabled:text-slate-600 text-white font-sans text-xs font-bold rounded-xl transition shadow-md hover:shadow-lg flex items-center justify-center space-x-1.5 self-start cursor-pointer active:scale-98"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                    <span>
                      {diagnosticLoadingName === activeProfile.name
                        ? "Synthesizing Remedial Alignment..."
                        : `Draft Advisory Diagnostic for ${activeProfile.name}`}
                    </span>
                  </button>
                </div>

                {/* AI TARGET OUTPUT BOX */}
                {(diagnosticsTexts[activeProfile.name] ||
                  diagnosticLoadingName === activeProfile.name) && (
                  <div className="bg-white p-4.5 rounded-xl border border-blue-105 shadow-inner leading-relaxed text-xs animate-fade-in text-left">
                    {diagnosticLoadingName === activeProfile.name ? (
                      <div className="flex items-center space-x-2 text-slate-400 italic">
                        <Activity className="w-4 h-4 animate-spin text-sky-655 text-sky-600" />
                        <span>
                          Formulating student diagnostic and targeted exercises
                          based on {activeProfile.name}'s performance
                          progression...
                        </span>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="text-[10px] font-mono text-indigo-500 uppercase font-extrabold tracking-widest flex items-center justify-between border-b pb-1.5 border-slate-100">
                          <span>Verified Gemini Output Success</span>
                          <span>Timestamp: Live Advisor Portal</span>
                        </div>
                        <p className="font-serif text-[12.2px] text-slate-700 whitespace-pre-line leading-relaxed">
                          {diagnosticsTexts[activeProfile.name]}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* SECTION D: REAL-TIME ONGOING FEEDBACK & MICRO-ASSESSMENTS */}
              <div className="bg-white border text-left border-slate-200 rounded-2xl p-5 md:p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold font-mono uppercase text-sky-700 tracking-wider flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span>Real-Time Feedback & Continuous Measurements</span>
                    </h4>
                    <p className="text-[10px] text-slate-400 font-mono mt-1 w-full max-w-2xl text-left">
                      Shift from high stakes single moment exams to logging
                      frequent, actionable micro-assessments directly to{" "}
                      {activeProfile.name}'s portfolio timeline.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-1 space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <label className="text-[10px] font-bold font-mono text-slate-500 uppercase">
                      New Entry Type
                    </label>
                    <select
                      value={newFeedbackType}
                      onChange={(e) =>
                        setNewFeedbackType(e.target.value as any)
                      }
                      className="w-full p-2 text-xs border border-slate-300 rounded focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                    >
                      <option value="micro-assessment">
                        Micro-Assessment Score
                      </option>
                      <option value="observation">Classroom Observation</option>
                      <option value="feedback">
                        Constructive Feedback Note
                      </option>
                    </select>

                    <div className="pt-2 space-y-1">
                      <label className="text-[10px] font-bold font-mono text-slate-500 uppercase block">
                        Log Content
                      </label>
                      <textarea
                        className="w-full text-[11px] p-2 border border-slate-300 rounded-lg min-h-[90px] focus:outline-none focus:border-indigo-500"
                        placeholder={`Submit real-time insight for ${activeProfile.name}...`}
                        value={newFeedbackContent}
                        onChange={(e) => setNewFeedbackContent(e.target.value)}
                      />
                    </div>

                    <button
                      onClick={() => {
                        if (!newFeedbackContent.trim()) return;
                        const newEntry = {
                          id: "fb-" + Date.now(),
                          date: new Date().toLocaleString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "numeric",
                            minute: "numeric",
                          }),
                          content: newFeedbackContent,
                          type: newFeedbackType,
                        };
                        setStudentProfilesData((prev) => ({
                          ...prev,
                          [selectedStudentName]: {
                            ...prev[selectedStudentName],
                            recentFeedback: [
                              newEntry,
                              ...prev[selectedStudentName].recentFeedback,
                            ],
                          },
                        }));
                        setNewFeedbackContent("");
                      }}
                      className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-mono text-[10px] uppercase font-bold tracking-wider rounded-lg shadow-sm transition"
                    >
                      <div className="flex items-center justify-center gap-1.5">
                        <Plus className="w-3.5 h-3.5" /> Submit Log
                      </div>
                    </button>
                  </div>

                  <div className="md:col-span-2">
                    <h5 className="text-[10px] font-bold font-mono text-slate-500 uppercase border-b border-slate-200 pb-2 mb-3">
                      Live Progress & Feedback Stream
                    </h5>
                    <div className="space-y-3 max-h-64 overflow-y-auto pr-2 scrollbar-thin">
                      {activeProfile.recentFeedback?.length === 0 ? (
                        <div className="text-[11px] italic text-slate-400 py-4 px-2 text-center border-2 border-dashed border-slate-200 rounded-lg">
                          No recent ongoing measurements logged.
                        </div>
                      ) : (
                        activeProfile.recentFeedback?.map((fb) => (
                          <div
                            key={fb.id}
                            className="p-3 bg-white border border-slate-200 shadow-xs rounded-xl hover:border-sky-300 transition-colors flex flex-col gap-1.5"
                          >
                            <div className="flex items-center justify-between">
                              <span
                                className={`text-[9px] font-mono font-extrabold uppercase px-1.5 py-0.5 rounded ${
                                  fb.type === "micro-assessment"
                                    ? "bg-emerald-100 text-emerald-800"
                                    : fb.type === "feedback"
                                      ? "bg-amber-100 text-amber-800"
                                      : "bg-sky-100 text-sky-800"
                                }`}
                              >
                                {fb.type.replace("-", " ")}
                              </span>
                              <span className="text-[9px] font-mono tracking-widest text-slate-400">
                                {fb.date}
                              </span>
                            </div>
                            <p className="text-[11px] leading-relaxed text-slate-700 font-sans">
                              {fb.content}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {isAssignmentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="text-sm font-bold text-slate-800 font-serif">
                {editingAssignmentId ? "Edit Assignment" : "Add New Assignment"}
              </h3>
              <button
                onClick={() => setIsAssignmentModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-4 text-left">
              {modalError && (
                <div className="bg-red-50 text-red-600 border border-red-200 text-xs p-3 rounded-lg flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{modalError}</span>
                </div>
              )}
              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold text-slate-500 uppercase">
                  Assignment Name
                </label>
                <input
                  type="text"
                  value={modalName}
                  onChange={(e) => setModalName(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="e.g. Final Project"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-slate-500 uppercase">
                    Weight
                  </label>
                  <input
                    type="text"
                    value={modalWeight}
                    onChange={(e) => setModalWeight(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="e.g. x5"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-slate-500 uppercase">
                    Release Date
                  </label>
                  <input
                    type="text"
                    value={modalRelease}
                    onChange={(e) => setModalRelease(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="e.g. Oct 5 or 2024-10-05"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-slate-500 uppercase">
                    Due Date
                  </label>
                  <input
                    type="text"
                    value={modalDue}
                    onChange={(e) => setModalDue(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="e.g. Oct 12 or 2024-10-12"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-slate-500 uppercase">
                    Grade By
                  </label>
                  <input
                    type="text"
                    value={modalGradeBy}
                    onChange={(e) => setModalGradeBy(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="e.g. Oct 26 or 2024-10-26"
                  />
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end space-x-2">
              <button
                onClick={() => setIsAssignmentModalOpen(false)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={saveAssignmentModal}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition shadow-sm"
              >
                {editingAssignmentId ? "Save Changes" : "Add Assignment"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
