import React, { useState, useEffect } from 'react';
import { Student, LessonActivity, StudentFeedback } from '../types';
import { INITIAL_STUDENTS, INITIAL_TIMELINE, INITIAL_FEEDBACK, SAMPLE_PROTEST_DOC } from '../data';
import { db } from '../lib/firebase';
import { doc, collection, onSnapshot, setDoc, updateDoc, writeBatch, increment } from 'firebase/firestore';
import {
  Play,
  Pause,
  Volume2,
  Sparkles,
  Undo2,
  Redo2,
  Printer,
  ChevronDown,
  Bold,
  Italic,
  Underline,
  Link,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  RefreshCw,
  Search,
  BookOpen,
  MessageSquare,
  Users,
  FolderOpen,
  BarChart4,
  Share2,
  Grid,
  Settings,
  HelpCircle,
  MoreHorizontal,
  MoreVertical,
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneMissed,
  MonitorUp,
  Smile,
  Check,
  X,
  Plus,
  ArrowLeft,
  Send,
  Hand
} from 'lucide-react';

interface SeminarClassroomProps {
  onHCSelectForAssessment: (studentName: string, text: string, hc: string) => void;
  onBackToDashboard?: () => void;
}

export default function SeminarClassroom({ onHCSelectForAssessment, onBackToDashboard }: SeminarClassroomProps) {
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [timeline, setTimeline] = useState<LessonActivity[]>(INITIAL_TIMELINE);
  const [feedback, setFeedback] = useState<StudentFeedback>({
    happyGreen: 58,
    neutralYellow: 0,
    heartOrange: 14,
    frownRed: 1,
    excitedPurple: 28,
    worriedBlue: 0,
    handWhite: 3
  });
  const [documentContent, setDocumentContent] = useState(SAMPLE_PROTEST_DOC);
  
  // High fidelity UI simulation states
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(1758); // 29:18 initial state matching screenshot
  const [activeActivityId, setActiveActivityId] = useState('act3'); // "act3" is active
  const [currentSpeaker, setCurrentSpeaker] = useState<Student | null>(
    INITIAL_STUDENTS.find(s => s.name === 'David') || INITIAL_STUDENTS[4]
  );
  const [subSpeaker, setSubSpeaker] = useState<Student | null>(
    INITIAL_STUDENTS.find(s => s.name === 'Sharon') || INITIAL_STUDENTS[7]
  );
  
  const [debateText, setDebateText] = useState<string>(
    "We believe nonviolent campaigns possess significantly higher structural legitimacy, which triggers mass domestic support (#analogies). This makes government counter-repression backfire. We can analyze Strategy 6 in our chart for proof!"
  );
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [feedbackGauges, setFeedbackGauges] = useState({ yes: 124, no: 18 });
  const [activeTabVerticalRail, setActiveTabVerticalRail] = useState('chat');
  
  // Google Meet layout & controls state
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(true);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [inBreakout, setInBreakout] = useState(false);

  const [chatMessages, setChatMessages] = useState([
    { id: '1', sender: 'Sharon', text: 'Does anyone have the link to the reading?', timestamp: '3:20 PM' },
    { id: '2', sender: 'David', text: 'Yes, it is in the module syllabus page.', timestamp: '3:21 PM' },
    { id: '3', sender: 'Prof Genone', text: 'Make sure to reference Exhibit B for our current discussion.', timestamp: '3:25 PM', isInstructor: true },
  ]);
  const [newChatMessage, setNewChatMessage] = useState('');
  const [useJitsi, setUseJitsi] = useState(true);

  // Firestore Real-time Synchronization
  useEffect(() => {
    // 1. Classroom Document Sync
    const classroomRef = doc(db, 'classroom', 'live');
    const unsubClassroom = onSnapshot(classroomRef, async (snap) => {
      if (!snap.exists()) {
        try {
          await setDoc(classroomRef, {
            activeActivityId: 'act3',
            feedback: {
              happyGreen: 58,
              neutralYellow: 0,
              heartOrange: 14,
              frownRed: 1,
              excitedPurple: 28,
              worriedBlue: 0,
              handWhite: 3
            },
            feedbackGauges: { yes: 124, no: 18 },
            elapsedSeconds: 1758,
            isPlaying: false,
            debateText: "We believe nonviolent campaigns possess significantly higher structural legitimacy, which triggers mass domestic support (#analogies). This makes government counter-repression backfire. We can analyze Strategy 6 in our chart for proof!"
          });
        } catch (error) {
          console.error("Failed to seed initial classroom document to Firestore:", error);
        }
      } else {
        const data = snap.data();
        if (data.feedback) setFeedback(data.feedback);
        if (data.feedbackGauges) setFeedbackGauges(data.feedbackGauges);
        if (data.elapsedSeconds !== undefined) setElapsedSeconds(data.elapsedSeconds);
        if (data.isPlaying !== undefined) setIsPlaying(data.isPlaying);
        if (data.debateText) setDebateText(data.debateText);
        if (data.activeActivityId) setActiveActivityId(data.activeActivityId);
      }
    }, (error) => {
      console.error("Classroom snapshot stream error:", error);
    });

    // 2. Students Subcollection Sync
    const studentsColRef = collection(db, 'classroom', 'live', 'students');
    const unsubStudents = onSnapshot(studentsColRef, async (snap) => {
      if (snap.empty) {
        try {
          const batch = writeBatch(db);
          INITIAL_STUDENTS.forEach((st) => {
            const studentDocRef = doc(db, 'classroom', 'live', 'students', st.id);
            batch.set(studentDocRef, st);
          });
          await batch.commit();
        } catch (error) {
          console.error("Failed to seed students subcollection:", error);
        }
      } else {
        const loadedStudents: Student[] = [];
        snap.forEach((docSnap) => {
          loadedStudents.push(docSnap.data() as Student);
        });
        loadedStudents.sort((a, b) => a.id.localeCompare(b.id));
        setStudents(loadedStudents);
        
        const activeSpeaker = loadedStudents.find(s => s.isSpeaking);
        if (activeSpeaker) {
          setCurrentSpeaker(activeSpeaker);
        }
      }
    }, (error) => {
      console.error("Students list snapshot error:", error);
    });

    return () => {
      unsubClassroom();
      unsubStudents();
    };
  }, []);

  // Time elapsed ticker
  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
        if (Math.random() > 0.8) {
          try {
            const classroomRef = doc(db, 'classroom', 'live');
            updateDoc(classroomRef, {
              'feedback.happyGreen': increment(Math.random() > 0.6 ? 1 : 0),
              'feedback.excitedPurple': increment(Math.random() > 0.75 ? 1 : 0)
            });
          } catch (e) {
            console.error("Failed to update active ticker ticker:", e);
          }
        }
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const selectSpeaker = async (studentId: string) => {
    try {
      const target = students.find(s => s.id === studentId);
      let text = debateText;
      if (target) {
        if (target.name === 'Prof Genone') {
          text = "Excellent points so far. Let's observe the distribution in the bar chart against Strategy 6. How does moral legitimacy affect counter-repression backfire?";
        } else if (target.name === 'Marika') {
          text = "Analyzing the data, we observe peaceful campaigns succeed 53% of the time. This is a crucial metric demonstrating high elasticity of nonviolent pressure (#dataviz).";
        } else {
          text = `As we evaluate our constraints, nonviolent movements demonstrate superior structural mobilization dynamics under diverse socio-political headers. I believe Strategy 6 represents our optimal proof vector.`;
        }
      }

      const batch = writeBatch(db);
      students.forEach(st => {
        const studentRef = doc(db, 'classroom', 'live', 'students', st.id);
        batch.update(studentRef, { isSpeaking: st.id === studentId });
      });

      const classroomRef = doc(db, 'classroom', 'live');
      batch.update(classroomRef, {
        debateText: text,
        currentSpeakerId: studentId
      });

      await batch.commit();
    } catch (err) {
      console.error("Firestore select speaker failed:", err);
    }
  };

  const handlePickRandomStudent = () => {
    const speakable = students.filter(s => s.name !== 'Prof Genone');
    const randomGuy = speakable[Math.floor(Math.random() * speakable.length)];
    if (randomGuy) {
      selectSpeaker(randomGuy.id);
    }
  };

  const handleCallLeastTalkative = () => {
    const roger = students.find(s => s.name === 'Roger');
    if (roger) {
      selectSpeaker(roger.id);
    } else {
      handlePickRandomStudent();
    }
  };

  const handleSimulateDebate = async () => {
    if (!currentSpeaker) return;
    setIsAiLoading(true);
    try {
      const response = await fetch('/api/gemini/discuss', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: "Proposition: Social protests are an effective way to bring about political change. Chart Strategy Values.",
          activeStudent: currentSpeaker.name,
          previousMessages: [
            { name: "Prof Genone", text: "Welcome everyone. Let's review the empirical non-violence campaign success metrics." }
          ],
        }),
      });
      const data = await response.json();
      if (response.ok && data.text) {
        const classroomRef = doc(db, 'classroom', 'live');
        await updateDoc(classroomRef, { debateText: data.text });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiLoading(false);
    }
  };

  const triggerEmojiReaction = async (key: keyof StudentFeedback) => {
    try {
      const classroomRef = doc(db, 'classroom', 'live');
      await updateDoc(classroomRef, {
        [`feedback.${key}`]: increment(1)
      });
    } catch (err) {
      console.error("Firestore error incrementing reaction:", err);
    }
  };

  const testDataBars = [
    { name: 'Strategy 1', values: [35, 75, 115, 155] },
    { name: 'Strategy 2', values: [135, 175, 85, 205] },
    { name: 'Strategy 3', values: [105, 145, 95, 235] },
    { name: 'Strategy 4', values: [65, 125, 155, 185] },
    { name: 'Strategy 5', values: [185, 235, 45, 125] },
    { name: 'Strategy 6', values: [295, 115, 215, 175] },
    { name: 'Strategy 7', values: [255, 175, 235, 275] },
    { name: 'Strategy 8', values: [115, 315, 155, 135] }
  ];

  return (
    <div className="flex flex-col bg-[#F3F4F6] text-[#334155] min-h-screen font-sans select-none">
      
      {/* Main Meet Assembly */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden bg-[#202124] select-none relative h-auto lg:h-full">
        
        {/* Main Central Viewport */}
        <div className="flex-1 flex flex-col p-4 min-w-0 min-h-[400px] lg:min-h-0">
          <div className="flex-1 rounded-2xl overflow-hidden relative flex bg-[#1e1e1e] h-full">
            <iframe 
              src="https://meet.jit.si/ArtemisClassroomSession110" 
              allow="camera; microphone; fullscreen; display-capture; autoplay"
              className="w-full h-full border-none"
            />
          </div>
        </div>

        {/* Side Panel (Right) - AI Seminar Tools Fixed */}
        <div className="w-auto lg:w-80 bg-white flex flex-col m-4 lg:my-4 lg:mr-4 lg:ml-0 rounded-xl shadow-md border border-neutral-200 overflow-hidden shrink-0 z-10 transition-all duration-300 h-auto lg:h-full min-h-[380px] lg:min-h-0">
           {/* Dynamic side panel header */}
           <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
             <h3 className="text-[13px] font-bold text-slate-700 font-serif tracking-tight">
               AI Seminar Tools
             </h3>
           </div>

           {/* Side panel dynamic content */}
           <div className="flex-1 overflow-y-auto flex flex-col min-h-0 bg-white">
              <div className="flex-1 flex flex-col p-4 text-left">
                <div className="mb-6">
                  <h4 className="text-[11px] font-bold text-slate-500 tracking-wider mb-3">REACTIONS & ENGAGEMENT</h4>
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div onClick={() => triggerEmojiReaction('happyGreen')} className="bg-slate-50 hover:bg-slate-100 p-2 rounded-lg border border-slate-200 cursor-pointer transition shadow-xs">
                      <div className="text-lg mx-auto mb-1">😊</div>
                      <div className="text-[10px] font-bold text-slate-600">{feedback.happyGreen}</div>
                    </div>
                    <div onClick={() => triggerEmojiReaction('neutralYellow')} className="bg-slate-50 hover:bg-slate-100 p-2 rounded-lg border border-slate-200 cursor-pointer transition shadow-xs">
                      <div className="text-lg mx-auto mb-1">😐</div>
                      <div className="text-[10px] font-bold text-slate-600">{feedback.neutralYellow}</div>
                    </div>
                    <div onClick={() => triggerEmojiReaction('heartOrange')} className="bg-slate-50 hover:bg-slate-100 p-2 rounded-lg border border-slate-200 cursor-pointer transition shadow-xs">
                      <div className="text-lg mx-auto mb-1">😍</div>
                      <div className="text-[10px] font-bold text-slate-600">{feedback.heartOrange}</div>
                    </div>
                    <div onClick={() => triggerEmojiReaction('handWhite')} className="bg-slate-50 hover:bg-slate-100 p-2 rounded-lg border border-slate-200 cursor-pointer transition shadow-xs">
                      <div className="text-lg mx-auto mb-1">✋</div>
                      <div className="text-[10px] font-bold text-slate-600">{feedback.handWhite}</div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-4">
                  <h4 className="text-[11px] font-bold text-slate-500 tracking-wider mb-3">AI SEMINAR TOOLS</h4>
                  
                  {/* Active dialogue assess button */}
                  <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100 space-y-2 text-left mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-blue-800">Assess Current Speaker</span>
                    </div>
                    <p className="text-[12px] leading-relaxed text-blue-900/80 italic line-clamp-3">
                      "{debateText}"
                    </p>
                    <button
                      type="button"
                      onClick={() => currentSpeaker && onHCSelectForAssessment(currentSpeaker.name, debateText, '#analogies')}
                      className="mt-2 w-full text-[11px] bg-white hover:bg-blue-50 text-blue-700 border border-blue-200 font-bold px-3 py-1.5 rounded-lg transition duration-150 shadow-sm"
                    >
                      Grade Dialogue Block
                    </button>
                  </div>

                  <button
                    onClick={handleSimulateDebate}
                    disabled={isAiLoading}
                    className="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white text-[12px] font-bold rounded-lg flex items-center justify-center space-x-1.5 shadow-sm transition"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{isAiLoading ? 'Synthesizing...' : 'Simulate Class Debate'}</span>
                  </button>
                </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
