"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ListHeader } from "./ListHeader";
import type { List as ListType } from "@/types";

interface ListProps {
  list: ListType;
  children?: React.ReactNode;
}

export const List = ({ list, children }: ListProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: list.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="list"
      {...attributes}
      {...listeners}
    >
      <ListHeader list={list} />
      <div className="list-content">{children}</div>
    </div>
  );
};
