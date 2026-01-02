import { useCallback } from "react";
import { useBoardStore } from "@/shared/store/boardStore";
import { ListService } from "../services/listService";
import type { List } from "@/shared/types";

/**
 * Hook for list actions - separates business logic from components
 */
export const useListActions = () => {
  const board = useBoardStore((state) => state.board);
  const lists = useBoardStore((state) => state.lists);
  const cards = useBoardStore((state) => state.cards);
  const isLoading = useBoardStore((state) => state.isLoading);
  const error = useBoardStore((state) => state.error);
  const setBoard = useBoardStore((state) => state.setBoard);
  const setLists = useBoardStore((state) => state.setLists);
  const setCards = useBoardStore((state) => state.setCards);

  const addList = useCallback(
    (list: List) => {
      const result = ListService.addList(
        {
          board,
          lists,
          cards,
          isLoading,
          error,
        },
        list
      );

      if (result) {
        setBoard(result.board);
        setLists(result.lists);
      }
    },
    [board, lists, cards, isLoading, error, setBoard, setLists]
  );

  const updateListTitle = useCallback(
    (listId: string, title: string) => {
      const result = ListService.updateListTitle(
        {
          board,
          lists,
          cards,
          isLoading,
          error,
        },
        listId,
        title
      );

      if (result) {
        setBoard(result.board);
        setLists(result.lists);
      }
    },
    [board, lists, cards, isLoading, error, setBoard, setLists]
  );

  const deleteList = useCallback(
    (listId: string) => {
      const result = ListService.deleteList(
        {
          board,
          lists,
          cards,
          isLoading,
          error,
        },
        listId
      );

      if (result) {
        setBoard(result.board);
        setLists(result.lists);
        setCards(result.cards);
      }
    },
    [board, lists, cards, isLoading, error, setBoard, setLists, setCards]
  );

  const reorderLists = useCallback(
    (listIds: string[]) => {
      const result = ListService.reorderLists(
        {
          board,
          lists,
          cards,
          isLoading,
          error,
        },
        listIds
      );

      if (result) {
        setBoard(result.board);
      }
    },
    [board, lists, cards, isLoading, error, setBoard]
  );

  const deleteAllCardsFromList = useCallback(
    (listId: string) => {
      const result = ListService.deleteAllCardsFromList(
        {
          board,
          lists,
          cards,
          isLoading,
          error,
        },
        listId
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
    addList,
    updateListTitle,
    deleteList,
    reorderLists,
    deleteAllCardsFromList,
  };
};

