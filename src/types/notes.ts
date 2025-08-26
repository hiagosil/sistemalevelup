export type NoteRank = 'E' | 'D' | 'C' | 'B' | 'A' | 'S';

export interface Note {
  id: string;
  title: string;
  content: string;
  priority: NoteRank;
  createdAt: string;
  updatedAt: string;
}

export interface NotesStats {
  totalNotes: number;
  totalWords: number;
  exp: number;
  level: number;
  activeDays: number;
  notesPerDay: number;
  estimatedTime: number;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  type: 'short' | 'medium' | 'long';
  status: 'progress' | 'completed' | 'abandoned';
  createdAt: string;
  completedAt?: string;
}

export interface HunterRoom {
  strengths: string[];
  weaknesses: string[];
  goals: Goal[];
  weeklyReports: WeeklyReport[];
}

export interface WeeklyReport {
  id: string;
  week: string;
  missionCompletionRate: number;
  productivityPeaks: string[];
  recommendations: string[];
  createdAt: string;
}

export const RANK_LABELS: Record<NoteRank, string> = {
  'E': 'Básico',
  'D': 'Comum',
  'C': 'Importante',
  'B': 'Urgente',
  'A': 'Crítico',
  'S': 'Prioritário',
};

export const RANK_COLORS: Record<NoteRank, string> = {
  'E': 'bg-gray-500/20 text-gray-700 border-gray-300',
  'D': 'bg-blue-500/20 text-blue-700 border-blue-300',
  'C': 'bg-green-500/20 text-green-700 border-green-300',
  'B': 'bg-yellow-500/20 text-yellow-700 border-yellow-300',
  'A': 'bg-orange-500/20 text-orange-700 border-orange-300',
  'S': 'bg-red-500/20 text-red-700 border-red-300',
};

export const NARRATIVE_PHRASES = {
  objetivos: [
    "Um novo destino foi traçado. O Sistema registrou sua ambição.",
    "A cada meta definida, o caminho diante de você se torna mais claro.",
    "Seus objetivos são portais. Cabe a você atravessá-los."
  ],
  pontosFortes: [
    "Reconhecer seu poder é o primeiro passo para dominá-lo.",
    "A força que você já possui é a base para novos níveis.",
    "O Sistema observa: sua confiança está aumentando."
  ],
  pontosFracos: [
    "Suas fraquezas foram reveladas. Enfrentá-las é inevitável.",
    "Aceitar suas limitações é transformar vulnerabilidade em força.",
    "Somente os caçadores que reconhecem suas falhas podem evoluir."
  ],
  avaliacaoSemanal: [
    "O Sistema registrou sua evolução. Você está mais forte do que há sete dias.",
    "Seus progressos e falhas foram analisados. Use-os como armas.",
    "A disciplina que você cultivou está moldando um novo caçador."
  ],
  reflexaoRecompensa: [
    "O Sistema recompensa aqueles que olham para dentro de si.",
    "A verdadeira evolução nasce do autoexame.",
    "Você desbloqueou mais sabedoria ao refletir sobre sua jornada."
  ]
};