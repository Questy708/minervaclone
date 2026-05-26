import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  Plus, 
  GraduationCap, 
  Sparkles, 
  BookOpen, 
  RefreshCw, 
  ArrowLeft, 
  ChevronDown, 
  X, 
  FileText, 
  Layers, 
  Award, 
  Check, 
  TrendingUp, 
  HelpCircle,
  Clock,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DegreePlannerProps {
  onBackToDashboard?: () => void;
}

// Student presets aligning with the Artemis multifaceted curriculum cohorts
interface StudentPreset {
  id: string;
  name: string;
  email: string;
  enrolled: string;
  graduating: string;
  degree: string;
  major: string;
  concentration: string;
  minor: string;
  gpa: number;
  initialCredits: number;
  avatarInitials: string;
  avatarBg: string;
  avatarUrl?: string;
  catalogPDFUrl: string;
  coursePlan: {
    year: number;
    fallTitle: string;
    springTitle: string;
    termPlan: {
      fall: string[];
      spring: string[];
    };
  }[];
  requirements: {
    id: string;
    courseCode: string;
    courseTitle: string;
    status: 'completed' | 'info' | 'warning' | 'pending';
    description: string;
    targetYear: number;
    targetTerm: 'fall' | 'spring';
  }[];
}

const STUDENT_PRESETS: Record<string, StudentPreset> = {
  university: {
    id: 'university',
    name: 'Ari Bader-Natal',
    email: 'ari@artemis.kgi.edu',
    enrolled: 'May 2015',
    graduating: 'May 2019',
    degree: 'Bachelors of Science',
    major: 'Social Sciences',
    concentration: 'Economics and Society & Politics, Government, and Society',
    minor: 'Arts & Humanities - Arts and Literature',
    gpa: 3.85,
    initialCredits: 112,
    avatarInitials: 'AB',
    avatarBg: 'bg-gradient-to-tr from-slate-600 to-indigo-700',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120&h=120',
    catalogPDFUrl: 'University_Cornerstone_Catalog_2026.pdf',
    coursePlan: [
      {
        year: 1,
        fallTitle: 'FALL 2015',
        springTitle: 'SPRING 2016',
        termPlan: {
          fall: ['AH50', 'CS50', 'NS50', 'SS50'],
          spring: ['AH51', 'CS51', 'NS51', 'SS51']
        }
      },
      {
        year: 2,
        fallTitle: 'FALL 2016',
        springTitle: 'SPRING 2017',
        termPlan: {
          fall: ['AH112', 'SS111', 'SS112'],
          spring: ['AH110', 'AH111', 'SS110']
        }
      },
      {
        year: 3,
        fallTitle: 'FALL 2017',
        springTitle: 'SPRING 2018',
        termPlan: {
          fall: ['CP191', 'SS156', 'SS164', 'SS166'],
          spring: ['AH146', 'AH156', 'CP192', 'SS146']
        }
      },
      {
        year: 4,
        fallTitle: 'FALL 2018',
        springTitle: 'SPRING 2019',
        termPlan: {
          fall: [],
          spring: []
        }
      }
    ],
    requirements: [
      { id: 'u1', courseCode: 'AH50', courseTitle: 'Multimodal Communications', status: 'completed', description: 'Rhetoric & writing benchmarks met.', targetYear: 1, targetTerm: 'fall' },
      { id: 'u2', courseCode: 'AH51', courseTitle: 'Multimodal Communications', status: 'completed', description: 'Advanced spacing heuristics and structural messaging passed.', targetYear: 1, targetTerm: 'spring' },
      { id: 'u3', courseCode: 'CP191', courseTitle: 'Capstone Seminar', status: 'completed', description: 'Capstone thesis exploration part I approved.', targetYear: 3, targetTerm: 'fall' },
      { id: 'u4', courseCode: 'CP192', courseTitle: 'Capstone Seminar', status: 'completed', description: 'Capstone literature thesis synthesis defense passed.', targetYear: 3, targetTerm: 'spring' },
      { id: 'u5', courseCode: 'CP193', courseTitle: 'Capstone Independent Study I', status: 'pending', description: 'Apply course matching to program coordinates above.', targetYear: 4, targetTerm: 'fall' },
      { id: 'u6', courseCode: 'CP194', courseTitle: 'Capstone Independent Study II', status: 'pending', description: 'Requires adding equivalent course to final year.', targetYear: 4, targetTerm: 'spring' },
      { id: 'u7', courseCode: 'CP195', courseTitle: 'Manifest', status: 'warning', description: 'Draft syllabus mapping incomplete. Complete 120 credits to qualify.', targetYear: 4, targetTerm: 'fall' },
      { id: 'u8', courseCode: 'CS50', courseTitle: 'Formal Analyses', status: 'completed', description: 'Algorithmic proofing and systems complexity passed.', targetYear: 1, targetTerm: 'fall' },
      { id: 'u9', courseCode: 'CS51', courseTitle: 'Formal Analyses', status: 'completed', description: 'Heuristic diagnostic modeling structures met.', targetYear: 1, targetTerm: 'spring' },
      { id: 'u10', courseCode: 'NS50', courseTitle: 'Empirical Analyses', status: 'completed', description: 'Natural phenomena research methodologies evaluated.', targetYear: 1, targetTerm: 'fall' },
      { id: 'u11', courseCode: 'NS51', courseTitle: 'Empirical Analyses', status: 'completed', description: 'Core understanding of scientific testability established.', targetYear: 1, targetTerm: 'spring' },
      { id: 'u12', courseCode: 'SS50', courseTitle: 'Complex Systems', status: 'completed', description: 'Systems feedback loop maps drafted and certified.', targetYear: 1, targetTerm: 'fall' },
      { id: 'u13', courseCode: 'SS51', courseTitle: 'Complex Systems', status: 'completed', description: 'Socio-economic tipping point analysis project verified.', targetYear: 1, targetTerm: 'spring' }
    ]
  },
  k12: {
    id: 'k12',
    name: 'Leo Alvarez',
    email: 'leo@artemis.k12.edu',
    enrolled: 'Sept 2024',
    graduating: 'June 2028',
    degree: 'Bachelors of Play & Inquiry',
    major: 'Ecological Game Systems',
    concentration: 'Biodiversity Foundations & Playable Logic Simulations',
    minor: 'Narrative Arts & Wildlife Cartography',
    gpa: 3.92,
    initialCredits: 104,
    avatarInitials: 'LA',
    avatarBg: 'bg-gradient-to-tr from-emerald-600 to-teal-500',
    catalogPDFUrl: 'K12_Artemis_Adventurer_Catalog_2026.pdf',
    coursePlan: [
      {
        year: 1,
        fallTitle: 'FALL 2024',
        springTitle: 'SPRING 2025',
        termPlan: {
          fall: ['BIO10', 'GAME10', 'ECO10'],
          spring: ['BIO11', 'GAME11', 'ECO11']
        }
      },
      {
        year: 2,
        fallTitle: 'FALL 2025',
        springTitle: 'SPRING 2026',
        termPlan: {
          fall: ['BIO122', 'NARR101'],
          spring: ['GAME210', 'ECO205']
        }
      },
      {
        year: 3,
        fallTitle: 'FALL 2026',
        springTitle: 'SPRING 2027',
        termPlan: {
          fall: ['THESIS01', 'GAME301'],
          spring: ['THESIS02', 'MAPS104']
        }
      },
      {
        year: 4,
        fallTitle: 'FALL 2027',
        springTitle: 'SPRING 2028',
        termPlan: {
          fall: [],
          spring: []
        }
      }
    ],
    requirements: [
      { id: 'k1', courseCode: 'BIO10', courseTitle: 'Ecology Discoveries', status: 'completed', description: 'Flora cataloging field hours resolved.', targetYear: 1, targetTerm: 'fall' },
      { id: 'k2', courseCode: 'BIO11', courseTitle: 'Aquatic Life Patterns', status: 'completed', description: 'Completed local streams analysis.', targetYear: 1, targetTerm: 'spring' },
      { id: 'k3', courseCode: 'THESIS01', courseTitle: 'Invention Blueprint', status: 'completed', description: 'Physical board game mechanics prototype approved.', targetYear: 3, targetTerm: 'fall' },
      { id: 'k4', courseCode: 'THESIS02', courseTitle: 'Class Demonstration', status: 'completed', description: 'Cooperative board game playtest complete.', targetYear: 3, targetTerm: 'spring' },
      { id: 'k5', courseCode: 'THESIS03', courseTitle: 'Narrative Rulebook writing', status: 'pending', description: 'Need to schedule final rules manual composition.', targetYear: 4, targetTerm: 'fall' },
      { id: 'k6', courseCode: 'THESIS04', courseTitle: 'Portfolio Publication', status: 'pending', description: 'Requires final public web upload setup.', targetYear: 4, targetTerm: 'spring' },
      { id: 'k7', courseCode: 'GAME10', courseTitle: 'Intro to Board Mechanics', status: 'completed', description: 'Dice rolling and strategic card logic projects passed.', targetYear: 1, targetTerm: 'fall' },
      { id: 'k8', courseCode: 'GAME11', courseTitle: 'Strategic Game Balance', status: 'completed', description: 'Mathematically balanced victory constraints modeled.', targetYear: 1, targetTerm: 'spring' },
      { id: 'k9', courseCode: 'ECO10', courseTitle: 'Ecosystem Dynamics', status: 'completed', description: 'Studied trophic cascades in grey wolves.', targetYear: 1, targetTerm: 'fall' },
      { id: 'k10', courseCode: 'ECO11', courseTitle: 'Climate Adaptation Models', status: 'completed', description: 'Thermal simulation model projects finalized.', targetYear: 1, targetTerm: 'spring' }
    ]
  },
  seniors: {
    id: 'seniors',
    name: 'Eleanor Sterling',
    email: 'eleanor@sterling-oasis.com',
    enrolled: 'Jan 2025',
    graduating: 'Dec 2028',
    degree: 'Bachelors of Lifelong Philosophy',
    major: 'Classical Symphony & Memory Synthesis',
    concentration: 'Orchestral Harmony Motifs & Oral History Transcription',
    minor: 'Creative Lifespan Memoirs',
    gpa: 4.00,
    initialCredits: 108,
    avatarInitials: 'ES',
    avatarBg: 'bg-gradient-to-tr from-pink-600 to-amber-500',
    catalogPDFUrl: 'Seniors_Oasis_Memoir_Catalog_2026.pdf',
    coursePlan: [
      {
        year: 1,
        fallTitle: 'WINTER 2025',
        springTitle: 'SPRING 2025',
        termPlan: {
          fall: ['MUS10', 'MEMO10', 'HIST10'],
          spring: ['MUS11', 'MEMO11', 'HIST11']
        }
      },
      {
        year: 2,
        fallTitle: 'FALL 2025',
        springTitle: 'SPRING 2026',
        termPlan: {
          fall: ['SYM145', 'GEN-T10'],
          spring: ['SYM202', 'DIG-CO1']
        }
      },
      {
        year: 3,
        fallTitle: 'FALL 2026',
        springTitle: 'SPRING 2027',
        termPlan: {
          fall: ['MAJ-P10', 'NARR-2'],
          spring: ['MAJ-P20', 'RECAP-1']
        }
      },
      {
        year: 4,
        fallTitle: 'FALL 2027',
        springTitle: 'SPRING 2028',
        termPlan: {
          fall: [],
          spring: []
        }
      }
    ],
    requirements: [
      { id: 's1', courseCode: 'MUS10', courseTitle: 'Symphony Form Foundations', status: 'completed', description: 'Auditory segmentation and sonata blueprints passed.', targetYear: 1, targetTerm: 'fall' },
      { id: 's2', courseCode: 'MUS11', courseTitle: 'Classical Orchestration', status: 'completed', description: 'Woodwind and brass balancing tests finalized.', targetYear: 1, targetTerm: 'spring' },
      { id: 's3', courseCode: 'MAJ-P10', courseTitle: 'Recital Transcription I', status: 'completed', description: 'First 3 sections of memory audio archived.', targetYear: 3, targetTerm: 'fall' },
      { id: 's4', courseCode: 'MAJ-P20', courseTitle: 'Recital Transcription II', status: 'completed', description: 'Completed dissertation of personal symphonic memoirs.', targetYear: 3, targetTerm: 'spring' },
      { id: 's5', courseCode: 'MAJ-P30', courseTitle: 'Oasis Concert Organization', status: 'pending', description: 'Arrange classical community concert schedule.', targetYear: 4, targetTerm: 'fall' },
      { id: 's6', courseCode: 'MAJ-P40', courseTitle: 'Memoir Compilation Archiving', status: 'pending', description: 'Submit written oral histories to Artemis Legacy Vault.', targetYear: 4, targetTerm: 'spring' },
      { id: 's7', courseCode: 'SYM145', courseTitle: 'Romantic Era Motifs', status: 'completed', description: 'Detailed analysis of Rachmaninoff’s Second Symphony.', targetYear: 2, targetTerm: 'fall' },
      { id: 's8', courseCode: 'GEN-T10', courseTitle: 'Genealogy of Sound', status: 'completed', description: 'Traced family stories via folk tunes.', targetYear: 2, targetTerm: 'fall' },
      { id: 's9', courseCode: 'MEMO10', courseTitle: 'Introduction to Memoirs', status: 'completed', description: 'Archived initial adolescent memory journal drafts.', targetYear: 1, targetTerm: 'fall' },
      { id: 's10', courseCode: 'MEMO11', courseTitle: 'Narrative Structures', status: 'completed', description: 'Creative non-fiction voice criteria passed with distinction.', targetYear: 1, targetTerm: 'spring' }
    ]
  }
};

