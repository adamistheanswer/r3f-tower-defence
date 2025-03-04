import { Text } from "@react-three/drei";
import { Suspense } from "react";

export function GameOver() {
  return (
    <Suspense fallback={null}>
      <Text color="red" anchorY="middle" fontSize={2} position={[0, 5, 0]}>
        GAME OVER
      </Text>
    </Suspense>
  );
}
