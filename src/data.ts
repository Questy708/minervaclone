import { Student, LessonActivity, StudentFeedback, HCCecept, CoursePlanYear, GradRequirement, ReverseEngineeringClue } from './types';

export const INITIAL_STUDENTS: Student[] = [
  { id: '1', name: 'Prof Genone', isSpeaking: false, active: true, avatarColor: '#3F51B5' },
  { id: '2', name: 'Marika', isSpeaking: false, active: true, avatarColor: '#E91E63' },
  { id: '3', name: 'Paul', isSpeaking: false, active: true, avatarColor: '#9C27B0' },
  { id: '4', name: 'Matthew', isSpeaking: false, active: true, avatarColor: '#673AB7' },
  { id: '5', name: 'David', isSpeaking: true, active: true, avatarColor: '#4CAF50' }, // David is active first speaker in screenshot 1
  { id: '6', name: 'Grace', isSpeaking: false, active: true, avatarColor: '#FF9800' },
  { id: '7', name: 'Roger', isSpeaking: false, active: true, avatarColor: '#00BCD4' },
  { id: '8', name: 'Sharon', isSpeaking: false, active: true, avatarColor: '#009688' },
  { id: '9', name: 'Nancy', isSpeaking: false, active: true, avatarColor: '#795548' },
  { id: '10', name: 'Marilyn', isSpeaking: false, active: true, avatarColor: '#FF5722' },
  { id: '11', name: 'Lauren', isSpeaking: false, active: true, avatarColor: '#607D8B' },
];

export const CORNERSTONE_HCS: HCCecept[] = [
  { code: '#analogies', count: 1, weight: 4, description: 'Identify and evaluate standard or creative analogies', category: 'Formal' },
  { code: '#breakitdown', count: 1, weight: 9, description: 'Subdivide problems into constituent subproblems', category: 'Formal' },
  { code: '#constraints', count: 1, weight: 8, description: 'Identify active, inactive, or latent constraints on solutions', category: 'Formal' },
  { code: '#correlation', count: 1, weight: 1, description: 'Distinguish correlation from causation', category: 'Empirical' },
  { code: '#creativeheuristics', count: 1, weight: 3, description: 'Apply non-conscious or cognitive side-channels for discovery', category: 'Formal' },
  { code: '#critique', count: 1, weight: 1, description: 'Evaluate arguments based on robustness & logical form', category: 'Social' },
  { code: '#dataviz', count: 3, weight: 8, description: 'Present quantitative data beautifully & clearly', category: 'Empirical' },
  { code: '#decisionheuristics', count: 1, weight: 3, description: 'Map out alternatives and select a decision path', category: 'Empirical' },
  { code: '#deduction', count: 2, weight: 2, description: 'Construct or analyze deductive syllogisms', category: 'Formal' },
  { code: '#descriptivestats', count: 3, weight: 3, description: 'Summarize distribution characteristics and features', category: 'Empirical' },
  { code: '#epistemology', count: 1, weight: 4, description: 'Define the nature, limits, and justification of knowledge', category: 'Multimodal' },
  { code: '#gapanalysis', count: 1, weight: 8, description: 'Contrast desired outcomes with existing states to design plans', category: 'Social' },
  { code: '#hypothesisdriven', count: 2, weight: 11, description: 'Formulate falsifiable hypotheses to test claims', category: 'Empirical' },
  { code: '#induction', count: 3, weight: 0, description: 'Assess strengths and bounds of inductive patterns', category: 'Empirical' },
  { code: '#modeling', count: 3, weight: 0, description: 'Simulate physical, biological, or social systems to study outcomes', category: 'Formal' },
  { code: '#observation', count: 3, weight: 11, description: 'Collect unbiased observations while self-auditing bias', category: 'Empirical' },
  { code: '#plausibility', count: 2, weight: 4, description: 'Quantify initial prior odds of statements before empirical tests', category: 'Formal' },
  { code: '#rightproblem', count: 1, weight: 8, description: 'Reframe superficial complaints to spot the underlying malfunction', category: 'Social' },
  { code: '#scienceoflearning', count: 1, weight: 1, description: 'Apply findings on cognitive encoding and spacing to study', category: 'Multimodal' },
  { code: '#simulation', count: 3, weight: 0, description: 'Iterate scenarios to predict state transitions', category: 'Formal' },
  { code: '#testability', count: 2, weight: 7, description: 'Design repeatable, falsifiable experimental setups', category: 'Empirical' },
  { code: '#theorytesting', count: 1, weight: 3, description: 'Contrast competitive theories under comprehensive datasets', category: 'Multimodal' },
  { code: '#variables', count: 4, weight: 0, description: 'Identify independent, dependent, and confounding variables', category: 'Empirical' },
];

