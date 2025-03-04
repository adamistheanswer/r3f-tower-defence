import { useRef, useEffect } from "react";
import { Grid, Line } from "@react-three/drei";
import Tower from "./Tower";
import Enemy from "./Enemy";
import { useGameStore } from "../store/gameStore";
import { GameOver } from "./GameOver";
import { ThreeEvent } from "@react-three/fiber";
import { Group } from "three";

export default function GameBoard() {
  const boardRef = useRef<Group>(null);
  const path = useGameStore((state) => state.path);
  const enemies = useGameStore((state) => state.enemies);
  const isPlaying = useGameStore((state) => state.isPlaying);
  const spawnEnemy = useGameStore((state) => state.spawnEnemy);
  const lives = useGameStore((state) => state.lives);
  const selectedTowerType = useGameStore((state) => state.selectedTowerType);
  const placeTower = useGameStore((state) => state.placeTower);

  useEffect(() => {
    if (isPlaying && lives > 0) {
      const spawnInterval = setInterval(() => {
        spawnEnemy();
      }, 1000);

      return () => clearInterval(spawnInterval);
    }
  }, [isPlaying, lives, spawnEnemy]);

  const pathPoints = path.map(
    (point) => [point.x, 0.1, point.z] as [number, number, number]
  );

  const handlePlaneClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    if (!selectedTowerType) return;
    const x = Math.round(event.point.x);
    const z = Math.round(event.point.z);
    placeTower(x, z, selectedTowerType);
  };

  return (
    <group ref={boardRef}>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.2, 0]}
        onClick={handlePlaneClick}
      >
        <planeGeometry args={[30, 20]} />
        <meshBasicMaterial visible={false} />
      </mesh>

      <Grid
        args={[30, 20]}
        cellSize={1}
        cellThickness={0.1}
        cellColor="#6f6f6f"
        position={[0, -0.1, 0]}
      />
      <Line points={pathPoints} color="yellow" lineWidth={5} dashed={false} />

      {useGameStore((state) => state.towers).map((tower) => (
        <Tower
          key={tower.id}
          position={[tower.x, 0, tower.y]}
          type={tower.type}
        />
      ))}

      {lives > 0 &&
        enemies.map((enemy) => (
          <Enemy key={enemy.id} id={enemy.id} position={enemy.position} />
        ))}
      {lives <= 0 && <GameOver />}
    </group>
  );
}
