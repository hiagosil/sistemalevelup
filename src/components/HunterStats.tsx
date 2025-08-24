import { HunterStats as StatsType } from '@/types/game';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  Sword, 
  Heart, 
  Zap, 
  Brain, 
  Sparkles
} from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';

interface HunterStatsProps {
  stats: StatsType;
}

const statConfig = {
  strength: {
    icon: Sword,
    label: 'Força',
    color: 'strength',
    description: 'Poder físico e resistência'
  },
  vitality: {
    icon: Heart,
    label: 'Vitalidade',
    color: 'vitality',
    description: 'Saúde e energia vital'
  },
  agility: {
    icon: Zap,
    label: 'Agilidade',
    color: 'agility',
    description: 'Velocidade e reflexos'
  },
  intelligence: {
    icon: Brain,
    label: 'Inteligência',
    color: 'intelligence',
    description: 'Conhecimento e estratégia'
  },
  mana: {
    icon: Sparkles,
    label: 'Mana',
    color: 'mana',
    description: 'Energia mágica e foco'
  },
};

export function HunterStats({ stats }: HunterStatsProps) {
  const maxStat = Math.max(...Object.values(stats));
  const totalPower = Object.values(stats).reduce((sum, stat) => sum + stat, 0);

  // Preparar dados para o gráfico radar
  const radarData = Object.entries(stats).map(([statKey, value]) => ({
    stat: statConfig[statKey as keyof typeof statConfig].label,
    value: value,
    fullMark: Math.max(100, maxStat * 1.2) // Escala dinâmica
  }));

  return (
    <Card className="magic-card">
      <CardHeader>
        <CardTitle className="text-xl font-orbitron magic-text flex items-center">
          📊 Status do Caçador
        </CardTitle>
        <div className="text-sm text-muted-foreground">
          Poder Total: <span className="text-primary font-bold">{totalPower}</span>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Gráfico Radar */}
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis 
                dataKey="stat" 
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              />
              <PolarRadiusAxis 
                angle={90} 
                domain={[0, 'dataMax']} 
                tick={false}
                tickCount={5}
              />
              <Radar 
                name="Stats" 
                dataKey="value" 
                stroke="hsl(var(--primary))" 
                fill="hsl(var(--primary))" 
                fillOpacity={0.3}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Stats Detalhados */}
        <div className="grid gap-3">
          {Object.entries(stats).map(([statKey, value]) => {
            const config = statConfig[statKey as keyof typeof statConfig];
            const IconComponent = config.icon;
            
            return (
              <div key={statKey} className="flex items-center justify-between p-2 rounded-lg bg-background/50">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full bg-${config.color}/20`}>
                    <IconComponent className={`w-4 h-4 text-${config.color}`} />
                  </div>
                  <span className="font-medium text-sm">
                    {config.label}
                  </span>
                </div>
                <div className={`text-lg font-bold text-${config.color}`}>
                  {value}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Power Level Indicator */}
        <div className="pt-4 border-t border-border">
          <div className="text-center p-4 bg-gradient-magic/10 rounded-lg border border-primary/20">
            <div className="text-sm text-muted-foreground mb-1">
              Nível de Poder
            </div>
            <div className="text-2xl font-orbitron font-bold text-primary magic-text">
              {totalPower.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {totalPower < 100 && "Caçador Iniciante"}
              {totalPower >= 100 && totalPower < 200 && "Caçador Competente"}
              {totalPower >= 200 && totalPower < 350 && "Caçador Veterano"}
              {totalPower >= 350 && totalPower < 500 && "Caçador Elite"}
              {totalPower >= 500 && "Caçador Lendário"}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}