export const INITIAL_TIMELINE: LessonActivity[] = [
  {
    id: 'act0',
    title: 'Poll D',
    subtitle: '5-up with poll',
    duration: '05:00',
    type: 'poll',
    active: false,
  },
  {
    id: 'act1',
    title: 'Activity #1: Migration causal loop diagrams',
    subtitle: '15:00 - 40:00',
    duration: '25:00',
    type: 'introduction',
    active: false,
    resources: ['Causal Loop Map', 'Migration Dataset'],
  },
  {
    id: 'act2',
    title: 'Introduction',
    subtitle: '2-up with resource',
    duration: '10:00',
    type: 'introduction',
    active: false,
    resources: ['Course Description Slides'],
  },
  {
    id: 'act3',
    title: 'Homework Share-out',
    subtitle: '3-up with resource',
    duration: '15:00',
    type: 'homework',
    active: true, // Currently selected in live-view
    resources: ['Protest Strategy Document', 'Country Metrics Spreadsheet'],
  },
  {
    id: 'act4',
    title: 'Active Summary',
    subtitle: '3-up with resource',
    duration: '12:00',
    type: 'summary',
    active: false,
    resources: ['Summary Canvas'],
  },
  {
    id: 'act5',
    title: 'Activity #2: Effective engagement with complex social systems',
    subtitle: '40:00 - 1:10:00',
    duration: '30:00',
    type: 'proposal',
    active: false,
    resources: ['Systems Mapping Template'],
  },
  {
    id: 'act6',
    title: 'Introduction/Pre-breakout inst...',
    subtitle: '2-up with resource',
    duration: '05:00',
    type: 'introduction',
    active: false,
  },
  {
    id: 'act7',
    title: 'Breakout Groups',
    subtitle: 'Start breakout',
    duration: '15:00',
    type: 'breakout',
    active: false,
  },
  {
    id: 'act8',
    title: 'Proposal Critique: Feature Grou...',
    subtitle: 'Feature Breakout Notes',
    duration: '10:00',
    type: 'proposal',
    active: false,
  },
];

export const INITIAL_FEEDBACK: StudentFeedback = {
  happyGreen: 58,
  neutralYellow: 0,
  heartOrange: 14,
  frownRed: 1,
  excitedPurple: 28,
  worriedBlue: 0,
  handWhite: 3,
};

export const INITIAL_TRANSCRIPT: GradRequirement[] = [
  { id: 'req1', label: 'AH50 / Multimodal Communications', status: 'completed', description: 'Passed with high distinction in core communication modes.' },
  { id: 'req2', label: 'AH51 / Multimodal Communications', status: 'completed', description: 'Passed. Applied spacing heuristics successfully.' },
  { id: 'req3', label: 'CP191 / Capstone Seminar', status: 'completed', description: 'Capstone thesis part 1 completed.' },
  { id: 'req4', label: 'CP192 / Capstone Seminar', status: 'completed', description: 'Capstone defense approved by committee.' },
  { id: 'req5', label: 'CP193 / Capstone Independent Study I', status: 'pending', description: 'Course not yet taken or registered. (Add Course option active)' },
  { id: 'req6', label: 'CP194 / Capstone Independent Study II', status: 'pending', description: 'Course not yet taken or registered. (Add Course option active)' },
  { id: 'req7', label: 'CP195 / Manifest', status: 'warning', description: 'Requires approval of capstone proposal framework from Academic Board.' },
  { id: 'req8', label: 'CS50 / Formal Analyses', status: 'completed', description: 'Successfully completed with emphasis on #analogies and #breakitdown.' },
  { id: 'req9', label: 'CS51 / Formal Analyses', status: 'completed', description: 'Passed. Focus on #modeling and heuristic design.' },
  { id: 'req10', label: 'NS50 / Empirical Analyses', status: 'completed', description: 'Completed. Anchored under NS series.' },
  { id: 'req11', label: 'NS51 / Empirical Analyses', status: 'completed', description: 'Passed with core understanding of #testability.' },
  { id: 'req12', label: 'SS50 / Complex Systems', status: 'completed', description: 'Passed. Active system dynamic studies.' },
  { id: 'req13', label: 'SS51 / Complex Systems', status: 'completed', description: 'Passed. Project on social movements and political outcomes.' },
];

export const INITIAL_COURSE_YEARS: CoursePlanYear[] = [
  {
    year: 1,
    termPlan: {
      fall: ['AH50', 'CS50', 'NS50', 'SS50'],
      spring: ['AH51', 'CS51', 'NS51', 'SS51'],
    },
  },
  {
    year: 2,
    termPlan: {
      fall: ['AH112', 'SS111', 'SS112'],
      spring: ['AH110', 'AH111', 'SS110'],
    },
  },
  {
    year: 3,
    termPlan: {
      fall: ['CP191', 'SS156', 'SS164', 'SS166'],
      spring: ['AH146', 'AH156', 'CP192', 'SS146'],
    },
  },
  {
    year: 4,
    termPlan: {
      fall: [],
      spring: [],
    },
  },
];

