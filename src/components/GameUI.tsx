import React from "react";
import { useGameStore } from "../store/gameStore";
import styled from "styled-components";
import { useShallow } from "zustand/shallow";

const StatsContainer = styled.div`
  background: rgba(0, 0, 0, 0.7);
  padding: 10px 20px;
  border-radius: 8px;
  color: white;
  display: flex;
  gap: 20px;
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

const Button = styled.button`
  background: #4a5568;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  &:hover:not(:disabled) {
    background: #2d3748;
  }
`;

export const GameUI: React.FC = () => {
  const [money, lives, wave, isPlaying, startWave, resetGame] = useGameStore(
    useShallow((state) => [
      state.money,
      state.lives,
      state.wave,
      state.isPlaying,
      state.startWave,
      state.resetGame,
    ])
  );

  return (
    <StatsContainer>
      <StatItem>💰 ${money}</StatItem>
      <StatItem>❤️ {lives}</StatItem>
      <StatItem>🌊 Wave {wave}</StatItem>
      <Button onClick={startWave} disabled={isPlaying}>
        {isPlaying ? "Wave in Progress" : "Start Wave"}
      </Button>
      <Button onClick={resetGame}>Reset Game</Button>
    </StatsContainer>
  );
};
