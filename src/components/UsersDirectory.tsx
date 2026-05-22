import React, { useState } from 'react';
import { Search, Users, Sparkles, Star, ShieldCheck, Mail, CheckCircle, Award, AlertCircle } from 'lucide-react';
import { Student } from '../types';
import { INITIAL_STUDENTS } from '../data';

export default function UsersDirectory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<'all' | 'faculty' | 'student'>('all');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // Expanded student list with additional performance metrics for directory view
  const rosterData = [
    { id: '1', name: 'James Doyle', email: 'doyle@artemis.edu', role: 'Faculty', avatarColor: '#3F51B5', status: 'Active', classes: 'AH 110, SS 110', officeHrs: 'Mon 14:00' },
    { id: '2', name: 'Marika', email: 'marika@artemis.edu', role: 'Student', avatarColor: '#E91E63', status: 'Active', activeSpeakerTime: '4m 12s', classPrepGrade: 'A', cornerstonesMet: 6 },
    { id: '3', name: 'Paul', email: 'paul@artemis.edu', role: 'Student', avatarColor: '#9C27B0', status: 'Active', activeSpeakerTime: '2m 45s', classPrepGrade: 'B+', cornerstonesMet: 4 },
    { id: '4', name: 'Matthew', email: 'matthew@artemis.edu', role: 'Student', avatarColor: '#673AB7', status: 'Active', activeSpeakerTime: '1m 15s', classPrepGrade: 'B', cornerstonesMet: 3 },
    { id: '5', name: 'David', email: 'david@artemis.edu', role: 'Student', avatarColor: '#4CAF50', status: 'Active', activeSpeakerTime: '5m 30s', classPrepGrade: 'A', cornerstonesMet: 8 },
    { id: '6', name: 'Grace', email: 'grace@artemis.edu', role: 'Student', avatarColor: '#FF9800', status: 'Away', activeSpeakerTime: '3m 02s', classPrepGrade: 'A-', cornerstonesMet: 5 },
    { id: '7', name: 'Roger', email: 'roger@artemis.edu', role: 'Student', avatarColor: '#00BCD4', status: 'Active', activeSpeakerTime: '1m 40s', classPrepGrade: 'C+', cornerstonesMet: 2 },
    { id: '8', name: 'Sharon', email: 'sharon@artemis.edu', role: 'Student', avatarColor: '#009688', status: 'Active', activeSpeakerTime: '3m 50s', classPrepGrade: 'A-', cornerstonesMet: 7 },
    { id: '9', name: 'Nancy', email: 'nancy@artemis.edu', role: 'Student', avatarColor: '#795548', status: 'Active', activeSpeakerTime: '0m 45s', classPrepGrade: 'B-', cornerstonesMet: 3 },
    { id: '10', name: 'Marilyn', email: 'marilyn@artemis.edu', role: 'Student', avatarColor: '#FF5722', status: 'Active', activeSpeakerTime: '2m 10s', classPrepGrade: 'B', cornerstonesMet: 4 },
    { id: '11', name: 'Lauren', email: 'lauren@artemis.edu', role: 'Student', avatarColor: '#607D8B', status: 'Offline', activeSpeakerTime: '1m 20s', classPrepGrade: 'B+', cornerstonesMet: 5 },
  ];

  const filteredRoster = rosterData.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || 
                        (selectedRole === 'faculty' && item.role === 'Faculty') ||
                        (selectedRole === 'student' && item.role === 'Student');
    return matchesSearch && matchesRole;
  });

  return (
    <div className="flex-grow bg-[#F3F4F6] text-[#334155] min-h-screen flex flex-col font-sans select-none">
      
      {/* Dense Mini-Header */}
      <header className="px-8 py-4 bg-white border-b border-slate-200 shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-wider text-orange-600 font-bold">DIRECTORY PORTAL</span>
          <h1 className="text-lg font-bold text-slate-900 font-serif">
            Active Forum Users & Instructors
          </h1>
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 w-64 border border-slate-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-505 focus:ring-indigo-500 bg-slate-50 text-slate-800"
            />
          </div>

          <div className="flex rounded-lg border border-slate-250 bg-slate-50 p-0.5 text-xs font-semibold">
            <button
              onClick={() => setSelectedRole('all')}
              className={`px-3 py-1.5 rounded-md transition ${selectedRole === 'all' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedRole('faculty')}
              className={`px-3 py-1.5 rounded-md transition ${selectedRole === 'faculty' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Faculty
            </button>
            <button
              onClick={() => setSelectedRole('student')}
              className={`px-3 py-1.5 rounded-md transition ${selectedRole === 'student' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Student
            </button>
          </div>
        </div>
      </header>

      {/* Roster & Details Grid */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
        
        {/* Left 2 Columns: Roster Grid */}
        <div className="lg:col-span-2 flex flex-col space-y-4 min-h-0 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredRoster.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedStudent(item as any)}
                className={`bg-white border p-4 rounded-xl cursor-pointer hover:border-indigo-500 hover:shadow-md transition duration-150 flex items-start space-x-3.5 ${selectedStudent?.id === item.id ? 'border-indigo-600 ring-1 ring-indigo-500/20' : 'border-slate-200'}`}
              >
                <div 
                  className="w-10 h-10 rounded-full text-white flex items-center justify-center font-bold text-sm shadow-inner"
                  style={{ backgroundColor: item.avatarColor }}
                >
                  {item.name[0]}
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-800 font-serif">{item.name}</h3>
                    <span className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                      item.role === 'Faculty' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {item.role}
                    </span>
                  </div>
                  
                  <p className="text-[11px] text-slate-500 font-medium font-mono">{item.email}</p>
                  
                  <div className="flex items-center justify-between text-[10.5px] text-slate-400 font-mono mt-2 pt-2 border-t border-slate-100">
                    <span className="flex items-center space-x-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${item.status === 'Active' ? 'bg-emerald-500' : item.status === 'Away' ? 'bg-amber-500' : 'bg-slate-300'}`} />
                      <span>{item.status}</span>
                    </span>
                    {item.role === 'Student' && (
                      <span>Prep: <strong className="text-slate-600 font-sans">{item.classPrepGrade}</strong></span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Column: User Focus Card & Detailed Metrics */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between h-[450px]">
          {selectedStudent ? (
            <div className="space-y-6 flex-grow flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div 
                    className="w-14 h-14 rounded-full text-white flex items-center justify-center font-bold text-lg shadow-sm shrink-0"
                    style={{ backgroundColor: selectedStudent.avatarColor }}
                  >
                    {selectedStudent.name[0]}
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900 font-serif">{selectedStudent.name}</h2>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">{selectedStudent.email}</p>
                  </div>
                </div>

                <div className="border-t border-slate-150 pt-4 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-mono font-medium">Platform Role</span>
                    <span className="font-bold text-slate-800">{selectedStudent.role}</span>
                  </div>

                  {selectedStudent.role === 'Student' ? (
                    <>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400 font-mono font-medium">Session Voice Minutes</span>
                        <span className="font-bold text-slate-805 font-mono text-slate-880">{(selectedStudent as any).activeSpeakerTime}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400 font-mono font-medium">Pre-Class Preparation</span>
                        <span className="font-bold text-[#047857] bg-emerald-50 border border-emerald-150 px-2 py-0.5 rounded">
                          {(selectedStudent as any).classPrepGrade}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400 font-mono font-medium">Key Cornerstone Objectives Met</span>
                        <span className="font-bold text-slate-800">{(selectedStudent as any).cornerstonesMet} HCs</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400 font-mono font-medium">Sections Supervised</span>
                        <span className="font-bold text-indigo-700">{(selectedStudent as any).classes}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400 font-mono font-medium">Instructors Office Hours</span>
                        <span className="font-bold text-slate-800 font-mono">{(selectedStudent as any).officeHrs}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-500 space-y-2 leading-relaxed">
                <div className="flex items-center space-x-1.5 font-bold text-slate-700">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>Verified Account Credentials</span>
                </div>
                <p className="text-[10.5px]">
                  Student performance statistics are compiled automatically via active Zoom streams, class dialog contributions, and submitted assignments.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <Users className="w-12 h-12 text-slate-350 stroke-1 mb-3" />
              <h3 className="text-xs font-bold text-slate-600 font-mono uppercase tracking-wider">Select a User Card</h3>
              <p className="text-[11px] leading-relaxed max-w-xs mt-1">
                Click on any user or faculty block in the roster list to overview performance statistics, preparation grades, or class prep details.
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
