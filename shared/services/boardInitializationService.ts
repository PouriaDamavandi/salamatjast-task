import type { Board, List, Card } from "@/shared/types";
import { loadBoard, saveBoard, getInitialBoard } from "./storageService";

/**
 * Board Initialization Service - Handles board loading and initialization
 */
export class BoardInitializationService {
  /**
   * Initialize board from storage or create default
   */
  static async initialize(): Promise<{
    board: Board | null;
    lists: Record<string, List>;
    cards: Record<string, Card>;
    error: string | null;
  }> {
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

        return {
          board: stored.board,
          lists: listsObject,
          cards: cardsObject,
          error: null,
        };
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

        // Save initial data
        saveBoard(board, lists, cards);

        return {
          board,
          lists: listsObject,
          cards: cardsObject,
          error: null,
        };
      }
    } catch (error) {
      return {
        board: null,
        lists: {},
        cards: {},
        error:
          error instanceof Error ? error.message : "Failed to initialize board",
      };
    }
  }
}

