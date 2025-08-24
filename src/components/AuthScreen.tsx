import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface AuthScreenProps {
  onCreateHunter: (name: string, age: number, weight: number) => void;
}

export function AuthScreen({ onCreateHunter }: AuthScreenProps) {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    weight: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.age && formData.weight) {
      onCreateHunter(
        formData.name,
        parseInt(formData.age),
        parseFloat(formData.weight)
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-primary/5 rounded-full blur-2xl animate-pulse delay-1000" />
      
      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-orbitron font-black text-primary magic-text mb-2">
            SISTEMA LEVEL UP
          </h1>
          <p className="text-muted-foreground text-lg">
            Sua jornada épica começa aqui
          </p>
        </div>

        <Card className="magic-card-intense">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-orbitron magic-text">
              ⚔️ Registro de Caçador
            </CardTitle>
            <CardDescription>
              Desperte seus poderes e transforme-se em um verdadeiro caçador
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-primary font-medium">
                  Nome do Caçador
                </Label>
                <Input
                  id="name"
                  placeholder="Digite seu nome épico..."
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="bg-muted border-primary/30 focus:border-primary glow-secondary"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age" className="text-primary font-medium">
                    Idade
                  </Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="25"
                    value={formData.age}
                    onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                    className="bg-muted border-primary/30 focus:border-primary"
                    required
                    min="13"
                    max="100"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weight" className="text-primary font-medium">
                    Peso (kg)
                  </Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.1"
                    placeholder="70.0"
                    value={formData.weight}
                    onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                    className="bg-muted border-primary/30 focus:border-primary"
                    required
                    min="30"
                    max="300"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-magic hover:glow-primary font-orbitron font-bold text-lg py-6 relative overflow-hidden group"
              >
                <span className="relative z-10">✨ DESPERTAR PODERES</span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary-glow to-primary opacity-0 group-hover:opacity-20 transition-opacity" />
              </Button>
            </form>

            <div className="mt-6 p-4 bg-muted/30 rounded-lg border border-primary/20">
              <p className="text-sm text-muted-foreground text-center">
                <span className="text-primary">💡 Dica:</span> Seus dados ficam salvos localmente e seguros
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer Quote */}
        <div className="text-center mt-8 p-4">
          <blockquote className="text-primary/80 italic font-medium">
            "A força não vem da capacidade física. Vem de uma vontade indomável."
          </blockquote>
        </div>
      </div>
    </div>
  );
}