// Database of catalog course details when a user clicks a course
const GLOBAL_COURSE_CATALOG: Record<string, { title: string; desc: string; hcs: string[]; level: string; credits: number }> = {
  // University scale
  'AH50': { title: 'Multimodal Communications', desc: 'Rhetorical analysis focusing on written, oral, visual, and electronic parameters. Students construct persuasive essays and high-impact design templates.', hcs: ['#rhetoric', '#design-principles'], level: 'Cornerstone Core', credits: 4 },
  'AH51': { title: 'Multimodal Communications II', desc: 'Continuation of AH50 with advanced analysis of typography spacing, web layout grids, structural messaging, and public presenting skills.', hcs: ['#audience-adaptation', '#spacing-heuristics'], level: 'Cornerstone Core', credits: 4 },
  'AH110': { title: 'Human Philosophy & Ethics', desc: 'Philosophical study of fundamental ethical theories and their application to complex modern institutional structures.', hcs: ['#ethical-framing', '#utilitarianism'], level: 'Intermediate', credits: 4 },
  'AH111': { title: 'Historical Historiography', desc: 'Analyzing the narrative construct of historiography, exploring how cultural lenses warp historical records.', hcs: ['#bias-detection', '#triangulation'], level: 'Intermediate', credits: 4 },
  'AH112': { title: 'Visual Art Narratives', desc: 'Deciphering symbolic communication in Renaissance and modern painting, sculpting, and architecture.', hcs: ['#abstraction', '#aesthetic-pairing'], level: 'Intermediate', credits: 4 },
  'AH146': { title: 'Contemporary Novel Poetics', desc: 'Critical study of modern experimental novels exploring temporal shifts, perspective shifts, and metafictional elements.', hcs: ['#deconstruction', '#hermeneutics'], level: 'Advanced Seminar', credits: 4 },
  'AH156': { title: 'Creative Writing Workshop', desc: 'Constructive peer review and writing exercises focusing on voice development, imagery synthesis, and plot arcs.', hcs: ['#metaphorical-leaps', '#creative-critique'], level: 'Advanced Seminar', credits: 4 },
  'CS50': { title: 'Formal Analyses I', desc: 'Introduction to logic, statistics, set theory, algorithm structures, and diagnostic analytics.', hcs: ['#breakitdown', '#modeling', '#probability'], level: 'Cornerstone Core', credits: 4 },
  'CS51': { title: 'Formal Analyses II', desc: 'Deep dive into computer programming fundamentals, complex probability distributions, and deductive math structures.', hcs: ['#induction', '#regression-error', '#testability'], level: 'Cornerstone Core', credits: 4 },
  'NS50': { title: 'Empirical Analyses I', desc: 'Introduction to scientific methodology, physical system observations, chemistry formulas, and natural sciences core.', hcs: ['#hypothesis-generation', '#empirical-falsified'], level: 'Cornerstone Core', credits: 4 },
  'NS51': { title: 'Empirical Analyses II', desc: 'Experimental testing, research modeling, biomechanical tracking, and statistical significance validation.', hcs: ['#experimental-design', '#control-grouping'], level: 'Cornerstone Core', credits: 4 },
  'SS50': { title: 'Complex Systems I', desc: 'Exploring dynamics of multi-agent networks, economic markets, ecological balances, and chaotic tipping systems.', hcs: ['#system-dynamics', '#micro-macro', '#causal-loops'], level: 'Cornerstone Core', credits: 4 },
  'SS51': { title: 'Complex Systems II', desc: 'Societal organizations, legislative structures, social contagion waves, game theory, and multi-agent systems coordination.', hcs: ['#game-theory', '#leverage-points', '#equilibrium'], level: 'Cornerstone Core', credits: 4 },
  'SS110': { title: 'Global Economics & Trade', desc: 'Comparative macroeconomic analyses, microeconomic constraints, tariff and central banking mechanisms.', hcs: ['#opportunity-cost', '#supply-demand'], level: 'Intermediate', credits: 4 },
  'SS111': { title: 'Political Movements', desc: 'Historical and contemporary case studies of collective action, revolutions, and civic platform organization.', hcs: ['#collective-action', '#mobilization'], level: 'Intermediate', credits: 4 },
  'SS112': { title: 'Urban Anthropology', desc: 'Socio-spatial analysis of modern cities, gentrification vectors, and infrastructure planning frameworks.', hcs: ['#spacecode', '#ethnography'], level: 'Intermediate', credits: 4 },
  'SS146': { title: 'Geopolitical Alliances', desc: 'Systemic evaluation of balance of power, international treaty structures, and regional resource networks.', hcs: ['#hegemony', '#strategic-pivoting'], level: 'Advanced Seminar', credits: 4 },
  'SS156': { title: 'Cognitive Psychology Networks', desc: 'Neural architectures and behavioral schemas of memory recall, selective attention, and perceptual biases.', hcs: ['#confirmation-bias', '#cognitive-load'], level: 'Advanced Seminar', credits: 4 },
  'SS164': { title: 'Social Stratification Dynamics', desc: 'Analyzing distribution inequalities in labor wealth portfolios and academic credential structures.', hcs: ['#intersectionality', '#structural-constraint'], level: 'Advanced Seminar', credits: 4 },
  'SS166': { title: 'Advanced game theory modeling', desc: 'Strategic pricing models, prisoner dilemna simulations, and Nash Equilibria in oligopoly structures.', hcs: ['#zero-sum', '#dominant-strategy'], level: 'Advanced Seminar', credits: 4 },
  'CP191': { title: 'Capstone Seminar I', desc: 'The launching pad for senior capstone research. Mapped outline draftings, advisor selectings, and initial drafts.', hcs: ['#problem-framing', '#milestone-pacing'], level: 'Senior Capstone', credits: 4 },
  'CP192': { title: 'Capstone Seminar II', desc: 'Synthesizing literary evidence, refining thesis proofs, compiling reference libraries, and defending methods.', hcs: ['#peer-review', '#academic-integrity'], level: 'Senior Capstone', credits: 4 },
  'CP193': { title: 'Capstone Independent Study I', desc: 'First semester of independent field mapping and research under direct mentorship of graduate faculty advisors.', hcs: ['#self-efficacy', '#expert-interviewing'], level: 'Senior Capstone', credits: 4 },
  'CP194': { title: 'Capstone Independent Study II', desc: 'Primary synthesis compilation of field findings, creating a formal journal publication transcript.', hcs: ['#knowledge-synthesis', '#scholarly-voice'], level: 'Senior Capstone', credits: 4 },
  'CP195': { title: 'Manifest Defense', desc: 'University registration defense panel. Senior students present their portfolio materials publicly.', hcs: ['#multimedia-defense', '#critical-defense'], level: 'Graduation Benchmark', credits: 4 },

  // K12 Scale
  'BIO10': { title: 'Ecology Discoveries', desc: 'Introductory biology tracking physical leaves, ecosystems, and animal behaviors in gardens.', hcs: ['#nature-noticing', '#biodiversity'], level: 'K12 Explorer Core', credits: 4 },
  'BIO11': { title: 'Aquatic Life Patterns', desc: 'Field trips to nearby creeks to identify frog larvae, micro-plankton, and local fish habitats.', hcs: ['#aquatic-biology', '#fieldwork'], level: 'K12 Explorer Core', credits: 4 },
  'BIO122': { title: 'Forest Canopy Biology', desc: 'Hands-on tree climbing bio surveys, cataloging leaf surface moss types and micro-arthropods.', hcs: ['#vertical-ecology', '#canopy-life'], level: 'K12 Intermediate', credits: 4 },
  'GAME10': { title: 'Intro to Board Mechanics', desc: 'Deconstruct popular games to analyze rules systems, turn design, and mechanical constraints.', hcs: ['#turn-dynamics', '#rule-clarity'], level: 'K12 Explorer Core', credits: 4 },
  'GAME11': { title: 'Strategic Game Balance', desc: 'Iterating rules systems mathematically to ensure all players maintain cooperative engagement pathways.', hcs: ['#competitive-fairness', '#probabilistic-mechanics'], level: 'K12 Explorer Core', credits: 4 },
  'GAME210': { title: 'Physical Card Game Fabrication', desc: 'Paper prototypings and playtesting of thematic cards including custom graphic interfaces.', hcs: ['#graphic-interface', '#physical-materials'], level: 'K12 Intermediate', credits: 4 },
  'GAME301': { title: 'Cooperative Game Design Lab', desc: 'Advanced board game creation project. Designing board paths to teach climatic ecological concepts.', hcs: ['#educational-gaming', '#systems-adaptation'], level: 'K12 Advanced', credits: 4 },
  'ECO10': { title: 'Ecosystem Dynamics', desc: 'Tracing trophic energy lines from solar photosynthesis up through secondary wolf pack structures.', hcs: ['#energy-cascades', '#trophic-pyramids'], level: 'K12 Explorer Core', credits: 4 },
  'ECO11': { title: 'Climate Adaptation Models', desc: 'Manipulating temperature feeds in mini greenhouse terrariums to test leaf humidity thresholds.', hcs: ['#greenhouse-loops', '#data-graphing'], level: 'K12 Explorer Core', credits: 4 },
  'ECO205': { title: 'Wildfire Prevention Heuristics', desc: 'Mapping dry woodland zones, evaluating debris accumulation buffers, planning fire lanes.', hcs: ['#fuel-load', '#risk-containment'], level: 'K12 Intermediate', credits: 4 },
  'NARR101': { title: 'Adventure Storytelling', desc: 'Crafting flavor story cards and narrative frameworks that breathe life into physical characters.', hcs: ['#lore-building', '#character-motivational-anchors'], level: 'K12 Intermediate', credits: 4 },
  'MAPS104': { title: 'Wildlife Cartography', desc: 'Creating highly detailed map layers tracing local deer patterns through natural trail valleys.', hcs: ['#valleys-contouring', '#fauna-spacing'], level: 'K12 Advanced', credits: 4 },
  'THESIS01': { title: 'Invention Blueprint', desc: 'Core drafting of capstone project ideas, sketching mechanics, establishing design milestones.', hcs: ['#blueprint-planning', '#prototype-drafts'], level: 'K12 Senior Thesis', credits: 4 },
  'THESIS02': { title: 'Class Demonstration', desc: 'Structured peer playtesting sessions to evaluate clarity of rules cards and emotional responses.', hcs: ['#feedback-integration', '#emotional-engagement'], level: 'K12 Senior Thesis', credits: 4 },
  'THESIS03': { title: 'Narrative Rulebook Writing', desc: 'Drafting clear, humorous, comprehensive instructions manuals for ecological systems gameboards.', hcs: ['#compositional-clarity', '#play-by-rules'], level: 'K12 Senior Thesis', credits: 4 },
  'THESIS04': { title: 'Portfolio Publication', desc: 'Exposing custom gameboards at science expos, printing vector illustrations, staging online demos.', hcs: ['#public-scenic', '#digital-hosting'], level: 'K12 Graduation requirement', credits: 4 },

  // Seniors Scale
  'MUS10': { title: 'Symphony Form Foundations', desc: 'Deciphering standard symphony orchestrations, following standard Sonata cycles and motifs.', hcs: ['#sonata-cycle', '#motif-detection'], level: 'Oasis Intro Core', credits: 4 },
  'MUS11': { title: 'Classical Orchestration', desc: 'Balancing orchestral families including high woodwinds with robust brass section layouts.', hcs: ['#acoustic-balancing', '#scoring-transcription'], level: 'Oasis Intro Core', credits: 4 },
  'SYM145': { title: 'Romantic Era Motifs', desc: 'Musical history of late romantic orchestrations with emphasis on Russian composer symphonies.', hcs: ['#chromatic-shifts', '#emotional-rhapsodics'], level: 'Oasis Intermediate', credits: 4 },
  'SYM202': { title: 'Beethoven’s Creative Eras', desc: 'Tracing development of Ludwig van Beethoven through his early classical chamber works to choral symphonies.', hcs: ['#stylistic-phases', '#heroic-metaphors'], level: 'Oasis Intermediate', credits: 4 },
  'GEN-T10': { title: 'Genealogy of Sound', desc: 'Tracing family lineage roots and historical events through ancestral folk songs and regional scales.', hcs: ['#oral-clues', '#roots-tracing'], level: 'Oasis Intermediate', credits: 4 },
  'DIG-CO1': { title: 'Digital Connection Tools', desc: 'Equipping elders to scan rare classical musical cassettes and host them safely in digital archive vaults.', hcs: ['#digital-archival', '#lossless-formats'], level: 'Oasis Intermediate', credits: 4 },
  'MAJ-P10': { title: 'Recital Transcription I', desc: 'Scribing oral accounts of mid-century symphonic concert experiences into digital memoirs.', hcs: ['#interview-transcription', '#narrative-polishing'], level: 'Oasis Senior Track', credits: 4 },
  'MAJ-P20': { title: 'Recital Transcription II', desc: 'Completing a formal bound booklet containing transcribed details of local symphonic archives.', hcs: ['#archival-integrity', '#memoir-layout'], level: 'Oasis Senior Track', credits: 4 },
  'MAJ-P30': { title: 'Oasis Concert Organization', desc: 'Planning and directing a community recital featuring local classical violinists and folk singers.', hcs: ['#event-logistics', '#repertoire-selection'], level: 'Oasis Senior Track', credits: 4 },
  'MAJ-P40': { title: 'Memoir Compilation Archiving', desc: 'Publishing and depositing finalized written oral memoirs into the Artemis Legacy Core Vault.', hcs: ['#digital-submission', '#legacy-safeguards'], level: 'Oasis Senior Track', credits: 4 },
  'MEMO10': { title: 'Introduction to Memoirs', desc: 'Creative exercises designed to tease out vivid visual sensory memories from early childhood.', hcs: ['#sensory-anchors', '#journaling-structure'], level: 'Oasis Intro Core', credits: 4 },
  'MEMO11': { title: 'Narrative Structures', desc: 'Exploring temporal pacing, stream of consciousness, and sensory memoirs writing structures.', hcs: ['#narrative-climax', '#voice-calibration'], level: 'Oasis Intro Core', credits: 4 },
  'HIST10': { title: 'Oral History Methodologies', desc: 'Critical strategies for eliciting memories and cross-verifying folk recordings with academic historical papers.', hcs: ['#witness-reliability', '#triangulation'], level: 'Oasis Intro Core', credits: 4 },
  'HIST11': { title: 'Modern Archives Inquiry', desc: 'A hands-on research class where students seek family details in government and municipal logs.', hcs: ['#public-records', '#evidence-hierarchy'], level: 'Oasis Intro Core', credits: 4 },
  'NARR-2': { title: 'The Art of Dialogue', desc: 'Drafting lively, authentic dialogue based on transcribed voice files without losing character eccentricities.', hcs: ['#dialect-accuracy', '#punctuation-rhythms'], level: 'Oasis Intermediate', credits: 4 },
  'RECAP-1': { title: 'Historical Recapitulation', desc: 'Interrogating major world occurrences and reflecting on how personal trajectories crossed them.', hcs: ['#subjective-perspective', '#historical-contextualization'], level: 'Oasis Intermediate', credits: 4 }
};

