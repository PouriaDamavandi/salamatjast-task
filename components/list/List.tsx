"use client";

import { memo, useMemo, useCallback } from "react";
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
import { EmptyState } from "@/components/ui/EmptyState";
import type { List as ListType, Card as CardType } from "@/types";

interface ListProps {
  list: ListType;
  cards: CardType[];
  onCardClick?: (cardId: string) => void;
}

const ListComponent = ({ list, cards, onCardClick }: ListProps) => {
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

  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: `list-droppable-${list.id}`,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? "none" : transition,
    opacity: isDragging ? 0.3 : 1,
  };

  const cardIds = useMemo(() => cards.map((card) => card.id), [cards]);

  const handleCardClick = useCallback(
    (cardId: string) => {
      onCardClick?.(cardId);
    },
    [onCardClick]
  );

  return (
    <div
      ref={setSortableRef}
      style={style}
      className={`list ${isDragging ? "dragging" : ""}`}
      {...attributes}
      {...listeners}
    >
      <ListHeader list={list} />
      <div ref={setDroppableRef}>
        <SortableContext items={cardIds} strategy={verticalListSortingStrategy}>
          <div
            className={`list-content ${isOver && cards.length === 0 ? "list-content-drag-over" : ""}`}
          >
            {cards.length > 0 ? (
              cards.map((card) => (
                <Card
                  key={card.id}
                  card={card}
                  onClick={() => handleCardClick(card.id)}
                />
              ))
            ) : (
              <EmptyState
                message="No cards yet. Drop a card here or add one below."
                className={isOver ? "empty-state-drag-over" : ""}
              />
            )}
          </div>
        </SortableContext>
      </div>
      <AddCard list={list} />
    </div>
  );
};

export const List = memo(ListComponent);
