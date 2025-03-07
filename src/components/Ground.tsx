import { Grid } from "@react-three/drei";
import { useControls } from "leva";

const Ground = () => {
  const { gridSize, ...gridConfig } = useControls({
    gridSize: [10.5, 10.5],
    cellSize: { value: 2.5, min: 0, max: 10, step: 0.1 },
    cellThickness: { value: 1.5, min: 0, max: 5, step: 0.1 },
    cellColor: "#ffffff",
    sectionSize: { value: 0, min: 0, max: 10, step: 0.1 },
    sectionThickness: { value: 0, min: 0, max: 5, step: 0.1 },
    sectionColor: "#ffffff",
    fadeDistance: { value: 100, min: 0, max: 100, step: 1 },
    fadeStrength: { value: 1, min: 0, max: 1, step: 0.1 },
    followCamera: true,
    infiniteGrid: true,
  });

  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.6, 0]}>
        <planeGeometry args={[1000, 1000]} />
        <meshStandardMaterial color="#EC5800" />
      </mesh>
      <Grid position={[0, -1.5, 0]} args={gridSize} {...gridConfig} />
    </>
  );
};

export default Ground;
