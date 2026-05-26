import React, { useState } from 'react';
import { 
  FileText, 
  Upload, 
  CheckCircle2, 
  HelpCircle, 
  Clock, 
  Award, 
  Sparkles, 
  ChevronRight, 
  AlertCircle, 
  BookOpen, 
  Plus, 
  Search,
  Filter,
  UserCheck2,
  Undo
} from 'lucide-react';
import { UserRole } from '../App';

interface Assignment {
  id: string;
  title: string;
  course: string;
  dueDate: string;
  description: string;
  outcomeTags: string[];
  points: number;
  status: 'pending' | 'submitted' | 'graded';
  submittedAt?: string;
  fileAttachment?: string;
  essayContent?: string;
  instructorFeedback?: {
    grade: string;
    comments: string;
    outcomesScored: { outcome: string; score: number; maxScore: number }[];
  };
}

const PRESET_ASSIGNMENTS: Assignment[] = [
  {
    id: 'assign-1',
    title: 'Sensation vs Perception Dualism Essay',
    course: 'SS110: Cognitive Neuroscience Foundations',
    dueDate: 'In 3 Days (May 27, 2026)',
    description: 'Deconstruct the neurological boundaries separating receptor activation from psychological awareness. Highlight the role of raw neural sensory transduction vs cortical construct. Choose one primary sensory modality (auditory, visual, or tactile) and demonstrate a specific illusion that invalidates physical realism.',
    outcomeTags: ['#perception-bias', '#neural-transduction', '#right-pricing'],
    points: 100,
    status: 'pending'
  },
  {
    id: 'assign-2',
    title: 'Spatial Transcriptomics of Mammalian Hippocampus',
    course: 'NS166: Advanced Functional Genomics',
    dueDate: 'In 1 Week (May 31, 2026)',
    description: 'Analyze raw data logs from spatial transcriptomics assays on mouse hippocampus slices. Apply dimensional reduction techniques to isolate cluster profiles for inhibitory interneurons and CA1 pyrimidals.',
    outcomeTags: ['#spatial-biology', '#induction', '#data-visualization'],
    points: 150,
    status: 'pending'
  },
  {
    id: 'assign-3',
    title: 'Deconstructed Learning System Feedback Synthesis',
    course: 'IL181: Metacognitive Practice & Interdisciplinary Design',
    dueDate: 'Yesterday (Submitted)',
    description: 'Reflect upon the deconstruction of global university pedagogy models. Critique Minerva and Arc Institute rotation methodologies, synthesizing place-based learning dynamics with virtual seminar efficiency.',
    outcomeTags: ['#learning-loops', '#metacognition', '#systemic-design'],
    points: 120,
    status: 'submitted',
    submittedAt: 'May 23, 2026 18:42 UTC',
    fileAttachment: 'metacognitive_rotation_framework_v2.pdf',
    essayContent: 'The synthesis of global rotational learning and continuous remote semantic coordination yields a hybrid model of extreme intellectual elasticity. Rotation places students in high-intensity regional tech density hubs (Palo Alto, Shibuya, London Crick) while remote learning handles formal, rigorous cornerstone workshops without interruption...'
  },
  {
    id: 'assign-4',
    title: 'Heisenberg Spin Model Simulation',
    course: 'NS111: Classical and Quantum Biophysics',
    dueDate: 'May 15, 2026',
    description: 'Formulate an interactive 1D Ising model and expand it into a Heisenberg spin simulation to analyze neural signal decay rates across synthetic biophysical boundaries.',
    outcomeTags: ['#quantum-dynamics', '#mathematical-modeling'],
    points: 80,
    status: 'graded',
    submittedAt: 'May 14, 2026 11:20 UTC',
    fileAttachment: 'heisenberg_neural_lattice.ipynb',
    essayContent: 'Using a Monte Carlo algorithm with Metropolis-Hastings sampling, we resolved the signal propagation delay boundaries. Neural spin lattices demonstrate unexpected phase resilience over 1.2 milliseconds...',
    instructorFeedback: {
      grade: 'A',
      comments: 'Excellent numerical resolution of the partition function and clear mapping of critical neural thresholds. Exceptional application of the #mathematical-modeling cornerstone outcome!',
      outcomesScored: [
        { outcome: '#quantum-dynamics', score: 4, maxScore: 5 },
        { outcome: '#mathematical-modeling', score: 5, maxScore: 5 }
      ]
    }
  }
];

