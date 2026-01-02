"use client";

interface EmptyStateProps {
  message: string;
  className?: string;
}

export const EmptyState = ({ message, className = "" }: EmptyStateProps) => {
  return (
    <div className={`empty-state ${className}`}>
      <p className="empty-state-message">{message}</p>
    </div>
  );
};

