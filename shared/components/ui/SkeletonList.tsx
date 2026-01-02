"use client";

import { SkeletonCard } from "./SkeletonCard";

export const SkeletonList = () => {
  return (
    <div className="skeleton-list">
      <div className="skeleton-list-header">
        <div className="skeleton-line skeleton-list-title" />
      </div>
      <div className="skeleton-list-content">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  );
};

