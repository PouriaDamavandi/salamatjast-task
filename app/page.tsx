"use client";

import { useState } from "react";
import { Board } from "@/components/board/Board";
import { ListsContainer } from "@/components/list/ListsContainer";
import { CardModal } from "@/components/card/CardModal";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ErrorDisplay } from "@/components/ui/ErrorDisplay";
import { EmptyState } from "@/components/ui/EmptyState";
import { useBoard } from "@/hooks/useBoard";
import { useBoardStore } from "@/store/boardStore";
import type { Card as CardType } from "@/types";

export default function Home() {
  const { board, isLoading, error } = useBoard();
  const cards = useBoardStore((state) => state.cards);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const selectedCard: CardType | null =
    selectedCardId && cards[selectedCardId] ? cards[selectedCardId] : null;

  const handleCardClick = (cardId: string) => {
    setSelectedCardId(cardId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCardId(null);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorDisplay error={error} />;
  }

  if (!board) {
    return <EmptyState message="No board found" />;
  }

  return (
    <>
      <Board>
        <ListsContainer onCardClick={handleCardClick} />
      </Board>
      <CardModal
        card={selectedCard}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
}
