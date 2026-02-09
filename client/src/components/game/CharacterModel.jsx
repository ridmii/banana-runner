import { Suspense } from 'react';
import { useGLTF } from '@react-three/drei';

function Model({ path, scale = 1 }) {
  const { scene } = useGLTF(path);
  return <primitive object={scene} scale={scale} />;
}

export default function CharacterModel({ name }) {
  const base = `/assets/models/${name}.glb`;
  return (
    <Suspense fallback={null}>
      <Model path={base} scale={1.2} />
    </Suspense>
  );
}

useGLTF.preload('/assets/models/monkey.glb');
useGLTF.preload('/assets/models/cat.glb');
useGLTF.preload('/assets/models/robot.glb');
