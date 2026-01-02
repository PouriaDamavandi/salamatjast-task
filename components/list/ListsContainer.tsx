"use client";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
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

export const ListsContainer = () => {
  const { board, lists, cards } = useBoard();
  const reorderLists = useBoardStore((state) => state.reorderLists);
  const reorderCardsInList = useBoardStore((state) => state.reorderCardsInList);
  const moveCard = useBoardStore((state) => state.moveCard);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const isListId = (id: string): boolean => {
    return id in lists;
  };

  const isCardId = (id: string): boolean => {
    return id in cards;
  };

  const getListIdFromDroppable = (id: string): string | null => {
    if (id.startsWith("list-droppable-")) {
      return id.replace("list-droppable-", "");
    }
    return null;
  };

  const handleDragEnd = (event: DragEndEvent) => {
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
          const newCardIds = arrayMove(activeList.cardIds, oldIndex, newIndex);
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
  };

  if (!board) {
    return null;
  }

  const orderedLists = board.listIds
    .map((listId) => lists[listId])
    .filter((list): list is ListType => list !== undefined);

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
          {orderedLists.map((list) => {
            const listCards = list.cardIds
              .map((cardId) => cards[cardId])
              .filter((card): card is CardType => card !== undefined);

            return <List key={list.id} list={list} cards={listCards} />;
          })}
          <AddList />
        </div>
      </SortableContext>
    </DndContext>
  );
};