interface AssignmentsModuleProps {
  role: UserRole;
  userInfo: { name: string; email: string; avatarColor: string };
}

export default function AssignmentsModule({ role, userInfo }: AssignmentsModuleProps) {
  const [assignments, setAssignments] = useState<Assignment[]>(() => {
    const saved = localStorage.getItem('artemis_assignments');
    return saved ? JSON.parse(saved) : PRESET_ASSIGNMENTS;
  });

  const [selectedId, setSelectedId] = useState<string>(PRESET_ASSIGNMENTS[0].id);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'submitted' | 'graded'>('all');

  // Submit states
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [essayText, setEssayText] = useState('');
  const [aiGenerating, setAiGenerating] = useState(false);
  const [isSuccessfullySubmitted, setIsSuccessfullySubmitted] = useState(false);

  // Faculty state: manual grading
  const [facultyGrade, setFacultyGrade] = useState('A');
  const [facultyComments, setFacultyComments] = useState('');
  const [scores, setScores] = useState<Record<string, number>>({});

  const selectedAssignment = assignments.find((a) => a.id === selectedId) || assignments[0];

  const handleSaveToLocalStorage = (newAssignments: Assignment[]) => {
    localStorage.setItem('artemis_assignments', JSON.stringify(newAssignments));
    setAssignments(newAssignments);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setUploadedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };

  const handleStudentSubmit = () => {
    if (!essayText && !uploadedFile) {
      alert("Please upload a file or write an essay response before submitting.");
      return;
    }

    const updated = assignments.map((a) => {
      if (a.id === selectedAssignment.id) {
        return {
          ...a,
          status: 'submitted' as const,
          submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 16) + ' UTC',
          fileAttachment: uploadedFile ? uploadedFile.name : 'reflection_document.txt',
          essayContent: essayText
        };
      }
      return a;
    });

    handleSaveToLocalStorage(updated);
    setIsSuccessfullySubmitted(true);
    setUploadedFile(null);
    setEssayText('');

    // Formative immediate AI grading suggestion trigger
    setAiGenerating(true);
    setTimeout(() => {
      setAiGenerating(false);
      // Auto upgrade to Graded with formative comments
      const finalUpdated = updated.map((a) => {
        if (a.id === selectedAssignment.id) {
          return {
            ...a,
            status: 'graded' as const,
            instructorFeedback: {
              grade: 'B+',
              comments: 'AI Formative Core Analyser: Synthesized arguments are structurally sound and exhibit elegant concept linkage. Excellent critical assessment of context variables.',
              outcomesScored: a.outcomeTags.map((tag) => ({
                outcome: tag,
                score: 4,
                maxScore: 5
              }))
            }
          };
        }
        return a;
      });
      handleSaveToLocalStorage(finalUpdated);
      setIsSuccessfullySubmitted(false);
    }, 2800);
  };

  const handleFacultySubmitGrading = () => {
    const updated = assignments.map((a) => {
      if (a.id === selectedAssignment.id) {
        return {
          ...a,
          status: 'graded' as const,
          instructorFeedback: {
            grade: facultyGrade,
            comments: facultyComments || 'Evaluation successfully recorded by Academic Faculty Advisor.',
            outcomesScored: a.outcomeTags.map((tag) => ({
              outcome: tag,
              score: scores[tag] || 4,
              maxScore: 5
            }))
          }
        };
      }
      return a;
    });

    handleSaveToLocalStorage(updated);
    setFacultyComments('');
    alert("Evaluation published successfully.");
  };

  const handleResetAssignments = () => {
    localStorage.removeItem('artemis_assignments');
    setAssignments(PRESET_ASSIGNMENTS);
    setSelectedId(PRESET_ASSIGNMENTS[0].id);
  };

  const filtered = assignments.filter((a) => {
    const matchesSearch = a.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      a.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.outcomeTags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (statusFilter === 'all') return matchesSearch;
    return matchesSearch && a.status === statusFilter;
  });

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden font-sans text-slate-800" id="assignments-root">
      {/* High-fidelity contextual banner */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between shrink-0" id="assignments-banner">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
            <FileText className="w-5.5 h-5.5 text-indigo-600" />
            <span>Assignments & Formative Portals</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Evaluate, test, and map Minerva-style learning outcomes via interactive submissions
          </p>
        </div>
        <div className="flex items-center gap-3 mt-3 md:mt-0">
          <button 
            onClick={handleResetAssignments}
            className="text-xs px-3 py-1.5 border border-slate-200 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition flex items-center gap-1.5"
            title="Reset to default seed coursework data"
          >
            <Undo className="w-3.5 h-3.5" />
            <span>Reset coursework</span>
          </button>
          <div className="text-xs bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg font-medium border border-slate-200 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full" />
            <span>Role Context: <strong className="uppercase">{role}</strong></span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Left pane: Task roster */}
        <div className="w-full md:w-80 border-r border-slate-200 bg-white flex flex-col divide-y divide-slate-100 shrink-0 overflow-y-auto" id="assignments-left-pane">
          {/* Filters & search */}
          <div className="p-4 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search assignments or outcomes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-hidden transition"
              />
            </div>

            <div className="flex items-center justify-between gap-1 bg-slate-150/50 p-0.5 rounded-lg border border-slate-200">
              {(['all', 'pending', 'submitted', 'graded'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setStatusFilter(tab)}
                  className={`flex-1 text-[10px] py-1 font-bold text-center capitalize rounded-md transition select-none ${
                    statusFilter === tab 
                      ? 'bg-indigo-600 text-white shadow-xs' 
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Assignments list */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {filtered.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                <AlertCircle className="w-8 h-8 mx-auto text-slate-350 mb-2" />
                <p className="text-xs font-semibold">No coursework matches filter</p>
              </div>
            ) : (
              filtered.map((item) => {
                const isActive = item.id === selectedId;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setSelectedId(item.id);
                      setUploadedFile(null);
                      setEssayText('');
                    }}
                    className={`w-full p-4 text-left transition relative flex flex-col gap-1 hover:bg-slate-50/50 border-r-2 ${
                      isActive 
                        ? 'bg-indigo-50/40 border-indigo-600' 
                        : 'border-transparent'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">
                        {item.course.split(':')[0]}
                      </span>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        item.status === 'graded' 
                          ? 'bg-emerald-550/10 text-emerald-700' 
                          : item.status === 'submitted'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100/80 text-rose-800'
                      }`}>
                        {item.status}
                      </span>
                    </div>

                    <h4 className="text-xs font-extrabold text-slate-900 leading-tight">
                      {item.title}
                    </h4>

                    <div className="flex items-center gap-1.5 text-slate-500 text-[10px] mt-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{item.dueDate}</span>
                    </div>

                    <div className="flex flex-wrap gap-1 mt-2">
                      {item.outcomeTags.map((tag) => (
                        <span key={tag} className="text-[9px] font-mono font-bold bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded-sm">
                          {tag}
                        </span>
                      ))}
                    </div>

                    {item.status === 'graded' && item.instructorFeedback && (
                      <div className="mt-2.5 pt-2 border-t border-slate-150 flex items-center justify-between text-[10px] font-semibold text-emerald-700 bg-emerald-50/20 px-2 py-1 rounded-sm">
                        <span className="flex items-center gap-1">
                          <Award className="w-3 h-3 text-emerald-600" />
                          <span>Formative Evaluation Recorded</span>
                        </span>
                        <strong className="font-extrabold text-xs">Score: {item.instructorFeedback.grade}</strong>
                      </div>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right pane: Core Workspace */}
        <div className="flex-1 overflow-y-auto bg-slate-50/65 flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-slate-200" id="assignments-core-workspace">
          
          {/* Workspace center: Problem sheet & submission console */}
          <div className="flex-1 p-6 md:p-8 space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6 md:p-8 shadow-2xs hover:shadow-xs transition duration-200">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                  <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider block">
                    {selectedAssignment.course}
                  </span>
                  <h2 className="text-lg md:text-xl font-extrabold text-slate-900 mt-1">
                    {selectedAssignment.title}
                  </h2>
                </div>
                <div className="text-right flex md:flex-col items-center md:items-end justify-between gap-2 md:gap-0 font-sans shrink-0">
                  <span className="text-xs text-slate-500">Points weighting:</span>
                  <strong className="text-lg font-black text-indigo-600">{selectedAssignment.points} Pts</strong>
                </div>
              </div>

              {/* Assignment Prompt */}
              <div className="pt-5 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Prompt & Parameters</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-sans font-medium whitespace-pre-line bg-slate-50/70 p-4 border border-slate-150 rounded-lg">
                  {selectedAssignment.description}
                </p>
              </div>

              {/* Learning Outcomes Tagging */}
              <div className="mt-6 pt-5 border-t border-slate-100">
                <h3 className="text-xs font-extrabold uppercase tracking-wide text-indigo-700 mb-2">Cornerstone Outcomes Rubric</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {selectedAssignment.outcomeTags.map((tag) => (
                    <div key={tag} className="border border-indigo-100 bg-indigo-50/20 rounded-lg p-3 flex flex-col justify-between hover:border-indigo-200 transition">
                      <span className="text-[10px] font-mono font-bold text-indigo-700 tracking-wide">{tag}</span>
                      <p className="text-[9px] text-slate-500 mt-1">
                        Student response must exemplify high mastery, rigorous logic, and structured deconstruction matching the outcome definition.
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Submission Portal (Only relevant for student, or faculty checking submission status) */}
            {selectedAssignment.status === 'pending' && role === 'student' && (
              <div className="bg-white rounded-xl border border-slate-200 p-6 md:p-8 shadow-2xs space-y-5">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
                  <Upload className="w-5 h-5 text-orange-600" />
                  <h3 className="text-sm font-extrabold text-slate-900">Upload Your Response</h3>
                </div>

                {isSuccessfullySubmitted ? (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 text-center space-y-3">
                    <CheckCircle2 className="w-8 h-8 text-amber-600 mx-auto animate-bounce" />
                    <h4 className="text-xs font-bold text-amber-900">Uploading Submission File...</h4>
                    <p className="text-[11px] text-amber-700 max-w-sm mx-auto">
                      Routing data packet to server-side evaluation engine. Retaining system integrity checks.
                    </p>
                  </div>
                ) : aiGenerating ? (
                  <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-6 text-center space-y-3">
                    <div className="w-8 h-8 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin mx-auto" />
                    <h4 className="text-xs font-bold text-indigo-950 flex items-center justify-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
                      <span>Synthesizing Formative Feedback...</span>
                    </h4>
                    <p className="text-[11px] text-indigo-700 max-w-md mx-auto">
                      AI Critical Tutor Core is compiling semantic scores on HCs. Generating formative commentary models.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Raw Text / Essay content input */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 block">Companion Essay Response (Synthesized Thesis)</label>
                      <textarea
                        value={essayText}
                        onChange={(e) => setEssayText(e.target.value)}
                        placeholder="Type or paste your rigorous deconstruction, explaining how your thesis targets each cornerstone outcome outcome..."
                        rows={6}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-4 text-xs font-serif leading-relaxed focus:bg-white focus:ring-1 focus:ring-indigo-500 focus:outline-hidden transition"
                      />
                    </div>

                    {/* Drag and Drop / File Input */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 block">Supporting Research Dataset / Notebook / PDF</label>
                      <div 
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        className={`border-2 border-dashed rounded-lg p-6 text-center transition cursor-pointer relative ${
                          dragActive 
                            ? 'border-indigo-600 bg-indigo-50/30' 
                            : uploadedFile 
                            ? 'border-emerald-550 bg-emerald-50/10' 
                            : 'border-slate-250 bg-slate-50 hover:bg-slate-100/50'
                        }`}
                      >
                        <input
                          type="file"
                          id="file-selector"
                          onChange={handleFileChange}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                        <div className="space-y-2 pointer-events-none">
                          <Upload className="w-8 h-8 text-indigo-500 mx-auto" />
                          <p className="text-xs font-bold text-slate-700">
                            {uploadedFile ? `Ready to submit: ${uploadedFile.name}` : "Drag & Drop files here, or click to browse files"}
                          </p>
                          <p className="text-[10px] text-slate-500">
                            Accepts PDFs, Markdowns, Jupyter Notebooks (.ipynb) or .zip files (Max 40MB)
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        onClick={handleStudentSubmit}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-6 py-2.5 rounded-lg shadow-sm hover:shadow-xs transition cursor-pointer flex items-center gap-2"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>Submit & Get AI Assessment</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Submitted & Graded response view */}
            {selectedAssignment.status !== 'pending' && (
              <div className="bg-white rounded-xl border border-slate-200 p-6 md:p-8 shadow-2xs space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <h3 className="text-sm font-extrabold text-slate-900">Your Filed Submission</h3>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono font-medium">Submitted {selectedAssignment.submittedAt}</span>
                </div>

                <div className="space-y-4">
                  <div className="bg-slate-50/70 p-3 rounded-lg border border-slate-150 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-slate-500" />
                      <span className="text-xs font-serif font-black text-slate-800">{selectedAssignment.fileAttachment}</span>
                    </div>
                    <span className="text-[10px] bg-slate-100 border border-slate-200 text-slate-500 px-2 py-0.5 rounded-md font-mono">Attachment lock</span>
                  </div>

                  {selectedAssignment.essayContent && (
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Synthesized Essay Text</span>
                      <div className="text-xs text-slate-700 leading-relaxed font-serif bg-slate-50/30 p-5 rounded-lg border border-slate-200/60 whitespace-pre-line">
                        {selectedAssignment.essayContent}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Workspace side-rail: Gradebook, Outcomes Scores, and Teacher Annotator */}
          <div className="w-full lg:w-80 p-6 shrink-0 bg-white border-l border-slate-200/80 space-y-6" id="assignments-right-sierail">
            {/* Outcomes evaluation card */}
            {selectedAssignment.status === 'graded' && selectedAssignment.instructorFeedback && (
              <div className="bg-slate-900 text-slate-100 rounded-xl p-5 shadow-lg space-y-5 border border-slate-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Award className="w-4.5 h-4.5 text-amber-500" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Outcomes Gradecard</h4>
                  </div>
                  <span className="text-xl font-black text-[#EA580C] bg-[#EA580C]/10 border border-[#EA580C]/20 px-2.5 py-0.5 rounded font-mono">
                    {selectedAssignment.instructorFeedback.grade}
                  </span>
                </div>

                <div className="space-y-3.5 divide-y divide-slate-800">
                  {selectedAssignment.instructorFeedback.outcomesScored.map((scoreCard) => {
                    const percent = (scoreCard.score / scoreCard.maxScore) * 100;
                    return (
                      <div key={scoreCard.outcome} className="pt-3.5 first:pt-0 space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-mono text-[10.5px] font-bold text-amber-400">{scoreCard.outcome}</span>
                          <strong className="text-slate-200 font-mono font-extrabold">{scoreCard.score} / {scoreCard.maxScore}</strong>
                        </div>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-amber-500 h-1.5 rounded-full transition-all" style={{ width: `${percent}%` }} />
                        </div>
                        <p className="text-[9px] text-slate-400">
                          {scoreCard.score >= 4 ? 'Exceeds structural constraints with high cognitive elasticity.' : 'Satisfactory integration of the core element.'}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <div className="bg-slate-850 p-4 border border-slate-800/60 rounded-lg space-y-1 border-l-2 border-indigo-400">
                  <span className="text-[9px] font-mono tracking-widest uppercase text-slate-400 block font-bold">Evaluating Advisor Critique</span>
                  <p className="text-xs text-slate-300 font-serif leading-relaxed italic">
                    "{selectedAssignment.instructorFeedback.comments}"
                  </p>
                </div>
              </div>
            )}

            {/* Faculty Evaluator Workspace Controls */}
            {role === 'faculty' && selectedAssignment.status === 'submitted' && (
              <div className="bg-white rounded-xl border border-amber-300/65 bg-amber-50/15 p-5 shadow-xs space-y-5">
                <div className="flex items-center gap-1.5 border-b border-slate-100 pb-3">
                  <UserCheck2 className="w-5 h-5 text-indigo-600" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">Advisor Annotation Portal</h4>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Assign Grade Card</label>
                    <select
                      value={facultyGrade}
                      onChange={(e) => setFacultyGrade(e.target.value)}
                      className="w-full bg-white border border-slate-250 rounded-lg px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
                    >
                      <option value="A+">A+ (Distinguished Mastery)</option>
                      <option value="A">A (Excellent Cognitive Elasticity)</option>
                      <option value="B+">B+ (Good Synthesis)</option>
                      <option value="B">B (Satisfactory Concept Linkage)</option>
                      <option value="C">C (Passable Application)</option>
                    </select>
                  </div>

                  {/* Corner Outcomes scoring map */}
                  <div className="space-y-2.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">Cornerstone Outcome Ratings</label>
                    {selectedAssignment.outcomeTags.map((tag) => (
                      <div key={tag} className="space-y-1">
                        <div className="flex justify-between items-center text-[10px] font-mono font-bold text-indigo-900">
                          <span>{tag}</span>
                          <span>Rating: {scores[tag] || 4} / 5</span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="5"
                          step="1"
                          value={scores[tag] || 4}
                          onChange={(e) => setScores({ ...scores, [tag]: parseInt(e.target.value) })}
                          className="w-full accent-indigo-600 cursor-pointer"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Advisor Formative Critique</label>
                    <textarea
                      value={facultyComments}
                      onChange={(e) => setFacultyComments(e.target.value)}
                      placeholder="Input highly contextual annotations addressing student's structural reasoning..."
                      rows={4}
                      className="w-full bg-white border border-slate-250 rounded-lg p-2.5 text-xs font-serif focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
                    />
                  </div>

                  <button
                    onClick={handleFacultySubmitGrading}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2 rounded-lg transition"
                  >
                    Publish Formal Grade
                  </button>
                </div>
              </div>
            )}

            {/* General Rubric information block */}
            <div className="bg-slate-50/50 p-4 border border-slate-200 rounded-xl space-y-3">
              <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">Minerva Peer Annotation & Grading System</span>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Rather than generic tests, student ratings map directly to continuous, qualitative, formative checkpoints. Each assignment must satisfy rigorous, repeatable cognitive rubrics.
              </p>
              <div className="flex items-center gap-1.5 text-indigo-700 text-[10px] font-bold cursor-pointer hover:underline">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Read complete Outcomes manual 2026</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
