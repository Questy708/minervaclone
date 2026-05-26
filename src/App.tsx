import React, { useState, useEffect } from 'react';
import { initAuth, googleSignIn, logout } from './lib/auth';
import { User } from 'firebase/auth';
import SeminarClassroom from './components/SeminarClassroom';
import CourseBuilder from './components/CourseBuilder';
import DegreePlanner from './components/DegreePlanner';
import AssessmentAnnotator from './components/AssessmentAnnotator';
import ReverseEngineeringSkill from './components/ReverseEngineeringSkill';
import GradingSections from './components/GradingSections';
import UsersDirectory from './components/UsersDirectory';
import OutcomeIndex from './components/OutcomeIndex';
import AbsencesTracker from './components/AbsencesTracker';
import CoursesModule from './components/CoursesModule';
import AiTutor from './components/AiTutor';
import AutoTutor from './components/AutoTutor';
import { Tv } from 'lucide-react';
import AllEvents from './components/AllEvents';
import DashboardHome from './components/DashboardHome';
import AssignmentsModule from './components/AssignmentsModule';
import ForumFeedModule from './components/ForumFeedModule';
import { LearningCluster } from './types';

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
  Search, 
  Database,
  ArrowLeft,
  Calendar,
  Award,
  Book,
  FileText,
  BadgeAlert,
  GraduationCap as GradCap,
  Volume2,
  ListFilter,
  UserCheck2,
  HelpCircle,
  Menu,
  ChevronDown,
  Globe,
  MessageSquare
} from 'lucide-react';

type AppTab = 
  | 'dashboard' 
  | 'course-builder' 
  | 'class-assessments' 
  | 'outcome-index' 
  | 'seminar-classroom' 
  | 'users-directory' 
  | 'grading-sections' 
  | 'grading-advisees' 
  | 'grading-absences' 
  | 'reverse-engineering'
  | 'courses'
  | 'ai-tutor'
  | 'auto-tutor'
  | 'all-events'
  | 'learner-portfolio'
  | 'assignments'
  | 'forum-feed';

export type UserRole = 'faculty' | 'student' | 'researcher' | 'admin';

export const ALLOWED_TABS_BY_ROLE: Record<UserRole, AppTab[]> = {
  student: ['dashboard', 'courses', 'seminar-classroom', 'outcome-index', 'ai-tutor', 'auto-tutor', 'all-events', 'grading-advisees', 'learner-portfolio', 'assignments', 'forum-feed'],
  researcher: ['dashboard', 'courses', 'seminar-classroom', 'outcome-index', 'ai-tutor', 'auto-tutor', 'all-events', 'users-directory', 'course-builder', 'reverse-engineering', 'learner-portfolio', 'grading-advisees', 'assignments', 'forum-feed'],
  faculty: ['dashboard', 'courses', 'seminar-classroom', 'outcome-index', 'ai-tutor', 'auto-tutor', 'all-events', 'users-directory', 'course-builder', 'class-assessments', 'grading-sections', 'grading-advisees', 'grading-absences', 'learner-portfolio', 'assignments', 'forum-feed'],
  admin: [
    'dashboard', 
    'courses', 
    'course-builder', 
    'class-assessments', 
    'outcome-index', 
    'seminar-classroom', 
    'users-directory', 
    'grading-sections', 
    'grading-advisees', 
    'grading-absences', 
    'reverse-engineering', 
    'ai-tutor', 
    'auto-tutor',
    'all-events',
    'learner-portfolio',
    'assignments',
    'forum-feed'
  ]
};

