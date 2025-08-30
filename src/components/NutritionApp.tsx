import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  Calculator, 
  Target, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  Coffee,
  Sun,
  Moon,
  Apple
} from 'lucide-react';

interface NutritionData {
  height: number;
  weight: number;
  age: number;
  gender: 'male' | 'female';
  financialCondition: 'low' | 'medium' | 'high';
  goal: 'gain' | 'lose';
  targetWeight: number;
}

interface MealPlan {
  breakfast: string[];
  lunch: string[];
  dinner: string[];
  snacks: string[];
}

const mealSuggestions = {
  low: {
    breakfast: ['Aveia com banana', 'Pão integral com ovo', 'Vitamina de banana com leite'],
    lunch: ['Arroz, feijão e frango desfiado', 'Macarrão com sardinha', 'Sopa de legumes'],
    dinner: ['Ovos mexidos com batata', 'Sopa de feijão', 'Arroz com ovo frito'],
    snacks: ['Banana', 'Biscoito de polvilho', 'Água com limão']
  },
  medium: {
    breakfast: ['Granola com iogurte', 'Sanduíche natural', 'Smoothie de frutas'],
    lunch: ['Salmão grelhado com batata doce', 'Peito de frango com quinoa', 'Salada completa'],
    dinner: ['Omelete com vegetais', 'Peixe grelhado com legumes', 'Wrap integral'],
    snacks: ['Mix de castanhas', 'Iogurte grego', 'Frutas vermelhas']
  },
  high: {
    breakfast: ['Açaí bowl gourmet', 'Croissant integral com salmão', 'Smoothie detox premium'],
    lunch: ['Filé mignon com aspargos', 'Bacalhau com azeite especial', 'Salada caesar gourmet'],
    dinner: ['Sushi variado', 'Cordeiro com ervas', 'Risotto de camarão'],
    snacks: ['Pistache', 'Chocolate 70% cacau', 'Smoothie proteico']
  }
};

