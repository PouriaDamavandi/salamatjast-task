"use client";

import { useMemo, useCallback, useState } from "react";
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { useBoard } from "@/shared/hooks/useBoard";
import { List } from "./List";
import { AddList } from "./AddList";
import { useListActions } from "../hooks/useListActions";
import { useCardActions } from "@/features/cards/hooks/useCardActions";
import type { List as ListType, Card as CardType } from "@/shared/types";

interface ListsContainerProps {
  onCardClick?: (cardId: string) => void;
}

export const ListsContainer = ({ onCardClick }: ListsContainerProps) => {
  const { board, lists, cards } = useBoard();
  const { reorderLists } = useListActions();
  const { reorderCardsInList, moveCard } = useCardActions();
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 2,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const isListId = useCallback(
    (id: string): boolean => {
      return id in lists;
    },
    [lists]
  );

  const isCardId = useCallback(
    (id: string): boolean => {
      return id in cards;
    },
    [cards]
  );

  const getListIdFromDroppable = useCallback((id: string): string | null => {
    if (id.startsWith("list-droppable-")) {
      return id.replace("list-droppable-", "");
    }
    if (id.startsWith("list-start-")) {
      return id.replace("list-start-", "");
    }
    if (id.startsWith("list-end-")) {
      return id.replace("list-end-", "");
    }
    return null;
  }, []);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (!over || !board) return;

      const activeId = active.id as string;
      const overId = over.id as string;

      // Handle list drag - only allow dropping on other lists, not cards
      if (isListId(activeId)) {
        // Check if dropped directly on another list
        if (isListId(overId)) {
          if (activeId !== overId) {
            const oldIndex = board.listIds.indexOf(activeId);
            const newIndex = board.listIds.indexOf(overId);
            if (oldIndex !== -1 && newIndex !== -1) {
              const newListIds = arrayMove(board.listIds, oldIndex, newIndex);
              reorderLists(newListIds);
            }
          }
          setActiveId(null);
          return;
        }

        // Check if dropped on a card drop zone - extract the list ID and treat as list drop
        const targetListIdFromDropZone = getListIdFromDroppable(overId);
        if (targetListIdFromDropZone && isListId(targetListIdFromDropZone)) {
          // Only allow if it's a different list
          if (activeId !== targetListIdFromDropZone) {
            const oldIndex = board.listIds.indexOf(activeId);
            const newIndex = board.listIds.indexOf(targetListIdFromDropZone);
            if (oldIndex !== -1 && newIndex !== -1) {
              const newListIds = arrayMove(board.listIds, oldIndex, newIndex);
              reorderLists(newListIds);
            }
          }
          setActiveId(null);
          return;
        }

        // If dropped on a card or invalid target, cancel silently
        setActiveId(null);
        return;
      }

      // Handle card drag
      if (isCardId(activeId)) {
        const activeCard = cards[activeId];
        if (!activeCard) return;

        const activeListId = activeCard.listId;
        const activeList = lists[activeListId];
        if (!activeList) return;

        // Check if dropped on start-of-list zone
        if (overId.startsWith("list-start-")) {
          const startListId = overId.replace("list-start-", "");
          if (startListId !== activeListId) {
            const targetList = lists[startListId];
            if (targetList) {
              moveCard(activeId, startListId, 0);
            }
          }
          setActiveId(null);
          return;
        }

        // Check if dropped on end-of-list zone
        if (overId.startsWith("list-end-")) {
          const endListId = overId.replace("list-end-", "");
          if (endListId !== activeListId) {
            const targetList = lists[endListId];
            if (targetList) {
              moveCard(activeId, endListId, targetList.cardIds.length);
            }
          }
          setActiveId(null);
          return;
        }

        // Check if dropped on list droppable area (middle of list)
        const targetListId = getListIdFromDroppable(overId);
        if (targetListId && targetListId !== activeListId) {
          // Move card to another list (at the end as fallback)
          const targetList = lists[targetListId];
          if (targetList) {
            moveCard(activeId, targetListId, targetList.cardIds.length);
          }
          setActiveId(null);
          return;
        }

        // Check if dropped on another card
        if (isCardId(overId)) {
          const overCard = cards[overId];
          if (!overCard) return;

          if (overCard.listId === activeListId) {
            // Reorder cards within the same list
            const oldIndex = activeList.cardIds.indexOf(activeId);
            const newIndex = activeList.cardIds.indexOf(overId);
            const newCardIds = arrayMove(
              activeList.cardIds,
              oldIndex,
              newIndex
            );
            reorderCardsInList(activeListId, newCardIds);
            setActiveId(null);
          } else {
            // Move card to different list (before the over card)
            const targetList = lists[overCard.listId];
            if (targetList) {
              const targetIndex = targetList.cardIds.indexOf(overId);
              moveCard(activeId, overCard.listId, targetIndex);
            }
          }
          setActiveId(null);
          return;
        }

        // If dropped on the same list droppable area, do nothing
        if (targetListId && targetListId === activeListId) {
          setActiveId(null);
          return;
        }
      }
      setActiveId(null);
    },
    [
      board,
      lists,
      cards,
      isListId,
      isCardId,
      getListIdFromDroppable,
      reorderLists,
      reorderCardsInList,
      moveCard,
    ]
  );

  const handleDragCancel = useCallback(() => {
    setActiveId(null);
  }, []);

  const orderedLists = useMemo(() => {
    if (!board) return [];
    return board.listIds
      .map((listId) => lists[listId])
      .filter((list): list is ListType => list !== undefined);
  }, [board, lists]);

  const listsWithCards = useMemo(() => {
    return orderedLists.map((list) => ({
      list,
      cards: list.cardIds
        .map((cardId) => cards[cardId])
        .filter((card): card is CardType => card !== undefined),
    }));
  }, [orderedLists, cards]);

  if (!board) {
    return null;
  }

  const activeCard = activeId && isCardId(activeId) ? cards[activeId] : null;
  const activeList = activeId && isListId(activeId) ? lists[activeId] : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
      modifiers={[]}
    >
      <SortableContext
        items={board.listIds}
        strategy={horizontalListSortingStrategy}
      >
        <div className="lists-container">
          {listsWithCards.map(({ list, cards: listCards }) => (
            <List
              key={list.id}
              list={list}
              cards={listCards}
              onCardClick={onCardClick}
              isCardDragging={!!activeCard}
            />
          ))}
          <AddList />
        </div>
      </SortableContext>
      <DragOverlay>
        {activeCard ? (
          <div className="card dragging drag-overlay">
            <div className="card-header">
              <p className="card-title">{activeCard.title}</p>
            </div>
            {activeCard.comments.length > 0 && (
              <div className="card-footer">
                <span className="card-comments-badge">
                  Comments ({activeCard.comments.length})
                </span>
              </div>
            )}
          </div>
        ) : activeList ? (
          <div className="list dragging drag-overlay">
            <div className="list-header">
              <h3 className="list-title">{activeList.title}</h3>
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};
