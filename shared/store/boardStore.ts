import { create } from "zustand";
import type { Board, List, Card } from "@/shared/types";
import { BoardInitializationService } from "@/shared/services/boardInitializationService";
import { clearBoard } from "@/shared/services/storageService";

// Define the store type inline to avoid module resolution conflicts
interface BoardState {
  board: Board | null;
  lists: Record<string, List>;
  cards: Record<string, Card>;
  isLoading: boolean;
  error: string | null;
}

interface BoardActions {
  // State setters
  setBoard: (board: Board | null) => void;
  setLists: (lists: Record<string, List>) => void;
  setCards: (cards: Record<string, Card>) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;

  // Initialization
  initializeBoard: () => Promise<void>;
  resetBoard: () => Promise<void>;
}

type BoardStore = BoardState & BoardActions;

/**
 * Thin store - only manages state
 * Business logic is in feature services
 */
export const useBoardStore = create<BoardStore>((set, get) => ({
  // Initial state
  board: null,
  lists: {},
  cards: {},
  isLoading: false,
  error: null,

  // State setters
  setBoard: (board: Board | null) => {
    set({ board });
  },

  setLists: (lists: Record<string, List>) => {
    set({ lists });
  },

  setCards: (cards: Record<string, Card>) => {
    set({ cards });
  },

  setIsLoading: (isLoading: boolean) => {
    set({ isLoading });
  },

  setError: (error: string | null) => {
    set({ error });
  },

  // Initialization
  initializeBoard: async () => {
    set({ isLoading: true, error: null });

    const result = await BoardInitializationService.initialize();

    set({
      board: result.board,
      lists: result.lists,
      cards: result.cards,
      isLoading: false,
      error: result.error,
    });
  },

  resetBoard: async () => {
    clearBoard();
    const { initializeBoard } = get();
    await initializeBoard();
  },
}));
