import { useCallback } from "react";
import { useBoardStore } from "@/shared/store/boardStore";
import { BoardService } from "../services/boardService";

/**
 * Hook for board actions - separates business logic from components
 */
export const useBoardActions = () => {
  const board = useBoardStore((state) => state.board);
  const lists = useBoardStore((state) => state.lists);
  const cards = useBoardStore((state) => state.cards);
  const isLoading = useBoardStore((state) => state.isLoading);
  const error = useBoardStore((state) => state.error);
  const setBoard = useBoardStore((state) => state.setBoard);

  const updateBoardTitle = useCallback(
    (title: string) => {
      const result = BoardService.updateBoardTitle(
        {
          board,
          lists,
          cards,
          isLoading,
          error,
        },
        title
      );

      if (result) {
        setBoard(result.board);
      }
    },
    [board, lists, cards, isLoading, error, setBoard]
  );

  return {
    updateBoardTitle,
  };
};