// Available electives that can be added dynamically in the dropdown picker
const ELECTIVE_CATALOG: Record<string, string[]> = {
  university: ['AH110', 'AH111', 'AH112', 'AH146', 'AH156', 'SS110', 'SS111', 'SS112', 'SS146', 'SS156', 'SS164', 'SS166', 'CS50', 'CS51', 'NS50', 'NS51', 'SS50', 'SS51'],
  k12: ['BIO122', 'GAME210', 'GAME301', 'ECO205', 'NARR101', 'MAPS104'],
  seniors: ['SYM145', 'SYM202', 'DIG-CO1', 'HIST11', 'NARR-2', 'RECAP-1']
};

export default function DegreePlanner({ onBackToDashboard }: DegreePlannerProps = {}) {
  // Currently active cohort cluster, controlled dynamically by "Populating with data from"
  const [activePresetKey, setActivePresetKey] = useState<string>('university');
  const currentPreset = STUDENT_PRESETS[activePresetKey] || STUDENT_PRESETS.university;

  // Track user-specific state changes since they differ for each loaded preset
  const [localCoursePlans, setLocalCoursePlans] = useState<Record<string, typeof currentPreset.coursePlan>>({});
  const [localRequirements, setLocalRequirements] = useState<Record<string, typeof currentPreset.requirements>>({});
  const [localCredits, setLocalCredits] = useState<Record<string, number>>({});
  const [nonCourseCredits, setNonCourseCredits] = useState<Record<string, { id: string; category: string; value: number; label: string }[]>>({});

  // Dialog / Popup UI State managers
  const [activeCourseInfo, setActiveCourseInfo] = useState<string | null>(null);
  const [showAddCourseForm, setShowAddCourseForm] = useState<{ year: number; term: 'fall' | 'spring' } | null>(null);
  const [selectedAddCourseCode, setSelectedAddCourseCode] = useState<string>('');
  
  // Custom non-course credit additions managers
  const [expandingFormType, setExpandingFormType] = useState<string | null>(null);
  const [customCreditLabel, setCustomCreditLabel] = useState<string>('');
  const [customCreditHours, setCustomCreditHours] = useState<number>(4);

  // General audit log and trigger values
  const [showProgramsSummary, setShowProgramsSummary] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showCatalogModal, setShowCatalogModal] = useState<boolean>(false);

  // Initialize data stores for each preset when component mounts
  useEffect(() => {
    const plans: Record<string, typeof currentPreset.coursePlan> = {};
    const reqs: Record<string, typeof currentPreset.requirements> = {};
    const creds: Record<string, number> = {};
    const nonCreds: Record<string, any[]> = {};

    Object.keys(STUDENT_PRESETS).forEach(key => {
      plans[key] = JSON.parse(JSON.stringify(STUDENT_PRESETS[key].coursePlan));
      reqs[key] = JSON.parse(JSON.stringify(STUDENT_PRESETS[key].requirements));
      creds[key] = STUDENT_PRESETS[key].initialCredits;
      nonCreds[key] = [];
    });

    setLocalCoursePlans(plans);
    setLocalRequirements(reqs);
    setLocalCredits(creds);
    setNonCourseCredits(nonCreds);
  }, []);

  const activePlans = localCoursePlans[activePresetKey] || currentPreset.coursePlan;
  const activeReqs = localRequirements[activePresetKey] || currentPreset.requirements;
  const activeCreds = localCredits[activePresetKey] || currentPreset.initialCredits;
  const activeNonCourse = nonCourseCredits[activePresetKey] || [];

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Switch student portfolio presets gracefully
  const handlePresetChange = (key: string) => {
    setActivePresetKey(key);
    triggerToast(`Switching registrar feed to: ${STUDENT_PRESETS[key].name} (${STUDENT_PRESETS[key].degree})`);
    setExpandingFormType(null);
    setShowAddCourseForm(null);
  };

  // Reset the loaded preset data to its original default state
  const handleResetPlan = () => {
    if (window.confirm('Do you want to reset this transcript to its official starting template?')) {
      const freshPreset = STUDENT_PRESETS[activePresetKey];
      setLocalCoursePlans(prev => ({
        ...prev,
        [activePresetKey]: JSON.parse(JSON.stringify(freshPreset.coursePlan))
      }));
      setLocalRequirements(prev => ({
        ...prev,
        [activePresetKey]: JSON.parse(JSON.stringify(freshPreset.requirements))
      }));
      setLocalCredits(prev => ({
        ...prev,
        [activePresetKey]: freshPreset.initialCredits
      }));
      setNonCourseCredits(prev => ({
        ...prev,
        [activePresetKey]: []
      }));
      triggerToast(`Successfully reset plan for ${freshPreset.name} back to original registrar index.`);
    }
  };

  // Add a course to our live semester database
  const executeAddCourse = (yearNum: number, term: 'fall' | 'spring', code: string) => {
    if (!code) return;
    
    // Check if course already exists in the term to avoid duplicates
    const finalPlans = activePlans.map(yearPlan => {
      if (yearPlan.year === yearNum) {
        const termItems = yearPlan.termPlan[term];
        if (termItems.includes(code)) return yearPlan;
        return {
          ...yearPlan,
          termPlan: {
            ...yearPlan.termPlan,
            [term]: [...termItems, code]
          }
        };
      }
      return yearPlan;
    });

    // Update state
    setLocalCoursePlans(prev => ({
      ...prev,
      [activePresetKey]: finalPlans
    }));

    // Increment overall credit metric (4 study hours)
    setLocalCredits(prev => ({
      ...prev,
      [activePresetKey]: prev[activePresetKey] + 4
    }));

    // Auto check off any pending requirement in our Checklist
    const updatedReqs = activeReqs.map(req => {
      if (req.courseCode === code) {
        return { ...req, status: 'completed' as const, description: 'Course mapped inside academic schedule successfully.' };
      }
      return req;
    });

    // Also auto check requirements mapped directly to this code, e.g. mapping CP193 turns u5 to completed
    setLocalRequirements(prev => ({
      ...prev,
      [activePresetKey]: updatedReqs
    }));

    triggerToast(`Added course ${code} to Year ${yearNum} ${term.toUpperCase()}: Mapped to graduation list (+4 credits).`);
    setShowAddCourseForm(null);
    setSelectedAddCourseCode('');
  };

  // Interactive helper clicked directly on the checklist, matching "(Add Course)" link next to unmet requirement
  const handleChecklistAddCourseShortcut = (reqId: string, code: string, yearNum: number, term: 'fall' | 'spring') => {
    // Direct shortcut addition matching mock layout exactly
    executeAddCourse(yearNum, term, code);
  };

  // Add custom transfer, experience, or summer research credits
  const handleAddNonCourseCredits = (category: string) => {
    if (!customCreditLabel.trim()) {
      alert('Please enter a descriptive label for this non-course credit entry.');
      return;
    }
    const val = Number(customCreditHours) || 4;
    const newItem = {
      id: Math.random().toString(),
      category,
      value: val,
      label: customCreditLabel
    };

    setNonCourseCredits(prev => ({
      ...prev,
      [activePresetKey]: [...(prev[activePresetKey] || []), newItem]
    }));

    setLocalCredits(prev => ({
      ...prev,
      [activePresetKey]: prev[activePresetKey] + val
    }));

    triggerToast(`Granted non-course credit: ${customCreditLabel} (+${val} credits written to transcript).`);
    setCustomCreditLabel('');
    setExpandingFormType(null);
  };

  // Auto audit: turns orange warning to green checkpoint for manifest once 120 threshold met
  const processedRequirementsList = activeReqs.map(req => {
    // If CP195 manifests require 120 credits, check if credits threshold is met!
    if (req.courseCode === 'CP195' || req.courseCode === 'THESIS04' || req.courseCode === 'MAJ-P40') {
      if (activeCreds >= 120) {
        return {
          ...req,
          status: 'completed' as const,
          description: `Total graduation threshold met with ${activeCreds} credits. Core advisor manifest approved.`
        };
      }
    }
    return req;
  });

  return (
    <div className="bg-[#FAFBFD] text-slate-800 min-h-screen font-sans flex flex-col select-none relative pb-16">
      
      {/* Dynamic Pop-up alert Toast message banner */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -45, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.9 }}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-[#1E293B] border border-blue-500/30 text-white px-5 py-3 rounded-full shadow-2xl flex items-center space-x-2 text-xs font-mono select-none"
          >
            <Sparkles className="w-4 h-4 text-orange-400 shrink-0 animate-pulse" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= HEADER SEGMENT (Charcoal gray matching Degree Planner design) ================= */}
      <header className="flex items-center justify-between px-6 py-3.5 bg-[#2D353F] text-white border-b border-slate-900 shrink-0 select-none shadow-md">
        
        {/* Brand identity */}
        <div className="flex items-center space-x-3.5">
          {onBackToDashboard && (
            <button
              onClick={onBackToDashboard}
              className="p-1.5 rounded-lg bg-[#3C4754] hover:bg-[#4E5C6C] border border-neutral-700 hover:text-white transition cursor-pointer flex items-center space-x-1 mr-1"
              title="Return to Portal Home"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-neutral-350" />
              <span className="text-[10px] uppercase font-semibold font-mono tracking-wider">Portal</span>
            </button>
          )}

          {/* Core branding emblem */}
          <div className="relative flex items-center justify-center h-8 w-8 bg-white/10 rounded-full border border-white/25">
            <div className="absolute h-5 w-5 rounded-full border-2 border-white opacity-40 animate-spin-slow" />
            <GraduationCap className="h-4.5 w-4.5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-black font-mono uppercase tracking-widest text-orange-400">
                Artemis Academic systems
              </span>
              <span className="bg-emerald-950/80 text-emerald-400 border border-emerald-800 text-[8px] px-1.5 py-0.2 rounded font-mono font-bold uppercase tracking-widest">
                REGISTRAR AUTH
              </span>
            </div>
            <h1 className="text-base font-bold font-serif -mt-0.5 tracking-tight text-white">Degree Progress Planner</h1>
          </div>
        </div>

        {/* Global Controls & User Info */}
        <div className="flex items-center space-x-4">
          
          <button
            onClick={() => setShowCatalogModal(true)}
            className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded border border-white/20 text-xs bg-white/5 hover:bg-white/15 transition cursor-pointer font-medium"
          >
            <BookOpen className="w-3.5 h-3.5 text-orange-300" />
            <span>Browse Catalog</span>
          </button>

          <button
            onClick={handleResetPlan}
            className="p-1.5 rounded border border-white/10 bg-white/5 text-slate-350 hover:bg-white/10 hover:text-white transition cursor-pointer"
            title="Reset active transcript variables to template values"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          {/* User badge */}
          <div className="flex items-center space-x-2.5 pl-3 border-l border-white/15">
            <span className="text-xs font-semibold text-slate-150 font-sans tracking-wide">
              {currentPreset.name.split(' ')[0]}
            </span>
            {currentPreset.avatarUrl ? (
              <img 
                src={currentPreset.avatarUrl} 
                alt={currentPreset.name}
                className="w-7 h-7 rounded-full border border-white/30 object-cover shrink-0"
              />
            ) : (
              <div className={`w-7 h-7 rounded-sm ${currentPreset.avatarBg} flex items-center justify-center font-bold text-[10px]`}>
                {currentPreset.avatarInitials}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ================= STUDENT HEALTH HERO SECTION ================= */}
      <section className="bg-white border-b border-slate-200 py-6 px-6 md:px-8 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start justify-between gap-6 md:gap-8">
          
          {/* Identity Grid: Column 1 */}
          <div className="space-y-1.5 md:max-w-sm">
            <h2 className="text-4xl font-serif font-black text-[#1E293B] tracking-tight hover:text-orange-600 transition duration-150 cursor-default">
              {currentPreset.name}
            </h2>
            <div className="flex flex-col gap-0.5 text-xs text-slate-500 font-sans">
              <p className="font-semibold text-slate-600">
                Enrolled: <span className="font-bold text-slate-800">{currentPreset.enrolled}</span> • Graduating: <span className="font-bold text-slate-800">{currentPreset.graduating}</span>
              </p>
              <p className="font-mono text-zinc-400 select-text hover:text-slate-700 transition">
                Email: {currentPreset.email}
              </p>
            </div>
          </div>

          {/* Program Concentrations: Column 2 */}
          <div className="flex-1 md:max-w-xl bg-slate-50/50 border border-slate-100 p-4 rounded-xl space-y-2">
            <div className="text-[11px] uppercase font-mono tracking-widest text-[#152A63] font-black flex items-center space-x-1.5">
              <Layers className="w-3.5 h-3.5 text-[#EA580C]" />
              <span>Current Matriculated Degree Objectives</span>
            </div>
            
            <p className="text-[13px] text-slate-600 leading-normal font-sans">
              <span className="font-bold text-slate-900">{currentPreset.degree}</span> majoring in <span className="font-bold text-slate-950 font-serif italic">{currentPreset.major}</span>, concentrating in <span className="font-bold text-slate-900 border-b border-dashed border-orange-200">{currentPreset.concentration}</span>, and minoring in <span className="font-bold text-slate-900">{currentPreset.minor}</span>.
            </p>

            <div className="pt-1.5 flex items-center space-x-2">
              <button 
                onClick={() => setShowProgramsSummary(!showProgramsSummary)}
                className="text-[11px] font-sans font-bold text-orange-650 hover:text-orange-850 hover:underline flex items-center space-x-1 cursor-pointer"
              >
                <span>{showProgramsSummary ? 'Hide Available Academic Tracks' : 'View All Program Options'}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition ${showProgramsSummary ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Accordion view of all programs */}
            <AnimatePresence>
              {showProgramsSummary && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden pt-3 border-t border-slate-200/60 mt-2 space-y-2"
                >
                  <p className="text-[10.5px] font-mono text-slate-450 uppercase tracking-wider font-extrabold">Active Department Clusters</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                    <div className="p-2 border border-slate-150 rounded bg-white text-[11px]">
                      <span className="font-bold text-indigo-700 block mb-0.5">University Core</span>
                      KGI Foundation structures centering formal, empirical sciences.
                    </div>
                    <div className="p-2 border border-slate-150 rounded bg-white text-[11px]">
                      <span className="font-bold text-emerald-700 block mb-0.5">K-12 Exploration</span>
                      Eco-biology tracks intersecting interactive game rules blueprinting.
                    </div>
                    <div className="p-2 border border-slate-150 rounded bg-white text-[11px]">
                      <span className="font-bold text-pink-700 block mb-0.5">Seniors Legacy</span>
                      Transcribing community violin metrics & oral life memoirs archives.
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Database Selector Dropdown: Column 3 */}
          <div className="w-full md:w-56 space-y-3.5 shrink-0 self-start md:self-end">
            <div className="space-y-1">
              <label className="text-[10.5px] text-zinc-400 font-mono block font-bold uppercase tracking-wider">
                Populating with data from:
              </label>
              <div className="relative">
                <select
                  value={activePresetKey}
                  onChange={(e) => handlePresetChange(e.target.value)}
                  className="w-full text-xs font-semibold p-2 pr-8 border border-slate-250 bg-white rounded shadow-2xs hover:border-[#EA580C] focus:outline-none focus:ring-1 focus:ring-orange-500 cursor-pointer text-slate-700 truncate"
                >
                  <option value="university">Official Transcript (University)</option>
                  <option value="k12">Student Draft Plan (K-12)</option>
                  <option value="seniors">Simulated Oasis Core (Seniors)</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
              </div>
            </div>

            <div className="flex items-center space-x-1.5 text-xs">
              <FileText className="w-3.5 h-3.5 text-[#152A63]" />
              <button 
                onClick={() => setShowCatalogModal(true)}
                className="text-orange-600 hover:text-orange-950 font-bold hover:underline select-none"
              >
                Course Catalog (PDF)
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* ================= TWO-COLUMN INTERACTIVE CANVAS ================= */}
      <main className="max-w-7xl mx-auto w-full px-6 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8">

        {/* LEFT COLUMN: Your Course Plan */}
        <section className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 shadow-2xs hover:shadow-xs transition duration-200">
          
          <div className="border-b border-slate-150 pb-3 mb-5">
            <h3 className="text-2xl font-serif font-black text-slate-800 tracking-tight flex items-center justify-between">
              <span>Your Course Plan</span>
              <BookOpen className="w-5 h-5 text-indigo-650" />
            </h3>
          </div>

          {/* Academic years loop */}
          <div className="space-y-6">
            {activePlans.map((yearPlan, yIdx) => (
              <div key={yearPlan.year} className="group/year border-b border-dashed border-slate-150 pb-5 last:border-b-0 last:pb-0">
                
                {/* Year Label */}
                <div className="flex items-center justify-between text-[11px] font-bold font-sans tracking-widest text-slate-400 uppercase mb-3 select-none">
                  <span>YEAR {yearPlan.year}</span>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => setShowAddCourseForm({ year: yearPlan.year, term: 'fall' })}
                      className="text-[9.5px] bg-indigo-50 hover:bg-indigo-150 border border-indigo-100 hover:text-indigo-850 px-2 py-0.5 rounded transition cursor-pointer font-bold font-mono tracking-normal"
                    >
                      + Fall
                    </button>
                    <button
                      onClick={() => setShowAddCourseForm({ year: yearPlan.year, term: 'spring' })}
                      className="text-[9.5px] bg-emerald-50 hover:bg-emerald-150 border border-emerald-100 hover:text-emerald-850 px-2 py-0.5 rounded transition cursor-pointer font-bold font-mono tracking-normal"
                    >
                      + Spring
                    </button>
                  </div>
                </div>

                {/* Left/Right Semesters Columns */}
                <div className="grid grid-cols-2 gap-4">
                  
                  {/* Fall Column */}
                  <div className="space-y-1.5">
                    <div className="text-[9.5px] font-mono tracking-wider text-slate-400 font-extrabold uppercase border-b border-slate-100 pb-0.5 mb-1 flex items-center justify-between">
                      <span>{yearPlan.fallTitle}</span>
                      <span>{yearPlan.termPlan.fall.length} hrs</span>
                    </div>

                    <div className="space-y-1">
                      {yearPlan.termPlan.fall.map((courseCode) => {
                        const info = GLOBAL_COURSE_CATALOG[courseCode];
                        return (
                          <div 
                            key={courseCode}
                            onClick={() => setActiveCourseInfo(courseCode)}
                            className="bg-slate-50/70 hover:bg-indigo-50/40 border border-slate-200 rounded px-2.5 py-1.5 text-xs text-indigo-700 font-mono hover:border-indigo-600 transition cursor-pointer font-bold flex items-center justify-between select-none group"
                            title={`Click to analyze ${courseCode}: ${info?.title || 'Syllabus details'}`}
                          >
                            <span className="truncate">📘 {courseCode}</span>
                            <span className="text-[9px] font-sans font-normal text-slate-450 opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                              inspect →
                            </span>
                          </div>
                        );
                      })}

                      {yearPlan.termPlan.fall.length === 0 && (
                        <div 
                          onClick={() => setShowAddCourseForm({ year: yearPlan.year, term: 'fall' })}
                          className="border border-dashed border-slate-200 text-[#EA580C] bg-orange-50/10 hover:bg-orange-50 hover:border-orange-200 cursor-pointer text-[10px] p-2.5 rounded text-center transition font-bold"
                        >
                          + Add Course
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Spring Column */}
                  <div className="space-y-1.5">
                    <div className="text-[9.5px] font-mono tracking-wider text-slate-400 font-extrabold uppercase border-b border-slate-100 pb-0.5 mb-1 flex items-center justify-between">
                      <span>{yearPlan.springTitle}</span>
                      <span>{yearPlan.termPlan.spring.length} hrs</span>
                    </div>

                    <div className="space-y-1">
                      {yearPlan.termPlan.spring.map((courseCode) => {
                        const info = GLOBAL_COURSE_CATALOG[courseCode];
                        return (
                          <div 
                            key={courseCode}
                            onClick={() => setActiveCourseInfo(courseCode)}
                            className="bg-slate-50/70 hover:bg-[#EA580C]/5 border border-slate-200 rounded px-2.5 py-1.5 text-xs text-[#EA580C] font-mono hover:border-orange-500 transition cursor-pointer font-bold flex items-center justify-between select-none group"
                            title={`Click to analyze ${courseCode}: ${info?.title || 'Syllabus details'}`}
                          >
                            <span className="truncate font-bold">📙 {courseCode}</span>
                            <span className="text-[9px] font-sans font-normal text-slate-450 opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                              inspect →
                            </span>
                          </div>
                        );
                      })}

                      {yearPlan.termPlan.spring.length === 0 && (
                        <div 
                          onClick={() => setShowAddCourseForm({ year: yearPlan.year, term: 'spring' })}
                          className="border border-dashed border-slate-200 text-[#EA580C] bg-orange-50/10 hover:bg-orange-50 hover:border-orange-200 cursor-pointer text-[10px] p-2.5 rounded text-center transition font-bold"
                        >
                          + Add Course
                        </div>
                      )}
                    </div>
                  </div>

                </div>

              </div>
            ))}
          </div>

          {/* Dynamic Scheduled Inline Form Overlay to mapped terms */}
          <AnimatePresence>
            {showAddCourseForm && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="mt-6 p-4 bg-slate-50 border border-slate-250 rounded-xl space-y-3 relative"
              >
                <button
                  onClick={() => {
                    setShowAddCourseForm(null);
                    setSelectedAddCourseCode('');
                  }}
                  className="p-1 rounded-full text-slate-400 hover:bg-slate-200 absolute top-2 right-2 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>

                <div className="space-y-0.5">
                  <span className="text-[9.5px] uppercase font-mono tracking-widest text-[#152A63] font-black">Semester Scheduler</span>
                  <h4 className="text-xs font-semibold text-slate-800">
                    Add course map for Year {showAddCourseForm.year} {showAddCourseForm.term.toUpperCase()}
                  </h4>
                </div>

                <div className="space-y-2">
                  <select
                    value={selectedAddCourseCode}
                    onChange={(e) => setSelectedAddCourseCode(e.target.value)}
                    className="w-full text-xs p-1.5 border border-slate-250 bg-white rounded focus:ring-1 focus:ring-orange-400 text-slate-700"
                  >
                    <option value="">-- Choose from available catalog --</option>
                    {(ELECTIVE_CATALOG[activePresetKey] || []).map((code) => {
                      const info = GLOBAL_COURSE_CATALOG[code];
                      return (
                        <option key={code} value={code}>
                          {code} - {info?.title || 'Elective Syllabus'} ({info?.level})
                        </option>
                      );
                    })}
                  </select>

                  <div className="flex justify-end gap-2 text-xs pt-1">
                    <button
                      onClick={() => {
                        setShowAddCourseForm(null);
                        setSelectedAddCourseCode('');
                      }}
                      className="px-2.5 py-1 hover:bg-slate-200 rounded font-semibold text-slate-500"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => executeAddCourse(showAddCourseForm.year, showAddCourseForm.term, selectedAddCourseCode)}
                      disabled={!selectedAddCourseCode}
                      className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold px-3 py-1 rounded"
                    >
                      Schedule Course
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* NON-COURSE CREDITS TRANSCRIPT UTILITIES */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <h4 className="text-[10px] font-mono tracking-widest text-slate-450 uppercase font-black mb-4">
              NON-COURSE CREDITS
            </h4>

            <div className="space-y-2 text-xs select-none">
              
              {/* Added non-course elements ledger list */}
              {activeNonCourse.map((item: any) => (
                <div key={item.id} className="p-2 border border-slate-200 rounded bg-[#FAF9F6] flex justify-between items-center text-[11px] animate-fade-in text-slate-750">
                  <div className="flex items-center space-x-2">
                    <span className="text-[9px] bg-slate-200 px-1.5 py-0.2 rounded font-mono font-black">{item.category}</span>
                    <span className="font-semibold">{item.label}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-slate-900">+{item.value} hrs</span>
                    <button 
                      onClick={() => {
                        setNonCourseCredits(prev => ({
                          ...prev,
                          [activePresetKey]: prev[activePresetKey].filter((i: any) => i.id !== item.id)
                        }));
                        setLocalCredits(prev => ({
                          ...prev,
                          [activePresetKey]: prev[activePresetKey] - item.value
                        }));
                        triggerToast(`Deleted custom credits portfolio: ${item.label}`);
                      }}
                      className="text-red-500 font-bold hover:text-red-700 p-0.5 cursor-pointer text-[10px]"
                      title="Delete credits entry"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}

              {/* Form buttons */}
              {[
                { type: 'transfer', label: 'Add Transfer Credits', icon: Layers },
                { type: 'prior', label: 'Add Prior Experiential Learning', icon: Award },
                { type: 'summer', label: 'Add Summer Research Experience', icon: Sparkles }
              ].map((btn) => (
                <div key={btn.type} className="space-y-3">
                  <button
                    onClick={() => setExpandingFormType(expandingFormType === btn.type ? null : btn.type)}
                    className="w-full text-left font-bold text-indigo-750 hover:text-indigo-950 hover:underline flex items-center space-x-1.5 py-1 cursor-pointer font-sans"
                  >
                    <Plus className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    <span>{btn.label}</span>
                  </button>

                  <AnimatePresence>
                    {expandingFormType === btn.type && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2 mt-1"
                      >
                        <div className="text-[9.5px] uppercase font-mono tracking-widest text-[#152A63] font-black pb-1">
                          Configure {btn.type.toUpperCase()} Credit Hours
                        </div>
                        <input
                          type="text"
                          placeholder="e.g. Advanced Bio Biology AP or Internship"
                          value={customCreditLabel}
                          onChange={(e) => setCustomCreditLabel(e.target.value)}
                          className="w-full text-xs p-1.5 border border-slate-250 bg-white rounded focus:ring-1 focus:ring-indigo-500 focus:outline-none focus:bg-white text-slate-850"
                        />
                        <div className="flex items-center justify-between gap-3 pt-1">
                          <div className="flex items-center space-x-1">
                            <span className="text-[10px] text-slate-400 font-mono">Credits</span>
                            <input
                              type="number"
                              min="1"
                              max="16"
                              value={customCreditHours}
                              onChange={(e) => setCustomCreditHours(Math.max(1, Number(e.target.value)))}
                              className="w-12 text-xs p-1 border border-slate-200 bg-white rounded font-mono text-center text-slate-800"
                            />
                          </div>
                          <div className="flex space-x-1">
                            <button
                              onClick={() => setExpandingFormType(null)}
                              className="px-2 py-0.5 rounded text-[11px] text-slate-500 hover:bg-slate-200"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleAddNonCourseCredits(btn.type)}
                              className="bg-indigo-650 hover:bg-indigo-850 text-white font-bold px-2.5 py-0.5 rounded text-[11px]"
                            >
                              Add Portfolio
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}

            </div>
          </div>

        </section>

        {/* RIGHT COLUMN: Graduation Requirements */}
        <section className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 shadow-2xs hover:shadow-xs transition duration-200">
          
          <div className="border-b border-slate-100 pb-3 mb-6 select-none">
            <h3 className="text-3xl font-serif font-black text-slate-800 tracking-tight pb-1">
              Graduation Requirements
            </h3>
            <p className="text-sm font-semibold text-slate-500">
              Degree: <span className="font-serif italic font-bold text-slate-850">{currentPreset.degree}</span>
            </p>
          </div>

          {/* Map through Processed Checklist, directly matching screenshot mockup layout */}
          <div className="space-y-0 text-xs select-none">
            {processedRequirementsList.map((item) => (
              <div 
                key={item.id} 
                className="py-2.5 border-b border-slate-150/80 flex items-start justify-between gap-4 last:border-b-0 hover:bg-slate-50/50 px-1 rounded-sm transition text-slate-750"
              >
                
                <div className="flex items-start space-x-3.5">
                  
                  {/* Matching icons for screenshot exactly */}
                  <div className="mt-0.5 shrink-0">
                    {item.status === 'completed' ? (
                      <Check className="w-4.5 h-4.5 text-emerald-600 border-2 border-emerald-500 bg-emerald-50 rounded-full p-0.5" />
                    ) : item.status === 'warning' ? (
                      <AlertTriangle className="w-4.5 h-4.5 text-amber-500 bg-amber-50 rounded p-0.5 border border-amber-200" />
                    ) : item.status === 'info' ? (
                      <Info className="w-4.5 h-4.5 text-indigo-500 bg-indigo-50 rounded p-0.5 border border-indigo-200" />
                    ) : (
                      // Empty circle representing pending unobtained courses
                      <div className="w-[18px] h-[18px] rounded-full border-2 border-slate-200 bg-white" />
                    )}
                  </div>

                  <div className="space-y-1">
                    <p className="font-medium text-slate-800 text-[13px]">
                      <span className="font-mono font-extrabold pr-1.5">{item.courseCode}</span> / <span className="font-sans font-bold hover:text-indigo-805 transition cursor-default">{item.courseTitle}</span>
                      
                      {/* Empty circle also gets an interactive matching course link helper */}
                      {item.status === 'pending' && (
                        <button
                          onClick={() => handleChecklistAddCourseShortcut(item.id, item.courseCode, item.targetYear, item.targetTerm)}
                          className="text-orange-650 hover:text-orange-850 font-bold ml-2.5 underline cursor-pointer hover:scale-103 inline-block transition text-[11px]"
                          title={`Schedule ${item.courseCode} immediately into the planner to earn +4 credits.`}
                        >
                          (Add Course)
                        </button>
                      )}
                    </p>
                    <p className="text-[11.5px] text-zinc-400 font-sans tracking-wide">
                      {item.description}
                    </p>
                  </div>

                </div>

                {/* Inspect Button */}
                <button
                  onClick={() => setActiveCourseInfo(item.courseCode)}
                  className="px-2 py-1 text-[10.5px] border border-slate-200 bg-slate-50 rounded text-slate-450 hover:border-indigo-400 hover:text-indigo-700 transition font-mono tracking-tighter shrink-0 cursor-pointer"
                  title="Syllabus inspect"
                >
                  Analyze
                </button>

              </div>
            ))}
          </div>

          {/* SECTOR: ADDITIONAL REQUIREMENTS INDEX */}
          <div className="mt-8 pt-6 border-t-2 border-slate-150">
            <h4 className="text-[10px] font-mono tracking-widest text-[#152A63] font-black uppercase mb-4">
              BACHELORS DEGREE - ADDITIONAL REQUIREMENTS
            </h4>

            <div className="space-y-3.5 text-xs select-none">
              
              {/* Requirement 1: Majors */}
              <div className="flex items-start space-x-3.5">
                <Check className="w-4 h-4 text-emerald-600 bg-emerald-50 rounded-full p-0.5 border border-emerald-200 mt-0.5 shrink-0" />
                <p className="text-slate-700 leading-normal font-medium text-[12.5px]">
                  This program requires either one or two Majors. 
                  <span className="text-zinc-400 block text-xs font-normal">Passed. Enrolled in {currentPreset.major}.</span>
                </p>
              </div>

              {/* Requirement 2: GPA */}
              <div className="flex items-start space-x-3.5">
                <Info className="w-4 h-4 text-indigo-500 bg-indigo-50 rounded-full p-0.5 border border-indigo-200 mt-0.5 shrink-0" />
                <p className="text-slate-700 leading-normal font-medium text-[12.5px]">
                  This program requires a cumulative grade point average (GPA) of at least a 2.00 to graduate.
                  <span className="text-zinc-400 block text-xs font-normal">Passed. Active transcript cumulative standing currently at <strong className="text-slate-700 font-bold">{currentPreset.gpa.toFixed(2)}</strong>.</span>
                </p>
              </div>

              {/* Requirement 3: 120 credit hour threshold (Live Reactive Checklist Variable!) */}
              <div className="flex items-start space-x-3.5">
                {activeCreds >= 120 ? (
                  <Check className="w-4 h-4 text-emerald-600 bg-emerald-50 rounded-full p-0.5 border border-emerald-200 mt-0.5 shrink-0 animate-bounce" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-500 bg-amber-50 rounded p-0.5 border border-amber-200 mt-0.5 shrink-0" />
                )}
                <div className="space-y-0.5 leading-normal">
                  <p className="text-slate-700 font-medium text-[12.5px]">
                    This program requires completion of at least 120 credits.
                  </p>
                  <p className="text-xs">
                    {activeCreds >= 120 ? (
                      <span className="text-emerald-600 font-semibold flex items-center gap-1">
                        Passed! Complete with <strong>{activeCreds} credits</strong> mapped (Threshold of 120 reached).
                      </span>
                    ) : (
                      <span className="text-amber-600 font-semibold">
                        Requires action: Currently at <strong>{activeCreds} credits</strong>. Add {120 - activeCreds} more credits from electives or non-course utilities.
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {/* Requirement 4: Minor limit */}
              <div className="flex items-start space-x-3.5">
                <Check className="w-4 h-4 text-emerald-600 bg-emerald-50 rounded-full p-0.5 border border-emerald-200 mt-0.5 shrink-0" />
                <p className="text-slate-700 leading-normal font-medium text-[12.5px]">
                  This program requires completion of no more than two Minors.
                  <span className="text-zinc-400 block text-xs font-normal">Passed. 1 minor declared: {currentPreset.minor}.</span>
                </p>
              </div>

              {/* Requirement 5: Full-time hours status */}
              <div className="flex items-start space-x-3.5">
                <Info className="w-4 h-4 text-indigo-500 bg-indigo-50 rounded-full p-0.5 border border-indigo-200 mt-0.5 shrink-0" />
                <p className="text-slate-700 leading-normal font-medium text-[12.5px]">
                  This program requires maintaining full-time enrollment status.
                  <span className="text-zinc-400 block text-xs font-normal">Passed. Confirmed active enrollment standing with registrar records.</span>
                </p>
              </div>

            </div>
          </div>

        </section>

      </main>

      {/* ================= MODAL: COURSE SYLLABUS INSPECTION DRAWER ================= */}
      <AnimatePresence>
        {activeCourseInfo && (() => {
          const course = GLOBAL_COURSE_CATALOG[activeCourseInfo];
          return (
            <>
              {/* Backdrop blur */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                onClick={() => setActiveCourseInfo(null)}
                className="fixed inset-0 bg-slate-900 z-40 cursor-pointer backdrop-blur-xs"
              />

              {/* Right overlay drawer */}
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white border-l border-slate-200 z-50 shadow-2xl flex flex-col justify-between overflow-hidden text-slate-800"
              >
                {/* Header */}
                <div className="p-5 border-b border-slate-150 bg-slate-50 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-mono font-black text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-150 uppercase tracking-widest">
                      Course Syllabus index
                    </span>
                    <h3 className="text-lg font-bold text-[#1E293B] font-mono leading-none pt-1">
                      {activeCourseInfo}
                    </h3>
                  </div>
                  <button
                    onClick={() => setActiveCourseInfo(null)}
                    className="p-1.5 rounded-full hover:bg-slate-200 text-slate-450 hover:text-slate-800 transition cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Body Content */}
                <div className="flex-grow overflow-y-auto p-6 space-y-5">
                  {course ? (
                    <>
                      <div className="space-y-1">
                        <span className="text-[9.5px] font-mono font-bold uppercase tracking-wider text-slate-400">Course Full Title</span>
                        <h4 className="text-xl font-serif font-black text-slate-800 leading-tight">
                          {course.title}
                        </h4>
                      </div>

                      <div className="grid grid-cols-2 gap-3.5 border-y border-slate-100 py-3.5">
                        <div>
                          <span className="text-[9px] font-mono block uppercase text-slate-400">Department Band</span>
                          <span className="text-xs font-bold font-sans text-slate-700">{course.level}</span>
                        </div>
                        <div>
                          <span className="text-[9px] font-mono block uppercase text-slate-400">Award Weight</span>
                          <span className="text-xs font-bold font-sans text-slate-700">{course.credits} Credits</span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[9.5px] font-mono font-bold uppercase tracking-wider text-slate-400">Course Syllabus Description</span>
                        <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                          {course.desc}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <span className="text-[9.5px] font-mono font-bold block uppercase tracking-wider text-slate-400">Mapped Habits & Concepts (HCs)</span>
                        <div className="flex flex-wrap gap-1.5 pt-0.5">
                          {course.hcs.map((hc) => (
                            <span 
                              key={hc}
                              className="text-[10px] font-mono bg-orange-50 border border-orange-150 text-[#EA580C] font-semibold px-2 py-0.5 rounded-sm"
                            >
                              {hc}
                            </span>
                          ))}
                        </div>
                        <p className="text-[10px] italic text-slate-450">These core learning HCs indicate the cognitive diagnostic variables tracked under the Artemis portal outcomes dashboard.</p>
                      </div>

                      <div className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl space-y-1">
                        <div className="flex items-center space-x-1.5 text-xs text-indigo-700 font-bold uppercase tracking-wide font-mono">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Auditing Core Met</span>
                        </div>
                        <p className="text-[11px] text-slate-550 leading-relaxed">
                          Your active transcript proves enrollment limits are optimized. Course is flagged as <strong className="text-indigo-800 font-bold">certified</strong> by the Academic Standards Board.
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-10 text-slate-400">
                      <Layers className="w-8 h-8 text-slate-300 mx-auto mb-2 animate-bounce" />
                      <p className="text-xs font-mono font-bold">No Syllabus record mapped</p>
                      <p className="text-[11px] mt-1">This course code does not have static syllabus definitions mapped inside the general registrar index.</p>
                    </div>
                  )}
                </div>

                {/* Footer close option */}
                <div className="p-4 border-t border-slate-150 bg-slate-50 flex items-center justify-between">
                  <span className="text-[9px] font-mono text-zinc-400 uppercase font-black">Authorized Course Ledger V3</span>
                  <button
                    onClick={() => setActiveCourseInfo(null)}
                    className="bg-[#2D353F] hover:bg-slate-800 text-white font-bold px-3 py-1.5 text-xs rounded transition uppercase cursor-pointer"
                  >
                    Close Sheet
                  </button>
                </div>
              </motion.div>
            </>
          );
        })()}
      </AnimatePresence>

      {/* ================= MODAL: COURSE CATALOG OVERVIEW ================= */}
      <AnimatePresence>
        {showCatalogModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCatalogModal(false)}
              className="fixed inset-0 bg-slate-900 z-40 backdrop-blur-xs cursor-pointer"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="fixed inset-6 md:inset-x-20 md:inset-y-12 bg-white rounded-2xl z-50 shadow-2xl flex flex-col justify-between overflow-hidden text-slate-800 border border-slate-200"
            >
              {/* Header */}
              <div className="p-5 border-b border-slate-150 bg-[#2D353F] text-white flex items-center justify-between select-none">
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-5 h-5 text-orange-300 shrink-0" />
                  <div>
                    <h3 className="text-base font-bold font-serif leading-none">
                      Artemis Academic Course Catalog & Syllabus Index
                    </h3>
                    <p className="text-[10px] text-slate-300 font-mono mt-1 uppercase tracking-widest font-black">
                      2026-2027 Authorized Curriculum Release
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowCatalogModal(false)}
                  className="p-1 rounded-full hover:bg-slate-700 text-slate-350 hover:text-white transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Course Cards */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-slate-50">
                {Object.keys(GLOBAL_COURSE_CATALOG).map((courseCode) => {
                  const itm = GLOBAL_COURSE_CATALOG[courseCode];
                  return (
                    <div 
                      key={courseCode}
                      className="bg-white border border-slate-200 p-4.5 rounded-xl space-y-3.5 hover:shadow transition hover:border-[#EA580C] relative group flex flex-col justify-between select-none"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono font-extrabold text-[#152A63] bg-indigo-50 px-2 py-0.5 rounded border border-indigo-150">
                            {courseCode}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">
                            {itm.level}
                          </span>
                        </div>
                        <h4 className="text-[13.5px] font-black font-serif text-slate-800 truncate">
                          {itm.title}
                        </h4>
                        <p className="text-slate-500 leading-relaxed text-[11px] line-clamp-3">
                          {itm.desc}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          {itm.hcs.slice(0, 2).map((hc) => (
                            <span key={hc} className="text-[8.5px] font-mono text-orange-650 bg-orange-50 px-1 py-0.2 rounded-xs">
                              {hc}
                            </span>
                          ))}
                        </div>
                        <span className="text-[10px] font-mono text-slate-400 font-bold shrink-0">{itm.credits} credits</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-slate-205 bg-slate-100 flex justify-between items-center text-xs text-slate-450 font-semibold select-none pr-6">
                <span>Registrar Syllabus Sync State: OK</span>
                <button
                  onClick={() => setShowCatalogModal(false)}
                  className="bg-[#2D353F] hover:bg-slate-800 text-white font-bold px-4 py-1.5 rounded transition uppercase tracking-wide cursor-pointer"
                >
                  Close Catalog View
                </button>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
