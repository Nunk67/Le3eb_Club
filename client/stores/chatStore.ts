import { create } from 'zustand';
import type { ChatSession, Message } from '@shared/types';

interface ChatState {
  sessions: ChatSession[];
  currentMessages: Message[];
  setSessions: (sessions: ChatSession[] | ((prev: ChatSession[]) => ChatSession[])) => void;
  setCurrentMessages: (messages: Message[] | ((prev: Message[]) => Message[])) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  sessions: [],
  currentMessages: [],
  setSessions: (sessions) =>
    set((s) => ({
      sessions: typeof sessions === 'function' ? sessions(s.sessions) : sessions,
    })),
  setCurrentMessages: (messages) =>
    set((s) => ({
      currentMessages: typeof messages === 'function' ? messages(s.currentMessages) : messages,
    })),
}));
