export enum Difficulty {
  BEGINNER = 'Beginner',
  INTERMEDIATE = 'Intermediate',
  ADVANCED = 'Advanced',
  MASTER = 'Master'
}

export interface CodeTask {
  id: string;
  title: string;
  description: string;
  language: string; // usually python
  code: string;
  explanation: string;
  difficulty: Difficulty;
}

export interface FeedbackResult {
  score: number;
  isCorrect: boolean;
  feedback: string;
  suggestions: string[];
}

export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  PRACTICE = 'PRACTICE',
  HISTORY = 'HISTORY',
  SETTINGS = 'SETTINGS'
}
