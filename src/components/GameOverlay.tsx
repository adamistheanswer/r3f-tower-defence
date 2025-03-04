import React from "react";
import { GameUI } from "./GameUI";
import { TowerSelector } from "./TowerSelector";
import styled from "styled-components";

const OverlayContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 10;
`;

const TopBar = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  right: 20px;
  display: flex;
  justify-content: space-between;
  pointer-events: auto;
`;

const BottomBar = styled.div`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  pointer-events: auto;
`;

export const GameOverlay: React.FC = () => {
  return (
    <OverlayContainer>
      <TopBar>
        <GameUI />
      </TopBar>
      <BottomBar>
        <TowerSelector />
      </BottomBar>
    </OverlayContainer>
  );
};
