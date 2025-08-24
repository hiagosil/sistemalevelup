import { Mission } from '@/types/game';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Sunrise, 
  Dumbbell, 
  Apple, 
  Book, 
  Brain, 
  Home, 
  Target,
  Check,
  Star
} from 'lucide-react';

interface MissionListProps {
  missions: Mission[];
  onCompleteMission: (missionId: string) => void;
  isAllCompleted: boolean;
}

const iconMap = {
  sunrise: Sunrise,
  dumbbell: Dumbbell,
  apple: Apple,
  book: Book,
  brain: Brain,
  home: Home,
  target: Target,
};

const statColors = {
  strength: 'text-strength',
  vitality: 'text-vitality',
  agility: 'text-agility',
  intelligence: 'text-intelligence',
  mana: 'text-mana',
};

export function MissionList({ missions, onCompleteMission, isAllCompleted }: MissionListProps) {
  const completedCount = missions.filter(m => m.completed).length;
  const progressPercentage = (completedCount / missions.length) * 100;

  return (
    <Card className="magic-card">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-orbitron magic-text flex items-center">
            ⚔️ Missões Diárias
            {isAllCompleted && <Star className="w-5 h-5 ml-2 text-primary animate-pulse" />}
          </CardTitle>
          <div className="text-sm text-muted-foreground">
            {completedCount}/{missions.length}
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="space-y-2">
          <Progress value={progressPercentage} className="h-2" />
          {isAllCompleted && (
            <p className="text-sm text-primary font-medium animate-pulse">
              ✨ Todas as missões concluídas! Você é imparável!
            </p>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {missions.map((mission) => {
          const IconComponent = iconMap[mission.icon as keyof typeof iconMap] || Target;
          const statColor = statColors[mission.statReward];
          
          return (
            <div
              key={mission.id}
              className={`
                p-4 rounded-lg border transition-all duration-300
                ${mission.completed 
                  ? 'bg-primary/10 border-primary/30 opacity-75' 
                  : 'bg-muted/20 border-muted hover:border-primary/50 hover:bg-muted/30'
                }
              `}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`
                    p-2 rounded-full 
                    ${mission.completed ? 'bg-primary/20' : 'bg-muted'}
                  `}>
                    {mission.completed ? (
                      <Check className="w-5 h-5 text-primary" />
                    ) : (
                      <IconComponent className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className={`
                      font-medium
                      ${mission.completed ? 'text-primary line-through' : 'text-foreground'}
                    `}>
                      {mission.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {mission.description}
                    </p>
                    <div className="flex items-center space-x-3 text-xs mt-1">
                      <span className="text-primary">+{mission.xpReward} XP</span>
                      <span className={statColor}>
                        +{Math.floor(mission.xpReward / 10)} {mission.statReward.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
                
                {!mission.completed && (
                  <Button
                    onClick={() => onCompleteMission(mission.id)}
                    size="sm"
                    className="bg-gradient-magic hover:glow-secondary font-medium"
                  >
                    Concluir
                  </Button>
                )}
              </div>
            </div>
          );
        })}
        
        {/* Daily Complete Message */}
        {isAllCompleted && (
          <div className="text-center p-6 bg-gradient-magic/10 rounded-lg border border-primary/30">
            <div className="text-2xl mb-2">🏆</div>
            <h3 className="font-orbitron font-bold text-primary magic-text mb-1">
              DIA ÉPICO COMPLETO!
            </h3>
            <p className="text-sm text-muted-foreground">
              Você provou ser um verdadeiro caçador. Volte amanhã para novas missões!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}