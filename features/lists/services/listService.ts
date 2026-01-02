import type { List, Board, Card } from "@/shared/types";
import { saveBoard } from "@/shared/services/storageService";
import type { BoardState } from "@/shared/types/store";

/**
 * List Service - Business logic for list operations
 */
export class ListService {
  /**
   * Add a new list
   */
  static addList(
    currentState: BoardState,
    list: List
  ): { board: Board; lists: Record<string, List> } | null {
    const { board, lists, cards } = currentState;
    if (!board) return null;

    const updatedLists = { ...lists, [list.id]: list };
    const updatedBoard: Board = {
      ...board,
      listIds: [...board.listIds, list.id],
      updatedAt: new Date().toISOString(),
    };

    // Persist to storage
    saveBoard(updatedBoard, Object.values(updatedLists), Object.values(cards));

    return { board: updatedBoard, lists: updatedLists };
  }

  /**
   * Update list title
   */
  static updateListTitle(
    currentState: BoardState,
    listId: string,
    title: string
  ): { board: Board; lists: Record<string, List> } | null {
    const { board, lists, cards } = currentState;
    if (!board || !lists[listId]) return null;

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

    // Persist to storage
    saveBoard(updatedBoard, Object.values(updatedLists), Object.values(cards));

    return { board: updatedBoard, lists: updatedLists };
  }

  /**
   * Delete a list and all its cards
   */
  static deleteList(
    currentState: BoardState,
    listId: string
  ): {
    board: Board;
    lists: Record<string, List>;
    cards: Record<string, Card>;
  } | null {
    const { board, lists, cards } = currentState;
    if (!board || !lists[listId]) return null;

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

    // Persist to storage
    saveBoard(
      updatedBoard,
      Object.values(updatedLists),
      Object.values(updatedCards)
    );

    return {
      board: updatedBoard,
      lists: updatedLists,
      cards: updatedCards,
    };
  }

  /**
   * Reorder lists
   */
  static reorderLists(
    currentState: BoardState,
    listIds: string[]
  ): { board: Board } | null {
    const { board, lists, cards } = currentState;
    if (!board) return null;

    const updatedBoard: Board = {
      ...board,
      listIds,
      updatedAt: new Date().toISOString(),
    };

    // Persist to storage
    saveBoard(updatedBoard, Object.values(lists), Object.values(cards));

    return { board: updatedBoard };
  }

  /**
   * Delete all cards from a list
   */
  static deleteAllCardsFromList(
    currentState: BoardState,
    listId: string
  ): {
    board: Board;
    lists: Record<string, List>;
    cards: Record<string, Card>;
  } | null {
    const { board, lists, cards } = currentState;
    if (!board || !lists[listId]) return null;

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

    // Persist to storage
    saveBoard(
      updatedBoard,
      Object.values(updatedLists),
      Object.values(updatedCards)
    );

    return {
      board: updatedBoard,
      lists: updatedLists,
      cards: updatedCards,
    };
  }
}

