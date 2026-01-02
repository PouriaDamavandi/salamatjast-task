"use client";

interface EmptyStateProps {
  message: string;
}

export const EmptyState = ({ message }: EmptyStateProps) => {
  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <p>{message}</p>
    </div>
  );
};

