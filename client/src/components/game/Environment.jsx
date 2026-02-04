import { Sky, Cloud, Environment as DreiEnvironment } from '@react-three/drei';

export default function EnvironmentComponent() {
  return (
    <>
      <DreiEnvironment preset="sunset" />
      <Sky sunPosition={[100, 20, 100]} />
      <Cloud position={[10, 15, 0]} opacity={0.8} scale={3} />
      <Cloud position={[-10, 12, -5]} opacity={0.6} scale={2.5} />
      <Cloud position={[0, 18, 10]} opacity={0.7} scale={4} />
      {/* Jungle trees along the path */}
      {[...Array(12)].map((_, i) => (
        <group key={i} position={[i % 2 === 0 ? -3 : 3, 0, -i * 8]}>
          <mesh position={[0, 1, 0]} castShadow>
            <cylinderGeometry args={[0.15, 0.2, 2, 12]} />
            <meshStandardMaterial color="#8B4513" />
          </mesh>
          <mesh position={[0, 2.2, 0]} castShadow>
            <coneGeometry args={[1.2, 1.5, 12]} />
            <meshStandardMaterial color="#2E8B57" roughness={0.8} />
          </mesh>
        </group>
      ))}
    </>
  );
}
