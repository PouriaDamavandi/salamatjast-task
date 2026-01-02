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
    opacity: isDragging ? 0.5 : 1,
  };

  const handleClick = (e: React.MouseEvent) => {
    if (onClick && !isEditing) {
      onClick();
    }
  };

  const handleTitleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
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
      className="card"
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
        />
      ) : (
        <p
          className="card-title"
          onClick={handleTitleClick}
          onMouseDown={(e) => e.stopPropagation()}
          role="button"
          tabIndex={0}
          aria-label={`Card: ${currentCard.title}. Click to edit title, double-click to open details.`}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleTitleClick(e as unknown as React.MouseEvent);
            }
          }}
        >
          {currentCard.title}
        </p>
      )}
      {currentCard.comments.length > 0 && (
        <span className="card-comments-badge">
          {currentCard.comments.length}
        </span>
      )}
    </div>
  );
};
