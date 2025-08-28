import { useState, useEffect } from 'react';
import { Note, NotesStats, NoteRank } from '@/types/notes';
import { useToast } from '@/hooks/use-toast';

const NOTES_STORAGE_KEY = 'solo-leveling-notes';

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = () => {
    try {
      const savedNotes = localStorage.getItem(NOTES_STORAGE_KEY);
      if (savedNotes) {
        const parsedNotes = JSON.parse(savedNotes);
        setNotes(parsedNotes);
      }
    } catch (error) {
      console.error('Erro ao carregar notas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveNotes = (notesToSave: Note[]) => {
    try {
      localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notesToSave));
    } catch (error) {
      console.error('Erro ao salvar notas:', error);
    }
  };

  const createNote = (title: string, content: string, priority: NoteRank) => {
    const newNote: Note = {
      id: crypto.randomUUID(),
      title: title.trim(),
      content: content.trim(),
      priority,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedNotes = [...notes, newNote];
    setNotes(updatedNotes);
    saveNotes(updatedNotes);

    toast({
      title: "📝 Nova nota adicionada ao sistema",
      description: `Nota "${title}" criada com prioridade ${priority}`,
    });

    return newNote;
  };

  const updateNote = (id: string, title: string, content: string, priority: NoteRank) => {
    const updatedNotes = notes.map(note =>
      note.id === id
        ? {
            ...note,
            title: title.trim(),
            content: content.trim(),
            priority,
            updatedAt: new Date().toISOString(),
          }
        : note
    );

    setNotes(updatedNotes);
    saveNotes(updatedNotes);

    toast({
      title: "✨ Nota atualizada",
      description: `As alterações foram salvas no sistema`,
    });
  };

  const deleteNote = (id: string) => {
    const noteToDelete = notes.find(note => note.id === id);
    const updatedNotes = notes.filter(note => note.id !== id);
    
    setNotes(updatedNotes);
    saveNotes(updatedNotes);

    toast({
      title: "🗑️ Nota removida",
      description: `"${noteToDelete?.title}" foi removida do sistema`,
    });
  };

  const getFilteredNotes = () => {
    const sortedNotes = [...notes].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    if (!searchQuery.trim()) return sortedNotes;
    
    const query = searchQuery.toLowerCase();
    return sortedNotes.filter(note =>
      note.title.toLowerCase().includes(query) ||
      note.content.toLowerCase().includes(query)
    );
  };

  const calculateStats = (): NotesStats => {
    const totalNotes = notes.length;
    const totalWords = notes.reduce((sum, note) => {
      const words = (note.title + ' ' + note.content).split(/\s+/).filter(word => word.length > 0);
      return sum + words.length;
    }, 0);

    // Fórmula: EXP = palavras escritas * 5 (cada palavra vale 5 XP)
    const exp = totalWords * 5;
    
    // Fórmula: Nível = floor(EXP / 500) + 1
    const level = Math.floor(exp / 500) + 1;
    
    // Calcular dias ativos (simplificado)
    const activeDays = new Set(
      notes.map(note => new Date(note.createdAt).toDateString())
    ).size;
    
    // Notas por dia
    const notesPerDay = activeDays > 0 ? Number((totalNotes / activeDays).toFixed(1)) : 0;
    
    // Tempo estimado: 200 palavras ≈ 1 minuto
    const estimatedTime = Math.round(totalWords / 200);

    return {
      totalNotes,
      totalWords,
      exp,
      level,
      activeDays,
      notesPerDay,
      estimatedTime,
    };
  };

  const getRandomPhrase = (category: keyof typeof import('@/types/notes').NARRATIVE_PHRASES) => {
    const { NARRATIVE_PHRASES } = require('@/types/notes');
    const phrases = NARRATIVE_PHRASES[category];
    return phrases[Math.floor(Math.random() * phrases.length)];
  };

  return {
    notes: getFilteredNotes(),
    allNotes: notes,
    searchQuery,
    setSearchQuery,
    isLoading,
    createNote,
    updateNote,
    deleteNote,
    stats: calculateStats(),
    getRandomPhrase,
  };
}