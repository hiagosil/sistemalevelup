import { Button } from '@/components/ui/button';
import { FileText, Plus } from 'lucide-react';

interface EmptyStateProps {
  onCreateNote: () => void;
}

export function EmptyState({ onCreateNote }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="relative mb-6">
        <div className="w-24 h-24 bg-gradient-magic/20 rounded-full flex items-center justify-center border-2 border-primary/20">
          <FileText className="w-12 h-12 text-primary/60" />
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center animate-bounce">
          <Plus className="w-4 h-4 text-primary-foreground" />
        </div>
      </div>
      
      <h3 className="text-2xl font-orbitron font-bold text-foreground mb-2">
        Sistema de Notas Vazio
      </h3>
      
      <p className="text-muted-foreground mb-6 max-w-md leading-relaxed">
        Seja bem-vindo ao sistema de notas gamificado! Aqui você pode organizar seus pensamentos, 
        ganhar experiência e evoluir como um verdadeiro caçador do conhecimento.
      </p>
      
      <div className="space-y-4">
        <Button 
          onClick={onCreateNote}
          className="font-medium px-6 py-3 text-base"
          size="lg"
        >
          <Plus className="w-5 h-5 mr-2" />
          Criar Primeira Nota
        </Button>
        
        <div className="text-sm text-muted-foreground space-y-1">
          <p>💡 Cada palavra escrita gera 5 XP</p>
          <p>⭐ Use rankings para organizar por prioridade</p>
          <p>🚀 Acesse a Sala do Caçador para autoavaliação</p>
        </div>
      </div>
    </div>
  );
}