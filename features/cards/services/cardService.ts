import type { Card, List, Board } from "@/shared/types";
import { saveBoard } from "@/shared/services/storageService";
import type { BoardState } from "@/shared/types/store";

/**
 * Card Service - Business logic for card operations
 */
export class CardService {
  /**
   * Add a new card
   */
  static addCard(
    currentState: BoardState,
    card: Card
  ): { board: Board; lists: Record<string, List>; cards: Record<string, Card> } | null {
    const { board, lists, cards } = currentState;
    if (!board || !lists[card.listId]) return null;

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
   * Update card title
   */
  static updateCardTitle(
    currentState: BoardState,
    cardId: string,
    title: string
  ): { board: Board; cards: Record<string, Card> } | null {
    const { board, lists, cards } = currentState;
    if (!cards[cardId]) return null;

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

    // Persist to storage
    saveBoard(updatedBoard, Object.values(lists), Object.values(updatedCards));

    return { board: updatedBoard, cards: updatedCards };
  }

  /**
   * Move card to a different list or position
   */
  static moveCard(
    currentState: BoardState,
    cardId: string,
    newListId: string,
    newIndex: number
  ): { board: Board; lists: Record<string, List>; cards: Record<string, Card> } | null {
    const { board, lists, cards } = currentState;
    if (!board || !cards[cardId] || !lists[newListId]) return null;

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
   * Reorder cards within a list
   */
  static reorderCardsInList(
    currentState: BoardState,
    listId: string,
    cardIds: string[]
  ): { board: Board; lists: Record<string, List> } | null {
    const { board, lists, cards } = currentState;
    if (!board || !lists[listId]) return null;

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

    // Persist to storage
    saveBoard(updatedBoard, Object.values(updatedLists), Object.values(cards));

    return { board: updatedBoard, lists: updatedLists };
  }

  /**
   * Delete a card
   */
  static deleteCard(
    currentState: BoardState,
    cardId: string
  ): { board: Board; lists: Record<string, List>; cards: Record<string, Card> } | null {
    const { board, lists, cards } = currentState;
    if (!cards[cardId]) return null;

    const card = cards[cardId];
    const list = lists[card.listId];
    if (!list) return null;

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

