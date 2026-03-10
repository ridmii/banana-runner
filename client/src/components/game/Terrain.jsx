import { Float, useTexture } from '@react-three/drei';
import { Suspense } from 'react';

function LaneMarkers() {
  return (
    <>
      {Array.from({ length: 20 }).map((_, i) => (
        <mesh key={i} position={[0, 0.1, -i * 5]} scale={[0.2, 0.1, 2]}>
          <boxGeometry />
          <meshStandardMaterial color="#FFFFFF" emissive="#444444" />
        </mesh>
      ))}
    </>
  );
}

export default function Terrain() {
  let grassTexture, rockTexture;
  try {
    grassTexture = useTexture('/assets/textures/grass.jpg');
    grassTexture.wrapS = grassTexture.wrapT = 1000; //repeat texture
    rockTexture = useTexture('/assets/textures/rock.jpg');
  } catch (e) {}

  return (
    <Suspense fallback={null}>
      {/* Main ground platform */}
      <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        {grassTexture ? (
          <meshStandardMaterial map={grassTexture} />
        ) : (
          <meshStandardMaterial color="#228B22" />
        )}
      </mesh>

      {/* Floating islands */}
      <Float speed={0.5} rotationIntensity={0.01}>
        <mesh position={[5, 2, -10]} castShadow receiveShadow>
          <icosahedronGeometry args={[3, 1]} />
          <meshStandardMaterial color="#8FBC8F" roughness={0.8} />
        </mesh>
      </Float>

      <Float speed={0.7} rotationIntensity={0.02}>
        <mesh position={[-8, 3, -15]} castShadow receiveShadow>
          <icosahedronGeometry args={[2.5, 1]} />
          <meshStandardMaterial color="#228B22" roughness={0.9} />
        </mesh>
      </Float>

      <Float speed={0.3} rotationIntensity={0.015}>
        <mesh position={[12, 1.5, -20]} castShadow receiveShadow>
          <icosahedronGeometry args={[4, 1]} />
          <meshStandardMaterial color="#32CD32" roughness={0.7} />
        </mesh>
      </Float>

      <LaneMarkers />
    </Suspense>
  );
}
