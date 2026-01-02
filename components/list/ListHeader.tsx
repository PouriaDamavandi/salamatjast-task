"use client";

import { useState, useRef, useEffect } from "react";
import type { List } from "@/types";
import { useBoardStore } from "@/store/boardStore";

interface ListHeaderProps {
  list: List;
}

export const ListHeader = ({ list }: ListHeaderProps) => {
  const updateListTitle = useBoardStore((state) => state.updateListTitle);
  const deleteList = useBoardStore((state) => state.deleteList);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(list.title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTitle(list.title);
  }, [list.title]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleTitleClick = () => {
    setIsEditing(true);
  };

  const handleTitleBlur = () => {
    if (title.trim()) {
      updateListTitle(list.id, title.trim());
    } else {
      setTitle(list.title);
    }
    setIsEditing(false);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      inputRef.current?.blur();
    } else if (e.key === "Escape") {
      setTitle(list.title);
      setIsEditing(false);
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete the list "${list.title}"?`)) {
      deleteList(list.id);
    }
  };

  const handleInteraction = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="list-header" onMouseDown={handleInteraction}>
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={title}
          onChange={handleTitleChange}
          onBlur={handleTitleBlur}
          onKeyDown={handleTitleKeyDown}
          onMouseDown={handleInteraction}
          className="list-title-input"
          aria-label="List title"
        />
      ) : (
        <h3
          onClick={handleTitleClick}
          className="list-title"
          role="button"
          tabIndex={0}
          aria-label={`List title: ${list.title}. Click to edit.`}
          onKeyDown={(e) => {
            handleInteraction(e);
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleTitleClick();
            }
          }}
          onMouseDown={handleInteraction}
        >
          {list.title}
        </h3>
      )}
      <button
        onClick={handleDelete}
        onMouseDown={handleInteraction}
        className="list-delete-button"
        aria-label={`Delete list ${list.title}`}
        type="button"
      >
        ×
      </button>
    </div>
  );
};
