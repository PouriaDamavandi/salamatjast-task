"use client";

interface ErrorDisplayProps {
  error: string;
}

export const ErrorDisplay = ({ error }: ErrorDisplayProps) => {
  return (
    <div style={{ padding: "2rem", textAlign: "center", color: "red" }}>
      <p>Error: {error}</p>
    </div>
  );
};

