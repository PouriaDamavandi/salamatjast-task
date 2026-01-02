"use client";

import { useState, useRef, useEffect } from "react";
import { useBoardStore } from "@/store/boardStore";
import { generateId, getCurrentTimestamp } from "@/utils/helpers";
import type { Card as CardType, Comment as CommentType } from "@/types";
import { CommentList } from "./CommentList";

interface CardModalProps {
  card: CardType | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CardModal = ({ card, isOpen, onClose }: CardModalProps) => {
  const updateCardTitle = useBoardStore((state) => state.updateCardTitle);
  const addComment = useBoardStore((state) => state.addComment);
  const deleteCard = useBoardStore((state) => state.deleteCard);
  const cards = useBoardStore((state) => state.cards);

  const [title, setTitle] = useState(card?.title || "");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const commentInputRef = useRef<HTMLTextAreaElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const currentCard = card ? cards[card.id] : null;

  useEffect(() => {
    if (card) {
      setTitle(card.title);
      setIsEditingTitle(false);
      setCommentText("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [card?.id]);

  useEffect(() => {
    if (isOpen && isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, [isOpen, isEditingTitle]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        if (isMenuOpen) {
          setIsMenuOpen(false);
        } else {
          onClose();
        }
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose, isMenuOpen]);

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

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleTitleClick = () => {
    setIsEditingTitle(true);
  };

  const handleTitleBlur = () => {
    if (title.trim() && card) {
      updateCardTitle(card.id, title.trim());
    } else if (card) {
      setTitle(card.title);
    }
    setIsEditingTitle(false);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.stopPropagation();
    if (e.key === "Enter") {
      e.currentTarget.blur();
    } else if (e.key === "Escape") {
      if (card) {
        setTitle(card.title);
      }
      setIsEditingTitle(false);
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleCommentSubmit = () => {
    if (commentText.trim() && card) {
      const newComment: CommentType = {
        id: generateId("comment"),
        text: commentText.trim(),
        createdAt: getCurrentTimestamp(),
      };
      addComment(card.id, newComment);
      setCommentText("");
      if (commentInputRef.current) {
        commentInputRef.current.focus();
      }
    }
  };

  const handleCommentKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    e.stopPropagation();
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleCommentSubmit();
    }
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCommentText(e.target.value);
  };

  const handleMenuToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

  const handleDeleteCard = () => {
    if (
      card &&
      confirm(`Are you sure you want to delete the card "${card.title}"?`)
    ) {
      deleteCard(card.id);
      setIsMenuOpen(false);
      onClose();
    }
  };

  if (!isOpen || !card || !currentCard) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-actions">
          <div className="modal-menu-container" ref={menuRef}>
            <button
              onClick={handleMenuToggle}
              className="modal-menu-button"
              aria-label="Card options"
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
              <div className="modal-menu-dropdown">
                <button
                  onClick={handleDeleteCard}
                  className="modal-menu-item modal-menu-item-danger"
                  type="button"
                  aria-label="Delete card"
                >
                  Delete card
                </button>
              </div>
            )}
          </div>
          <button
            className="modal-close-button"
            onClick={onClose}
            aria-label="Close modal"
            type="button"
          >
            ×
          </button>
        </div>

        <div className="modal-header">
          {isEditingTitle ? (
            <input
              ref={titleInputRef}
              type="text"
              value={title}
              onChange={handleTitleChange}
              onBlur={handleTitleBlur}
              onKeyDown={handleTitleKeyDown}
              className="modal-title-input"
              aria-label="Card title"
            />
          ) : (
            <h2
              className="modal-title"
              onClick={handleTitleClick}
              role="button"
              tabIndex={0}
              aria-label={`Card title: ${currentCard.title}. Click to edit.`}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleTitleClick();
                }
              }}
            >
              {currentCard.title}
            </h2>
          )}
        </div>

        <div className="modal-body">
          <div className="modal-section">
            <h3 className="modal-section-title">
              Comments ({currentCard.comments.length})
            </h3>
            <CommentList comments={currentCard.comments} />
            <div className="modal-add-comment">
              <textarea
                ref={commentInputRef}
                value={commentText}
                onChange={handleCommentChange}
                onKeyDown={handleCommentKeyDown}
                placeholder="Write a comment... (Ctrl/Cmd + Enter to submit)"
                className="modal-comment-input"
                rows={3}
                aria-label="Comment text"
              />
              <button
                onClick={handleCommentSubmit}
                className="modal-comment-submit"
                type="button"
                disabled={!commentText.trim()}
                aria-label="Add comment"
              >
                Add Comment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
