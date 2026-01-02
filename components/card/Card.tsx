"use client";

// Placeholder Card component - will be implemented in Phase 6
export const Card = ({ card }: { card: { id: string; title: string } }) => {
  return (
    <div className="card">
      <p>{card.title}</p>
    </div>
  );
};
