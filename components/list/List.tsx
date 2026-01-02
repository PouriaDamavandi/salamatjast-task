"use client";

import { useSortable } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { ListHeader } from "./ListHeader";
import { AddCard } from "@/components/card/AddCard";
import { Card } from "@/components/card/Card";
import type { List as ListType, Card as CardType } from "@/types";

interface ListProps {
  list: ListType;
  cards: CardType[];
}

export const List = ({ list, cards }: ListProps) => {
  const {
    attributes,
    listeners,
    setNodeRef: setSortableRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: list.id,
  });

  const { setNodeRef: setDroppableRef } = useDroppable({
    id: `list-droppable-${list.id}`,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const setNodeRef = (node: HTMLDivElement | null) => {
    setSortableRef(node);
    setDroppableRef(node);
  };

  const cardIds = cards.map((card) => card.id);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="list"
      {...attributes}
      {...listeners}
    >
      <ListHeader list={list} />
      <SortableContext items={cardIds} strategy={verticalListSortingStrategy}>
        <div className="list-content">
          {cards.map((card) => (
            <Card key={card.id} card={card} />
          ))}
        </div>
      </SortableContext>
      <AddCard list={list} />
    </div>
  );
};
