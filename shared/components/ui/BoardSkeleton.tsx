"use client";

import { SkeletonList } from "./SkeletonList";

export const BoardSkeleton = () => {
  return (
    <div className="board">
      <header className="board-header skeleton-board-header">
        <div className="skeleton-line skeleton-board-title" />
      </header>
      <div className="board-content">
        <div className="lists-container">
          <SkeletonList />
          <SkeletonList />
          <SkeletonList />
        </div>
      </div>
    </div>
  );
};

