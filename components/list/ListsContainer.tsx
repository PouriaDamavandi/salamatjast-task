"use client";

import { useMemo, useCallback } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { useBoardStore } from "@/store/boardStore";
import { useBoard } from "@/hooks/useBoard";
import { List } from "./List";
import { AddList } from "./AddList";
import type { List as ListType, Card as CardType } from "@/types";

interface ListsContainerProps {
  onCardClick?: (cardId: string) => void;
}

export const ListsContainer = ({ onCardClick }: ListsContainerProps) => {
  const { board, lists, cards } = useBoard();
  const reorderLists = useBoardStore((state) => state.reorderLists);
  const reorderCardsInList = useBoardStore((state) => state.reorderCardsInList);
  const moveCard = useBoardStore((state) => state.moveCard);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 1,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 5,
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
    return null;
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (!over || !board) return;

      const activeId = active.id as string;
      const overId = over.id as string;

      // Handle list drag
      if (isListId(activeId) && isListId(overId)) {
        if (activeId !== overId) {
          const oldIndex = board.listIds.indexOf(activeId);
          const newIndex = board.listIds.indexOf(overId);
          const newListIds = arrayMove(board.listIds, oldIndex, newIndex);
          reorderLists(newListIds);
        }
        return;
      }

      // Handle card drag
      if (isCardId(activeId)) {
        const activeCard = cards[activeId];
        if (!activeCard) return;

        const activeListId = activeCard.listId;
        const activeList = lists[activeListId];
        if (!activeList) return;

        // Check if dropped on another list (droppable area)
        const targetListId = getListIdFromDroppable(overId);
        if (targetListId && targetListId !== activeListId) {
          // Move card to another list (at the end)
          const targetList = lists[targetListId];
          if (targetList) {
            moveCard(activeId, targetListId, targetList.cardIds.length);
          }
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
          } else {
            // Move card to different list (before the over card)
            const targetList = lists[overCard.listId];
            if (targetList) {
              const targetIndex = targetList.cardIds.indexOf(overId);
              moveCard(activeId, overCard.listId, targetIndex);
            }
          }
          return;
        }

        // If dropped on the same list droppable area, do nothing
        if (targetListId && targetListId === activeListId) {
          return;
        }
      }
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

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
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
            />
          ))}
          <AddList />
        </div>
      </SortableContext>
    </DndContext>
  );
};
