import React, { useState } from 'react';
import { Student } from '../types';
import { INITIAL_STUDENTS, CORNERSTONE_HCS } from '../data';
import { Sparkles, Star, Award, Type, HelpCircle, Save, Check, ArrowLeft } from 'lucide-react';

interface AssessmentAnnotatorProps {
  selectedStudent: string;
  selectedText: string;
  selectedHC: string;
  onClearSelection: () => void;
  onBackToDashboard?: () => void;
}

export default function AssessmentAnnotator({ selectedStudent, selectedText, selectedHC, onClearSelection, onBackToDashboard }: AssessmentAnnotatorProps) {
  const [students] = useState<Student[]>(INITIAL_STUDENTS);
  
  // Scoring parameters
  const [activeStudentName, setActiveStudentName] = useState(selectedStudent || 'David');
  const [spokenText, setSpokenText] = useState(selectedText || 'We propose nonviolent protests because the historical database proves peaceful movements maintain higher moral legitimacy (#analogies). Strategy 6 clearly scales backfire cost.');
  const [assignedHC, setAssignedHC] = useState(selectedHC || '#analogies');
  const [score, setScore] = useState(3);
  const [feedbackText, setFeedbackText] = useState('');
  const [anchoredText, setAnchoredText] = useState('');
  
  const [suggestedCriteria, setSuggestedCriteria] = useState<string[]>([]);
  const [suggestedFeedbackOptions, setSuggestedFeedbackOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [savedLogs, setSavedLogs] = useState<Array<any>>([
    {
      student: 'Marika',
      text: 'Our historical analysis shows nonviolent methods are successful 53% of the time, while violent ones fail to attract broad based interest.',
      hc: '#descriptivestats',
      score: 4,
      comment: 'Excellent empirical synthesis. Anchored under the 53% success rate citation.',
      anchored: 'successful 53% of the time'
    }
  ]);

  const handleSimulateFacultyAssessment = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/gemini/assess', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentName: activeStudentName, spokenText, assignedHC }),
      });
      const data = await response.json();
      if (response.ok) {
        setScore(data.score || 3);
        setSuggestedCriteria(data.criteria || []);
        
        let initialOptions = data.feedbackOptions || [];
        if (typeof data.feedback === 'string' && initialOptions.length === 0) {
          initialOptions = [data.feedback];
        }
        setSuggestedFeedbackOptions(initialOptions);
        
        setFeedbackText(initialOptions[0] || 'The student demonstrated appropriate mastery.');
        setAnchoredText(data.anchoredText || '');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const saveAssessmentToGradebook = () => {
    setSavedLogs(prev => [
      ...prev,
      {
        student: activeStudentName,
        text: spokenText,
        hc: assignedHC,
        score,
        comment: feedbackText || 'Grade registered successfully.',
        anchored: anchoredText || 'General response context'
      }
    ]);
    
    // Clear selection helpers
    onClearSelection();
    setFeedbackText('');
    setAnchoredText('');
  };

  return (
    <div className="bg-[#F3F4F6] text-gray-800 min-h-screen font-sans flex flex-col select-none">
      {/* 1. Header aligned to Course Builder style */}
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
            <span className="text-[10px] uppercase font-mono tracking-wider text-orange-400 font-bold">Classroom Assessment Tool</span>
            <div className="flex items-center space-x-2 mt-0.5">
              <h1 className="text-sm font-bold text-white font-serif">Formative Context-Anchored Feedback</h1>
              <span className="bg-[#1F2937] text-indigo-400 border border-neutral-800 text-[10px] px-2 py-0.5 rounded font-mono font-bold uppercase tracking-wider">Feedback Catalog Studio</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row min-h-0">
        
        {/* Left Side: Active assessment entry form */}
        <div className="flex-grow p-6 md:p-8 bg-[#F3F4F6] overflow-y-auto space-y-6 text-gray-800">
          <div className="p-5 bg-white border border-neutral-200 rounded-xl shadow-xs">
            <h3 className="text-xs font-bold text-orange-600 font-mono tracking-wider mb-2 flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4 text-orange-500" />
              <span>CONTEXT ANCHORED ASSESSMENT HELPER</span>
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed font-sans">
              Double click on any classroom speech or upload student written homework passages to select and grade elements. Gemini will automatically parse syntax and draft annotations against standard rubrics criteria!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-[10.5px] font-bold text-[#64748B] font-mono block uppercase mb-1.5">Student Evaluated</label>
              <select
                value={activeStudentName}
                onChange={(e) => setActiveStudentName(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg bg-white border border-neutral-300 text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-semibold cursor-pointer"
              >
                {students.map((st) => (
                  <option key={st.id} value={st.name}>{st.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10.5px] font-bold text-[#64748B] font-mono block uppercase mb-1.5">Target Cornerstone Concept (HC)</label>
              <select
                value={assignedHC}
                onChange={(e) => setAssignedHC(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg bg-white border border-neutral-300 text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono font-semibold cursor-pointer"
              >
                {CORNERSTONE_HCS.map((hc) => (
                  <option key={hc.code} value={hc.code}>{hc.code}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-[10.5px] font-bold text-[#64748B] font-mono block mb-1.5 uppercase">Draft context/Spoken Text Passage</label>
            <textarea
              rows={4}
              value={spokenText}
              onChange={(e) => setSpokenText(e.target.value)}
              className="w-full text-xs p-3.5 rounded-xl bg-white border border-neutral-300 leading-relaxed text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-sans font-medium"
              placeholder="Provide speech or feedback essay passages..."
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSimulateFacultyAssessment}
              disabled={loading || !spokenText.trim()}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg shadow-sm cursor-pointer hover:opacity-90 transition flex items-center justify-center space-x-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{loading ? 'Analyzing with Gemini AI...' : 'Generate rubric score & annotations with Gemini'}</span>
            </button>
          </div>

          {/* Render parsed/suggested grading schema styled as Course Builder step cards */}
          {feedbackText && (
            <div className="p-5 bg-white border border-neutral-200 rounded-xl space-y-4 shadow-sm animate-fade-in-up">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-2.5">
                <h4 className="text-xs font-bold font-mono text-indigo-600 uppercase tracking-wider">Suggested Grade Rating</h4>
                
                {/* Visual Stars */}
                <div className="flex items-center space-x-1 bg-[#FAFBFD] border border-neutral-200 px-3 py-1 rounded-lg">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star 
                      key={i} 
                      onClick={() => setScore(i)}
                      className={`w-4 h-4 cursor-pointer transition ${
                        i <= score ? 'fill-amber-400 text-amber-500' : 'text-neutral-300 hover:text-amber-400/80'
                      }`} 
                    />
                  ))}
                  <span className="text-xs font-mono ml-2 font-bold text-slate-700">{score} / 5</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 font-bold font-mono block mb-1 uppercase">ANCHORED TEXT HIGHLIGHT:</span>
                {anchoredText ? (
                  <p className="text-xs bg-indigo-50/80 border-l-2 border-indigo-500 px-3 py-1.5 text-indigo-900 font-mono inline-block rounded font-semibold">
                    "{anchoredText}"
                  </p>
                ) : (
                  <input
                    type="text"
                    placeholder="Provide specific word selection anchor range..."
                    value={anchoredText}
                    onChange={(e) => setAnchoredText(e.target.value)}
                    className="w-full text-xs p-2 rounded bg-white border border-neutral-300 text-slate-700"
                  />
                )}
              </div>

              {suggestedCriteria && suggestedCriteria.length > 0 && (
                <div>
                  <span className="text-[10px] text-slate-400 font-bold font-mono block mb-2 uppercase">SUGGESTED RUBRIC CRITERIA:</span>
                  <div className="space-y-1.5">
                    {suggestedCriteria.map((crit, idx) => (
                      <div key={idx} className="text-[11px] bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-slate-700 font-sans font-medium flex items-start gap-2">
                         <Check className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                         <span>{crit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <span className="text-[10px] text-slate-400 font-bold font-mono block mb-2 uppercase">PROPOSED FORMATIVE CRITIQUE COMMENTS:</span>
                {suggestedFeedbackOptions && suggestedFeedbackOptions.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {suggestedFeedbackOptions.map((opt, idx) => (
                      <button
                        key={idx}
                        onClick={() => setFeedbackText(opt)}
                        className={`text-[10.5px] px-3 py-1.5 rounded-lg transition-colors border font-sans font-medium cursor-pointer ${
                          feedbackText === opt
                            ? 'bg-indigo-50 border-indigo-300 text-indigo-800'
                            : 'bg-white border-neutral-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        Option {idx + 1}
                      </button>
                    ))}
                  </div>
                )}
                <textarea
                  rows={2}
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  className="w-full text-xs p-3.5 rounded-xl bg-[#FAFBFD] border border-neutral-250 text-slate-700 focus:outline-none font-sans font-medium"
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={saveAssessmentToGradebook}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 font-bold text-white text-xs rounded-lg flex items-center space-x-1 cursor-pointer transition shadow-xs"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Register into Official Gradebook Archive</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Gradebook log history panel matches secondary Catalog list from CourseBuilder */}
        <div className="w-full lg:w-96 bg-[#EBEFF5] p-6 border-l border-neutral-300 flex flex-col space-y-4 shrink-0">
          <h3 className="text-xs font-bold text-slate-500 font-mono uppercase tracking-wider border-b border-neutral-300 pb-2">Archived Feedback Assessments</h3>
          
          <div className="flex-1 overflow-y-auto space-y-4 pr-1 max-h-[520px]">
            {savedLogs.map((log, idx) => (
              <div key={idx} className="p-4 bg-white rounded-xl border border-neutral-200 shadow-sm space-y-2.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-900 font-sans">{log.student}</span>
                  <div className="flex items-center space-x-1">
                    <span className="text-[9px] bg-indigo-50 text-indigo-600 px-2 py-0.5 border border-indigo-100 rounded font-mono font-bold font-sans">{log.hc}</span>
                    <span className="text-[10px] bg-amber-550 bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-mono font-bold">★ {log.score}</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 line-clamp-3 italic leading-relaxed font-sans font-medium">
                  "{log.text}"
                </p>

                {log.anchored && (
                  <p className="text-[10px] text-indigo-700 font-mono bg-indigo-50/50 border border-indigo-100 px-2.5 py-0.5 rounded inline-block font-bold">
                    ⚓ "{log.anchored}"
                  </p>
                )}

                <div className="pt-2.5 border-t border-slate-100 text-[11px] text-slate-700 leading-relaxed font-sans">
                  <span className="font-bold text-emerald-600 font-mono text-[9.5px] block uppercase mb-0.5">Advisor Comment:</span>
                  {log.comment}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