export function NutritionApp() {
  const [nutritionData, setNutritionData] = useState<NutritionData>({
    height: 0,
    weight: 0,
    age: 0,
    gender: 'male',
    financialCondition: 'medium',
    goal: 'lose',
    targetWeight: 0
  });

  const [showResults, setShowResults] = useState(false);
  const [bmi, setBmi] = useState(0);
  const [bmiCategory, setBmiCategory] = useState('');
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);

  const calculateBMI = () => {
    if (nutritionData.height > 0 && nutritionData.weight > 0) {
      const heightInMeters = nutritionData.height / 100;
      const calculatedBMI = nutritionData.weight / (heightInMeters * heightInMeters);
      setBmi(calculatedBMI);
      
      if (calculatedBMI < 18.5) setBmiCategory('Abaixo do peso');
      else if (calculatedBMI < 25) setBmiCategory('Peso ideal');
      else if (calculatedBMI < 30) setBmiCategory('Sobrepeso');
      else setBmiCategory('Obesidade');
    }
  };

  const generateMealPlan = () => {
    const suggestions = mealSuggestions[nutritionData.financialCondition];
    setMealPlan(suggestions);
  };

  const handleSubmit = () => {
    calculateBMI();
    generateMealPlan();
    setShowResults(true);
  };

  const getBMIColor = () => {
    if (bmi < 18.5) return 'text-intelligence';
    if (bmi < 25) return 'text-vitality';
    if (bmi < 30) return 'text-agility';
    return 'text-strength';
  };

  const getProgressPercentage = () => {
    if (nutritionData.targetWeight === 0) return 0;
    const totalChange = Math.abs(nutritionData.targetWeight - nutritionData.weight);
    const currentProgress = Math.abs(nutritionData.weight - nutritionData.weight);
    return Math.min((currentProgress / totalChange) * 100, 100);
  };

  const shouldShowMedicalAlert = () => {
    return bmi < 16 || bmi > 35;
  };

  return (
    <div className="space-y-4">
      <Card className="magic-card">
        <CardHeader>
          <CardTitle className="text-lg font-orbitron magic-text flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Calculadora Nutricional
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="height" className="text-sm">Altura (cm)</Label>
              <Input
                id="height"
                type="number"
                value={nutritionData.height || ''}
                onChange={(e) => setNutritionData(prev => ({ ...prev, height: Number(e.target.value) }))}
                className="text-sm"
              />
            </div>
            <div>
              <Label htmlFor="weight" className="text-sm">Peso (kg)</Label>
              <Input
                id="weight"
                type="number"
                value={nutritionData.weight || ''}
                onChange={(e) => setNutritionData(prev => ({ ...prev, weight: Number(e.target.value) }))}
                className="text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="age" className="text-sm">Idade</Label>
              <Input
                id="age"
                type="number"
                value={nutritionData.age || ''}
                onChange={(e) => setNutritionData(prev => ({ ...prev, age: Number(e.target.value) }))}
                className="text-sm"
              />
            </div>
            <div>
              <Label className="text-sm">Sexo</Label>
              <Select value={nutritionData.gender} onValueChange={(value: 'male' | 'female') => 
                setNutritionData(prev => ({ ...prev, gender: value }))
              }>
                <SelectTrigger className="text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Masculino</SelectItem>
                  <SelectItem value="female">Feminino</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label className="text-sm">Condição Financeira</Label>
            <Select value={nutritionData.financialCondition} onValueChange={(value: 'low' | 'medium' | 'high') => 
              setNutritionData(prev => ({ ...prev, financialCondition: value }))
            }>
              <SelectTrigger className="text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Baixa</SelectItem>
                <SelectItem value="medium">Média</SelectItem>
                <SelectItem value="high">Alta</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-sm">Objetivo</Label>
              <Select value={nutritionData.goal} onValueChange={(value: 'gain' | 'lose') => 
                setNutritionData(prev => ({ ...prev, goal: value }))
              }>
                <SelectTrigger className="text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lose">Perder peso</SelectItem>
                  <SelectItem value="gain">Ganhar peso</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="targetWeight" className="text-sm">Meta de peso (kg)</Label>
              <Input
                id="targetWeight"
                type="number"
                value={nutritionData.targetWeight || ''}
                onChange={(e) => setNutritionData(prev => ({ ...prev, targetWeight: Number(e.target.value) }))}
                className="text-sm"
              />
            </div>
          </div>

          <Button 
            onClick={handleSubmit} 
            className="w-full"
            disabled={!nutritionData.height || !nutritionData.weight || !nutritionData.targetWeight}
          >
            Gerar Plano Nutricional
          </Button>
        </CardContent>
      </Card>

      {showResults && (
        <>
          {/* IMC Results */}
          <Card className="magic-card">
            <CardHeader>
              <CardTitle className="text-lg font-orbitron magic-text">Resultado do IMC</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-2">
                <div className={`text-3xl font-bold ${getBMIColor()}`}>
                  {bmi.toFixed(1)}
                </div>
                <Badge variant="outline" className={getBMIColor()}>
                  {bmiCategory}
                </Badge>
              </div>

              {shouldShowMedicalAlert() && (
                <Alert className="mt-4 border-destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Recomendamos procurar acompanhamento médico profissional devido ao seu IMC atual.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Progress */}
          <Card className="magic-card">
            <CardHeader>
              <CardTitle className="text-lg font-orbitron magic-text flex items-center gap-2">
                <Target className="w-5 h-5" />
                Progresso do Objetivo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Peso atual: {nutritionData.weight}kg</span>
                  <span>Meta: {nutritionData.targetWeight}kg</span>
                </div>
                <Progress value={getProgressPercentage()} className="h-2" />
                <div className="text-center text-sm text-muted-foreground">
                  {nutritionData.goal === 'lose' ? (
                    <span className="flex items-center justify-center gap-1">
                      <TrendingDown className="w-4 h-4" />
                      Faltam {(nutritionData.weight - nutritionData.targetWeight).toFixed(1)}kg para atingir sua meta
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      Faltam {(nutritionData.targetWeight - nutritionData.weight).toFixed(1)}kg para atingir sua meta
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Meal Plan */}
          {mealPlan && (
            <Card className="magic-card">
              <CardHeader>
                <CardTitle className="text-lg font-orbitron magic-text">Plano Alimentar</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Coffee className="w-4 h-4 text-agility" />
                        <h4 className="font-semibold text-sm">Café da Manhã</h4>
                      </div>
                    <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                      {mealPlan.breakfast.map((meal, index) => (
                        <li key={index}>• {meal}</li>
                      ))}
                    </ul>
                  </div>

                  <Separator />

                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Sun className="w-4 h-4 text-agility" />
                        <h4 className="font-semibold text-sm">Almoço</h4>
                      </div>
                    <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                      {mealPlan.lunch.map((meal, index) => (
                        <li key={index}>• {meal}</li>
                      ))}
                    </ul>
                  </div>

                  <Separator />

                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Moon className="w-4 h-4 text-intelligence" />
                        <h4 className="font-semibold text-sm">Jantar</h4>
                      </div>
                    <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                      {mealPlan.dinner.map((meal, index) => (
                        <li key={index}>• {meal}</li>
                      ))}
                    </ul>
                  </div>

                  <Separator />

                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Apple className="w-4 h-4 text-vitality" />
                        <h4 className="font-semibold text-sm">Lanches</h4>
                      </div>
                    <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                      {mealPlan.snacks.map((meal, index) => (
                        <li key={index}>• {meal}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}