import { useFrame } from '@react-three/fiber';
import { useRef, useState } from 'react';
import CharacterModel from './CharacterModel.jsx';
import { RealisticMonkey, RealisticRobot } from './RealisticCharacters.jsx';

function Monkey({ crouch, tilt }) {
  return <RealisticMonkey crouch={crouch} tilt={tilt} />;
}

function Robot({ crouch, tilt }) {
  return <RealisticRobot crouch={crouch} tilt={tilt} />;
}

export default function Player({ position = [0, 1, 0], character = 'monkey', tilt = 0, crouch = false }) {
  const modelRef = useRef();
  const [animationState, setAnimationState] = useState('run');
  const USE_MODELS = import.meta.env.VITE_USE_MODELS === 'true';
  
  useFrame(() => {
    if (modelRef.current) {
      modelRef.current.position.set(position[0], position[1], position[2]);
      // Remove the spinning rotation - monkey should face forward
      // Lean when changing lanes for a game-like feel
      modelRef.current.rotation.z = tilt;
      // Simple crouch visual: squash vertically and lower slightly
      const sY = crouch ? 0.6 : 1;
      const sXZ = crouch ? 1.05 : 1;
      modelRef.current.scale.set(sXZ, sY, sXZ);
      modelRef.current.position.y = position[1] - (crouch ? 0.2 : 0);
    }
  });
  
  return (
    <group ref={modelRef}>
      {USE_MODELS ? (
        <CharacterModel name={character} />
      ) : (
        <>
          {character === 'monkey' && <Monkey crouch={crouch} tilt={tilt} />}
          {character === 'robot' && <Robot crouch={crouch} tilt={tilt} />}
          {!character && <Monkey crouch={crouch} tilt={tilt} />} {/* Default to monkey */}
        </>
      )}
      <mesh position={[0, -0.9, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[1.5, 1.5, 1]}>
        <planeGeometry args={[1, 1]} />
        <shadowMaterial opacity={0.5} />
      </mesh>
    </group>
  );
}
