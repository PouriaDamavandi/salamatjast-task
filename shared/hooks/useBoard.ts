import { useEffect } from "react";
import { useBoardStore } from "@/shared/store/boardStore";

/**
 * Custom hook to manage board initialization and provide board state
 */
export const useBoard = () => {
  const initializeBoard = useBoardStore((state) => state.initializeBoard);
  const board = useBoardStore((state) => state.board);
  const lists = useBoardStore((state) => state.lists);
  const cards = useBoardStore((state) => state.cards);
  const isLoading = useBoardStore((state) => state.isLoading);
  const error = useBoardStore((state) => state.error);

  useEffect(() => {
    // Initialize board on mount if not already loaded
    if (!board && !isLoading) {
      initializeBoard();
    }
  }, [board, isLoading, initializeBoard]);

  return {
    board,
    lists,
    cards,
    isLoading,
    error,
  };
};
