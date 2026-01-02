import type { Board, List, Card } from "@/shared/types";

const STORAGE_KEY = "trello-clone-board";

/**
 * Get initial demo board data
 */
export const getInitialBoard = (): {
  board: Board;
  lists: List[];
  cards: Card[];
} => {
  const boardId = "board-1";
  const list1Id = "list-1";
  const list2Id = "list-2";
  const list3Id = "list-3";

  const board: Board = {
    id: boardId,
    title: "Demo Board",
    listIds: [list1Id, list2Id, list3Id],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const lists: List[] = [
    {
      id: list1Id,
      title: "To Do",
      boardId: boardId,
      cardIds: ["card-1", "card-2"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: list2Id,
      title: "In Progress",
      boardId: boardId,
      cardIds: ["card-3"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: list3Id,
      title: "Done",
      boardId: boardId,
      cardIds: ["card-4"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  const cards: Card[] = [
    {
      id: "card-1",
      title: "Set up project structure",
      listId: list1Id,
      comments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "card-2",
      title: "Implement drag and drop",
      listId: list1Id,
      comments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "card-3",
      title: "Add comments functionality",
      listId: list2Id,
      comments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "card-4",
      title: "Complete project",
      listId: list3Id,
      comments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  return { board, lists, cards };
};

/**
 * Load board data from localStorage
 */
export const loadBoard = (): {
  board: Board;
  lists: List[];
  cards: Card[];
} | null => {
  try {
    if (typeof window === "undefined") {
      return null;
    }

    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return null;
    }

    const data = JSON.parse(stored);
    return data;
  } catch {
    // Silently fail and return null to allow fallback to initial board
    // In production, you might want to log to an error reporting service
    return null;
  }
};

/**
 * Save board data to localStorage
 */
export const saveBoard = (board: Board, lists: List[], cards: Card[]): void => {
  try {
    if (typeof window === "undefined") {
      return;
    }

    const data = {
      board,
      lists,
      cards,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    // Handle quota exceeded error or other storage errors
    if (error instanceof DOMException && error.name === "QuotaExceededError") {
      throw new Error("Storage quota exceeded. Please clear some data.");
    }
    throw new Error("Failed to save board data");
  }
};

/**
 * Clear board data from localStorage
 */
export const clearBoard = (): void => {
  try {
    if (typeof window === "undefined") {
      return;
    }
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Silently fail - clearing is not critical
    // In production, you might want to log to an error reporting service
  }
};

