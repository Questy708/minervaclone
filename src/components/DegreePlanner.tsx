import React, { useState } from 'react';
import { INITIAL_TRANSCRIPT, INITIAL_COURSE_YEARS } from '../data';
import { GradRequirement, CoursePlanYear } from '../types';
import { CheckCircle2, AlertTriangle, Info, Plus, GraduationCap, Sparkles, BookOpen, RefreshCw, ArrowLeft } from 'lucide-react';

interface DegreePlannerProps {
  onBackToDashboard?: () => void;
}

export default function DegreePlanner({ onBackToDashboard }: DegreePlannerProps = {}) {
  const [transcripts, setTranscripts] = useState<GradRequirement[]>(INITIAL_TRANSCRIPT);
  const [courseYears, setCourseYears] = useState<CoursePlanYear[]>(INITIAL_COURSE_YEARS);
  
  // Custom states for interactive additions
  const [showAddCourse, setShowAddCourse] = useState<number | null>(null);
  const [newCourseCode, setNewCourseCode] = useState('');
  const [newCourseTerm, setNewCourseTerm] = useState<'fall' | 'spring'>('fall');

  const [gpa, setGpa] = useState(3.85);
  const [credits, setCredits] = useState(115); // Close to 120 graduation threshold
  const [audited, setAudited] = useState(false);
  const [auditLog, setAuditLog] = useState<string[]>([]);

  const handleAddCourseToPlan = (yearIndex: number) => {
    if (!newCourseCode.trim()) return;
    setCourseYears(prev => prev.map(y => {
      if (y.year === yearIndex) {
        const updated = { ...y.termPlan };
        updated[newCourseTerm] = [...updated[newCourseTerm], newCourseCode.toUpperCase()];
        return { ...y, termPlan: updated };
      }
      return y;
    }));
    
    // Increment credit hours
    setCredits(prev => prev + 4);
    setNewCourseCode('');
    setShowAddCourse(null);
  };

  const runGraduationAudit = () => {
    setAudited(true);
    const logs: string[] = [];
    
    if (gpa >= 2.0) {
      logs.push("✅ Cumulative GPA requirement satisfied (GPA is " + gpa + " - Threshold >= 2.00)");
    } else {
      logs.push("❌ Cumulative GPA failure.");
    }

    if (credits >= 120) {
      logs.push("✅ Graduation Credits satisfied (Complete: " + credits + " - Threshold >= 120)");
      // Satisfy checklist status in state!
      setTranscripts(prev => prev.map(t => t.id === 'req7' ? { ...t, status: 'completed', description: 'Capstone manifest approved and credits threshold satisfied.' } : t));
    } else {
      logs.push("⚠️ Graduation Credits below threshold (" + credits + " / 120 credits). Please add 1-2 more courses to your plan.");
    }

    logs.push("✅ Minor limitations verified (No more than 2 minor courses enrolled)");
    logs.push("✅ Full-time enrollment status satisfied for all 8 consecutive terms.");

    setAuditLog(logs);
  };

  return (
    <div className="bg-[#F3F4F6] text-gray-800 min-h-screen font-sans flex flex-col select-none overflow-y-auto lg:overflow-hidden">
      {/* 1. Header styled matching Course Builder Editor layouts */}
      <header className="flex items-center justify-between px-6 py-3 bg-[#0B0C10] text-[#E5E7EB] border-b border-neutral-900 shrink-0 select-none">
        <div className="flex items-center space-x-3">
          {onBackToDashboard && (
            <button
              onClick={onBackToDashboard}
              className="mr-2 p-1.5 rounded-lg bg-[#1F2937] hover:bg-[#2D3748] border border-neutral-800 text-neutral-300 hover:text-white transition cursor-pointer flex items-center space-x-1"
              title="Return to Portal Home"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="text-[10px] uppercase font-mono tracking-wider font-bold">Portal</span>
            </button>
          )}
          <div>
            <span className="text-[10px] uppercase font-mono tracking-wider text-orange-400 font-bold">Student Degree Planner</span>
            <div className="flex items-center space-x-2 mt-0.5">
              <h1 className="text-sm font-bold text-white font-serif">Degree Plan Framework</h1>
              <span className="bg-[#1F2937] text-indigo-400 border border-neutral-800 text-[10px] px-2 py-0.5 rounded font-mono font-bold uppercase tracking-wider">Official Registrar Transcript</span>
            </div>
          </div>
        </div>

        <button 
          onClick={runGraduationAudit}
          className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white cursor-pointer transition shadow-sm"
        >
          <GraduationCap className="w-4 h-4" />
          <span>Run Graduation Degree Audit</span>
        </button>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row min-h-0 h-auto lg:h-full lg:overflow-hidden">
        
        {/* Left Side Panel styled as a Premium Sidebar matching Course Builder side columns */}
        <div className="w-full lg:w-80 bg-[#2D2E36] p-6 text-white border-b lg:border-b-0 lg:border-r border-[#1E1F24] flex flex-col space-y-6 shrink-0 h-auto lg:h-full">
          <div className="pb-4 border-b border-[#1E1F24]">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-500 to-orange-500 flex items-center justify-center font-bold text-lg text-white mb-2 shadow-sm">
              AB
            </div>
            <h2 className="text-sm font-bold text-neutral-100 font-serif">Ari Bader-Natal</h2>
            <p className="text-xs text-neutral-300 font-medium">Enrolled: May 2015 • Graduating: May 2019</p>
            <p className="text-[11px] text-neutral-400 font-mono mt-1">Email: ari@artemis.kgi.edu</p>
          </div>

          <div className="space-y-2.5">
            <span className="text-[9px] uppercase font-mono text-orange-400 font-bold tracking-wider">Plan Objectives</span>
            <div className="text-xs space-y-2 text-neutral-200 font-sans">
              <div className="flex justify-between border-b border-neutral-700/45 pb-1">
                <span className="text-neutral-400">Concentration 1:</span>
                <span className="font-semibold text-white">Economics & Society</span>
              </div>
              <div className="flex justify-between border-b border-neutral-700/45 pb-1">
                <span className="text-neutral-400">Concentration 2:</span>
                <span className="font-semibold text-white">Politics & Gov</span>
              </div>
              <div className="flex justify-between pb-1">
                <span className="text-neutral-400">Minor studies:</span>
                <span className="font-semibold text-white">Arts & Humanities</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-[#333540] rounded-xl border border-[#494C5C] space-y-2.5">
            <span className="text-[10px] font-mono text-orange-400 font-bold block uppercase tracking-wider">Audit Progress Report</span>
            <div className="flex justify-between items-end">
              <span className="text-xs text-neutral-300 font-medium">Graduation Credits:</span>
              <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${credits >= 120 ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800' : 'bg-amber-950/80 text-amber-300 border border-amber-800'}`}>
                {credits} <span className="opacity-60">/ 120</span>
              </span>
            </div>
            <div className="flex justify-between items-end">
              <span className="text-xs text-neutral-300 font-medium font-sans">Cumulative GPA:</span>
              <span className="text-xs font-mono font-bold bg-[#202126] text-white px-2 py-0.5 rounded border border-neutral-800">
                {gpa.toFixed(2)}
              </span>
            </div>
          </div>

          {audited && (
            <div className="p-4 bg-indigo-950/40 border border-indigo-700/50 rounded-xl space-y-2 animate-fade-in-up">
              <div className="flex items-center space-x-1.5 text-xs text-indigo-300 font-bold font-mono uppercase tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Registrar Response:</span>
              </div>
              <ul className="text-[10.5px] text-neutral-200 space-y-1.5 font-sans leading-relaxed">
                {auditLog.map((log, idx) => (
                  <li key={idx} className="flex items-start gap-1">
                    <span className="text-indigo-400">•</span>
                    <span>{log}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Center Panel: Custom light mode annual grid maps matching courses cards */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto space-y-6 h-auto lg:h-full">
          
          <div className="flex items-center justify-between pb-2 border-b border-neutral-250">
            <h3 className="text-xs font-bold text-slate-500 font-mono uppercase tracking-wider">Course Plan Matrix (Years 1-4)</h3>
            <span className="text-[10px] text-slate-500 font-semibold italic">Interact: click "Add Course" to schedule paths</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {courseYears.map((year) => (
              <div key={year.year} className="p-5 bg-white border border-neutral-200 rounded-xl relative shadow-sm hover:shadow transition">
                <div className="flex justify-between items-center pb-2.5 mb-3.5 border-b border-slate-100">
                  <h4 className="text-xs font-bold font-mono text-indigo-600">YEAR {year.year} ACADEMIC PLAN</h4>
                  <button
                    onClick={() => setShowAddCourse(year.year)}
                    className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold border border-slate-300 px-2.5 py-1 rounded-md cursor-pointer flex items-center space-x-1 transition"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Course</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Fall block */}
                  <div className="space-y-1.5">
                    <span className="text-[9.5px] uppercase font-mono text-slate-400 font-bold block">Fall Semesters</span>
                    {year.termPlan.fall.length === 0 ? (
                      <span className="text-[10.5px] text-slate-400 italic block">No courses mapped</span>
                    ) : (
                      year.termPlan.fall.map((c) => (
                        <div key={c} className="text-[10.5px] bg-[#FAFBFD] px-2.5 py-1.5 rounded-lg border border-neutral-250 font-mono text-slate-700 flex items-center justify-between font-semibold shadow-xs">
                          <span>📘 {c}</span>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Spring block */}
                  <div className="space-y-1.5">
                    <span className="text-[9.5px] uppercase font-mono text-slate-400 font-bold block">Spring Semesters</span>
                    {year.termPlan.spring.length === 0 ? (
                      <span className="text-[10.5px] text-slate-400 italic block">No courses mapped</span>
                    ) : (
                      year.termPlan.spring.map((c) => (
                        <div key={c} className="text-[10.5px] bg-[#FAFBFD] px-2.5 py-1.5 rounded-lg border border-neutral-250 font-mono text-slate-700 flex items-center justify-between font-semibold shadow-xs">
                          <span>📘 {c}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Course Addition Popup Dialog Form */}
                {showAddCourse === year.year && (
                  <div className="absolute inset-0 bg-white/95 backdrop-blur-xs p-5 rounded-xl flex flex-col justify-center space-y-3 z-10 border border-neutral-200 shadow-xl animate-fade-in">
                    <h5 className="text-xs font-bold text-slate-900 font-sans border-b pb-1">Add Course Plan to Year {year.year}</h5>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. SS110"
                        value={newCourseCode}
                        onChange={(e) => setNewCourseCode(e.target.value)}
                        className="flex-1 text-xs p-2 rounded-lg bg-[#FAFBFD] border border-neutral-300 text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                      <select
                        value={newCourseTerm}
                        onChange={(e: any) => setNewCourseTerm(e.target.value)}
                        className="text-xs p-2 rounded-lg bg-[#FAFBFD] border border-neutral-300 text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                      >
                        <option value="fall">Fall</option>
                        <option value="spring">Spring</option>
                      </select>
                    </div>

                    <div className="flex gap-2 justify-end pt-1">
                      <button
                        onClick={() => setShowAddCourse(null)}
                        className="px-3 py-1 text-xs text-slate-500 hover:text-slate-800 font-medium"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleAddCourseToPlan(year.year)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3 py-1 rounded-lg shadow-sm cursor-pointer"
                      >
                        Confirm Mapping
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Academic Checklist indicators matching bottom of Course Builder spec elements */}
          <div className="mt-6 p-5 bg-white rounded-xl border border-neutral-200">
            <h3 className="text-xs font-bold text-slate-500 font-mono mb-3.5 uppercase tracking-wide">Academic Graduation Threshold Metrics Checklists</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {transcripts.map((item) => (
                <div key={item.id} className="p-3.5 bg-[#FAFBFD] rounded-xl border border-neutral-200 flex items-start space-x-3 shadow-xs">
                  <div className="mt-0.5 shrink-0">
                    {item.status === 'completed' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                    {item.status === 'pending' && <Info className="w-4 h-4 text-indigo-500 animate-pulse" />}
                    {item.status === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-500" />}
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-800 font-sans">{item.label}</h4>
                    <p className="text-[10.5px] text-slate-500 mt-1 leading-relaxed font-sans">{item.description}</p>
                    {item.status === 'pending' && (
                      <button 
                        onClick={() => {
                          setTranscripts(prev => prev.map(t => t.id === item.id ? { ...t, status: 'completed', description: 'Course plan satisfied successfully.' } : t));
                        }}
                        className="text-[10px] font-bold text-orange-500 hover:text-orange-600 hover:underline mt-2 cursor-pointer block"
                      >
                        Satisfy Mapping via Elective Selection
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
