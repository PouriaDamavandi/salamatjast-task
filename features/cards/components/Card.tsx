"use client";

import { useState, memo, useCallback } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Card as CardType } from "@/shared/types";
import { useCardActions } from "../hooks/useCardActions";

interface CardProps {
  card: CardType;
  onClick?: () => void;
}

const CardComponent = ({ card, onClick }: CardProps) => {
  const { updateCardTitle } = useCardActions();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(card.title);

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
    transition: isDragging ? undefined : transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleClick = useCallback(() => {
    if (onClick && !isEditing) {
      onClick();
    }
  }, [onClick, isEditing]);

  const handleEditClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setTitle(card.title);
      setIsEditing(true);
    },
    [card.title]
  );

  const handleEditKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        e.stopPropagation();
        setTitle(card.title);
        setIsEditing(true);
      }
    },
    [card.title]
  );

  const handleTitleBlur = useCallback(() => {
    if (title.trim()) {
      updateCardTitle(card.id, title.trim());
    } else {
      setTitle(card.title);
    }
    setIsEditing(false);
  }, [title, card.id, card.title, updateCardTitle]);

  const handleTitleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.currentTarget.blur();
      } else if (e.key === "Escape") {
        setTitle(card.title);
        setIsEditing(false);
      }
      e.stopPropagation();
    },
    [card.title]
  );

  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setTitle(e.target.value);
    },
    []
  );

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
          onMouseDown={(e) => e.stopPropagation()}
          aria-label="Card title"
          autoFocus
        />
      ) : (
        <>
          <div className="card-header">
            <p className="card-title">{card.title}</p>
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
          {card.comments.length > 0 && (
            <div className="card-footer">
              <span className="card-comments-badge">
                Comments ({card.comments.length})
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export const Card = memo(CardComponent);

