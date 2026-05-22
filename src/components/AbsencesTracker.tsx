import React, { useState } from 'react';
import { Calendar, User, Search, Sparkles, AlertTriangle, CheckCircle2, XCircle, Clock, Check } from 'lucide-react';

interface AbsenceRecord {
  id: string;
  studentName: string;
  date: string;
  sessionTitle: string;
  status: 'Excused' | 'Unexcused' | 'Late';
  resolved: boolean;
  notes: string;
}

export default function AbsencesTracker() {
  const [records, setRecords] = useState<AbsenceRecord[]>([
    { id: 'ab1', studentName: 'Paul', date: 'May 18, 2026', sessionTitle: 'SS110 Session 1.4 - Framing Causal Links', status: 'Excused', resolved: true, notes: 'Medical certificate submitted.' },
    { id: 'ab2', studentName: 'Matthew', date: 'May 15, 2026', sessionTitle: 'SS110 Session 1.2 - Feedback Loops', status: 'Unexcused', resolved: false, notes: 'Absent without notifying instructor.' },
    { id: 'ab3', studentName: 'Grace', date: 'May 10, 2026', sessionTitle: 'AH51 Session 2.1 - Spatial Heuristics', status: 'Late', resolved: true, notes: 'Arrived 11 minutes late due to connection issues.' },
    { id: 'ab4', studentName: 'Roger', date: 'May 08, 2026', sessionTitle: 'NS51 Session 3.2 - False Positives', status: 'Unexcused', resolved: false, notes: 'Missed class poll participations.' },
    { id: 'ab5', studentName: 'Nancy', date: 'May 04, 2026', sessionTitle: 'AH50 Session 4.1 - Design Modes', status: 'Excused', resolved: true, notes: 'Sports match external representation.' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Excused' | 'Unexcused' | 'Late'>('All');

  const handleResolve = (id: string) => {
    setRecords(prev => prev.map(rec => {
      if (rec.id === id) {
        return { ...rec, resolved: !rec.resolved };
      }
      return rec;
    }));
  };

  const filteredRecords = records.filter(rec => {
    const matchesSearch = rec.studentName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          rec.sessionTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || rec.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex-grow bg-[#F3F4F6] text-[#334155] min-h-screen flex flex-col font-sans select-none">
      
      {/* Mini-Header */}
      <header className="px-8 py-4 bg-white border-b border-slate-200 shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-wider text-orange-600 font-bold">ATTENDANCE LOG</span>
          <h1 className="text-lg font-bold text-slate-900 font-serif">
            Class Absences & Lateness Auditing
          </h1>
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by student or class..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 w-64 border border-slate-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-505 focus:ring-indigo-500 bg-slate-50 text-slate-800"
            />
          </div>

          <div className="flex rounded-lg border border-slate-250 bg-slate-50 p-0.5 text-xs font-semibold">
            {['All', 'Excused', 'Unexcused', 'Late'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st as any)}
                className={`px-3 py-1.5 rounded-md transition ${filterStatus === st ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Tables layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-6 py-6 space-y-6">
        
        {/* Statistics highlights grids */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200 p-5 rounded-xl flex items-center space-x-4">
            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 font-bold font-mono">
              96%
            </div>
            <div>
              <h4 className="text-[10px] font-mono tracking-wider text-slate-400 uppercase font-bold">Term Average Attendance</h4>
              <p className="text-sm font-bold text-slate-800 mt-0.5">High Faculty Host standard</p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-5 rounded-xl flex items-center space-x-4">
            <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center border border-red-100 font-mono font-bold">
              2
            </div>
            <div>
              <h4 className="text-[10px] font-mono tracking-wider text-slate-400 uppercase font-bold">Unresolved Absences</h4>
              <p className="text-sm font-bold text-slate-800 mt-0.5">Requires Dean coordination</p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-5 rounded-xl flex items-center space-x-4">
            <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 font-mono font-bold">
              3
            </div>
            <div>
              <h4 className="text-[10px] font-mono tracking-wider text-slate-400 uppercase font-bold">Excused Milestones</h4>
              <p className="text-sm font-bold text-slate-800 mt-0.5">Approved medical reports</p>
            </div>
          </div>
        </div>

        {/* List table */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          
          <div className="px-6 py-4 border-b border-slate-150 flex items-center justify-between bg-slate-50/50">
            <h3 className="text-xs font-bold text-slate-600 font-mono uppercase tracking-wider">
              Student Absence Dossier
            </h3>
            <span className="text-[11px] text-slate-400 font-mono font-semibold">
              Attendance thresholds calculated
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              
              <thead className="bg-[#FAFBFD] border-b border-slate-200 text-[10.5px] uppercase font-mono text-slate-400 font-bold">
                <tr>
                  <th scope="col" className="px-6 py-3 font-semibold">Student Name</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Incidence Date</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Session Lecture Focus</th>
                  <th scope="col" className="px-4 py-3 font-semibold text-center">Status</th>
                  <th scope="col" className="px-4 py-3 font-semibold text-center">Dossier Resolved</th>
                  <th scope="col" className="px-6 py-3 font-semibold text-right">Administrative Notes</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-150 font-medium whitespace-nowrap">
                {filteredRecords.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50 transition duration-100">
                    <td className="px-6 py-3.5 font-bold text-slate-800">
                      {rec.studentName}
                    </td>
                    <td className="px-4 py-3.5 font-mono text-slate-500">
                      {rec.date}
                    </td>
                    <td className="px-4 py-3.5 max-w-xs truncate text-slate-700">
                      {rec.sessionTitle}
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        rec.status === 'Excused' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' :
                        rec.status === 'Unexcused' ? 'bg-red-50 text-red-700 border border-red-200' :
                        'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {rec.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <button
                        onClick={() => handleResolve(rec.id)}
                        className={`px-3 py-1 text-[10.5px] font-bold rounded-lg transition border flex items-center justify-center mx-auto space-x-1 ${
                          rec.resolved 
                            ? 'bg-emerald-50 border-emerald-250 text-emerald-700 hover:bg-emerald-100'
                            : 'bg-slate-50 border-slate-300 text-slate-500 hover:bg-slate-100'
                        }`}
                      >
                        {rec.resolved ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600 font-bold" />
                            <span>Resolved</span>
                          </>
                        ) : (
                          <span>Mark Resolved</span>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-3.5 text-right font-medium text-slate-500 max-w-sm truncate text-wrap">
                      {rec.notes}
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>

        </div>

      </div>

    </div>
  );
}
