import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface DailyNote {
  id: string;
  date: string;
  notes: string;
  mood?: 'great' | 'good' | 'okay' | 'bad' | 'terrible';
  energy?: 'high' | 'medium' | 'low';
  createdAt: string;
  updatedAt: string;
}

interface NotesState {
  dailyNotes: DailyNote[];
  
  // Actions
  addDailyNote: (note: Omit<DailyNote, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateDailyNote: (note: DailyNote) => void;
  deleteDailyNote: (id: string) => void;
  
  // Getters
  getNoteByDate: (date: string) => DailyNote | null;
  getNotesByDateRange: (startDate: string, endDate: string) => DailyNote[];
  getRecentNotes: (count: number) => DailyNote[];
}

export const useNotesStore = create<NotesState>()(
  persist(
    (set, get) => ({
      dailyNotes: [],
      
      addDailyNote: (note) => {
        const now = new Date().toISOString();
        const newNote: DailyNote = {
          ...note,
          id: Date.now().toString(),
          createdAt: now,
          updatedAt: now,
        };
        
        set((state) => ({
          dailyNotes: [...state.dailyNotes, newNote]
        }));
      },
      
      updateDailyNote: (note) => {
        const updatedNote = {
          ...note,
          updatedAt: new Date().toISOString(),
        };
        
        set((state) => ({
          dailyNotes: state.dailyNotes.map(n => n.id === note.id ? updatedNote : n)
        }));
      },
      
      deleteDailyNote: (id) => {
        set((state) => ({
          dailyNotes: state.dailyNotes.filter(n => n.id !== id)
        }));
      },
      
      getNoteByDate: (date) => {
        const { dailyNotes } = get();
        return dailyNotes.find(note => {
          const noteDate = new Date(note.date).toDateString();
          const targetDate = new Date(date).toDateString();
          return noteDate === targetDate;
        }) || null;
      },
      
      getNotesByDateRange: (startDate, endDate) => {
        const { dailyNotes } = get();
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        return dailyNotes.filter(note => {
          const noteDate = new Date(note.date);
          return noteDate >= start && noteDate <= end;
        });
      },
      
      getRecentNotes: (count) => {
        const { dailyNotes } = get();
        return dailyNotes
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, count);
      },
    }),
    {
      name: 'notes-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
); 