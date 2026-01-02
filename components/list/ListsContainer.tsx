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
} from "@dnd-kit/sortable";
import { useBoardStore } from "@/store/boardStore";
import { useBoard } from "@/hooks/useBoard";
import { List } from "./List";
import { AddList } from "./AddList";
import type { List as ListType } from "@/types";
import { Card } from "@/components/card/Card";

export const ListsContainer = () => {
  const { board, lists, cards } = useBoard();
  const reorderLists = useBoardStore((state) => state.reorderLists);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || !board) return;

    if (active.id !== over.id) {
      const oldIndex = board.listIds.indexOf(active.id as string);
      const newIndex = board.listIds.indexOf(over.id as string);

      const newListIds = [...board.listIds];
      const [removed] = newListIds.splice(oldIndex, 1);
      newListIds.splice(newIndex, 0, removed);

      reorderLists(newListIds);
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
              .filter((card) => card !== undefined);

            return (
              <List key={list.id} list={list}>
                {listCards.map((card) => (
                  <Card key={card.id} card={card} />
                ))}
              </List>
            );
          })}
          <AddList />
        </div>
      </SortableContext>
    </DndContext>
  );
};
