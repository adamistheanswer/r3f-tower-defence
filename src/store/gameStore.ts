import { create } from "zustand";

type TowerType = "basic" | "sniper" | "heavy";

interface PathPoint {
  x: number;
  z: number;
}

interface Tower {
  id: string;
  type: TowerType;
  x: number;
  y: number;
  lastShot?: number;
}

interface Enemy {
  id: string;
  position: { x: number; z: number };
  health: number;
  maxHealth: number;
}

interface GameState {
  money: number;
  lives: number;
  towers: Tower[];
  selectedTowerType: TowerType | null;
  wave: number;
  isPlaying: boolean;
  path: PathPoint[];
  enemies: Enemy[];

  addMoney: (amount: number) => void;
  removeMoney: (amount: number) => boolean;
  decrementLives: () => void;
  placeTower: (x: number, y: number, type: TowerType) => boolean;
  removeTower: (id: string) => void;
  setSelectedTowerType: (type: TowerType | null) => void;
  startWave: () => void;
  resetGame: () => void;
  spawnEnemy: () => void;
  removeEnemy: (id: string) => void;
  damageEnemy: (id: string, damage: number) => void;
  updateEnemyPosition: (id: string, position: { x: number; z: number }) => void;
}

const TOWER_COSTS: Record<TowerType, number> = {
  basic: 50,
  sniper: 75,
  heavy: 100,
};

const INITIAL_STATE = {
  money: 1000,
  lives: 5,
  towers: [],
  selectedTowerType: null,
  wave: 0,
  isPlaying: false,
  path: [
    { x: -15, z: 0 },
    { x: -10, z: 0 },
    { x: -10, z: 5 },
    { x: 5, z: 5 },
    { x: 5, z: -5 },
    { x: 10, z: -5 },
    { x: 15, z: -5 },
  ],
  enemies: [],
};

export const useGameStore = create<GameState>((set, get) => ({
  ...INITIAL_STATE,
  enemies: [] as Enemy[],

  addMoney: (amount) =>
    set((state) => ({
      money: state.money + amount,
    })),

  removeMoney: (amount) => {
    const { money } = get();
    if (money >= amount) {
      set({ money: money - amount });
      return true;
    }
    return false;
  },

  decrementLives: () =>
    set((state) => ({
      lives: Math.max(0, state.lives - 1),
    })),

  placeTower: (x, y, type) => {
    const { money, towers } = get();
    const cost = TOWER_COSTS[type];

    if (money < cost) return false;

    const newTower = {
      id: `tower-${Date.now()}`,
      type,
      x,
      y,
    };

    set({
      towers: [...towers, newTower],
      money: money - cost,
    });
    return true;
  },

  removeTower: (id) =>
    set((state) => ({
      towers: state.towers.filter((tower) => tower.id !== id),
    })),

  setSelectedTowerType: (type) => set({ selectedTowerType: type }),

  startWave: () =>
    set((state) => ({
      wave: state.wave + 1,
      isPlaying: true,
    })),

  resetGame: () => set(INITIAL_STATE),

  spawnEnemy: () => {
    const { path } = get();
    const startPoint = path[0];
    const maxHealth = 100;
    const newEnemy = {
      id: `enemy-${Date.now()}`,
      position: { x: startPoint.x, z: startPoint.z },
      health: maxHealth,
      maxHealth: maxHealth,
    };
    set((state) => ({
      enemies: [...state.enemies, newEnemy],
    }));
  },

  removeEnemy: (id) =>
    set((state) => ({
      enemies: state.enemies.filter((enemy) => enemy.id !== id),
    })),

  damageEnemy: (id, damage) =>
    set((state) => ({
      enemies: state.enemies
        .map((enemy) =>
          enemy.id === id
            ? { ...enemy, health: Math.max(0, enemy.health - damage) }
            : enemy
        )
        .filter((enemy) => enemy.health > 0),
    })),

  updateEnemyPosition: (id, position) =>
    set((state) => ({
      enemies: state.enemies.map((enemy) =>
        enemy.id === id ? { ...enemy, position } : enemy
      ),
    })),
}));
