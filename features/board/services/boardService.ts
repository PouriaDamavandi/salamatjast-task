import type { Board } from "@/shared/types";
import { saveBoard } from "@/shared/services/storageService";
import type { BoardState } from "@/shared/types/store";

/**
 * Board Service - Business logic for board operations
 */
export class BoardService {
  /**
   * Update board title
   */
  static updateBoardTitle(
    currentState: BoardState,
    title: string
  ): { board: Board } | null {
    const { board, lists, cards } = currentState;
    if (!board) return null;

    const updatedBoard: Board = {
      ...board,
      title,
      updatedAt: new Date().toISOString(),
    };

    // Persist to storage
    saveBoard(updatedBoard, Object.values(lists), Object.values(cards));

    return { board: updatedBoard };
  }
}
