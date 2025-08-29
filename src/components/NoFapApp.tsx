import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Trophy, Shield, Target, Flame, Clock, AlertTriangle, RefreshCw, Crown, Star, Zap, Award, Swords, Medal } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface NoFapData {
  isActive: boolean;
  startTime: number;
  streakDays: number;
  bestStreak: number;
  totalResets: number;
}

const MOTIVATIONAL_QUOTES = [
  "A disciplina é a ponte entre metas e realizações.",
  "Sua força de vontade é seu maior poder.",
  "Todo dia vencido é uma vitória épica.",
  "Controle seus impulsos, domine seu destino.",
  "Caçadores verdadeiros têm autocontrole.",
  "A verdadeira força vem do autodomínio.",
  "Cada segundo de resistência te torna mais forte.",
];

const STREAK_LEVELS = [
  { days: 0, title: "Iniciante", color: "text-muted-foreground", icon: Shield },
  { days: 3, title: "Determinado", color: "text-blue-400", icon: Target },
  { days: 7, title: "Guerreiro", color: "text-green-400", icon: Swords },
  { days: 14, title: "Disciplinado", color: "text-yellow-400", icon: Medal },
  { days: 30, title: "Mestre", color: "text-purple-400", icon: Crown },
  { days: 60, title: "Lendário", color: "text-orange-400", icon: Flame },
  { days: 90, title: "Transcendente", color: "text-primary", icon: Star },
  { days: 365, title: "Imortal", color: "text-vitality", icon: Trophy },
];

