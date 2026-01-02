"use client";

import { useState, useRef, useEffect } from "react";
import { useBoardStore } from "@/store/boardStore";
import { generateId, getCurrentTimestamp } from "@/utils/helpers";
import type { List } from "@/types";

export const AddList = () => {
  const board = useBoardStore((state) => state.board);
  const addList = useBoardStore((state) => state.addList);
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
    if (title.trim() && board) {
      const newList: List = {
        id: generateId("list"),
        title: title.trim(),
        boardId: board.id,
        cardIds: [],
        createdAt: getCurrentTimestamp(),
        updatedAt: getCurrentTimestamp(),
      };
      addList(newList);
      setTitle("");
    }
    setIsAdding(false);
  };

  const handleCancel = () => {
    setTitle("");
    setIsAdding(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.stopPropagation();
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
        className="add-list-button"
        type="button"
        aria-label="Add new list"
      >
        + Add another list
      </button>
    );
  }

  return (
    <div className="add-list-form">
      <input
        ref={inputRef}
        type="text"
        value={title}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Enter list title..."
        className="add-list-input"
        aria-label="List title"
      />
      <div className="add-list-actions">
        <button
          onClick={handleSubmit}
          className="add-list-submit"
          type="button"
          aria-label="Add list"
        >
          Add List
        </button>
        <button
          onClick={handleCancel}
          className="add-list-cancel"
          type="button"
          aria-label="Cancel"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
