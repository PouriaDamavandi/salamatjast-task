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
  const deleteAllCardsFromList = useBoardStore(
    (state) => state.deleteAllCardsFromList
  );
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(list.title);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTitle(list.title);
  }, [list.title]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

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
    e.stopPropagation();
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
    setIsMenuOpen(false);
    if (confirm(`Are you sure you want to delete the list "${list.title}"?`)) {
      deleteList(list.id);
    }
  };

  const handleDeleteAllCards = () => {
    setIsMenuOpen(false);
    const cardCount = list.cardIds.length;
    if (cardCount === 0) {
      return;
    }
    if (
      confirm(
        `Are you sure you want to delete all ${cardCount} card${
          cardCount > 1 ? "s" : ""
        } from "${list.title}"?`
      )
    ) {
      deleteAllCardsFromList(list.id);
    }
  };

  const handleMenuToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
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
            e.stopPropagation();
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
      <div className="list-menu-container" ref={menuRef}>
        <button
          onClick={handleMenuToggle}
          onMouseDown={handleInteraction}
          className="list-menu-button"
          aria-label="List options"
          aria-expanded={isMenuOpen}
          type="button"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="4" cy="8" r="1.5" fill="currentColor" />
            <circle cx="8" cy="8" r="1.5" fill="currentColor" />
            <circle cx="12" cy="8" r="1.5" fill="currentColor" />
          </svg>
        </button>
        {isMenuOpen && (
          <div className="list-menu-dropdown">
            <button
              onClick={handleDeleteAllCards}
              className="list-menu-item list-menu-item-danger"
              type="button"
              aria-label="Delete all cards"
              disabled={list.cardIds.length === 0}
            >
              Delete all cards
            </button>
            <button
              onClick={handleDelete}
              className="list-menu-item list-menu-item-danger"
              type="button"
              aria-label="Delete list"
            >
              Delete list
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
