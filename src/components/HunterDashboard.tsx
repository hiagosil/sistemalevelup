import { Hunter, DailyProgress, RANK_NAMES } from '@/types/game';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MissionList } from './MissionList';
import { HunterStats } from './HunterStats';
import { Trophy, Calendar, Target, LogOut } from 'lucide-react';

interface HunterDashboardProps {
  hunter: Hunter;
  dailyProgress: DailyProgress;
  onCompleteMission: (missionId: string) => void;
  onLogout: () => void;
}

export function HunterDashboard({
  hunter,
  dailyProgress,
  onCompleteMission,
  onLogout
}: HunterDashboardProps) {
  const xpPercentage = (hunter.xp / hunter.xpToNextLevel) * 100;
  const completedMissions = dailyProgress.missions.filter(m => m.completed).length;
  const totalMissions = dailyProgress.missions.length;

  return (
    <div className="min-h-screen bg-background p-4 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-orbitron font-black text-primary magic-text">
            SISTEMA LEVEL UP
          </h1>
          <p className="text-muted-foreground">Portal do Caçador</p>
        </div>
        <Button
          variant="outline"
          onClick={onLogout}
          className="border-destructive/30 text-destructive hover:bg-destructive/10"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>

      {/* Hunter Profile */}
      <Card className="magic-card-intense">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl font-orbitron magic-text">
                {hunter.name}
                <Badge variant="rank" className="ml-3">
                  {RANK_NAMES[hunter.rank]}
                </Badge>
              </CardTitle>
              <div className="flex gap-4 text-sm text-muted-foreground mt-2">
                <span>Idade: {hunter.age}</span>
                <span>Peso: {hunter.weight}kg</span>
                <span>Criado: {new Date(hunter.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-orbitron font-black text-primary magic-text">
                LV.{hunter.level}
              </div>
              <div className="text-sm text-muted-foreground">
                {hunter.xp}/{hunter.xpToNextLevel} XP
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* XP Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-primary font-medium">Progresso para próximo nível</span>
              <span className="text-muted-foreground">{xpPercentage.toFixed(1)}%</span>
            </div>
            <Progress value={xpPercentage} className="h-3" />
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Trophy className="w-4 h-4 text-vitality mr-1" />
                <span className="text-sm text-muted-foreground">Dias</span>
              </div>
              <div className="text-2xl font-bold text-vitality">{hunter.completedDays}</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Target className="w-4 h-4 text-intelligence mr-1" />
                <span className="text-sm text-muted-foreground">Missões</span>
              </div>
              <div className="text-2xl font-bold text-intelligence">{hunter.totalMissionsCompleted}</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Calendar className="w-4 h-4 text-strength mr-1" />
                <span className="text-sm text-muted-foreground">Hoje</span>
              </div>
              <div className="text-2xl font-bold text-strength">{completedMissions}/{totalMissions}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Missions */}
        <div className="lg:col-span-2">
          <MissionList
            missions={dailyProgress.missions}
            onCompleteMission={onCompleteMission}
            isAllCompleted={dailyProgress.completed}
          />
        </div>

        {/* Stats */}
        <div>
          <HunterStats stats={hunter.stats} />
        </div>
      </div>

      {/* Daily Complete Effect */}
      {dailyProgress.completed && (
        <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-50">
          <div className="text-6xl font-orbitron font-black text-primary magic-text animate-level-up-glow">
            🎉 DIA COMPLETO! 🎉
          </div>
        </div>
      )}
    </div>
  );
}