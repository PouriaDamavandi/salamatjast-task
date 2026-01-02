// Core data types for Trello Clone

export interface Comment {
  id: string;
  text: string;
  createdAt: string;
}

export interface Card {
  id: string;
  title: string;
  listId: string;
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
}

export interface List {
  id: string;
  title: string;
  boardId: string;
  cardIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Board {
  id: string;
  title: string;
  listIds: string[];
  createdAt: string;
  updatedAt: string;
}

// Store state types
export interface BoardState {
  board: Board | null;
  lists: Record<string, List>;
  cards: Record<string, Card>;
  isLoading: boolean;
  error: string | null;
}

// Action types for state management
export interface BoardActions {
  // Board actions
  setBoard: (board: Board) => void;
  updateBoardTitle: (title: string) => void;

  // List actions
  addList: (list: List) => void;
  updateListTitle: (listId: string, title: string) => void;
  deleteList: (listId: string) => void;
  reorderLists: (listIds: string[]) => void;

  // Card actions
  addCard: (card: Card) => void;
  updateCardTitle: (cardId: string, title: string) => void;
  moveCard: (cardId: string, newListId: string, newIndex: number) => void;
  reorderCardsInList: (listId: string, cardIds: string[]) => void;
  deleteCard: (cardId: string) => void;

  // Comment actions
  addComment: (cardId: string, comment: Comment) => void;

  // Utility actions
  initializeBoard: () => void;
  resetBoard: () => void;
}

export type BoardStore = BoardState & BoardActions;
