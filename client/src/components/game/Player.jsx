import { useFrame } from '@react-three/fiber';
import { useRef, useState } from 'react';
import CharacterModel from './CharacterModel.jsx';

function Monkey() {
  return (
    <group>
      <mesh castShadow>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshStandardMaterial color="#8B4513" roughness={0.9} />
      </mesh>
      <mesh position={[0, 1.2, 0]} castShadow>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color="#D2B48C" roughness={0.8} />
      </mesh>
      <mesh position={[-0.2, 1.3, 0.4]} castShadow>
        <sphereGeometry args={[0.1, 32, 32]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      <mesh position={[0.2, 1.3, 0.4]} castShadow>
        <sphereGeometry args={[0.1, 32, 32]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      <mesh position={[-0.4, 1.4, 0]} castShadow>
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshStandardMaterial color="#D2B48C" />
      </mesh>
      <mesh position={[0.4, 1.4, 0]} castShadow>
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshStandardMaterial color="#D2B48C" />
      </mesh>
    </group>
  );
}

function Cat() {
  return (
    <group>
      <mesh castShadow>
        <boxGeometry args={[1.2, 0.8, 0.6]} />
        <meshStandardMaterial color="#F4A460" />
      </mesh>
      <mesh position={[0, 1, 0]} castShadow>
        <coneGeometry args={[0.5, 0.6, 4]} />
        <meshStandardMaterial color="#FFDAB9" />
      </mesh>
      <mesh position={[0.4, 0.4, 0.6]}>
        <coneGeometry args={[0.1, 0.3, 8]} />
        <meshStandardMaterial color="#F4A460" />
      </mesh>
    </group>
  );
}

function Robot() {
  return (
    <group>
      <mesh castShadow>
        <boxGeometry args={[0.9, 1.2, 0.6]} />
        <meshStandardMaterial color="#708090" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[0, 1.2, 0]} castShadow>
        <boxGeometry args={[0.6, 0.4, 0.6]} />
        <meshStandardMaterial color="#A9A9A9" metalness={0.5} />
      </mesh>
      <mesh position={[0.45, 0.6, 0.6]}>
        <cylinderGeometry args={[0.05, 0.05, 0.3, 12]} />
        <meshStandardMaterial color="#708090" />
      </mesh>
    </group>
  );
}

export default function Player({ position = [0, 1, 0], character = 'monkey', tilt = 0, crouch = false }) {
  const modelRef = useRef();
  const [animationState, setAnimationState] = useState('run');
  const USE_MODELS = import.meta.env.VITE_USE_MODELS === 'true';
  useFrame(() => {
    if (modelRef.current) {
      modelRef.current.position.set(position[0], position[1], position[2]);
      if (animationState === 'run') {
        modelRef.current.rotation.y += 0.03;
      }
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
          {character === 'monkey' && <Monkey />}
          {character === 'cat' && <Cat />}
          {character === 'robot' && <Robot />}
        </>
      )}
      <mesh position={[0, -0.9, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[1.5, 1.5, 1]}>
        <planeGeometry args={[1, 1]} />
        <shadowMaterial opacity={0.5} />
      </mesh>
    </group>
  );
}
