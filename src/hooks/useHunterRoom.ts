import { useState, useEffect } from 'react';
import { HunterRoom, Goal, WeeklyReport } from '@/types/notes';
import { useToast } from '@/hooks/use-toast';

const HUNTER_ROOM_STORAGE_KEY = 'solo-leveling-hunter-room';

export function useHunterRoom() {
  const [hunterRoom, setHunterRoom] = useState<HunterRoom>({
    strengths: [],
    weaknesses: [],
    goals: [],
    weeklyReports: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadHunterRoom();
  }, []);

  const loadHunterRoom = () => {
    try {
      const saved = localStorage.getItem(HUNTER_ROOM_STORAGE_KEY);
      if (saved) {
        setHunterRoom(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Erro ao carregar Sala do Caçador:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveHunterRoom = (data: HunterRoom) => {
    try {
      localStorage.setItem(HUNTER_ROOM_STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Erro ao salvar Sala do Caçador:', error);
    }
  };

  const addStrength = (strength: string) => {
    const updated = {
      ...hunterRoom,
      strengths: [...hunterRoom.strengths, strength.trim()],
    };
    setHunterRoom(updated);
    saveHunterRoom(updated);
    
    toast({
      title: "💪 Ponto forte registrado",
      description: "O Sistema reconhece sua evolução",
    });
  };

  const removeStrength = (index: number) => {
    const updated = {
      ...hunterRoom,
      strengths: hunterRoom.strengths.filter((_, i) => i !== index),
    };
    setHunterRoom(updated);
    saveHunterRoom(updated);
  };

  const addWeakness = (weakness: string) => {
    const updated = {
      ...hunterRoom,
      weaknesses: [...hunterRoom.weaknesses, weakness.trim()],
    };
    setHunterRoom(updated);
    saveHunterRoom(updated);

    toast({
      title: "🎯 Fraqueza identificada",
      description: "Reconhecer limitações é o primeiro passo para superá-las",
    });
  };

  const removeWeakness = (index: number) => {
    const updated = {
      ...hunterRoom,
      weaknesses: hunterRoom.weaknesses.filter((_, i) => i !== index),
    };
    setHunterRoom(updated);
    saveHunterRoom(updated);
  };

  const createGoal = (title: string, description: string, type: Goal['type']) => {
    const newGoal: Goal = {
      id: crypto.randomUUID(),
      title: title.trim(),
      description: description.trim(),
      type,
      status: 'progress',
      createdAt: new Date().toISOString(),
    };

    const updated = {
      ...hunterRoom,
      goals: [...hunterRoom.goals, newGoal],
    };
    setHunterRoom(updated);
    saveHunterRoom(updated);

    toast({
      title: "🎯 Novo objetivo definido",
      description: "Um novo destino foi traçado. O Sistema registrou sua ambição.",
    });

    return newGoal;
  };

  const updateGoalStatus = (id: string, status: Goal['status']) => {
    const updated = {
      ...hunterRoom,
      goals: hunterRoom.goals.map(goal =>
        goal.id === id
          ? {
              ...goal,
              status,
              completedAt: status === 'completed' ? new Date().toISOString() : undefined,
            }
          : goal
      ),
    };
    setHunterRoom(updated);
    saveHunterRoom(updated);

    if (status === 'completed') {
      toast({
        title: "🏆 Objetivo concluído!",
        description: "Seus progressos e falhas foram analisados. Use-os como armas.",
      });
    }
  };

  const deleteGoal = (id: string) => {
    const updated = {
      ...hunterRoom,
      goals: hunterRoom.goals.filter(goal => goal.id !== id),
    };
    setHunterRoom(updated);
    saveHunterRoom(updated);
  };

  const generateWeeklyReport = () => {
    const now = new Date();
    const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
    const weekKey = weekStart.toISOString().split('T')[0];

    // Verificar se já existe relatório desta semana
    const existingReport = hunterRoom.weeklyReports.find(report => 
      report.week === weekKey
    );

    if (existingReport) {
      toast({
        title: "📊 Relatório já existe",
        description: "O relatório desta semana já foi gerado",
      });
      return existingReport;
    }

    // Calcular métricas
    const completedGoals = hunterRoom.goals.filter(goal => goal.status === 'completed').length;
    const totalGoals = hunterRoom.goals.length;
    const completionRate = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;

    const newReport: WeeklyReport = {
      id: crypto.randomUUID(),
      week: weekKey,
      missionCompletionRate: completionRate,
      productivityPeaks: ['Manhã (8h-10h)', 'Tarde (14h-16h)'], // Simulado
      recommendations: [
        'Continue mantendo disciplina nas metas',
        'Considere revisar objetivos de longo prazo',
        'Dedique mais tempo à reflexão semanal',
      ],
      createdAt: new Date().toISOString(),
    };

    const updated = {
      ...hunterRoom,
      weeklyReports: [...hunterRoom.weeklyReports, newReport],
    };
    setHunterRoom(updated);
    saveHunterRoom(updated);

    toast({
      title: "📈 Relatório semanal gerado",
      description: "O Sistema registrou sua evolução. Você está mais forte do que há sete dias.",
    });

    return newReport;
  };

  const getHunterRoomXP = () => {
    // XP baseado em atividades da Sala do Caçador
    const strengthsXP = hunterRoom.strengths.length * 10;
    const weaknessesXP = hunterRoom.weaknesses.length * 10;
    const goalsXP = hunterRoom.goals.length * 25;
    const completedGoalsXP = hunterRoom.goals.filter(g => g.status === 'completed').length * 50;
    const reportsXP = hunterRoom.weeklyReports.length * 100;

    return strengthsXP + weaknessesXP + goalsXP + completedGoalsXP + reportsXP;
  };

  return {
    hunterRoom,
    isLoading,
    addStrength,
    removeStrength,
    addWeakness,
    removeWeakness,
    createGoal,
    updateGoalStatus,
    deleteGoal,
    generateWeeklyReport,
    getHunterRoomXP,
  };
}