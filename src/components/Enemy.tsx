import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { useGameStore } from "../store/gameStore";
import { Mesh } from "three";

interface EnemyProps {
  id: string;
  position: { x: number; z: number };
}

export default function Enemy({ id, position }: EnemyProps) {
  const meshRef = useRef<Mesh>(null);
  const pathIndex = useRef(0);
  const path = useGameStore((state) => state.path);
  const removeEnemy = useGameStore((state) => state.removeEnemy);
  const enemy = useGameStore((state) => state.enemies.find((e) => e.id === id));

  useFrame(() => {
    if (!meshRef.current || pathIndex.current >= path.length) return;

    const currentTarget = path[pathIndex.current];
    const mesh = meshRef.current;

    const dx = currentTarget.x - mesh.position.x;
    const dz = currentTarget.z - mesh.position.z;
    const distance = Math.sqrt(dx * dx + dz * dz);

    if (distance < 0.1) {
      pathIndex.current++;
      if (pathIndex.current >= path.length) {
        useGameStore.getState().decrementLives();
        removeEnemy(id);
      }
    } else {
      const newX = mesh.position.x + (dx / distance) * 0.05;
      const newZ = mesh.position.z + (dz / distance) * 0.05;

      mesh.position.x = newX;
      mesh.position.z = newZ;

      useGameStore.getState().updateEnemyPosition(id, { x: newX, z: newZ });
    }
  });

  const healthPercent = enemy ? (enemy?.health / enemy?.maxHealth) * 100 : 0;

  return (
    <mesh ref={meshRef} position={[position.x, 0, position.z]}>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial color="red" />
      <Html
        position={[0, 1, 0]}
        center
        style={{
          width: "50px",
          transform: "translateX(-50%)",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "4px",
            background: "#333",
            borderRadius: "2px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${healthPercent}%`,
              height: "100%",
              background: "green",
              transition: "width 0.2s ease",
            }}
          />
        </div>
      </Html>
    </mesh>
  );
}
