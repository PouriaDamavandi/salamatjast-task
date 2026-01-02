"use client";

import { Board } from "@/components/board/Board";
import { ListsContainer } from "@/components/list/ListsContainer";
import { useBoard } from "@/hooks/useBoard";

export default function Home() {
  const { board, isLoading, error } = useBoard();

  if (isLoading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p>Loading board...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "2rem", textAlign: "center", color: "red" }}>
        <p>Error: {error}</p>
      </div>
    );
  }

  if (!board) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p>No board found</p>
      </div>
    );
  }

  return (
    <Board>
      <ListsContainer />
    </Board>
  );
}
