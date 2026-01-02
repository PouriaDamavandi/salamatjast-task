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
import { AddCard } from "@/features/cards/components/AddCard";
import { Card } from "@/features/cards/components/Card";
import { EmptyState } from "@/shared/components/ui/EmptyState";
import type { List as ListType, Card as CardType } from "@/shared/types";

interface ListProps {
  list: ListType;
  cards: CardType[];
  onCardClick?: (cardId: string) => void;
  isCardDragging?: boolean;
}

const ListComponent = ({
  list,
  cards,
  onCardClick,
  isCardDragging,
}: ListProps) => {
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

  const { setNodeRef: setStartDroppableRef, isOver: isStartOver } =
    useDroppable({
      id: `list-start-${list.id}`,
    });

  const { setNodeRef: setEndDroppableRef, isOver: isEndOver } = useDroppable({
    id: `list-end-${list.id}`,
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
      <div
        ref={setStartDroppableRef}
        className={`list-start-drop-zone ${
          isStartOver && isCardDragging ? "list-start-drop-zone-active" : ""
        }`}
      />
      <div
        ref={setDroppableRef}
        className={`list-droppable-area ${
          isOver && isCardDragging ? "list-droppable-area-active" : ""
        }`}
      >
        <SortableContext items={cardIds} strategy={verticalListSortingStrategy}>
          <div className="list-content">
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
                className={
                  isOver && isCardDragging ? "empty-state-drag-over" : ""
                }
              />
            )}
          </div>
        </SortableContext>
      </div>
      <div
        ref={setEndDroppableRef}
        className={`list-end-drop-zone ${
          isEndOver && isCardDragging ? "list-end-drop-zone-active" : ""
        }`}
      >
        <AddCard list={list} />
      </div>
    </div>
  );
};

export const List = memo<ListProps>(ListComponent);
