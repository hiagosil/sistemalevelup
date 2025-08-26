import { useState, useEffect } from 'react';
import { Note, NoteRank, RANK_LABELS } from '@/types/notes';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus } from 'lucide-react';

interface NoteDialogProps {
  note?: Note;
  trigger?: React.ReactNode;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (title: string, content: string, priority: NoteRank) => void;
}

export function NoteDialog({ note, trigger, isOpen, onOpenChange, onSave }: NoteDialogProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState<NoteRank>('C');
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setPriority(note.priority);
    } else {
      setTitle('');
      setContent('');
      setPriority('C');
    }
  }, [note, isOpen]);

  useEffect(() => {
    const words = content.trim() ? content.trim().split(/\s+/).length : 0;
    setWordCount(words);
    setCharCount(content.length);
  }, [content]);

  const handleSave = () => {
    if (!title.trim() || !content.trim()) return;
    
    onSave(title, content, priority);
    onOpenChange(false);
    
    if (!note) {
      // Reset form for new notes
      setTitle('');
      setContent('');
      setPriority('C');
    }
  };

  const isFormValid = title.trim().length > 0 && content.trim().length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-orbitron magic-text">
            {note ? '✏️ Editar Nota' : '📝 Nova Nota'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              placeholder="Digite o título da nota..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="font-medium"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="priority">Prioridade</Label>
            <Select value={priority} onValueChange={(value: NoteRank) => setPriority(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a prioridade" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(RANK_LABELS).map(([rank, label]) => (
                  <SelectItem key={rank} value={rank}>
                    <span className="flex items-center gap-2">
                      <span className="font-mono font-bold">{rank}</span>
                      <span>- {label}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="content">Conteúdo</Label>
              <div className="text-xs text-muted-foreground flex gap-4">
                <span>{wordCount} palavras</span>
                <span>{charCount} caracteres</span>
              </div>
            </div>
            <Textarea
              id="content"
              placeholder="Escreva o conteúdo da sua nota aqui..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[200px] resize-none"
            />
          </div>
          
          {/* XP Preview */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
            <div className="text-sm text-muted-foreground mb-1">
              Experiência estimada:
            </div>
            <div className="text-lg font-bold text-primary">
              +{wordCount * 5} XP
            </div>
            <div className="text-xs text-muted-foreground">
              {wordCount} palavras × 5 XP cada
            </div>
          </div>
        </div>
        
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSave}
            disabled={!isFormValid}
            className="font-medium"
          >
            {note ? 'Atualizar' : 'Criar'} Nota
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}