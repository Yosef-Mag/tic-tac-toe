import { Canvas as ThreeCanvas } from "@react-three/fiber";
import Ground from "./Ground";
import { OrbitControls, Sky, Stage, StatsGl } from "@react-three/drei";
import Player from "./Player";

const Canvas = () => {
  return (
    <ThreeCanvas
      className="w-full h-full overflow-hidden"
      frameloop="always"
      shadows
    >
      <Stage>
        <Player />
      </Stage>
      <Sky
        distance={450000}
        sunPosition={[0, 1, 0]}
        inclination={0}
        azimuth={0.25}
      />
      <Ground />

      <OrbitControls />
      <StatsGl className="absolute bottom-2 left-4" />
    </ThreeCanvas>
  );
};

export default Canvas;
