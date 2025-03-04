import React, { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useGameStore } from "../store/gameStore";
import { Mesh } from "three";

interface Position {
  x: number;
  y: number;
  z: number;
}

interface Target {
  id: string;
}

interface ProjectileProps {
  startPosition: Position;
  target: Target;
  damage: number;
  onComplete: () => void;
}

export default function Projectile({
  startPosition,
  target,
  damage,
  onComplete,
}: ProjectileProps) {
  const meshRef = useRef<Mesh>(null);
  const [hasHit, setHasHit] = useState(false);
  const damageEnemy = useGameStore((state) => state.damageEnemy);
  const enemies = useGameStore((state) => state.enemies);

  useFrame((_, delta) => {
    if (!meshRef.current || hasHit) return;

    const enemy = enemies.find((e) => e.id === target.id);
    if (!enemy) {
      onComplete();
      return;
    }

    const speed = 15 * delta;
    const currentPos = meshRef.current.position;

    const dx = enemy.position.x - currentPos.x;
    const dz = enemy.position.z - currentPos.z;
    const distance = Math.sqrt(dx * dx + dz * dz);

    if (distance < 0.5) {
      damageEnemy(target.id, damage);
      setHasHit(true);
      onComplete();
      return;
    }

    meshRef.current.position.x += (dx / distance) * speed;
    meshRef.current.position.z += (dz / distance) * speed;
  });

  if (hasHit) return null;

  return (
    <mesh
      ref={meshRef}
      position={[startPosition.x, startPosition.y, startPosition.z]}
    >
      <sphereGeometry args={[0.1]} />
      <meshBasicMaterial color="yellow" />
    </mesh>
  );
}
