export interface Mission {
  id: number;
  title: string;
  topic: string;
  description: string;
  iconName: string;
  isLocked: boolean;
  isCompleted: boolean;
}

export interface Question {
  text: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string; // Breve explicación de por qué es la correcta
}

export interface MissionContent {
  introTitle: string;
  introText: string;
  funFact: string;
  questions: Question[];
}

export enum GameScreen {
  HOME,
  MAP,
  MISSION,
  CERTIFICATE
}

export interface PlayerState {
  name: string;
  points: number;
  completedMissions: number[]; // IDs of completed missions
}