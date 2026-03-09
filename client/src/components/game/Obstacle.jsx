// Ridmi: obstacles are intentionally game-like to contrast with environment
export default function Obstacle({ position = [0, 0, 0], type = 'rock' }) {
  if (type === 'rock') {
    return (
      <mesh position={position} castShadow receiveShadow>
        {/* Ridmi: artificial crystal obstacle */}
        <octahedronGeometry args={[0.6, 0]} />
        <meshStandardMaterial 
          color="#FF4444"
          roughness={0.2}
          metalness={0.1}
          emissive="#331111"
          emissiveIntensity={0.1}
        />
      </mesh>
    );
  }
  if (type === 'log') {
    return (
      <mesh position={position} rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
        {/* Ridmi: metal pipe obstacle */}
        <cylinderGeometry args={[0.15, 0.15, 1.4, 12]} />
        <meshStandardMaterial 
          color="#666666"
          roughness={0.3}
          metalness={0.8}
        />
      </mesh>
    );
  }
  return null;
}
