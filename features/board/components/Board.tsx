"use client";

import { BoardHeader } from "./BoardHeader";

interface BoardProps {
  children?: React.ReactNode;
}

export const Board = ({ children }: BoardProps) => {
  return (
    <div className="board">
      <BoardHeader />
      <div className="board-content">{children}</div>
    </div>
  );
};

