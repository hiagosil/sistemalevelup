export interface Hunter {
  id: string;
  name: string;
  age: number;
  weight: number;
  level: number;
  xp: number;
  xpToNextLevel: number;
  rank: HunterRank;
  createdAt: string;
  stats: HunterStats;
  achievements: Achievement[];
  completedDays: number;
  totalMissionsCompleted: number;
}

export interface HunterStats {
  strength: number;
  vitality: number;
  agility: number;
  intelligence: number;
  mana: number;
}

export type HunterRank = 'E' | 'D' | 'C' | 'B' | 'A' | 'S' | 'SHADOW_MONARCH';

export interface Mission {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  statReward: keyof HunterStats;
  completed: boolean;
  icon: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlockedAt: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface DailyProgress {
  date: string;
  missions: Mission[];
  completed: boolean;
  xpGained: number;
}

export const RANK_REQUIREMENTS: Record<HunterRank, number> = {
  'E': 0,
  'D': 100,
  'C': 300,
  'B': 600,
  'A': 1000,
  'S': 1500,
  'SHADOW_MONARCH': 2500,
};

export const RANK_NAMES: Record<HunterRank, string> = {
  'E': 'Iniciante',
  'D': 'Novato',
  'C': 'Competente',
  'B': 'Experiente',
  'A': 'Elite',
  'S': 'Lendário',
  'SHADOW_MONARCH': 'Monarca das Sombras',
};

export const DEFAULT_MISSIONS: Omit<Mission, 'id' | 'completed'>[] = [
  {
    title: "Despertar Matinal",
    description: "Acordar antes das 7:00",
    xpReward: 50,
    statReward: "vitality",
    icon: "sunrise"
  },
  {
    title: "Treino Físico",
    description: "30 min de exercício",
    xpReward: 80,
    statReward: "strength",
    icon: "dumbbell"
  },
  {
    title: "Alimentação Saudável",
    description: "Comer refeição nutritiva",
    xpReward: 60,
    statReward: "vitality",
    icon: "apple"
  },
  {
    title: "Leitura",
    description: "Ler por 30 minutos",
    xpReward: 70,
    statReward: "intelligence",
    icon: "book"
  },
  {
    title: "Meditação",
    description: "10 min de meditação",
    xpReward: 65,
    statReward: "mana",
    icon: "brain"
  },
  {
    title: "Organização",
    description: "Organizar espaço pessoal",
    xpReward: 55,
    statReward: "agility",
    icon: "home"
  },
  {
    title: "Desenvolvimento",
    description: "Estudar/praticar skill",
    xpReward: 75,
    statReward: "intelligence",
    icon: "target"
  }
];