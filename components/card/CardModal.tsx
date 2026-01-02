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
  const cards = useBoardStore((state) => state.cards);

  const [title, setTitle] = useState(card?.title || "");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [commentText, setCommentText] = useState("");
  const titleInputRef = useRef<HTMLInputElement>(null);
  const commentInputRef = useRef<HTMLTextAreaElement>(null);

  const currentCard = card ? cards[card.id] : null;

  useEffect(() => {
    if (card) {
      setTitle(card.title);
      setIsEditingTitle(false);
      setCommentText("");
    }
  }, [card]);

  useEffect(() => {
    if (isOpen && isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, [isOpen, isEditingTitle]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
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
  }, [isOpen, onClose]);

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
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleCommentSubmit();
    }
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCommentText(e.target.value);
  };

  if (!isOpen || !card || !currentCard) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button
          className="modal-close-button"
          onClick={onClose}
          aria-label="Close modal"
          type="button"
        >
          ×
        </button>

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
            <h3 className="modal-section-title">Comments</h3>
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
