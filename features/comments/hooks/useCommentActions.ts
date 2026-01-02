import { useCallback } from "react";
import { useBoardStore } from "@/shared/store/boardStore";
import { CommentService } from "../services/commentService";
import type { Comment } from "@/shared/types";

/**
 * Hook for comment actions - separates business logic from components
 */
export const useCommentActions = () => {
  const board = useBoardStore((state) => state.board);
  const lists = useBoardStore((state) => state.lists);
  const cards = useBoardStore((state) => state.cards);
  const isLoading = useBoardStore((state) => state.isLoading);
  const error = useBoardStore((state) => state.error);
  const setBoard = useBoardStore((state) => state.setBoard);
  const setCards = useBoardStore((state) => state.setCards);

  const addComment = useCallback(
    (cardId: string, comment: Comment) => {
      const result = CommentService.addComment(
        {
          board,
          lists,
          cards,
          isLoading,
          error,
        },
        cardId,
        comment
      );

      if (result) {
        setBoard(result.board);
        setCards(result.cards);
      }
    },
    [board, lists, cards, isLoading, error, setBoard, setCards]
  );

  return {
    addComment,
  };
};

