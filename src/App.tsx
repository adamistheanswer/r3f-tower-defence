import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import "./App.css";
import { GameOverlay } from "./components/GameOverlay";
import GameBoard from "./components/GameBoard";

export default function App() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas camera={{ position: [0, 15, 20], fov: 75 }}>
        <color attach="background" args={["#212121"]} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <GameBoard />
        <OrbitControls />
      </Canvas>
      <GameOverlay />
    </div>
  );
}