export const getPersonaByRole = (role: UserRole, userObj: User | null) => {
  if (userObj?.displayName) {
    return {
      name: userObj.displayName,
      email: userObj.email || `${role}@artemis.edu`,
      avatarColor: '#EA580C',
    };
  }
  switch (role) {
    case 'student':
      return {
        name: 'Marika Alvarez',
        email: 'marika@artemis.edu',
        avatarColor: '#E91E63',
      };
    case 'researcher':
      return {
        name: 'Dr. Evelyn Sterling',
        email: 'sterling@artemis.edu',
        avatarColor: '#9C27B0',
      };
    case 'admin':
      return {
        name: 'Admin Director Marcus',
        email: 'marcus@artemis.edu',
        avatarColor: '#4CAF50',
      };
    case 'faculty':
    default:
      return {
        name: 'Prof. James Freeman',
        email: 'freeman@artemis.edu',
        avatarColor: '#3F51B5',
      };
  }
};

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [bypassAuth, setBypassAuth] = useState(false);
  const [onboardingCompleted, setOnboardingCompleted] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('artemis_onboarding_completed') === 'true';
    }
    return false;
  });
  const [userRole, setUserRole] = useState<UserRole>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('artemis_role') as UserRole) || 'faculty';
    }
    return 'faculty';
  });
  const [userCluster, setUserCluster] = useState<LearningCluster>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('artemis_cluster') as LearningCluster) || 'university';
    }
    return 'university';
  });
  const [onboardingStep, setOnboardingStep] = useState<'role' | 'cluster'>('role');
  const [tempCluster, setTempCluster] = useState<LearningCluster | null>(null);

  // Apple Intelligence Viewport Responsiveness controls (including high-zoom responsiveness)
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) {
        setIsMobileMenuOpen(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Unified synchronizer for user object properties & local storage preferences
  useEffect(() => {
    if (user) {
      const persona = getPersonaByRole(userRole, user);
      setUser((prev: any) => {
        if (!prev) return null;
        if (prev.role === userRole && prev.cluster === userCluster) {
          return prev;
        }
        return {
          ...prev,
          role: userRole,
          cluster: userCluster,
          displayName: prev.isBypass ? persona.name : prev.displayName,
          email: prev.isBypass ? persona.email : prev.email,
        };
      });
    }
    localStorage.setItem('artemis_role', userRole);
    localStorage.setItem('artemis_cluster', userCluster);
  }, [userRole, userCluster]);

  useEffect(() => {
    const unsub = initAuth((currentUser) => {
      const savedRole = (localStorage.getItem('artemis_role') as UserRole) || 'faculty';
      const savedCluster = (localStorage.getItem('artemis_cluster') as LearningCluster) || 'university';
      const isCompleted = localStorage.getItem('artemis_onboarding_completed') === 'true';

      if (currentUser) {
        setUser({
          ...currentUser,
          uid: currentUser.uid,
          displayName: currentUser.displayName,
          email: currentUser.email,
          photoURL: currentUser.photoURL,
          role: savedRole,
          cluster: savedCluster,
        });
        setUserRole(savedRole);
        setUserCluster(savedCluster);
        setOnboardingCompleted(isCompleted);
        if (isCompleted) {
          setBypassAuth(true);
        }
      } else {
        if (isCompleted) {
          const persona = getPersonaByRole(savedRole, null);
          setUser({
            uid: 'local-bypass',
            displayName: persona.name,
            email: persona.email,
            photoURL: null,
            role: savedRole,
            cluster: savedCluster,
            isBypass: true
          });
          setUserRole(savedRole);
          setUserCluster(savedCluster);
          setOnboardingCompleted(true);
          setBypassAuth(true);
        } else {
          setUser(null);
          setOnboardingCompleted(false);
          setBypassAuth(false);
        }
      }
      setCheckingAuth(false);
    });
    return unsub;
  }, []);

  const [activeTab, setActiveTab] = useState<AppTab>('dashboard');
  const [sidebarCollapsible, setSidebarCollapsible] = useState(false);
  
  const [assessmentPreload, setAssessmentPreload] = useState({
    student: '',
    text: '',
    hc: ''
  });

  const handleSelectHCForAssessment = (studentName: string, text: string, hc: string) => {
    setAssessmentPreload({ student: studentName, text, hc });
    setActiveTab('class-assessments');
  };

  const handleClearPreload = () => {
    setAssessmentPreload({ student: '', text: '', hc: '' });
  };

  if (checkingAuth) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-[#0B0C10] text-[#E5E7EB]">
        <div id="auth-loader" className="flex flex-col items-center space-y-4">
          <div className="w-10 h-10 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
          <p className="text-xs font-mono tracking-wider text-slate-400 font-bold">Verifying academic session indices...</p>
        </div>
      </div>
    );
  }

  if (!onboardingCompleted && !bypassAuth) {
    const handleRoleSelect = (selected: UserRole) => {
      setUserRole(selected);
      localStorage.setItem('artemis_role', selected);
      setOnboardingStep('cluster');
    };

    const handleClusterSelect = (cluster: LearningCluster) => {
      setUserCluster(cluster);
      localStorage.setItem('artemis_cluster', cluster);
      localStorage.setItem('artemis_onboarding_completed', 'true');
      setOnboardingCompleted(true);
      
      const persona = getPersonaByRole(userRole, user);
      const customUserObj = {
        uid: user?.uid || 'local-bypass',
        displayName: user?.displayName || persona.name,
        email: user?.email || persona.email,
        photoURL: user?.photoURL || null,
        role: userRole,
        cluster: cluster,
        isBypass: !user,
      };
      
      setUser(customUserObj as any);
      setBypassAuth(true);
    };

    return (
      <div className="flex items-center justify-center min-h-screen w-screen bg-[#0B0C10] text-[#E5E7EB] font-sans antialiased relative overflow-y-auto py-8 px-4 select-none">
        
        {/* Subtle background circles */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-3xl -mr-60 -mt-60 animate-pulse pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-orange-500/5 rounded-full blur-3xl -ml-40 -mb-40 pointer-events-none" />

        <div className="w-full max-w-2xl bg-[#14161F] border border-neutral-900 rounded-3xl shadow-2xl p-6 md:p-10 relative z-20 space-y-8 my-auto">
          
          {/* Logo Heading */}
          <div className="text-center space-y-3">
            <div className="mx-auto w-14 h-14 rounded-2xl border border-slate-700/30 p-1 flex items-center justify-center bg-[#0F1015] shadow-inner">
              <div className="w-10 h-10 rounded-full border-2 border-orange-500 border-t-transparent animate-spin-slow" />
            </div>
            
            <div className="space-y-1">
              <h1 className="text-base font-extrabold tracking-[0.25em] text-white uppercase font-sans">
                ARTEMIS FORUM
              </h1>
              <p className="text-[9.5px] font-mono font-bold tracking-[0.2em] text-[#EA580C] uppercase">
                Active Learning Core &bull; KGI
              </p>
            </div>
            
            <p className="text-xs text-slate-400 max-w-lg mx-auto leading-relaxed">
              Log into the continuous formative learning ecosystem. Select your authorized school profile to launch your academic dashboard workspace.
            </p>
          </div>

          {onboardingStep === 'role' ? (
            /* STEP 1: SELECT ROLE */
            <div className="space-y-4">
              <h3 className="text-[10px] font-mono text-slate-500 uppercase text-center tracking-widest font-extrabold">
                Select Workspace Authorization Mode (Step 1 of 2)
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Card 1: Faculty */}
                <button
                  onClick={() => handleRoleSelect('faculty')}
                  className="bg-[#1C1E2B] border border-neutral-800 hover:border-[#EA580C] rounded-xl p-4 text-left transition duration-200 hover:shadow-lg group flex space-x-3.5 focus:outline-none focus:ring-1 focus:ring-[#EA580C] cursor-pointer"
                >
                  <div className="p-2.5 bg-orange-650/10 border border-orange-555/20 text-[#EA580C] rounded-lg group-hover:bg-[#EA580C] group-hover:text-white transition duration-200 shrink-0 self-start">
                    <CheckSquare className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold font-sans text-white group-hover:text-amber-500 transition">
                      Tutors & Professors (Faculty)
                    </h4>
                    <p className="text-[10.5px] text-slate-400 leading-normal font-sans mt-1">
                      Syllabus creation blueprints, grading portfolios, active students index, and coach advice parameters.
                    </p>
                    <span className="text-[9px] font-mono text-[#EA580C] font-semibold block mt-2 uppercase tracking-wider">
                      Persona: Prof James Freeman
                    </span>
                  </div>
                </button>

                {/* Card 2: Student */}
                <button
                  onClick={() => handleRoleSelect('student')}
                  className="bg-[#1C1E2B] border border-neutral-800 hover:border-indigo-500 rounded-xl p-4 text-left transition duration-200 hover:shadow-lg group flex space-x-3.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                >
                  <div className="p-2.5 bg-indigo-650/10 border border-indigo-550/20 text-indigo-400 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition duration-200 shrink-0 self-start">
                    <GraduationCap className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold font-sans text-white group-hover:text-indigo-400 transition">
                      Intelligent Scholar (Student)
                    </h4>
                    <p className="text-[10.5px] text-slate-400 leading-normal font-sans mt-1">
                      Track cornerstone HCs masteries, enter live seminar sessions, and review direct analytical grade plans.
                    </p>
                    <span className="text-[9px] font-mono text-indigo-400/80 font-bold block mt-2 uppercase tracking-wider">
                      Persona: Marika Alvarez
                    </span>
                  </div>
                </button>

                {/* Card 3: Researcher */}
                <button
                  onClick={() => handleRoleSelect('researcher')}
                  className="bg-[#1C1E2B] border border-neutral-800 hover:border-[#10B981] rounded-xl p-4 text-left transition duration-200 hover:shadow-lg group flex space-x-3.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                >
                  <div className="p-2.5 bg-emerald-650/10 border border-emerald-555/20 text-[#10B981] rounded-lg group-hover:bg-[#10B981] group-hover:text-white transition duration-200 shrink-0 self-start">
                    <Brain className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold font-sans text-white group-hover:text-emerald-400 transition">
                      Academic Analyst (Researcher)
                    </h4>
                    <p className="text-[10.5px] text-slate-400 leading-normal font-sans mt-1">
                      Formative assessments telemetry logs, curriculum outline maps, and users statistics.
                    </p>
                    <span className="text-[9px] font-mono text-emerald-400/85 font-bold block mt-2 uppercase tracking-wider">
                      Persona: Dr Evelyn Sterling
                    </span>
                  </div>
                </button>

                {/* Card 4: Admin */}
                <button
                  onClick={() => handleRoleSelect('admin')}
                  className="bg-[#1C1E2B] border border-neutral-800 hover:border-rose-500 rounded-xl p-4 text-left transition duration-200 hover:shadow-lg group flex space-x-3.5 focus:outline-none focus:ring-1 focus:ring-rose-500 cursor-pointer"
                >
                  <div className="p-2.5 bg-rose-650/10 border border-rose-555/20 text-[#F43F5E] rounded-lg group-hover:bg-[#F43F5E] group-hover:text-white transition duration-200 shrink-0 self-start">
                    <Users className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold font-sans text-white group-hover:text-rose-400 transition">
                      Super Administrator (Admin)
                    </h4>
                    <p className="text-[10.5px] text-slate-400 leading-normal font-sans mt-1">
                      Access all sub-panels, index academic terms, inspect schema registers, and curate the full course catalog.
                    </p>
                    <span className="text-[9px] font-mono text-rose-450/85 font-bold block mt-2 uppercase tracking-wider">
                      Persona: Marcus Admin
                    </span>
                  </div>
                </button>

              </div>
            </div>
          ) : (
            /* STEP 2: SELECT LEARNING CONTINUUM CLUSTER (VISUAL PICKER) */
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <button
                  onClick={() => setOnboardingStep('role')}
                  className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition font-bold uppercase font-mono cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Step 1</span>
                </button>
                <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest font-extrabold bg-[#1C1E2B] px-2.5 py-0.5 rounded border border-neutral-800">
                  Step 2 of 2
                </span>
              </div>
              
              <div className="space-y-2 text-center md:text-left">
                <h3 className="text-xs font-mono text-[#EA580C] uppercase tracking-widest font-extrabold">
                  Infinite Learning Continuum Profile Selection
                </h3>
                <p className="text-[11.5px] text-slate-400 leading-relaxed font-sans">
                  Choose a division of lifelong academic coordination. Your dashboard layout, study milestones, and active search catalog criteria adjust dynamically to match your lifestage boundary.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                
                {/* Cluster 1: K-12 */}
                <button
                  onClick={() => setTempCluster('k12')}
                  className={`border rounded-xl p-5 text-left transition duration-200 flex space-x-4 cursor-pointer relative overflow-hidden ${
                    tempCluster === 'k12' 
                      ? 'bg-[#1C1E2B] border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500' 
                      : 'bg-[#151722] border-neutral-800/80 hover:border-emerald-600/60'
                  }`}
                >
                  <div className={`p-3 rounded-xl transition duration-205 shrink-0 self-start text-xl font-bold font-mono w-12 h-12 flex items-center justify-center ${
                    tempCluster === 'k12' ? 'bg-emerald-600 text-white shadow-md' : 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/30'
                  }`}>
                    🎒
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xs font-bold font-sans text-white group-hover:text-emerald-400 transition flex items-center gap-2">
                      <span>Cluster 1: K-12 Division</span>
                      <span className="bg-emerald-950/80 border border-emerald-800 text-emerald-400 text-[8.5px] font-mono px-1.5 rounded">Avenues Style</span>
                    </h4>
                    <p className="text-[10.5px] text-slate-400 leading-normal font-sans mt-1">
                      Playful gamified study timelines, companion guides, explorer adventure badges, and cardboard computational models.
                    </p>
                  </div>
                  {tempCluster === 'k12' && (
                    <div className="absolute right-4 top-4 w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center text-[8px] text-black">
                      ✓
                    </div>
                  )}
                </button>

                {/* Cluster 2: University */}
                <button
                  onClick={() => setTempCluster('university')}
                  className={`border rounded-xl p-5 text-left transition duration-200 flex space-x-4 cursor-pointer relative overflow-hidden ${
                    tempCluster === 'university' 
                      ? 'bg-[#1C1E2B] border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.15)] ring-1 ring-indigo-500' 
                      : 'bg-[#151722] border-neutral-800/80 hover:border-indigo-600/60'
                  }`}
                >
                  <div className={`p-3 rounded-xl transition duration-205 shrink-0 self-start text-xl font-bold font-mono w-12 h-12 flex items-center justify-center ${
                    tempCluster === 'university' ? 'bg-indigo-600 text-white shadow-md' : 'bg-indigo-950/40 text-indigo-400 border border-indigo-900/30'
                  }`}>
                    🎓
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xs font-bold font-sans text-white group-hover:text-indigo-400 transition flex items-center gap-2">
                      <span>Cluster 2: Collegiate & Graduate Division</span>
                      <span className="bg-indigo-950/80 border border-indigo-805 text-indigo-400 text-[8.5px] font-mono px-1.5 rounded font-bold">Yale Search Index</span>
                    </h4>
                    <p className="text-[10.5px] text-slate-400 leading-normal font-sans mt-1">
                      Core rigorous analytical academic courses, 1-5 Habits of Mind formative grade scales, transcript GPA blueprints, and diagnostic spotlights.
                    </p>
                  </div>
                  {tempCluster === 'university' && (
                    <div className="absolute right-4 top-4 w-4 h-4 rounded-full bg-indigo-500 flex items-center justify-center text-[8px] text-white">
                      ✓
                    </div>
                  )}
                </button>

                {/* Cluster 3: Seniors */}
                <button
                  onClick={() => setTempCluster('seniors')}
                  className={`border rounded-xl p-5 text-left transition duration-200 flex space-x-4 cursor-pointer relative overflow-hidden ${
                    tempCluster === 'seniors' 
                      ? 'bg-[#1C1E2B] border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.15)] ring-1 ring-orange-500' 
                      : 'bg-[#151722] border-neutral-800/80 hover:border-orange-600/60'
                  }`}
                >
                  <div className={`p-3 rounded-xl transition duration-205 shrink-0 self-start text-xl font-bold font-mono w-12 h-12 flex items-center justify-center ${
                    tempCluster === 'seniors' ? 'bg-orange-600 text-white shadow-md' : 'bg-orange-950/40 text-orange-400 border border-orange-900/30'
                  }`}>
                    🌿
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xs font-bold font-sans text-white group-hover:text-indigo-400 transition flex items-center gap-1.5">
                      <span>Cluster 3: Seniors Active Mind Oasis</span>
                      <span className="bg-orange-955 text-orange-400 border border-orange-900 text-[8px] font-mono px-1.5 rounded uppercase tracking-wider font-extrabold">Active</span>
                    </h4>
                    <p className="text-[10.5px] text-slate-400 leading-normal font-sans mt-1">
                      Autobiographical memoirs transcription, classic symphonies orchestration auditory analysis circles, and friendly AI helper tutorials.
                    </p>
                  </div>
                  {tempCluster === 'seniors' && (
                    <div className="absolute right-4 top-4 w-4 h-4 rounded-full bg-orange-500 flex items-center justify-center text-[8px] text-white">
                      ✓
                    </div>
                  )}
                </button>

              </div>

              {/* Confirm CTA Button Box */}
              <div className="pt-4 border-t border-neutral-900 flex justify-end">
                <button
                  disabled={!tempCluster}
                  onClick={() => tempCluster && handleClusterSelect(tempCluster)}
                  className={`px-6 h-11 rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-md ${
                    tempCluster 
                      ? 'bg-gradient-to-r from-orange-600 to-indigo-600 hover:opacity-90 text-white cursor-pointer hover:scale-[1.02] active:scale-[0.98]' 
                      : 'bg-neutral-800 text-neutral-500 cursor-not-allowed border border-neutral-850/60'
                  }`}
                >
                  <span>Confirm Selection & Launch Artemis</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          )}

          {/* Social SSO block */}
          {onboardingStep === 'role' && (
            <div className="space-y-4 border-t border-neutral-900 pt-7">
              <div className="flex items-center justify-center gap-2">
                <span className="h-[1px] w-20 bg-neutral-800"></span>
                <span className="text-[9.5px] font-mono tracking-widest text-slate-500 uppercase font-extrabold">OR INSTITUTIONAL SSO</span>
                <span className="h-[1px] w-20 bg-neutral-800"></span>
              </div>

              <button
                onClick={async () => {
                  try {
                    await googleSignIn();
                    setOnboardingStep('cluster');
                  } catch (err) {
                    console.error("Sign-in failed:", err);
                  }
                }}
                className="w-full h-11 bg-white hover:bg-slate-50 text-slate-800 rounded-xl font-bold flex items-center justify-center space-x-2.5 text-xs cursor-pointer shadow-sm transition"
              >
                <svg className="w-4 h-4 text-xs font-bold leading-none" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.275 1.564-1.724 4.597-6.887 4.597-4.461 0-8.1-3.69-8.1-8.2s3.639-8.2 8.1-8.2c2.541 0 4.246 1.09 5.218 2.025l3.242-3.123C18.618 1.517 15.698 0 12.24 0a12 12 0 0 0-12 12 12 12 0 0 0 12 12c6.286 0 10.457-4.417 10.457-10.635 0-.715-.078-1.26-.174-1.802z" />
                </svg>
                <span>Authenticate with Institutional SSO</span>
              </button>
            </div>
          )}

          {/* Footer branding */}
          <div className="text-center pt-2">
            <span className="text-[9px] font-mono text-slate-550 block">
              Continuous Formative Assessment Engine Security Boundary &bull; v2.10
            </span>
          </div>

        </div>

      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#F3F4F6] text-[#334155] font-sans antialiased overflow-hidden select-none">
      
      {/* Backdrop overlay for mobile menu / zoomed-in drawer */}
      {isMobile && isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-45 bg-[#0B0C10]/60 backdrop-blur-xs transition duration-200" 
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* CORE SIDEBAR - Dark high-contrast styling restored */}
      <aside className={`
        flex flex-col select-none shrink-0 border-r border-neutral-900 transition-all duration-250 z-50
        ${isMobile 
          ? `fixed top-0 bottom-0 left-0 bg-[#1A1D26]/95 backdrop-blur-md text-slate-300 w-64 shadow-2xl transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`
          : `relative bg-[#1A1D26] text-slate-300 ${sidebarCollapsible ? 'w-0 overflow-hidden border-0' : 'w-60'}`
        }
      `}>
        {/* LOGO BOX FOR ARTEMIS SCHOOLS */}
        <div className="px-5 py-4 bg-[#14161F] border-b border-neutral-900 flex items-center space-x-2.5">
          <div className="relative w-7 h-7 rounded-sm border border-slate-500/20 p-0.5 flex items-center justify-center shrink-0">
            {/* White/Reflective circle simulation resembling screenshot */}
            <div className="w-5 h-5 rounded-full border-2 border-white/90 border-t-transparent animate-spin-slow" />
          </div>
          <div className="leading-tight">
            <div className="text-[11px] font-extrabold text-white tracking-widest font-sans uppercase">
              ARTEMIS
            </div>
            <div className="text-[8.5px] font-mono font-bold tracking-wider text-slate-400">
              SCHOOLS AT KGI
            </div>
          </div>
        </div>

        {/* SIDEBAR NAVIGATION LIST */}
        <div className="flex-1 overflow-y-auto px-3 py-5 space-y-6 select-none custom-scrollbar">
          
          {/* Group 1: CORE PORTALS */}
          <div className="space-y-0.5">
            {ALLOWED_TABS_BY_ROLE[userRole].includes('dashboard') && (
              <button
                onClick={() => {
                  setActiveTab('dashboard');
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition ${
                  activeTab === 'dashboard' 
                    ? 'bg-neutral-800 text-white font-bold border-l-2 border-orange-500' 
                    : 'hover:bg-neutral-800/50 hover:text-slate-100 text-slate-400'
                }`}
              >
                <Layout className="w-4 h-4 shrink-0 text-slate-400" />
                <span>Dashboard</span>
              </button>
            )}

            {ALLOWED_TABS_BY_ROLE[userRole].includes('courses') && (
              <button
                onClick={() => {
                  setActiveTab('courses');
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition ${
                  activeTab === 'courses' 
                    ? 'bg-neutral-800 text-white font-bold border-l-2 border-orange-500' 
                    : 'hover:bg-neutral-800/50 hover:text-slate-100 text-slate-400'
                }`}
              >
                <BookOpen className="w-4 h-4 shrink-0 text-slate-400" />
                <span>Courses</span>
              </button>
            )}

            {ALLOWED_TABS_BY_ROLE[userRole].includes('assignments') && (
              <button
                onClick={() => {
                  setActiveTab('assignments');
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition ${
                  activeTab === 'assignments' 
                    ? 'bg-neutral-800 text-white font-bold border-l-2 border-orange-500' 
                    : 'hover:bg-neutral-800/50 hover:text-slate-100 text-slate-400'
                }`}
              >
                <FileText className="w-4 h-4 shrink-0 text-slate-400" />
                <span>Assignments & Reflection</span>
              </button>
            )}

            {ALLOWED_TABS_BY_ROLE[userRole].includes('course-builder') && (
              <button
                onClick={() => {
                  setActiveTab('course-builder');
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition ${
                  activeTab === 'course-builder' 
                    ? 'bg-neutral-800 text-white font-bold border-l-2 border-orange-500' 
                    : 'hover:bg-neutral-800/50 hover:text-slate-100 text-slate-400'
                }`}
              >
                <Layout className="w-4 h-4 shrink-0 text-slate-400" />
                <span>Course Builder</span>
              </button>
            )}

            {ALLOWED_TABS_BY_ROLE[userRole].includes('class-assessments') && (
              <button
                onClick={() => {
                  setActiveTab('class-assessments');
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition ${
                  activeTab === 'class-assessments' 
                    ? 'bg-neutral-800 text-white font-bold border-l-2 border-orange-500' 
                    : 'hover:bg-neutral-800/50 hover:text-slate-100 text-slate-400'
                }`}
              >
                <CheckSquare className="w-4 h-4 shrink-0 text-slate-400" />
                <span>Class Assessments</span>
              </button>
            )}

            {ALLOWED_TABS_BY_ROLE[userRole].includes('outcome-index') && (
              <button
                onClick={() => {
                  setActiveTab('outcome-index');
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition ${
                  activeTab === 'outcome-index' 
                    ? 'bg-neutral-800 text-white font-bold border-l-2 border-orange-500' 
                    : 'hover:bg-neutral-800/50 hover:text-slate-100 text-slate-400'
                }`}
              >
                <Award className="w-4 h-4 shrink-0 text-slate-400" />
                <span>Outcome Index</span>
              </button>
            )}
          </div>

          {/* Group 2: COURSES LIST FOR DIRECTORY */}
          {ALLOWED_TABS_BY_ROLE[userRole].includes('seminar-classroom') && (
            <div className="space-y-1.5">
              <span className="px-3.5 text-[9px] font-mono font-bold tracking-widest text-slate-500 uppercase block mb-1">
                Active Courses
              </span>
              <div className="space-y-0.5">
                <button
                  onClick={() => {
                    setActiveTab('seminar-classroom');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex flex-col items-start px-3.5 py-1.5 rounded-lg text-left transition ${
                    activeTab === 'seminar-classroom' 
                      ? 'bg-neutral-800 text-white font-semibold border-l-2 border-orange-500' 
                      : 'hover:bg-neutral-800/50 hover:text-slate-100 text-slate-400'
                  }`}
                >
                  <div className="text-[10.5px] font-bold flex items-center justify-between w-full">
                    <span>SS110 Session 2.1</span>
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                  </div>
                  <div className="text-[8.5px] text-zinc-400 truncate font-mono mt-0.5 max-w-[170px]">
                    Sensation vs Perception (HC1)
                  </div>
                </button>
                
                <div className="px-3.5 py-1.5 text-[10.2px] text-slate-400 font-mono space-y-1.5 select-none pt-2 border-t border-neutral-850/60">
                  <div onClick={() => { setActiveTab('courses'); setIsMobileMenuOpen(false); }} className="hover:text-white cursor-pointer flex items-center justify-between transition">
                    <span>IL181.005 - Mon @17:05</span>
                  </div>
                  <div onClick={() => { setActiveTab('courses'); setIsMobileMenuOpen(false); }} className="hover:text-white cursor-pointer flex items-center justify-between transition">
                    <span>NS111 - Freeman MW @09:00</span>
                  </div>
                  <div onClick={() => { setActiveTab('courses'); setIsMobileMenuOpen(false); }} className="hover:text-white cursor-pointer flex items-center justify-between transition">
                    <span>NS166 - Freeman TTh @17:00</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Group 3: INTELLECTUAL UTILITIES */}
          <div className="space-y-0.5">
            <span className="px-3.5 text-[9px] font-mono font-bold tracking-widest text-slate-500 uppercase block mb-1">
              Utilities
            </span>
            {ALLOWED_TABS_BY_ROLE[userRole].includes('ai-tutor') && (
              <button
                onClick={() => {
                  setActiveTab('ai-tutor');
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-3.5 py-2 rounded-lg text-xs font-semibold tracking-wide transition ${
                  activeTab === 'ai-tutor' 
                    ? 'bg-neutral-800 text-white font-bold border-l-2 border-orange-500' 
                    : 'hover:bg-neutral-800/50 hover:text-slate-100 text-slate-400'
                }`}
              >
                <Sparkles className="w-4 h-4 shrink-0 text-slate-400" />
                <span>AI Tutor</span>
              </button>
            )}

            {ALLOWED_TABS_BY_ROLE[userRole].includes('auto-tutor') && (
              <button
                onClick={() => {
                  setActiveTab('auto-tutor');
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-3.5 py-2 rounded-lg text-xs font-semibold tracking-wide transition ${
                  activeTab === 'auto-tutor' 
                    ? 'bg-neutral-800 text-white font-bold border-l-2 border-fuchsia-500' 
                    : 'hover:bg-neutral-800/50 hover:text-slate-100 text-slate-400'
                }`}
              >
                <Tv className="w-4 h-4 shrink-0 text-[#d946ef]" />
                <span className="text-zinc-300">Artemis Navigator</span>
              </button>
            )}

            {ALLOWED_TABS_BY_ROLE[userRole].includes('all-events') && (
              <button
                onClick={() => {
                  setActiveTab('all-events');
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-3.5 py-2 rounded-lg text-xs font-semibold tracking-wide transition ${
                  activeTab === 'all-events' 
                    ? 'bg-neutral-800 text-white font-bold border-l-2 border-orange-500' 
                    : 'hover:bg-neutral-800/50 hover:text-slate-100 text-slate-400'
                }`}
              >
                <Calendar className="w-4 h-4 shrink-0 text-slate-400" />
                <span>Term Calendar</span>
              </button>
            )}

            {ALLOWED_TABS_BY_ROLE[userRole].includes('users-directory') && (
              <button
                onClick={() => {
                  setActiveTab('users-directory');
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-3.5 py-2 rounded-lg text-xs font-semibold tracking-wide transition ${
                  activeTab === 'users-directory' 
                    ? 'bg-neutral-800 text-white font-bold border-l-2 border-orange-500' 
                    : 'hover:bg-neutral-800/50 hover:text-slate-100 text-slate-400'
                }`}
              >
                <Users className="w-4 h-4 shrink-0 text-slate-400" />
                <span>Users Directory</span>
              </button>
            )}
          </div>

          {/* Group: GLOBAL FIELD CAMPUS */}
          {ALLOWED_TABS_BY_ROLE[userRole].includes('forum-feed') && (
            <div className="space-y-0.5">
              <span className="px-3.5 text-[9px] font-mono font-bold tracking-widest text-slate-500 uppercase block mb-1">
                Global Campus
              </span>

              {ALLOWED_TABS_BY_ROLE[userRole].includes('forum-feed') && (
                <button
                  onClick={() => {
                    setActiveTab('forum-feed');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-3.5 py-2 rounded-lg text-xs font-semibold tracking-wide transition ${
                    activeTab === 'forum-feed' 
                      ? 'bg-neutral-800 text-white font-bold border-l-2 border-orange-500' 
                      : 'hover:bg-neutral-800/50 hover:text-slate-100 text-slate-400'
                  }`}
                >
                  <MessageSquare className="w-4 h-4 shrink-0 text-slate-400" />
                  <span>Cooperative Forum / Feed</span>
                </button>
              )}
            </div>
          )}

          {/* Group 4: GRADING PLATFORM */}
          {(ALLOWED_TABS_BY_ROLE[userRole].includes('grading-sections') ||
            ALLOWED_TABS_BY_ROLE[userRole].includes('grading-advisees') ||
            ALLOWED_TABS_BY_ROLE[userRole].includes('grading-absences') ||
            ALLOWED_TABS_BY_ROLE[userRole].includes('learner-portfolio')) && (
            <div className="space-y-0.5">
              <span className="px-3.5 text-[9px] font-mono font-bold tracking-widest text-slate-500 uppercase block mb-1">
                {userRole === 'student' ? 'Academic Program' : 'Grading'}
              </span>
              
              {ALLOWED_TABS_BY_ROLE[userRole].includes('grading-sections') && (
                <button
                  onClick={() => {
                    setActiveTab('grading-sections');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2 rounded-lg text-xs font-semibold tracking-wide transition ${
                    activeTab === 'grading-sections' 
                      ? 'bg-neutral-800 text-white font-bold border-l-2 border-orange-500' 
                      : 'hover:bg-neutral-800/50 hover:text-slate-100 text-slate-400'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Layers className="w-4 h-4 shrink-0 text-slate-400" />
                    <span>Sections</span>
                  </div>
                  <span className="bg-[#EA580C] text-white text-[8px] font-mono tracking-wide px-1.5 py-0.2 rounded font-bold">14/17</span>
                </button>
              )}

              {ALLOWED_TABS_BY_ROLE[userRole].includes('grading-advisees') && (
                <button
                  onClick={() => {
                    setActiveTab('grading-advisees');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-3.5 py-2 rounded-lg text-xs font-semibold tracking-wide transition ${
                    activeTab === 'grading-advisees' 
                      ? 'bg-neutral-800 text-white font-bold border-l-2 border-orange-500' 
                      : 'hover:bg-neutral-800/50 hover:text-slate-100 text-slate-400'
                  }`}
                >
                  <GraduationCap className="w-4 h-4 shrink-0 text-slate-400" />
                  <span>{userRole === 'student' ? 'My Progress' : 'Advisees Planner'}</span>
                </button>
              )}

              {ALLOWED_TABS_BY_ROLE[userRole].includes('grading-absences') && (
                <button
                  onClick={() => {
                    setActiveTab('grading-absences');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2 rounded-lg text-xs font-semibold tracking-wide transition ${
                    activeTab === 'grading-absences' 
                      ? 'bg-neutral-800 text-white font-bold border-l-2 border-orange-500' 
                      : 'hover:bg-neutral-800/50 hover:text-slate-100 text-slate-400'
                  }`}
                >
                  <div className="flex items-center space-x-3 font-medium">
                    <Calendar className="w-4 h-4 shrink-0 text-slate-400" />
                    <span>Absences Log</span>
                  </div>
                  <span className="bg-red-950/40 text-red-350 border border-red-900/40 text-[8px] font-mono px-1.5 py-0.2 rounded font-bold">2 ALERTS</span>
                </button>
              )}

              {ALLOWED_TABS_BY_ROLE[userRole].includes('learner-portfolio') && (
                <button
                  onClick={() => {
                    setActiveTab('learner-portfolio');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2 rounded-lg text-xs font-semibold tracking-wide transition ${
                    activeTab === 'learner-portfolio' 
                      ? 'bg-neutral-800 text-white font-bold border-l-2 border-orange-500' 
                      : 'hover:bg-neutral-800/50 hover:text-slate-100 text-slate-400'
                  }`}
                >
                  <div className="flex items-center space-x-3 font-medium">
                    <Award className="w-4 h-4 shrink-0 text-slate-400" />
                    <span>Learner Portfolio</span>
                  </div>
                  <span className="bg-amber-600/25 text-amber-300 border border-amber-650/30 text-[8px] font-mono px-1.5 py-0.2 rounded font-bold uppercase tracking-wider">cloned</span>
                </button>
              )}
            </div>
          )}

          {/* Group 5: PRIVATE ENGINEERING TOOLS */}
          {ALLOWED_TABS_BY_ROLE[userRole].includes('reverse-engineering') && (
            <div className="space-y-0.5">
              <span className="px-3.5 text-[9px] font-mono font-bold tracking-widest text-[#EA580C] uppercase block mb-1">
                Deconstruct Studio
              </span>
              <button
                onClick={() => {
                  setActiveTab('reverse-engineering');
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-3.5 py-2 rounded-lg text-xs font-semibold tracking-wide transition ${
                  activeTab === 'reverse-engineering' 
                    ? 'bg-neutral-800 text-white font-bold border-l-2 border-[#EA580C]' 
                    : 'hover:bg-neutral-800/50 hover:text-slate-100 text-slate-400'
                }`}
              >
                <Brain className="w-4 h-4 shrink-0 text-[#EA580C]" />
                <span>Reverse Engineering</span>
              </button>
            </div>
          )}

        </div>

        {/* PROFILE BLOCK AT FOOTER WITH CUSTOM ROLE DROPDOWN SWITCHER */}
        <div className="p-4 bg-[#14161F] border-t border-neutral-900 flex flex-col space-y-2.5 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5 min-w-0">
              <div className="w-5 h-5 rounded bg-[#EA580C] text-white flex items-center justify-center font-bold text-[9px] shadow-inner font-mono shrink-0">
                {userRole.slice(0, 2).toUpperCase()}
              </div>
              <div className="text-[9.5px] font-mono tracking-wider font-extrabold text-slate-400 uppercase truncate">
                {userRole} MODE
              </div>
            </div>
            
            <select
              value={userRole}
              onChange={(e) => {
                const newRole = e.target.value as UserRole;
                setUserRole(newRole);
                setActiveTab('dashboard');
              }}
              className="bg-neutral-800 text-slate-300 text-[9px] font-mono border border-neutral-700/60 rounded px-1.5 py-0.5 outline-none cursor-pointer hover:bg-neutral-750 transition"
              title="Quick Toggle Workspace Role Portal"
            >
              <option value="faculty">Faculty</option>
              <option value="student">Student</option>
              <option value="researcher">Researcher</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-neutral-850/60">
            <div className="flex items-center space-x-2 min-w-0">
              <div className="leading-tight truncate">
                <div className="text-[10.5px] font-bold text-white truncate max-w-[120px]">
                  {getPersonaByRole(userRole, user).name}
                </div>
                <div className="text-[8.5px] text-slate-500 font-mono truncate max-w-[120px]">
                  {getPersonaByRole(userRole, user).email}
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                if (user) {
                  logout();
                } else {
                  setBypassAuth(false);
                }
              }}
              className="p-1 px-1.5 text-[8.5px] font-mono bg-red-950/20 border border-neutral-800 hover:border-red-950 hover:bg-red-950/40 text-slate-400 hover:text-red-400 rounded transition cursor-pointer shrink-0"
            >
              Exit
            </button>
          </div>
        </div>

      </aside>

      {/* CORE WORKSPACE SPACE WITH TOP NAVIGATION HEADER BAR */}
      <div className="flex-grow flex flex-col h-full overflow-hidden select-none">
        
        {/* UPPER VIEWPORT NAVIGATION STRIP */}
        <header className="px-6 py-3 bg-[#0B0C10] text-[#E5E7EB] border-b border-neutral-900 sticky top-0 z-40 flex items-center justify-between shrink-0 select-none">
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => {
                if (isMobile) {
                  setIsMobileMenuOpen(!isMobileMenuOpen);
                } else {
                  setSidebarCollapsible(!sidebarCollapsible);
                }
              }}
              className="p-1.5 rounded-lg bg-[#1F2937] hover:bg-[#2D3748] border border-neutral-800 text-neutral-300 hover:text-white transition cursor-pointer"
              title="Toggle Navigation Menu"
            >
              <Menu className="w-4 h-4" />
            </button>

            <div className="min-w-0">
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-mono tracking-wider text-slate-400 font-semibold hidden sm:inline">Artemis ›</span>
                <h1 className="text-xs sm:text-sm font-semibold text-white tracking-tight truncate max-w-[180px] sm:max-w-[320px] md:max-w-none font-sans">
                  {activeTab === 'dashboard' && 'Dashboard'}
                  {activeTab === 'course-builder' && 'Course Outline Builder'}
                  {activeTab === 'class-assessments' && 'Formative Annotations'}
                  {activeTab === 'outcome-index' && 'Cornerstone Outcomes'}
                  {activeTab === 'seminar-classroom' && 'Seminar Classroom Session'}
                  {activeTab === 'users-directory' && 'Directory list'}
                  {activeTab === 'grading-sections' && 'Assessment Section Portfolios'}
                  {activeTab === 'grading-advisees' && 'Degree Progress Planner'}
                  {activeTab === 'grading-absences' && 'Absences Control'}
                  {activeTab === 'reverse-engineering' && 'Deconstruction Studio'}
                  {activeTab === 'courses' && 'Active Curriculum'}
                  {activeTab === 'ai-tutor' && 'AI Critical Tutor Core'}
                  {activeTab === 'auto-tutor' && 'Retro AutoTutor Interface'}
                  {activeTab === 'all-events' && 'Academic Roadmap Calendar'}
                  {activeTab === 'assignments' && 'Assignments & Evaluation Panel'}
                  {activeTab === 'forum-feed' && 'Cooperative Academic Forum'}
                </h1>
                
                {activeTab === 'seminar-classroom' && (
                  <span className="bg-red-950/60 text-red-350 border border-red-900/40 text-[8px] px-1.5 py-0.2 rounded font-mono font-bold animate-pulse">
                    LIVE
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-xs">
            <div className="hidden sm:flex items-center space-x-1.5 bg-[#1F2937] px-3 py-1.5 rounded-xl border border-neutral-800/40 text-slate-400 font-mono text-[9px] font-bold">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>2026-05-21 UTC</span>
            </div>
            
            {activeTab !== 'dashboard' && (
              <button
                onClick={() => setActiveTab('dashboard')}
                className="px-3 py-1.5 text-[9px] font-mono font-bold uppercase tracking-wider bg-orange-650 hover:bg-orange-700 text-white rounded-xl transition cursor-pointer shadow-sm"
              >
                Back to Index
              </button>
            )}
          </div>
        </header>

        {/* ROUTED CONTENT VIEW AREA - Exactly matching the background parameter */}
        <div className="flex-grow overflow-y-auto select-none bg-[#F3F4F6]">
          
          {/* 1. DASHBOARD PORTAL PORT */}
          {activeTab === 'dashboard' && (
            <DashboardHome
              role={userRole}
              userInfo={getPersonaByRole(userRole, user)}
              onNavigate={(tab) => setActiveTab(tab)}
              allowedTabs={ALLOWED_TABS_BY_ROLE[userRole]}
              userCluster={userCluster}
              setUserCluster={setUserCluster}
            />
          )}

          {/* 1. OLD INSIGHT SYSTEM FALLBACK */}
          {activeTab === 'old-dashboard' && (
            <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
              {/* Dynamic Welcome card from mockup style */}
              <div className="bg-gradient-to-r from-slate-900 via-[#1F222D] to-slate-900 rounded-2xl p-6 md:p-10 text-white shadow-xl relative overflow-hidden border border-neutral-800 select-none">
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -mr-32 -mt-32" />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl -ml-20 -mb-20" />
                
                <div className="relative z-10 max-w-3xl space-y-4">
                  <div className="flex items-center space-x-2">
                    <span className="bg-orange-500 text-white text-[9px] font-mono tracking-widest px-2.5 py-0.5 rounded font-bold uppercase">
                      Artemis Active Learning Framework
                    </span>
                    <span className="bg-emerald-900/60 text-emerald-400 text-[9px] font-mono font-bold px-2.5 py-0.5 rounded">
                      Live Integrations Enabled
                    </span>
                  </div>

                  <h2 className="text-2xl md:text-4xl font-serif tracking-tight text-white leading-tight">
                    Welcome Back, Prof Freeman
                  </h2>
                  <p className="text-xs md:text-[13.2px] text-slate-300 leading-relaxed font-sans font-medium">
                    Analyze class reaction logs, plan new course structures, monitor outstanding grading sections, evaluate students' foundational concepts (HCs), and trigger graduation degree checklists. Connect directly with students using active real-time feedback anchors under the sidebar modules.
                  </p>
                  
                  <div className="pt-2 flex flex-wrap gap-4 text-xs text-slate-400 font-mono select-none">
                    <span className="flex items-center space-x-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500 animate-pulse" /> <span>9 Modules Fully Dynamic</span></span>
                    <span className="flex items-center space-x-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> <span>Grading Sections Linked</span></span>
                    <span className="flex items-center space-x-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> <span>Gemini Feedback Engine Online</span></span>
                  </div>
                </div>
              </div>

              {/* OUTSTANDING COMPANION MATRIX */}
              <div>
                <h3 className="text-xs font-bold text-slate-400 font-mono tracking-wider uppercase border-b border-neutral-300/40 pb-2 mb-6">
                  INTEGRATED SUITE FUNCTION BLOCKS
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  
                  {/* 1. Live classroom portal */}
                  <div 
                    onClick={() => setActiveTab('seminar-classroom')}
                    className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-orange-500 hover:shadow-lg transition duration-200 cursor-pointer flex flex-col justify-between group h-[260px] relative overflow-hidden"
                  >
                    <div className="space-y-4">
                      <div className="w-11 h-11 rounded-xl bg-orange-50 border border-orange-200 text-orange-600 flex items-center justify-center group-hover:bg-orange-600 group-hover:text-white transition duration-200 shadow-xs">
                        <Presentation className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="text-sm font-bold text-slate-800 font-sans group-hover:text-orange-600 transition">
                            Seminar Classroom
                          </h4>
                          <span className="bg-red-100 text-red-600 text-[8px] px-1.5 py-0.2 rounded font-mono font-bold uppercase animate-pulse">LIVE</span>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed mt-2 font-medium">
                          Enter live simulation classroom. Observe a high-resolution grid of 60 students and utilize interactive poll widgets, feedback emoji counters, slide sync buffers, and speech tags.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs font-semibold text-orange-600 group-hover:translate-x-1 transition duration-150 pt-3 border-t border-slate-100 font-sans">
                      <span>Launch Live Class Arena</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>

                  {/* 2. Grading sections portal */}
                  <div 
                    onClick={() => setActiveTab('grading-sections')}
                    className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-indigo-500 hover:shadow-lg transition duration-200 cursor-pointer flex flex-col justify-between group h-[260px] relative overflow-hidden"
                  >
                    <div className="space-y-4">
                      <div className="w-11 h-11 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition duration-200 shadow-xs">
                        <Layers className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-800 font-sans group-hover:text-indigo-600 transition">
                          Grading / My Sections
                        </h4>
                        <p className="text-xs text-slate-500 leading-relaxed mt-2 font-medium">
                          Directly manage Course Sections, examine submitted tasks (e.g. Oxidation-Reduction Reactions), lookup weights, and trigger intelligent Gemini feedback rubric synthesis.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs font-semibold text-indigo-600 group-hover:translate-x-1 transition duration-150 pt-3 border-t border-slate-100 font-sans">
                      <span>Grade Active Assignments</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>

                  {/* 3. Class Assessments */}
                  <div 
                    onClick={() => setActiveTab('class-assessments')}
                    className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-emerald-500 hover:shadow-lg transition duration-200 cursor-pointer flex flex-col justify-between group h-[260px] relative overflow-hidden"
                  >
                    <div className="space-y-4">
                      <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition duration-200 shadow-xs">
                        <CheckSquare className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-800 font-sans group-hover:text-emerald-600 transition">
                          Class Assessments Feedback
                        </h4>
                        <p className="text-xs text-slate-500 leading-relaxed mt-2 font-medium">
                          Analyze dialogue transcripts in context. Select student statements, evaluate performance grades on 1-5 scales, and register context-anchored grades.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs font-semibold text-emerald-600 group-hover:translate-x-1 transition duration-150 pt-3 border-t border-slate-100 font-sans">
                      <span>Enter Assessment Studio</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>

                  {/* 4. Outcomes Index */}
                  <div 
                    onClick={() => setActiveTab('outcome-index')}
                    className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-blue-500 hover:shadow-lg transition duration-200 cursor-pointer flex flex-col justify-between group h-[260px] relative overflow-hidden"
                  >
                    <div className="space-y-4">
                      <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition duration-200 shadow-xs">
                        <Award className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-800 font-sans group-hover:text-blue-600 transition">
                          Foundational Concept Outcomes
                        </h4>
                        <p className="text-xs text-slate-500 leading-relaxed mt-2 font-medium">
                          Browse all 23 active Cornerstone HCs (e.g. #analogies, #constraints, #dataviz), check category partitions, and view descriptions and score weights.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs font-semibold text-blue-600 group-hover:translate-x-1 transition duration-150 pt-3 border-t border-slate-100 font-sans">
                      <span>Lookup HCs Database</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>

                  {/* 5. Course builder */}
                  <div 
                    onClick={() => setActiveTab('course-builder')}
                    className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-slate-800 hover:shadow-lg transition duration-200 cursor-pointer flex flex-col justify-between group h-[260px] relative overflow-hidden"
                  >
                    <div className="space-y-4">
                      <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 flex items-center justify-center group-hover:bg-slate-800 group-hover:text-white transition duration-200 shadow-xs">
                        <Layout className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-800 font-sans group-hover:text-indigo-600 transition">
                          Course Builder
                        </h4>
                        <p className="text-xs text-slate-500 leading-relaxed mt-2 font-medium">
                          Map curriculum outlines, assign resource limits, modify lesson timelines, configure breakout steps, and synchronize syllabus focus questions.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-700 group-hover:translate-x-1 transition duration-150 pt-3 border-t border-slate-100 font-sans">
                      <span>Open Course Outline Builder</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>

                  {/* 6. Degree Planner */}
                  <div 
                    onClick={() => setActiveTab('grading-advisees')}
                    className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-amber-500 hover:shadow-lg transition duration-200 cursor-pointer flex flex-col justify-between group h-[260px] relative overflow-hidden"
                  >
                    <div className="space-y-4">
                      <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition duration-200 shadow-xs">
                        <GraduationCap className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-800 font-sans group-hover:text-amber-600 transition">
                          Advisees Degree Planner
                        </h4>
                        <p className="text-xs text-slate-500 leading-relaxed mt-2 font-medium">
                          Analyze complete student academic transcripts, add planned courses over Years 1-4, inspect graduation credits, and execute system degree audits.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs font-semibold text-amber-600 group-hover:translate-x-1 transition duration-150 pt-3 border-t border-slate-100 font-sans">
                      <span>Analyze Degree Advisees</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>

                </div>
              </div>
            </div>
          )}

          {/* 2. SYLLABUS COURSE BUILDER PORT */}
          {activeTab === 'course-builder' && (
            <div className="h-full flex flex-col">
              <CourseBuilder onBackToDashboard={() => setActiveTab('dashboard')} />
            </div>
          )}

          {/* 3. CLASSROOM ASSESSMENT ANNOTATOR PORT */}
          {activeTab === 'class-assessments' && (
            <div className="h-full flex flex-col">
              <AssessmentAnnotator
                selectedStudent={assessmentPreload.student}
                selectedText={assessmentPreload.text}
                selectedHC={assessmentPreload.hc}
                onClearSelection={handleClearPreload}
                onBackToDashboard={() => setActiveTab('dashboard')}
              />
            </div>
          )}

          {/* 4. OUTCOMES INDEX PORT */}
          {activeTab === 'outcome-index' && (
            <div className="h-full flex flex-col">
              <OutcomeIndex />
            </div>
          )}

          {/* 5. SEMINAR CLASSROOM ARENA PORT */}
          {activeTab === 'seminar-classroom' && (
            <div className="h-full flex flex-col">
              <SeminarClassroom 
                onHCSelectForAssessment={handleSelectHCForAssessment}
                onBackToDashboard={() => setActiveTab('dashboard')}
              />
            </div>
          )}

          {/* 6. USERS DIRECTORY PORT */}
          {activeTab === 'users-directory' && (
            <div className="h-full flex flex-col">
              <UsersDirectory />
            </div>
          )}

          {/* 7. GRADING SECTIONS PORT */}
          {activeTab === 'grading-sections' && (
            <div className="h-full flex flex-col">
              <GradingSections onBackToDashboard={() => setActiveTab('dashboard')} />
            </div>
          )}

          {/* 8. GRADING ADVISEES PORT */}
          {activeTab === 'grading-advisees' && (
            <div className="h-full flex flex-col">
              <DegreePlanner onBackToDashboard={() => setActiveTab('dashboard')} />
            </div>
          )}

          {/* 9. GRADING ABSENCES PORT */}
          {activeTab === 'grading-absences' && (
            <div className="h-full flex flex-col">
              <AbsencesTracker />
            </div>
          )}

          {/* 10. REVERSE ENGINEERING COGNITIVE CONSOLE PORT */}
          {activeTab === 'reverse-engineering' && (
            <div className="h-full flex flex-col">
              <ReverseEngineeringSkill onBackToDashboard={() => setActiveTab('dashboard')} />
            </div>
          )}

          {/* 11. DYNAMIC COURSES CATALOG INDEPENDENT MODULE */}
          {activeTab === 'courses' && (
            <div className="h-full flex flex-col">
              <CoursesModule 
                onEnterLiveClassroom={() => setActiveTab('seminar-classroom')} 
                userRole={userRole}
                userCluster={userCluster}
                setUserCluster={setUserCluster}
              />
            </div>
          )}

          {/* 12. DYNAMIC GEMINI AI TUTOR MODULE */}
          {activeTab === 'ai-tutor' && (
            <div className="h-full flex flex-col">
              <AiTutor role={userRole} cluster={userCluster} />
            </div>
          )}

          {/* 12b. RETRO AUTOTUTOR COOPERATIVE DIALOGUE MODULE */}
          {activeTab === 'auto-tutor' && (
            <div className="h-full flex flex-col">
              <AutoTutor />
            </div>
          )}

          {/* 13. DYNAMIC UNIFIED ALL EVENTS CALENDAR */}
          {activeTab === 'all-events' && (
            <div className="h-full flex flex-col">
              <AllEvents onEnterLiveClassroom={() => setActiveTab('seminar-classroom')} />
            </div>
          )}

          {/* 14. CLONED LEARNER PORTFOLIO FROM USER IMAGE */}
          {activeTab === 'learner-portfolio' && (
            <DashboardHome
              role={userRole}
              userInfo={getPersonaByRole(userRole, user)}
              onNavigate={(tab) => setActiveTab(tab)}
              allowedTabs={ALLOWED_TABS_BY_ROLE[userRole]}
              userCluster={userCluster}
              setUserCluster={setUserCluster}
            />
          )}

          {/* 15. ASSIGNMENTS & CRITIQUE PORT */}
          {activeTab === 'assignments' && (
            <div className="h-full flex flex-col min-h-0 overflow-hidden">
              <AssignmentsModule 
                role={userRole} 
                userInfo={getPersonaByRole(userRole, user)} 
              />
            </div>
          )}

          {/* 16. COOPERATIVE ACADEMIC FORUM & FEED */}
          {activeTab === 'forum-feed' && (
            <div className="h-full flex flex-col min-h-0 overflow-hidden">
              <ForumFeedModule 
                role={userRole} 
                userInfo={getPersonaByRole(userRole, user)} 
              />
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