export const PRESET_CLUES: ReverseEngineeringClue[] = [
  {
    id: 'clue1',
    title: 'Clue 1: Active Learning Seminar Forum',
    description: 'The real-time virtual classroom showing shared documents, a split video interface, a timeline of lessons, and emotional feedback trackers.',
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600',
    clueText: '[Image Clue of Seminar Grid of students Prof Genone, Matthew, and David. Shared Google-doc on Protest Propositions, multiclass bar chart. Right sidebar emoji tracker (58 green smiles, 14 heart orange) and lesson timeline (Homework Share-out active).]'
  },
  {
    id: 'clue2',
    title: 'Clue 2: Course Builder Catalog',
    description: 'The academic planning platform showcasing lesson structure (NS152/NS154/NS166), with thumbs up (likes) and student discourse counts.',
    imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=600',
    clueText: '[Image Clue of Curriculum Catalog showing NS152, Syllabus, and Lessons 1.1, 1.2, 2.1 Seeing Distant Matter with chat notification bubbles (1, 37, blue colors) and lesson plans with interactive comments.]'
  },
  {
    id: 'clue3',
    title: 'Clue 3: Lesson & HC Tagging Studio',
    description: 'Detailed view in Course Builder highlighting syllabus objectives paired with Habits of Mind & Foundational Concepts (HCs).',
    imageUrl: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&q=80&w=600',
    clueText: '[Course Builder metadata editor for NS50 Empirical Analyses showing course description with text tools, Prerequisites section, Resource Budget ($50 Budget, Available $50), right panel list of 23 active standard HCs with weights and counts (e.g. #analogies, #breakitdown, #constraints, #dataviz).]'
  },
  {
    id: 'clue4',
    title: 'Clue 4: Degree Planner Dashboard',
    description: 'A student-advisor roadmap containing automated checklist criteria, academic transcripts, and transfer course mappings.',
    imageUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=600',
    clueText: '[Degree Planner layout for student Ari Bader-Natal, listing Bachelors of Science majoring in Social Sciences, Academic Transcript selector, Year 1 to 4 course plans with status checkpoints, and dynamic checklists indicating 120 credits total, full-time status, double concentration paths, and credit constraints.]'
  }
];

export const SAMPLE_PROTEST_DOC = `In your breakout group, devise arguments in favor of your group's position on the debate, based on what you learned from the previous activity. Utilize #strategize to identify strengths and weakness in your position, and identify possible areas of common ground. Be prepared to present your arguments, propose counterarguments to the opposing team's arguments, and to respond to their counterarguments to your arguments.

Notes:
Proposition: Social protests are an effective way to bring about political change.

Strengths:
1. "Our findings show that major nonviolent campaigns have achieved success 53 percent of the time, compared with 26 percent for violent resistance campaigns" (data: major events from 1900 and 2006). (reference and below)
2. A campaign's commitment to nonviolent methods enhances its domestic and international legitimacy and encourages more broad-based participation in the resistance, which translates into increased pressure being brought to bear on the target.
3. Social protests will gather dissident people and make it as a mass protest. There will be no successful protest without the united spirit of making changes. Social protests unite people.
4. Whereas governments easily justify violent counterattacks against armed insurgents, regime violence against nonviolent movements is more likely to backfire against the regime.
5. Social protests will gather attention of the international countries and organizations that will help the protests to make political change. International forces could use #carrotandstick strategy.

Strategy Values Breakdown (Strategies 1-8):
- Strategy 1 (Publicity): Product A: 40, Product B: 80, Product C: 120, Product D: 160
- Strategy 2 (Nonviolence): Product A: 140, Product B: 180, Product C: 90, Product D: 210
- Strategy 3 (Mass Appeal): Product A: 110, Product B: 150, Product C: 100, Product D: 240
- Strategy 4 (Legitimacy): Product A: 70, Product B: 130, Product C: 160, Product D: 190
- Strategy 5 (External Power): Product A: 195, Product B: 240, Product C: 50, Product D: 130
- Strategy 6 (Backfire Cost): Product A: 310, Product B: 120, Product C: 220, Product D: 180
- Strategy 7 (Global Attention): Product A: 270, Product B: 180, Product C: 240, Product D: 290
- Strategy 8 (Pressure point): Product A: 120, Product B: 340, Product C: 160, Product D: 140`;
