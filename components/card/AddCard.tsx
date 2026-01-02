"use client";

import { useState, useRef, useEffect } from "react";
import { useBoardStore } from "@/store/boardStore";
import { generateId, getCurrentTimestamp } from "@/utils/helpers";
import type { Card, List } from "@/types";

interface AddCardProps {
  list: List;
}

export const AddCard = ({ list }: AddCardProps) => {
  const addCard = useBoardStore((state) => state.addCard);
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      <input
        ref={inputRef}
        type="text"
        value={title}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Enter a title for this card..."
        className="add-card-input"
        aria-label="Card title"
      />
      <div className="add-card-actions">
        <button
          onClick={handleSubmit}
          className="add-card-submit"
          type="button"
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
