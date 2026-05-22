import React, { useState } from 'react';
import { PRESET_CLUES } from '../data';
import { ReverseEngineeringClue } from '../types';
import { Brain, Sparkles, Code, Server, Database, GitMerge, FileText, ChevronRight, ArrowLeft } from 'lucide-react';

interface ReverseEngineeringProps {
  onBackToDashboard?: () => void;
}

export default function ReverseEngineeringSkill({ onBackToDashboard }: ReverseEngineeringProps = {}) {
  const [selectedClue, setSelectedClue] = useState<ReverseEngineeringClue>(PRESET_CLUES[0]);
  const [userDeduction, setUserDeduction] = useState(
    "How does the state synch in real-time when a student uses a particular hashtag in their speech, and how is the budget tracked in Course Builder?"
  );
  const [loading, setLoading] = useState(false);
  const [analysisMarkdown, setAnalysisMarkdown] = useState<string>('');

  const handleDeconstructClue = async () => {
    setLoading(true);
    setAnalysisMarkdown('');
    try {
      const response = await fetch('/api/gemini/reverse-engineer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clueText: `${selectedClue.title}: ${selectedClue.clueText}`,
          userDeduction
        }),
      });
      const data = await response.json();
      if (response.ok && data.analysis) {
        setAnalysisMarkdown(data.analysis);
      } else {
        setAnalysisMarkdown("Deconstruct maps failed. Please verify that your backend server is loaded successfully.");
      }
    } catch (e: any) {
      console.error(e);
      setAnalysisMarkdown(`Error calling Reverse-Engineering engine: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#F3F4F6] text-gray-800 min-h-screen font-sans flex flex-col select-none overflow-y-auto lg:overflow-hidden">
      {/* Subheader */}
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
            <span className="text-[10px] uppercase font-mono tracking-wider text-orange-400 font-bold">Reverse-Engineering Cognitive Engine</span>
            <div className="flex items-center space-x-2 mt-0.5">
              <h1 className="text-sm font-bold text-white font-serif">Reverse UX Deconstruct Backwards Studio</h1>
              <span className="bg-[#1F2937] text-indigo-400 border border-neutral-800 text-[10px] px-2 py-0.5 rounded font-mono font-bold uppercase tracking-wider">Cognitive Training Hub</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row min-h-0 h-auto lg:h-full lg:overflow-hidden">
        
        {/* Left Panel: Preset Clues or Image Selector */}
        <div className="w-full lg:w-96 bg-[#2D2E36] p-6 text-white border-b lg:border-b-0 lg:border-r border-[#1E1F24] flex flex-col space-y-6 shrink-0 h-auto lg:h-full">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-wider text-orange-400 font-bold block mb-3">Available Screen Deconstructors</span>
            <div className="space-y-3.5 max-h-[310px] overflow-y-auto pr-1">
              {PRESET_CLUES.map((clue) => {
                const isSelected = selectedClue.id === clue.id;
                return (
                  <div
                    key={clue.id}
                    onClick={() => {
                      setSelectedClue(clue);
                      if (clue.id === 'clue1') {
                        setUserDeduction('How does the state synch in real-time when a student uses a particular hashtag in their speech, and how is the budget tracked in Course Builder?');
                      } else if (clue.id === 'clue2') {
                        setUserDeduction('Trace how lesson plans, forum comments likes (thumbs up) and unread chat bubbles link to the student database schema.');
                      } else if (clue.id === 'clue3') {
                        setUserDeduction('Illustrate a complete Spanner relational database backing 23 Habits of Mind (HCs), weights, course prerequisites, and metadata.');
                      } else {
                        setUserDeduction('How does the advisor-student degree planner perform live verification on the graduation constraints (120 credits limit, minors) and return warning states?');
                      }
                    }}
                    className={`p-3.5 rounded-xl border-l-4 transition text-left cursor-pointer ${
                      isSelected
                        ? 'bg-[#333540] border-orange-500 text-white border-y border-r border-[#494C5C] shadow-inner font-semibold'
                        : 'bg-[#23242A] border-transparent hover:border-neutral-700 hover:bg-[#2A2B33] text-neutral-300'
                    }`}
                  >
                    <h4 className="text-xs font-bold truncate">{clue.title}</h4>
                    <p className={`text-[10.5px] mt-1 line-clamp-2 leading-relaxed ${isSelected ? 'text-neutral-200' : 'text-neutral-400'}`}>{clue.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-4 bg-[#23242A] border border-[#1E1F24] rounded-xl space-y-2.5">
            <h4 className="text-[10px] font-mono font-bold uppercase tracking-wider text-orange-400">Selected Clue Details</h4>
            <p className="text-xs text-neutral-200 leading-relaxed bg-[#2C2D35] p-3 rounded-lg border border-neutral-750 font-medium">
              {selectedClue.clueText}
            </p>
          </div>

          <div>
            <label className="text-[10px] font-bold text-neutral-300 font-mono block mb-1.5 uppercase tracking-wide">User Directives & Questions</label>
            <textarea
              rows={3}
              value={userDeduction}
              onChange={(e) => setUserDeduction(e.target.value)}
              className="w-full text-xs p-3 rounded-lg bg-[#2C2D35] border border-neutral-700 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-sans leading-relaxed resize-none font-medium"
              placeholder="What questions or reverse-engineering parameters do you want to explore?"
            />
          </div>

          <button
            onClick={handleDeconstructClue}
            disabled={loading}
            className="w-full py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-lg transition shadow-md cursor-pointer flex items-center justify-center space-x-1.5"
          >
            <Brain className="w-4 h-4 text-white animate-pulse" />
            <span>{loading ? 'Cognitive engine analyzing...' : 'Solve Screenshot Reverse Engineering'}</span>
          </button>
        </div>

        {/* Right Panel: Rendered analysis reports matching white page workspace */}
        <div className="flex-grow p-6 md:p-8 bg-[#F3F4F6] overflow-y-auto space-y-6 text-gray-800 h-auto lg:h-full">
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center space-y-3 p-10">
              <div className="w-10 h-10 rounded-full border-4 border-t-indigo-600 border-slate-200 animate-spin" />
              <p className="text-xs text-slate-500 font-bold font-mono">Reverse-engineering screenshot coordinates backwards... Creating relational mental maps...</p>
            </div>
          ) : analysisMarkdown ? (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center space-x-2 text-emerald-600 text-[11px] font-bold font-mono tracking-wider uppercase">
                <Sparkles className="w-4 h-4" />
                <span>Reverse Engineering Architectural Output Analysis Deconstructed Successfully:</span>
              </div>

              {/* White mock printed report format */}
              <div className="p-6 bg-white border border-neutral-250 rounded-xl font-sans text-xs leading-relaxed text-slate-800 space-y-4 whitespace-pre-wrap shadow-sm text-left">
                {analysisMarkdown}
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-white/40 border border-dashed border-neutral-300 rounded-2xl">
              <div className="w-16 h-16 rounded-full bg-slate-200/60 flex items-center justify-center text-2xl text-slate-705 border border-slate-350 mb-3">
                🕵️‍♂️
              </div>
              <h3 className="text-sm font-bold text-slate-800 font-serif">Deconstruction Canvas Idle</h3>
              <p className="text-xs text-slate-500 max-w-sm font-medium font-sans mt-1">
                Select one of the images/clues on the left of our Artemis platform suite, write comment filters, and click solve to see how a single screenshot can be reverse-engineered back to schemas, backend sockets, and state management hooks!
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
