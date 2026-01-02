import type { Comment, Card, Board } from "@/shared/types";
import { saveBoard } from "@/shared/services/storageService";
import type { BoardState } from "@/shared/types/store";

/**
 * Comment Service - Business logic for comment operations
 */
export class CommentService {
  /**
   * Add a comment to a card
   */
  static addComment(
    currentState: BoardState,
    cardId: string,
    comment: Comment
  ): { board: Board; cards: Record<string, Card> } | null {
    const { board, lists, cards } = currentState;
    if (!cards[cardId]) return null;

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

    // Persist to storage
    saveBoard(updatedBoard, Object.values(lists), Object.values(updatedCards));

    return { board: updatedBoard, cards: updatedCards };
  }
}

