import { Note } from '@/types/notes';
import { RANK_LABELS, RANK_COLORS } from '@/types/notes';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
}

export function NoteCard({ note, onEdit, onDelete }: NoteCardProps) {
  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: ptBR,
      });
    } catch {
      return 'Data inválida';
    }
  };

  const getRankColorClasses = (rank: string) => {
    switch (rank) {
      case 'S': return 'bg-red-500/10 border-red-500/30 text-red-700';
      case 'A': return 'bg-orange-500/10 border-orange-500/30 text-orange-700';
      case 'B': return 'bg-yellow-500/10 border-yellow-500/30 text-yellow-700';
      case 'C': return 'bg-green-500/10 border-green-500/30 text-green-700';
      case 'D': return 'bg-blue-500/10 border-blue-500/30 text-blue-700';
      case 'E': return 'bg-gray-500/10 border-gray-500/30 text-gray-700';
      default: return 'bg-gray-500/10 border-gray-500/30 text-gray-700';
    }
  };

  return (
    <Card className="group hover:shadow-glow-primary transition-all duration-300 hover:-translate-y-1 magic-card">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg truncate group-hover:text-primary transition-colors">
              {note.title}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge className={`text-xs border ${getRankColorClasses(note.priority)}`}>
                {note.priority} - {RANK_LABELS[note.priority]}
              </Badge>
            </div>
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(note)}
              className="h-8 w-8 p-0 hover:bg-primary/10"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(note.id)}
              className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <p className="text-muted-foreground text-sm mb-3 leading-relaxed">
          {truncateContent(note.content)}
        </p>
        
        <div className="flex items-center text-xs text-muted-foreground gap-1">
          <Calendar className="h-3 w-3" />
          <span>{formatDate(note.updatedAt)}</span>
        </div>
      </CardContent>
    </Card>
  );
}