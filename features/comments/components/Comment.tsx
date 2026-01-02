"use client";

import type { Comment as CommentType } from "@/shared/types";
import { formatRelativeTime } from "@/shared/utils/formatters";

interface CommentProps {
  comment: CommentType;
}

export const Comment = ({ comment }: CommentProps) => {
  return (
    <div className="comment">
      <div className="comment-content">{comment.text}</div>
      <div className="comment-date">
        {formatRelativeTime(comment.createdAt)}
      </div>
    </div>
  );
};
