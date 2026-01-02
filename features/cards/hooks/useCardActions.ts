import { useCallback } from "react";
import { useBoardStore } from "@/shared/store/boardStore";
import { CardService } from "../services/cardService";
import type { Card } from "@/shared/types";

/**
 * Hook for card actions - separates business logic from components
 */
export const useCardActions = () => {
  const board = useBoardStore((state) => state.board);
  const lists = useBoardStore((state) => state.lists);
  const cards = useBoardStore((state) => state.cards);
  const isLoading = useBoardStore((state) => state.isLoading);
  const error = useBoardStore((state) => state.error);
  const setBoard = useBoardStore((state) => state.setBoard);
  const setLists = useBoardStore((state) => state.setLists);
  const setCards = useBoardStore((state) => state.setCards);

  const addCard = useCallback(
    (card: Card) => {
      const result = CardService.addCard(
        {
          board,
          lists,
          cards,
          isLoading,
          error,
        },
        card
      );

      if (result) {
        setBoard(result.board);
        setLists(result.lists);
        setCards(result.cards);
      }
    },
    [board, lists, cards, isLoading, error, setBoard, setLists, setCards]
  );

  const updateCardTitle = useCallback(
    (cardId: string, title: string) => {
      const result = CardService.updateCardTitle(
        {
          board,
          lists,
          cards,
          isLoading,
          error,
        },
        cardId,
        title
      );

      if (result) {
        setBoard(result.board);
        setCards(result.cards);
      }
    },
    [board, lists, cards, isLoading, error, setBoard, setCards]
  );

  const moveCard = useCallback(
    (cardId: string, newListId: string, newIndex: number) => {
      const result = CardService.moveCard(
        {
          board,
          lists,
          cards,
          isLoading,
          error,
        },
        cardId,
        newListId,
        newIndex
      );

      if (result) {
        setBoard(result.board);
        setLists(result.lists);
        setCards(result.cards);
      }
    },
    [board, lists, cards, isLoading, error, setBoard, setLists, setCards]
  );

  const reorderCardsInList = useCallback(
    (listId: string, cardIds: string[]) => {
      const result = CardService.reorderCardsInList(
        {
          board,
          lists,
          cards,
          isLoading,
          error,
        },
        listId,
        cardIds
      );

      if (result) {
        setBoard(result.board);
        setLists(result.lists);
      }
    },
    [board, lists, cards, isLoading, error, setBoard, setLists]
  );

  const deleteCard = useCallback(
    (cardId: string) => {
      const result = CardService.deleteCard(
        {
          board,
          lists,
          cards,
          isLoading,
          error,
        },
        cardId
      );

      if (result) {
        setBoard(result.board);
        setLists(result.lists);
        setCards(result.cards);
      }
    },
    [board, lists, cards, isLoading, error, setBoard, setLists, setCards]
  );

  return {
    addCard,
    updateCardTitle,
    moveCard,
    reorderCardsInList,
    deleteCard,
  };
};

