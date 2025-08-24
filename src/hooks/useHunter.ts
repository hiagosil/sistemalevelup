import { useState, useEffect } from 'react';
import { Hunter, HunterRank, Mission, DailyProgress, DEFAULT_MISSIONS, RANK_REQUIREMENTS } from '@/types/game';
import { useToast } from '@/hooks/use-toast';

const STORAGE_KEY = 'solo-leveling-hunter';
const DAILY_PROGRESS_KEY = 'solo-leveling-daily';

export function useHunter() {
  const [hunter, setHunter] = useState<Hunter | null>(null);
  const [dailyProgress, setDailyProgress] = useState<DailyProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadHunterData();
  }, []);

  const loadHunterData = () => {
    const savedHunter = localStorage.getItem(STORAGE_KEY);
    const savedDaily = localStorage.getItem(DAILY_PROGRESS_KEY);
    
    if (savedHunter) {
      setHunter(JSON.parse(savedHunter));
    }
    
    if (savedDaily) {
      const dailyData = JSON.parse(savedDaily);
      const today = new Date().toDateString();
      
      if (dailyData.date === today) {
        setDailyProgress(dailyData);
      } else {
        // New day, reset missions
        createNewDailyProgress();
      }
    } else {
      createNewDailyProgress();
    }
    
    setIsLoading(false);
  };

  const createHunter = (name: string, age: number, weight: number) => {
    const newHunter: Hunter = {
      id: crypto.randomUUID(),
      name,
      age,
      weight,
      level: 1,
      xp: 0,
      xpToNextLevel: 100,
      rank: 'E',
      createdAt: new Date().toISOString(),
      stats: {
        strength: 10,
        vitality: 10,
        agility: 10,
        intelligence: 10,
        mana: 10,
      },
      achievements: [],
      completedDays: 0,
      totalMissionsCompleted: 0,
    };

    setHunter(newHunter);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newHunter));
    createNewDailyProgress();
    
    toast({
      title: "⚔️ Caçador Registrado!",
      description: `Bem-vindo, ${name}! Sua jornada épica começou.`,
    });
  };

  const createNewDailyProgress = () => {
    const today = new Date().toDateString();
    const missions: Mission[] = DEFAULT_MISSIONS.map(mission => ({
      ...mission,
      id: crypto.randomUUID(),
      completed: false,
    }));

    const newDaily: DailyProgress = {
      date: today,
      missions,
      completed: false,
      xpGained: 0,
    };

    setDailyProgress(newDaily);
    localStorage.setItem(DAILY_PROGRESS_KEY, JSON.stringify(newDaily));
  };

  const completeMission = (missionId: string) => {
    if (!hunter || !dailyProgress) return;

    const mission = dailyProgress.missions.find(m => m.id === missionId);
    if (!mission || mission.completed) return;

    // Update mission
    const updatedMissions = dailyProgress.missions.map(m =>
      m.id === missionId ? { ...m, completed: true } : m
    );

    const newXpGained = dailyProgress.xpGained + mission.xpReward;
    const newTotalXp = hunter.xp + mission.xpReward;
    
    // Check for level up
    let newLevel = hunter.level;
    let newXpToNext = hunter.xpToNextLevel;
    let leveledUp = false;
    
    if (newTotalXp >= hunter.xpToNextLevel) {
      newLevel++;
      newXpToNext = newLevel * 100; // Simple level calculation
      leveledUp = true;
    }

    // Update stats
    const newStats = { ...hunter.stats };
    newStats[mission.statReward] += Math.floor(mission.xpReward / 10);

    // Calculate new rank
    const newRank = calculateRank(newTotalXp);

    const updatedHunter = {
      ...hunter,
      level: newLevel,
      xp: newTotalXp,
      xpToNextLevel: newXpToNext,
      rank: newRank,
      stats: newStats,
      totalMissionsCompleted: hunter.totalMissionsCompleted + 1,
    };

    // Check if all missions completed
    const allCompleted = updatedMissions.every(m => m.completed);
    const updatedDaily = {
      ...dailyProgress,
      missions: updatedMissions,
      completed: allCompleted,
      xpGained: newXpGained,
    };

    if (allCompleted && !dailyProgress.completed) {
      updatedHunter.completedDays++;
      toast({
        title: "🎉 Dia Completo!",
        description: "Todas as missões concluídas! Você é imparável!",
      });
    }

    setHunter(updatedHunter);
    setDailyProgress(updatedDaily);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHunter));
    localStorage.setItem(DAILY_PROGRESS_KEY, JSON.stringify(updatedDaily));

    // Show mission complete toast
    toast({
      title: `✨ Missão Completa!`,
      description: `+${mission.xpReward} XP • +${Math.floor(mission.xpReward / 10)} ${mission.statReward.toUpperCase()}`,
    });

    if (leveledUp) {
      setTimeout(() => {
        toast({
          title: "🔥 LEVEL UP!",
          description: `Parabéns! Você alcançou o nível ${newLevel}!`,
        });
      }, 500);
    }
  };

  const calculateRank = (totalXp: number): HunterRank => {
    const ranks: HunterRank[] = ['E', 'D', 'C', 'B', 'A', 'S', 'SHADOW_MONARCH'];
    
    for (let i = ranks.length - 1; i >= 0; i--) {
      if (totalXp >= RANK_REQUIREMENTS[ranks[i]]) {
        return ranks[i];
      }
    }
    
    return 'E';
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(DAILY_PROGRESS_KEY);
    setHunter(null);
    setDailyProgress(null);
  };

  return {
    hunter,
    dailyProgress,
    isLoading,
    createHunter,
    completeMission,
    logout,
  };
}