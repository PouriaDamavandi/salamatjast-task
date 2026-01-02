"use client";

import { useState, useRef, useEffect } from "react";
import { useBoardStore } from "@/store/boardStore";

export const BoardHeader = () => {
  const board = useBoardStore((state) => state.board);
  const updateBoardTitle = useBoardStore((state) => state.updateBoardTitle);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(board?.title || "");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (board?.title) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTitle(board.title);
    }
  }, [board?.title]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    if (title.trim() && board) {
      updateBoardTitle(title.trim());
    } else if (board) {
      setTitle(board.title);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.stopPropagation();
    if (e.key === "Enter") {
      inputRef.current?.blur();
    } else if (e.key === "Escape") {
      if (board) {
        setTitle(board.title);
      }
      setIsEditing(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  if (!board) {
    return null;
  }

  return (
    <header className="board-header">
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={title}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="board-title-input"
          aria-label="Board title"
        />
      ) : (
        <h1
          onClick={handleClick}
          className="board-title"
          role="button"
          tabIndex={0}
          aria-label={`Board title: ${board.title}. Click to edit.`}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleClick();
            }
          }}
        >
          {board.title}
        </h1>
      )}
    </header>
  );
};
