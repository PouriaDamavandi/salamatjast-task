// Core data types for Trello Clone

export interface Comment {
  id: string;
  text: string;
  createdAt: string;
}

export interface Card {
  id: string;
  title: string;
  listId: string;
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
}

export interface List {
  id: string;
  title: string;
  boardId: string;
  cardIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Board {
  id: string;
  title: string;
  listIds: string[];
  createdAt: string;
  updatedAt: string;
}

// Re-export store types
export type { BoardState, BoardActions } from "./store";
