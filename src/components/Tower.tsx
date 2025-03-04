import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useGameStore } from "../store/gameStore";
import Projectile from "./Projectile";
import { Group } from "three";

interface TowerProps {
  position: [number, number, number];
  type: "basic" | "sniper" | "heavy";
}

interface Enemy {
  id: string;
  position: { x: number; z: number };
  health: number;
  maxHealth: number;
}

interface ProjectileData {
  id: number;
  target: { id: string };
  damage: number;
  startTime: number;
  startPosition: { x: number; y: number; z: number };
}

export default function Tower({ position, type }: TowerProps) {
  const meshRef = useRef<Group>(null);
  const turretRef = useRef<Group>(null);
  const [projectiles, setProjectiles] = useState<ProjectileData[]>([]);
  const enemies = useGameStore((state) => state.enemies as Enemy[]);
  const lives = useGameStore((state) => state.lives);

  const towerColors = {
    basic: "blue",
    sniper: "purple",
    heavy: "orange",
  };

  const towerHeights = {
    basic: 1,
    sniper: 1.5,
    heavy: 0.8,
  };

  const stats = {
    basic: { damage: 5, range: 100, attackSpeed: 1 },
    sniper: { damage: 8, range: 50, attackSpeed: 0.5 },
    heavy: { damage: 10, range: 10, attackSpeed: 1.5 },
  };

  useFrame(() => {
    if (!meshRef.current || !turretRef.current || enemies.length === 0) return;

    let closestEnemy: Enemy | null = null;
    let closestDistance = Infinity;

    enemies.forEach((enemy) => {
      const distance = Math.sqrt(
        Math.pow(position[0] - enemy.position.x, 2) +
          Math.pow(position[2] - enemy.position.z, 2)
      );

      if (distance < stats[type].range && distance < closestDistance) {
        closestDistance = distance;
        closestEnemy = enemy;
      }
    });

    if (closestEnemy !== null) {
      //@ts-expect-error
      const dx = closestEnemy.position.x - position[0];
      //@ts-expect-error
      const dz = closestEnemy.position.z - position[2];
      const angle = Math.atan2(dx, dz);
      turretRef.current.rotation.y = angle;

      const now = Date.now();
      const lastShot = (meshRef.current as any).lastShot || 0;
      if (now - lastShot > 1000 / stats[type].attackSpeed) {
        (meshRef.current as any).lastShot = now;

        const barrelHeight = towerHeights[type] + 0.5;
        const turretAngle = turretRef.current.rotation.y;

        const barrelTipX = position[0] + Math.sin(turretAngle) * 0.6;
        const barrelTipZ = position[2] + Math.cos(turretAngle) * 0.6;

        setProjectiles((prev) => [
          ...prev,
          {
            id: Date.now(),
            target: {
              //@ts-expect-error
              id: closestEnemy.id,
            },
            damage: stats[type].damage,
            startTime: now,
            startPosition: {
              x: barrelTipX,
              y: position[1] + barrelHeight,
              z: barrelTipZ,
            },
          },
        ]);
      }
    }

    setProjectiles((prev) =>
      prev.filter((p) => Date.now() - p.startTime < 3000)
    );
  });

  return (
    <>
      <group ref={meshRef} position={position}>
        {/* Base */}
        <mesh position={[0, 0.25, 0]}>
          <cylinderGeometry args={[0.4, 0.5, 0.5, 8]} />
          <meshStandardMaterial color="#666666" />
        </mesh>
        {/* Turret */}
        <group ref={turretRef} position={[0, 0.5, 0]}>
          <mesh position={[0, 0.25, 0]}>
            <cylinderGeometry args={[0.3, 0.3, towerHeights[type], 8]} />
            <meshStandardMaterial color={towerColors[type]} />
          </mesh>
          <mesh position={[0, 0.5, 0.2]}>
            <boxGeometry args={[0.2, 0.2, 0.6]} />
            <meshStandardMaterial color={towerColors[type]} />
          </mesh>
        </group>
      </group>
      {lives > 0 &&
        projectiles.map((projectile) => (
          <Projectile
            key={projectile.id}
            startPosition={projectile.startPosition}
            target={projectile.target}
            damage={projectile.damage}
            onComplete={() => {
              setProjectiles((prev) =>
                prev.filter((p) => p.id !== projectile.id)
              );
            }}
          />
        ))}
    </>
  );
}
