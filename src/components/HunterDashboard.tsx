import { useState } from 'react';
import { Hunter, DailyProgress, RANK_NAMES } from '@/types/game';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MissionList } from './MissionList';
import { HunterStats } from './HunterStats';
import { NotesApp } from './NotesApp';
import { HunterRoom } from './HunterRoom';
import { useHunterRoom } from '@/hooks/useHunterRoom';
import { Trophy, Calendar, Target, LogOut, FileText, Home as HomeIcon, Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

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
  const [activeTab, setActiveTab] = useState<'missions' | 'notes' | 'hunter-room'>('hunter-room');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { getHunterRoomXP } = useHunterRoom();
  const xpPercentage = (hunter.xp / hunter.xpToNextLevel) * 100;
  const completedMissions = dailyProgress.missions.filter(m => m.completed).length;
  const totalMissions = dailyProgress.missions.length;

  return (
    <div className="min-h-screen bg-background p-2 space-y-3">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-xl font-orbitron font-black text-primary magic-text">
            SISTEMA LEVEL UP
          </h1>
          <p className="text-xs text-muted-foreground">Portal do Caçador</p>
        </div>
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm">
              <Menu className="w-3 h-3" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <div className="flex flex-col space-y-3 mt-4">
              <Button
                variant={activeTab === 'hunter-room' ? 'default' : 'ghost'}
                className="w-full justify-start text-sm"
                onClick={() => {
                  setActiveTab('hunter-room');
                  setIsMenuOpen(false);
                }}
              >
                <HomeIcon className="w-3 h-3 mr-2" />
                Sala do Caçador
              </Button>
              <Button
                variant={activeTab === 'missions' ? 'default' : 'ghost'}
                className="w-full justify-start text-sm"
                onClick={() => {
                  setActiveTab('missions');
                  setIsMenuOpen(false);
                }}
              >
                <Target className="w-3 h-3 mr-2" />
                Missões
              </Button>
              <Button
                variant={activeTab === 'notes' ? 'default' : 'ghost'}
                className="w-full justify-start text-sm"
                onClick={() => {
                  setActiveTab('notes');
                  setIsMenuOpen(false);
                }}
              >
                <FileText className="w-3 h-3 mr-2" />
                Bloco de Notas
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-sm border-destructive/30 text-destructive hover:bg-destructive/10"
                onClick={onLogout}
              >
                <LogOut className="w-3 h-3 mr-2" />
                Sair
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Hunter Profile */}
      <Card className="magic-card-intense">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-lg font-orbitron magic-text">
                {hunter.name}
                <Badge variant="rank" className="ml-2 text-xs">
                  {RANK_NAMES[hunter.rank]}
                </Badge>
              </CardTitle>
              <div className="flex gap-3 text-xs text-muted-foreground mt-1">
                <span>Idade: {hunter.age}</span>
                <span>Peso: {hunter.weight}kg</span>
                <span>Criado: {new Date(hunter.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xl font-orbitron font-black text-primary magic-text">
                LV.{hunter.level}
              </div>
              <div className="text-xs text-muted-foreground">
                {hunter.xp}/{hunter.xpToNextLevel} XP
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-3 pt-0">
          {/* XP Progress */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-primary font-medium">Progresso para próximo nível</span>
              <span className="text-muted-foreground">{xpPercentage.toFixed(1)}%</span>
            </div>
            <Progress value={xpPercentage} className="h-2" />
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3 pt-2 border-t border-border">
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Trophy className="w-3 h-3 text-vitality mr-1" />
                <span className="text-xs text-muted-foreground">Dias</span>
              </div>
              <div className="text-lg font-bold text-vitality">{hunter.completedDays}</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Target className="w-3 h-3 text-intelligence mr-1" />
                <span className="text-xs text-muted-foreground">Missões</span>
              </div>
              <div className="text-lg font-bold text-intelligence">{hunter.totalMissionsCompleted}</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Calendar className="w-3 h-3 text-strength mr-1" />
                <span className="text-xs text-muted-foreground">Hoje</span>
              </div>
              <div className="text-lg font-bold text-strength">{completedMissions}/{totalMissions}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Dynamic Content */}
        <div className="lg:col-span-2">
          {activeTab === 'missions' && (
            <MissionList
              missions={dailyProgress.missions}
              onCompleteMission={onCompleteMission}
              isAllCompleted={dailyProgress.completed}
            />
          )}
          {activeTab === 'notes' && (
            <NotesApp additionalXP={getHunterRoomXP()} />
          )}
          {activeTab === 'hunter-room' && (
            <HunterRoom />
          )}
        </div>

        {/* Stats - only show on missions tab */}
        {activeTab === 'missions' && (
          <div>
            <HunterStats stats={hunter.stats} />
          </div>
        )}
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