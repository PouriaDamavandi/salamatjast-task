"use client";

import { useState, useRef, useEffect } from "react";
import type { List } from "@/types";
import { useBoardStore } from "@/store/boardStore";
import { ConfirmModal } from "@/components/ui/ConfirmModal";

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
  const [showDeleteListModal, setShowDeleteListModal] = useState(false);
  const [showDeleteAllCardsModal, setShowDeleteAllCardsModal] = useState(false);
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
    setShowDeleteListModal(true);
  };

  const handleDeleteAllCards = () => {
    setIsMenuOpen(false);
    const cardCount = list.cardIds.length;
    if (cardCount === 0) {
      return;
    }
    setShowDeleteAllCardsModal(true);
  };

  const handleConfirmDeleteList = () => {
    deleteList(list.id);
    setShowDeleteListModal(false);
  };

  const handleConfirmDeleteAllCards = () => {
    deleteAllCardsFromList(list.id);
    setShowDeleteAllCardsModal(false);
  };

  const handleCancelDeleteList = () => {
    setShowDeleteListModal(false);
  };

  const handleCancelDeleteAllCards = () => {
    setShowDeleteAllCardsModal(false);
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
      <ConfirmModal
        isOpen={showDeleteListModal}
        title="Delete List"
        message={`Are you sure you want to delete the list "${list.title}"? This action cannot be undone and will also delete all cards in this list.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDeleteList}
        onCancel={handleCancelDeleteList}
        variant="danger"
      />
      <ConfirmModal
        isOpen={showDeleteAllCardsModal}
        title="Delete All Cards"
        message={`Are you sure you want to delete all ${list.cardIds.length} card${
          list.cardIds.length > 1 ? "s" : ""
        } from "${list.title}"? This action cannot be undone.`}
        confirmText="Delete All"
        cancelText="Cancel"
        onConfirm={handleConfirmDeleteAllCards}
        onCancel={handleCancelDeleteAllCards}
        variant="danger"
      />
    </div>
  );
};