export function NoFapApp() {
  const [noFapData, setNoFapData] = useState<NoFapData>(() => {
    const saved = localStorage.getItem('nofap-data');
    return saved ? JSON.parse(saved) : {
      isActive: false,
      startTime: 0,
      streakDays: 0,
      bestStreak: 0,
      totalResets: 0,
    };
  });

  const [currentTime, setCurrentTime] = useState(Date.now());
  const { toast } = useToast();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    localStorage.setItem('nofap-data', JSON.stringify(noFapData));
  }, [noFapData]);

  const timeElapsed = noFapData.isActive ? currentTime - noFapData.startTime : 0;
  const days = Math.floor(timeElapsed / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeElapsed % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeElapsed % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeElapsed % (1000 * 60)) / 1000);

  const currentLevel = STREAK_LEVELS.slice().reverse().find(level => days >= level.days) || STREAK_LEVELS[0];
  const nextLevel = STREAK_LEVELS.find(level => days < level.days);
  const progressToNext = nextLevel ? (days / nextLevel.days) * 100 : 100;

  const fixedQuote = "A disciplina é a ponte entre metas e realizações.";

  const startChallenge = () => {
    setNoFapData({
      ...noFapData,
      isActive: true,
      startTime: Date.now(),
      streakDays: 0,
    });
    toast({
      title: "🚀 Desafio Iniciado!",
      description: "Sua jornada de autodisciplina começou. Mantenha-se forte!",
    });
  };

  const resetChallenge = () => {
    const currentDays = days;
    setNoFapData({
      ...noFapData,
      isActive: false,
      startTime: 0,
      streakDays: 0,
      bestStreak: Math.max(noFapData.bestStreak, currentDays),
      totalResets: noFapData.totalResets + 1,
    });
    
    // Penalidade aplicada
    toast({
      title: "💔 Recaída Detectada",
      description: `Seu streak de ${currentDays} dias foi perdido. Mas não desista!`,
      variant: "destructive",
    });
  };

  if (!noFapData.isActive) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <Card className="magic-card-intense border-primary/30">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-orbitron magic-text flex items-center justify-center gap-2">
              <Shield className="w-6 h-6 text-primary" />
              DESAFIO NOFAP
            </CardTitle>
            <p className="text-muted-foreground">
              Teste sua disciplina e autocontrole nesta jornada épica
            </p>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <Shield className="w-24 h-24 text-primary mx-auto mb-4" />
            
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-primary">Pronto para o desafio?</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Prove que você tem o controle total sobre si mesmo. 
                Cada dia vencido é uma vitória contra seus impulsos.
              </p>
              
              {(noFapData.bestStreak > 0 || noFapData.totalResets > 0) && (
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="text-center p-3 bg-muted/30 rounded-lg">
                    <Trophy className="w-5 h-5 text-vitality mx-auto mb-2" />
                    <div className="text-sm text-muted-foreground">Melhor Streak</div>
                    <div className="text-xl font-bold text-vitality">{noFapData.bestStreak} dias</div>
                  </div>
                  <div className="text-center p-3 bg-muted/30 rounded-lg">
                    <RefreshCw className="w-5 h-5 text-destructive mx-auto mb-2" />
                    <div className="text-sm text-muted-foreground">Tentativas</div>
                    <div className="text-xl font-bold text-muted-foreground">{noFapData.totalResets + 1}</div>
                  </div>
                </div>
              )}

              <Button
                onClick={startChallenge}
                className="w-full bg-gradient-magic hover:glow-primary font-orbitron font-bold text-lg py-6"
              >
                <Shield className="w-5 h-5 mr-2" />
                INICIAR NOFAP
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Motivational Quote */}
        <Card className="border-primary/20">
          <CardContent className="p-4 text-center">
            <blockquote className="text-primary italic font-medium">
              "{fixedQuote}"
            </blockquote>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Streak Display */}
      <Card className="magic-card-intense border-primary/30">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Flame className="w-6 h-6 text-primary" />
            <CardTitle className="text-2xl font-orbitron magic-text">
              STREAK ATIVO
            </CardTitle>
          </div>
          <Badge variant="outline" className={`${currentLevel.color} border-current flex items-center gap-1`}>
            <currentLevel.icon className="w-4 h-4" />
            {currentLevel.title}
          </Badge>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Time Counter */}
          <div className="text-center">
            <div className="text-4xl font-orbitron font-black text-primary magic-text mb-2">
              {days} DIAS
            </div>
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div className="text-center p-2 bg-muted/30 rounded">
                <Clock className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
                <div className="font-mono text-lg">{hours.toString().padStart(2, '0')}</div>
                <div className="text-xs text-muted-foreground">horas</div>
              </div>
              <div className="text-center p-2 bg-muted/30 rounded">
                <Clock className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
                <div className="font-mono text-lg">{minutes.toString().padStart(2, '0')}</div>
                <div className="text-xs text-muted-foreground">min</div>
              </div>
              <div className="text-center p-2 bg-muted/30 rounded">
                <Clock className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
                <div className="font-mono text-lg">{seconds.toString().padStart(2, '0')}</div>
                <div className="text-xs text-muted-foreground">seg</div>
              </div>
            </div>
          </div>

          {/* Progress to Next Level */}
          {nextLevel && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Próximo nível: {nextLevel.title}</span>
                <span className="text-primary">{days}/{nextLevel.days} dias</span>
              </div>
              <Progress value={progressToNext} className="h-3" />
            </div>
          )}

          <Separator />

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <Target className="w-5 h-5 text-intelligence mx-auto mb-2" />
              <div className="text-sm text-muted-foreground">Atual</div>
              <div className="text-xl font-bold text-primary">{days} dias</div>
            </div>
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <Trophy className="w-5 h-5 text-vitality mx-auto mb-2" />
              <div className="text-sm text-muted-foreground">Recorde</div>
              <div className="text-xl font-bold text-vitality">{Math.max(noFapData.bestStreak, days)} dias</div>
            </div>
          </div>

          {/* Warning for Reset */}
          <Card className="border-destructive/30 bg-destructive/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-destructive" />
                <span className="text-sm font-medium text-destructive">Zona de Perigo</span>
              </div>
              <p className="text-xs text-muted-foreground mb-3">
                Use este botão apenas se você realmente quebrou o desafio. 
                Isso irá resetar todo o seu progresso atual.
              </p>
              <Button
                onClick={resetChallenge}
                variant="destructive"
                size="sm"
                className="w-full"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                RECOMEÇAR DESAFIO
              </Button>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      {/* Motivational Section */}
      <Card className="border-primary/20">
        <CardContent className="p-4 text-center">
          <Zap className="w-8 h-8 text-primary mx-auto mb-2" />
          <blockquote className="text-primary italic font-medium mb-2">
            "{fixedQuote}"
          </blockquote>
          <p className="text-xs text-muted-foreground">
            Cada segundo que passa é uma prova da sua força interior.
          </p>
        </CardContent>
      </Card>

      {/* Achievement Milestones */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-orbitron flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" />
            Marcos de Conquista
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {STREAK_LEVELS.map((level, index) => {
              const IconComponent = level.icon;
              return (
                <div key={index} className="flex items-center gap-3 p-2 rounded-lg bg-muted/20">
                  <IconComponent className={`w-6 h-6 ${level.days <= days ? level.color : 'text-muted-foreground'}`} />
                  <div className="flex-1">
                    <div className={`font-medium ${level.days <= days ? level.color : 'text-muted-foreground'}`}>
                      {level.title}
                    </div>
                    <div className="text-xs text-muted-foreground">{level.days} dias</div>
                  </div>
                  {level.days <= days && (
                    <Badge variant="outline" className="text-primary border-primary">
                      ✓ Conquistado
                    </Badge>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}