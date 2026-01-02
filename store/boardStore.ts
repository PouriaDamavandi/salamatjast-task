import { create } from "zustand";
import type { Board, List, Card, Comment, BoardStore } from "@/types";
import {
  loadBoard,
  saveBoard,
  getInitialBoard,
  clearBoard,
} from "@/services/storageService";

export const useBoardStore = create<BoardStore>((set, get) => ({
  // Initial state
  board: null,
  lists: {},
  cards: {},
  isLoading: false,
  error: null,

  // Board actions
  setBoard: (board: Board) => {
    set({ board });
  },

  updateBoardTitle: (title: string) => {
    const { board, lists, cards } = get();
    if (!board) return;

    const updatedBoard: Board = {
      ...board,
      title,
      updatedAt: new Date().toISOString(),
    };

    set({ board: updatedBoard });
    saveBoard(updatedBoard, Object.values(lists), Object.values(cards));
  },

  // List actions
  addList: (list: List) => {
    const { board, lists, cards } = get();
    if (!board) return;

    const updatedLists = { ...lists, [list.id]: list };
    const updatedBoard: Board = {
      ...board,
      listIds: [...board.listIds, list.id],
      updatedAt: new Date().toISOString(),
    };

    set({ board: updatedBoard, lists: updatedLists });
    saveBoard(updatedBoard, Object.values(updatedLists), Object.values(cards));
  },

  updateListTitle: (listId: string, title: string) => {
    const { board, lists, cards } = get();
    if (!board || !lists[listId]) return;

    const updatedList: List = {
      ...lists[listId],
      title,
      updatedAt: new Date().toISOString(),
    };

    const updatedLists = { ...lists, [listId]: updatedList };
    const updatedBoard: Board = {
      ...board,
      updatedAt: new Date().toISOString(),
    };

    set({ board: updatedBoard, lists: updatedLists });
    saveBoard(updatedBoard, Object.values(updatedLists), Object.values(cards));
  },

  deleteList: (listId: string) => {
    const { board, lists, cards } = get();
    if (!board || !lists[listId]) return;

    // Delete all cards in this list
    const listCards = lists[listId].cardIds;
    const updatedCards = { ...cards };
    listCards.forEach((cardId) => {
      delete updatedCards[cardId];
    });

    // Remove list from board
    const updatedLists = { ...lists };
    delete updatedLists[listId];

    const updatedBoard: Board = {
      ...board,
      listIds: board.listIds.filter((id) => id !== listId),
      updatedAt: new Date().toISOString(),
    };

    set({
      board: updatedBoard,
      lists: updatedLists,
      cards: updatedCards,
    });
    saveBoard(
      updatedBoard,
      Object.values(updatedLists),
      Object.values(updatedCards)
    );
  },

  reorderLists: (listIds: string[]) => {
    const { board, lists, cards } = get();
    if (!board) return;

    const updatedBoard: Board = {
      ...board,
      listIds,
      updatedAt: new Date().toISOString(),
    };

    set({ board: updatedBoard });
    saveBoard(updatedBoard, Object.values(lists), Object.values(cards));
  },

  // Card actions
  addCard: (card: Card) => {
    const { board, lists, cards } = get();
    if (!board || !lists[card.listId]) return;

    const updatedCards = { ...cards, [card.id]: card };
    const list = lists[card.listId];
    const updatedList: List = {
      ...list,
      cardIds: [...list.cardIds, card.id],
      updatedAt: new Date().toISOString(),
    };
    const updatedLists = { ...lists, [card.listId]: updatedList };
    const updatedBoard: Board = {
      ...board,
      updatedAt: new Date().toISOString(),
    };

    set({
      board: updatedBoard,
      lists: updatedLists,
      cards: updatedCards,
    });
    saveBoard(
      updatedBoard,
      Object.values(updatedLists),
      Object.values(updatedCards)
    );
  },

  updateCardTitle: (cardId: string, title: string) => {
    const { board, lists, cards } = get();
    if (!cards[cardId]) return;

    const updatedCard: Card = {
      ...cards[cardId],
      title,
      updatedAt: new Date().toISOString(),
    };

    const updatedCards = { ...cards, [cardId]: updatedCard };
    const updatedBoard: Board = {
      ...board!,
      updatedAt: new Date().toISOString(),
    };

    set({ board: updatedBoard, cards: updatedCards });
    saveBoard(updatedBoard, Object.values(lists), Object.values(updatedCards));
  },

  moveCard: (cardId: string, newListId: string, newIndex: number) => {
    const { board, lists, cards } = get();
    if (!board || !cards[cardId] || !lists[newListId]) return;

    const card = cards[cardId];
    const oldListId = card.listId;
    const oldList = lists[oldListId];
    const newList = lists[newListId];

    // Remove card from old list
    const oldListCardIds = oldList.cardIds.filter((id) => id !== cardId);
    const updatedOldList: List = {
      ...oldList,
      cardIds: oldListCardIds,
      updatedAt: new Date().toISOString(),
    };

    // Add card to new list at specific index
    const newListCardIds = [...newList.cardIds];
    newListCardIds.splice(newIndex, 0, cardId);
    const updatedNewList: List = {
      ...newList,
      cardIds: newListCardIds,
      updatedAt: new Date().toISOString(),
    };

    // Update card's listId
    const updatedCard: Card = {
      ...card,
      listId: newListId,
      updatedAt: new Date().toISOString(),
    };

    const updatedLists = {
      ...lists,
      [oldListId]: updatedOldList,
      [newListId]: updatedNewList,
    };
    const updatedCards = { ...cards, [cardId]: updatedCard };
    const updatedBoard: Board = {
      ...board,
      updatedAt: new Date().toISOString(),
    };

    set({
      board: updatedBoard,
      lists: updatedLists,
      cards: updatedCards,
    });
    saveBoard(
      updatedBoard,
      Object.values(updatedLists),
      Object.values(updatedCards)
    );
  },

  reorderCardsInList: (listId: string, cardIds: string[]) => {
    const { board, lists, cards } = get();
    if (!board || !lists[listId]) return;

    const updatedList: List = {
      ...lists[listId],
      cardIds,
      updatedAt: new Date().toISOString(),
    };

    const updatedLists = { ...lists, [listId]: updatedList };
    const updatedBoard: Board = {
      ...board,
      updatedAt: new Date().toISOString(),
    };

    set({ board: updatedBoard, lists: updatedLists });
    saveBoard(updatedBoard, Object.values(updatedLists), Object.values(cards));
  },

  deleteCard: (cardId: string) => {
    const { board, lists, cards } = get();
    if (!cards[cardId]) return;

    const card = cards[cardId];
    const list = lists[card.listId];
    if (!list) return;

    const updatedList: List = {
      ...list,
      cardIds: list.cardIds.filter((id) => id !== cardId),
      updatedAt: new Date().toISOString(),
    };

    const updatedLists = { ...lists, [card.listId]: updatedList };
    const updatedCards = { ...cards };
    delete updatedCards[cardId];

    const updatedBoard: Board = {
      ...board!,
      updatedAt: new Date().toISOString(),
    };

    set({
      board: updatedBoard,
      lists: updatedLists,
      cards: updatedCards,
    });
    saveBoard(
      updatedBoard,
      Object.values(updatedLists),
      Object.values(updatedCards)
    );
  },

  deleteAllCardsFromList: (listId: string) => {
    const { board, lists, cards } = get();
    if (!board || !lists[listId]) return;

    const list = lists[listId];
    const updatedCards = { ...cards };

    // Delete all cards in this list
    list.cardIds.forEach((cardId) => {
      delete updatedCards[cardId];
    });

    const updatedList: List = {
      ...list,
      cardIds: [],
      updatedAt: new Date().toISOString(),
    };

    const updatedLists = { ...lists, [listId]: updatedList };
    const updatedBoard: Board = {
      ...board,
      updatedAt: new Date().toISOString(),
    };

    set({
      board: updatedBoard,
      lists: updatedLists,
      cards: updatedCards,
    });
    saveBoard(
      updatedBoard,
      Object.values(updatedLists),
      Object.values(updatedCards)
    );
  },

  // Comment actions
  addComment: (cardId: string, comment: Comment) => {
    const { board, lists, cards } = get();
    if (!cards[cardId]) return;

    const card = cards[cardId];
    const updatedCard: Card = {
      ...card,
      comments: [...card.comments, comment],
      updatedAt: new Date().toISOString(),
    };

    const updatedCards = { ...cards, [cardId]: updatedCard };
    const updatedBoard: Board = {
      ...board!,
      updatedAt: new Date().toISOString(),
    };

    set({ board: updatedBoard, cards: updatedCards });
    saveBoard(updatedBoard, Object.values(lists), Object.values(updatedCards));
  },

  // Utility actions
  initializeBoard: () => {
    set({ isLoading: true, error: null });

    try {
      const stored = loadBoard();
      if (stored) {
        // Convert arrays to objects for state management
        const listsObject: Record<string, List> = {};
        stored.lists.forEach((list) => {
          listsObject[list.id] = list;
        });

        const cardsObject: Record<string, Card> = {};
        stored.cards.forEach((card) => {
          cardsObject[card.id] = card;
        });

        set({
          board: stored.board,
          lists: listsObject,
          cards: cardsObject,
          isLoading: false,
        });
      } else {
        // Initialize with demo data
        const { board, lists, cards } = getInitialBoard();

        const listsObject: Record<string, List> = {};
        lists.forEach((list) => {
          listsObject[list.id] = list;
        });

        const cardsObject: Record<string, Card> = {};
        cards.forEach((card) => {
          cardsObject[card.id] = card;
        });

        set({
          board,
          lists: listsObject,
          cards: cardsObject,
          isLoading: false,
        });

        // Save initial data
        saveBoard(board, lists, cards);
      }
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to initialize board",
        isLoading: false,
      });
    }
  },

  resetBoard: () => {
    clearBoard();
    const { initializeBoard } = get();
    initializeBoard();
  },
}));
