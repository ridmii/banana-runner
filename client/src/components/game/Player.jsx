import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
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
  // smoothing refs to reduce visual jitter
  const smoothX = useRef(position[0]);
  const smoothY = useRef(position[1]);
  const smoothTilt = useRef(0);
  const smoothScaleY = useRef(1);
  const USE_MODELS = import.meta.env.VITE_USE_MODELS === 'true';
  
  useFrame((_, delta) => {
    if (modelRef.current) {
      // interpolate visuals independently of frame rate
      const xLerp = Math.min(1, 18 * delta);
      const yLerp = Math.min(1, 22 * delta);
      smoothX.current += (position[0] - smoothX.current) * xLerp;
      smoothY.current += (position[1] - smoothY.current) * yLerp;
      smoothTilt.current += (tilt - smoothTilt.current) * Math.min(1, 14 * delta);

      modelRef.current.position.set(smoothX.current, smoothY.current, position[2]);
      modelRef.current.rotation.z = smoothTilt.current;

      // smooth crouch scale transition
      const targetSY = crouch ? 0.6 : 1;
      smoothScaleY.current += (targetSY - smoothScaleY.current) * Math.min(1, 12 * delta);
      const sXZ = crouch ? 1.05 : 1;
      modelRef.current.scale.set(sXZ, smoothScaleY.current, sXZ);
      modelRef.current.position.y = smoothY.current - (crouch ? 0.2 : 0);
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
          {!character && <Monkey crouch={crouch} tilt={tilt} />} {/* default monkey */}
        </>
      )}
      <mesh position={[0, -0.9, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[1.5, 1.5, 1]}>
        <planeGeometry args={[1, 1]} />
        <shadowMaterial opacity={0.5} />
      </mesh>
    </group>
  );
}
