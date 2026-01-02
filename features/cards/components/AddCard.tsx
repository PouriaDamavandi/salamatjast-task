"use client";

import { useState, useRef, useEffect } from "react";
import { generateId, getCurrentTimestamp } from "@/shared/utils/helpers";
import type { Card, List } from "@/shared/types";
import { useCardActions } from "../hooks/useCardActions";

interface AddCardProps {
  list: List;
}

export const AddCard = ({ list }: AddCardProps) => {
  const { addCard } = useCardActions();
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isAdding && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAdding]);

  const handleClick = () => {
    setIsAdding(true);
  };

  const handleSubmit = () => {
    if (title.trim()) {
      const newCard: Card = {
        id: generateId("card"),
        title: title.trim(),
        listId: list.id,
        comments: [],
        createdAt: getCurrentTimestamp(),
        updatedAt: getCurrentTimestamp(),
      };
      addCard(newCard);
      setTitle("");
    }
    setIsAdding(false);
  };

  const handleCancel = () => {
    setTitle("");
    setIsAdding(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    e.stopPropagation();
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTitle(e.target.value);
  };

  if (!isAdding) {
    return (
      <button
        onClick={handleClick}
        className="add-card-button"
        type="button"
        aria-label="Add new card"
      >
        + Add a card
      </button>
    );
  }

  return (
    <div className="add-card-form">
      <textarea
        ref={inputRef}
        value={title}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Enter a title for this card..."
        className="add-card-input"
        aria-label="Card title"
        rows={3}
        autoFocus
      />
      <div className="add-card-actions">
        <button
          onClick={handleSubmit}
          className="add-card-submit"
          type="button"
          disabled={!title.trim()}
          aria-label="Add card"
        >
          Add Card
        </button>
        <button
          onClick={handleCancel}
          className="add-card-cancel"
          type="button"
          aria-label="Cancel"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
