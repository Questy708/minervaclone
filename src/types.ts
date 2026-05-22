export interface Student {
  id: string;
  name: string;
  avatarUrl?: string;
  isSpeaking: boolean;
  active: boolean;
  avatarColor: string;
  handRaised?: boolean;
  emojiReaction?: string;
  score?: number;
  unmute?: boolean;
}

export interface LessonActivity {
  id: string;
  title: string;
  duration: string;
  subtitle: string;
  type: 'poll' | 'introduction' | 'homework' | 'summary' | 'breakout' | 'proposal';
  active: boolean;
  resources?: string[];
}

export interface StudentFeedback {
  happyGreen: number;
  neutralYellow: number;
  heartOrange: number;
  frownRed: number;
  excitedPurple: number;
  worriedBlue: number;
  handWhite: number;
}

export interface HCCecept {
  code: string;
  count: number;
  weight: number;
  description: string;
  category: string; // 'Formal' | 'Empirical' | 'Multimodal' | 'Social'
}

export interface CoursePlanYear {
  year: number;
  termPlan: {
    fall: string[];
    spring: string[];
  };
}

export interface GradRequirement {
  id: string;
  label: string;
  status: 'completed' | 'info' | 'warning' | 'pending';
  description: string;
}

export interface ReverseEngineeringClue {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  clueText: string;
}
