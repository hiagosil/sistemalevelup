import { useState } from 'react';
import { useHunterRoom } from '@/hooks/useHunterRoom';
import { Goal } from '@/types/notes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  Target, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  CheckCircle, 
  XCircle,
  Clock,
  BarChart3,
  Trash2,
  Loader2
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function HunterRoom() {
  const {
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
  } = useHunterRoom();

  const [newStrength, setNewStrength] = useState('');
  const [newWeakness, setNewWeakness] = useState('');
  const [isGoalDialogOpen, setIsGoalDialogOpen] = useState(false);
  const [goalForm, setGoalForm] = useState({
    title: '',
    description: '',
    type: 'short' as Goal['type'],
  });

  const handleAddStrength = () => {
    if (newStrength.trim()) {
      addStrength(newStrength);
      setNewStrength('');
    }
  };

  const handleAddWeakness = () => {
    if (newWeakness.trim()) {
      addWeakness(newWeakness);
      setNewWeakness('');
    }
  };

  const handleCreateGoal = () => {
    if (goalForm.title.trim() && goalForm.description.trim()) {
      createGoal(goalForm.title, goalForm.description, goalForm.type);
      setGoalForm({ title: '', description: '', type: 'short' });
      setIsGoalDialogOpen(false);
    }
  };

  const getGoalTypeLabel = (type: Goal['type']) => {
    switch (type) {
      case 'short': return 'Curto Prazo';
      case 'medium': return 'Médio Prazo';
      case 'long': return 'Longo Prazo';
    }
  };

  const getStatusIcon = (status: Goal['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'abandoned': return <XCircle className="w-4 h-4 text-red-600" />;
      default: return <Clock className="w-4 h-4 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: Goal['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-300';
      case 'abandoned': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Carregando Sala do Caçador...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-orbitron font-bold magic-text">
          🏛️ Sala do Caçador
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Este é seu espaço de autodesenvolvimento. Defina objetivos, reconheça suas qualidades 
          e identifique áreas de melhoria para evoluir continuamente.
        </p>
        <div className="text-sm text-primary font-medium">
          XP da Sala do Caçador: {getHunterRoomXP()}
        </div>
      </div>

      <div className="space-y-6">
        {/* Objetivos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Objetivos
              </span>
              <Dialog open={isGoalDialogOpen} onOpenChange={setIsGoalDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Novo Objetivo
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>🎯 Definir Novo Objetivo</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="goal-title">Título</Label>
                      <Input
                        id="goal-title"
                        placeholder="Ex: Aprender React avançado"
                        value={goalForm.title}
                        onChange={(e) => setGoalForm({ ...goalForm, title: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="goal-type">Prazo</Label>
                      <Select
                        value={goalForm.type}
                        onValueChange={(value: Goal['type']) => setGoalForm({ ...goalForm, type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="short">Curto Prazo (1-3 meses)</SelectItem>
                          <SelectItem value="medium">Médio Prazo (3-12 meses)</SelectItem>
                          <SelectItem value="long">Longo Prazo (1+ anos)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="goal-description">Descrição</Label>
                      <Textarea
                        id="goal-description"
                        placeholder="Descreva seu objetivo em detalhes..."
                        value={goalForm.description}
                        onChange={(e) => setGoalForm({ ...goalForm, description: e.target.value })}
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsGoalDialogOpen(false)}>
                        Cancelar
                      </Button>
                      <Button onClick={handleCreateGoal}>
                        Criar Objetivo
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {hunterRoom.goals.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum objetivo definido ainda.</p>
                <p className="text-sm">Defina suas metas para começar sua jornada!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {hunterRoom.goals.map((goal) => (
                  <div key={goal.id} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold">{goal.title}</h4>
                          <Badge className={`text-xs ${getStatusColor(goal.status)}`}>
                            {getStatusIcon(goal.status)}
                            <span className="ml-1">
                              {goal.status === 'progress' && 'Em Andamento'}
                              {goal.status === 'completed' && 'Concluído'}
                              {goal.status === 'abandoned' && 'Abandonado'}
                            </span>
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {getGoalTypeLabel(goal.type)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{goal.description}</p>
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Criado {formatDistanceToNow(new Date(goal.createdAt), { addSuffix: true, locale: ptBR })}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        {goal.status === 'progress' && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateGoalStatus(goal.id, 'completed')}
                              className="text-green-600 hover:bg-green-50"
                            >
                              Concluir
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateGoalStatus(goal.id, 'abandoned')}
                              className="text-red-600 hover:bg-red-50"
                            >
                              Abandonar
                            </Button>
                          </>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteGoal(goal.id)}
                          className="hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pontos Fortes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              Pontos Fortes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Ex: Disciplina, Criatividade, Liderança..."
                value={newStrength}
                onChange={(e) => setNewStrength(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddStrength()}
              />
              <Button onClick={handleAddStrength} disabled={!newStrength.trim()}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            
            {hunterRoom.strengths.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50 text-green-600" />
                <p>Reconheça suas qualidades e pontos fortes.</p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {hunterRoom.strengths.map((strength, index) => (
                  <Badge
                    key={index}
                    className="bg-green-100 text-green-800 border-green-300 px-3 py-1"
                  >
                    {strength}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeStrength(index)}
                      className="ml-2 h-4 w-4 p-0 hover:bg-green-200"
                    >
                      ×
                    </Button>
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pontos Fracos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-red-600" />
              Pontos Fracos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Ex: Procrastinação, Impaciência, Desorganização..."
                value={newWeakness}
                onChange={(e) => setNewWeakness(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddWeakness()}
              />
              <Button onClick={handleAddWeakness} disabled={!newWeakness.trim()}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            
            {hunterRoom.weaknesses.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <TrendingDown className="w-12 h-12 mx-auto mb-4 opacity-50 text-red-600" />
                <p>Identifique áreas que precisam de melhoria.</p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {hunterRoom.weaknesses.map((weakness, index) => (
                  <Badge
                    key={index}
                    className="bg-red-100 text-red-800 border-red-300 px-3 py-1"
                  >
                    {weakness}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeWeakness(index)}
                      className="ml-2 h-4 w-4 p-0 hover:bg-red-200"
                    >
                      ×
                    </Button>
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Relatórios */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Relatórios
              </span>
              <Button onClick={generateWeeklyReport} size="sm">
                Gerar Relatório
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {hunterRoom.weeklyReports.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum relatório gerado ainda.</p>
                <p className="text-sm">Gere seu primeiro relatório semanal!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {hunterRoom.weeklyReports.slice().reverse().map((report) => (
                  <div key={report.id} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">
                        Semana de {new Date(report.week).toLocaleDateString('pt-BR')}
                      </h4>
                      <Badge variant="outline">
                        {report.missionCompletionRate}% concluído
                      </Badge>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <h5 className="font-medium mb-2">Picos de Produtividade:</h5>
                        <ul className="space-y-1 text-muted-foreground">
                          {report.productivityPeaks.map((peak, index) => (
                            <li key={index}>• {peak}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h5 className="font-medium mb-2">Recomendações:</h5>
                        <ul className="space-y-1 text-muted-foreground">
                          {report.recommendations.map((rec, index) => (
                            <li key={index}>• {rec}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

    </div>
  );
}