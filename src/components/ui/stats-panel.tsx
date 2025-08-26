import { NotesStats } from '@/types/notes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  FileText, 
  Zap, 
  Target, 
  Clock, 
  Calendar,
  TrendingUp,
  Star
} from 'lucide-react';

interface StatsPanelProps {
  stats: NotesStats;
  additionalXP?: number;
}

export function StatsPanel({ stats, additionalXP = 0 }: StatsPanelProps) {
  const totalXP = stats.exp + additionalXP;
  const totalLevel = Math.floor(totalXP / 500) + 1;
  const currentLevelXP = totalXP % 500;
  const progressToNextLevel = (currentLevelXP / 500) * 100;

  const statItems = [
    {
      icon: FileText,
      label: 'Total de Notas',
      value: stats.totalNotes,
      color: 'text-blue-600',
      bg: 'bg-blue-100'
    },
    {
      icon: Zap,
      label: 'Palavras Escritas',
      value: stats.totalWords.toLocaleString(),
      color: 'text-yellow-600',
      bg: 'bg-yellow-100'
    },
    {
      icon: Calendar,
      label: 'Dias Ativos',
      value: stats.activeDays,
      color: 'text-green-600',
      bg: 'bg-green-100'
    },
    {
      icon: TrendingUp,
      label: 'Notas/Dia',
      value: stats.notesPerDay,
      color: 'text-purple-600',
      bg: 'bg-purple-100'
    },
    {
      icon: Clock,
      label: 'Tempo Estimado',
      value: `${stats.estimatedTime}min`,
      color: 'text-orange-600',
      bg: 'bg-orange-100'
    },
  ];

  return (
    <Card className="magic-card">
      <CardHeader>
        <CardTitle className="text-xl font-orbitron magic-text flex items-center">
          📊 Estatísticas do Caçador
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Level e XP */}
        <div className="bg-gradient-magic/10 rounded-lg p-4 border border-primary/20">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-primary" />
              <span className="font-orbitron font-bold text-lg">
                Nível {totalLevel}
              </span>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">
                {totalXP.toLocaleString()} XP
              </div>
              {additionalXP > 0 && (
                <div className="text-xs text-muted-foreground">
                  (+{additionalXP} da Sala do Caçador)
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Progresso para Nível {totalLevel + 1}</span>
              <span>{currentLevelXP}/500 XP</span>
            </div>
            <Progress value={progressToNextLevel} className="h-2" />
          </div>
        </div>

        {/* Grid de Estatísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {statItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div 
                key={index}
                className="bg-background/50 rounded-lg p-3 border border-border hover:border-primary/30 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${item.bg}`}>
                    <IconComponent className={`w-4 h-4 ${item.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-muted-foreground truncate">
                      {item.label}
                    </div>
                    <div className="text-lg font-bold text-foreground">
                      {item.value}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Power Level Indicator */}
        <div className="text-center p-4 bg-gradient-power/10 rounded-lg border border-primary/20">
          <div className="text-sm text-muted-foreground mb-1">
            Classificação de Produtividade
          </div>
          <div className="text-xl font-orbitron font-bold text-primary magic-text">
            {totalXP < 500 && "Escriba Iniciante"}
            {totalXP >= 500 && totalXP < 1500 && "Escriba Competente"}
            {totalXP >= 1500 && totalXP < 3000 && "Escriba Veterano"}
            {totalXP >= 3000 && totalXP < 5000 && "Escriba Elite"}
            {totalXP >= 5000 && "Lenda dos Manuscritos"}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Continue escrevendo para evoluir ainda mais!
          </div>
        </div>
      </CardContent>
    </Card>
  );
}