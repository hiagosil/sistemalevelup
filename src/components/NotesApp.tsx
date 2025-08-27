import { useState } from 'react';
import { useNotes } from '@/hooks/useNotes';
import { Note } from '@/types/notes';
import { NoteCard } from '@/components/ui/note-card';
import { NoteDialog } from '@/components/ui/note-dialog';
import { StatsPanel } from '@/components/ui/stats-panel';
import { EmptyState } from '@/components/ui/empty-state';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Plus, Search, X } from 'lucide-react';

interface NotesAppProps {
  additionalXP?: number;
}

export function NotesApp({ additionalXP = 0 }: NotesAppProps) {
  const {
    notes,
    allNotes,
    searchQuery,
    setSearchQuery,
    isLoading,
    createNote,
    updateNote,
    deleteNote,
    stats,
  } = useNotes();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | undefined>();
  const [showStats, setShowStats] = useState(false);

  const handleCreateNote = () => {
    setEditingNote(undefined);
    setIsDialogOpen(true);
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setIsDialogOpen(true);
  };

  const handleSaveNote = (title: string, content: string, priority: Note['priority']) => {
    if (editingNote) {
      updateNote(editingNote.id, title, content, priority);
    } else {
      createNote(title, content, priority);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Carregando sistema de notas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-orbitron font-bold magic-text">
            📝 Sistema de Notas
          </h2>
          <p className="text-muted-foreground">
            Organize seus pensamentos e ganhe experiência
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowStats(!showStats)}
            size="sm"
          >
            Estatísticas
          </Button>
          {allNotes.length > 0 && (
            <Button onClick={handleCreateNote} className="font-medium">
              <Plus className="w-4 h-4 mr-2" />
              Nova Nota
            </Button>
          )}
        </div>
      </div>

      {/* Search Bar */}
      {allNotes.length > 0 && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por notas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-10"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSearch}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      )}

      {/* Content */}
      {allNotes.length === 0 ? (
        <EmptyState onCreateNote={handleCreateNote} />
      ) : notes.length === 0 && searchQuery ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Nenhuma nota encontrada</h3>
          <p className="text-muted-foreground mb-4">
            Não encontramos notas que correspondam à sua busca por "{searchQuery}".
          </p>
          <Button variant="outline" onClick={clearSearch}>
            Limpar busca
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onEdit={handleEditNote}
              onDelete={deleteNote}
            />
          ))}
        </div>
      )}

      {/* Stats Panel */}
      {showStats && <StatsPanel stats={stats} additionalXP={additionalXP} />}

      {/* Search Results Info */}
      {searchQuery && notes.length > 0 && (
        <div className="text-center text-sm text-muted-foreground">
          Encontradas {notes.length} nota(s) para "{searchQuery}"
        </div>
      )}

      {/* Note Dialog */}
      <NoteDialog
        note={editingNote}
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={handleSaveNote}
      />
    </div>
  );
}