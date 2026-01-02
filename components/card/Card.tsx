"use client";

import { useState, useEffect } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Card as CardType } from "@/types";
import { useBoardStore } from "@/store/boardStore";

interface CardProps {
  card: CardType;
  onClick?: () => void;
}

export const Card = ({ card, onClick }: CardProps) => {
  const updateCardTitle = useBoardStore((state) => state.updateCardTitle);
  const cards = useBoardStore((state) => state.cards);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(card.title);

  const currentCard = cards[card.id] || card;

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTitle(currentCard.title);
  }, [currentCard.title]);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  const handleClick = () => {
    if (onClick && !isEditing) {
      onClick();
    }
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleEditKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();
      setIsEditing(true);
    }
  };

  const handleTitleBlur = () => {
    if (title.trim()) {
      updateCardTitle(card.id, title.trim());
    } else {
      setTitle(currentCard.title);
    }
    setIsEditing(false);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.currentTarget.blur();
    } else if (e.key === "Escape") {
      setTitle(currentCard.title);
      setIsEditing(false);
    }
    e.stopPropagation();
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`card ${isDragging ? "dragging" : ""}`}
      {...attributes}
      {...listeners}
      onClick={handleClick}
    >
      {isEditing ? (
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          onBlur={handleTitleBlur}
          onKeyDown={handleTitleKeyDown}
          className="card-title-input"
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          aria-label="Card title"
          autoFocus
        />
      ) : (
        <>
          <div className="card-header">
            <p className="card-title">{currentCard.title}</p>
            <button
              type="button"
              className="card-edit-button"
              onClick={handleEditClick}
              onMouseDown={(e) => e.stopPropagation()}
              onKeyDown={handleEditKeyDown}
              aria-label="Edit card title"
              tabIndex={0}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.333 2a2.324 2.324 0 0 1 3.286 3.286L5.333 14.667H2v-3.333L11.333 2z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
          {currentCard.comments.length > 0 && (
            <div className="card-footer">
              <span className="card-comments-badge">
                Comments ({currentCard.comments.length})
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
};
