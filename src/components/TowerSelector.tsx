import { useGameStore } from "../store/gameStore";
import styled from "styled-components";
import { useShallow } from "zustand/shallow";

const SelectorContainer = styled.div`
  background: rgba(0, 0, 0, 0.7);
  padding: 10px;
  border-radius: 8px;
  display: flex;
  gap: 10px;
`;

const TowerButton = styled.button<{ $isSelected: boolean }>`
  background: ${(props) => (props.$isSelected ? "#4a5568" : "#2d3748")};
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
    background: #4a5568;
  }
`;

export const TowerSelector = () => {
  const [money, selectedTowerType, setSelectedTowerType] = useGameStore(
    useShallow((state) => [
      state.money,
      state.selectedTowerType,
      state.setSelectedTowerType,
    ])
  );

  const towers = [
    { type: "basic" as const, cost: 50, name: "Basic Tower" },
    { type: "sniper" as const, cost: 75, name: "Sniper Tower" },
    { type: "heavy" as const, cost: 100, name: "Heavy Tower" },
  ];

  return (
    <SelectorContainer>
      {towers.map((tower) => (
        <TowerButton
          key={tower.type}
          onClick={() => setSelectedTowerType(tower.type)}
          disabled={money < tower.cost}
          $isSelected={selectedTowerType === tower.type}
        >
          {tower.name} (${tower.cost})
        </TowerButton>
      ))}
    </SelectorContainer>
  );
};
