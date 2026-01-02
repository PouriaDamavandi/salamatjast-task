import type { Board, List, Card, Comment } from "./index";

// Store state types
export interface BoardState {
  board: Board | null;
  lists: Record<string, List>;
  cards: Record<string, Card>;
  isLoading: boolean;
  error: string | null;
}

// Action types for state management
// Store is now thin - only state setters/getters
// Business logic is in feature services
export interface BoardActions {
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

export type BoardStore = BoardState & BoardActions;

