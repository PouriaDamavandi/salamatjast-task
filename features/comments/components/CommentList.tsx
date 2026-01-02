"use client";

import { Comment } from "./Comment";
import type { Comment as CommentType } from "@/shared/types";

interface CommentListProps {
  comments: CommentType[];
}

export const CommentList = ({ comments }: CommentListProps) => {
  if (comments.length === 0) {
    return (
      <div className="comment-list-empty">
        <p>No comments yet. Be the first to comment!</p>
      </div>
    );
  }

  return (
    <div className="comment-list">
      {comments.map((comment) => (
        <Comment key={comment.id} comment={comment} />
      ))}
    </div>
  );
};

