// GAME OBSTACLES - These should look ARTIFICIAL/GAME-LIKE, NOT NATURAL
// This prevents confusion with environment (natural-looking) objects
export default function Obstacle({ position = [0, 0, 0], type = 'rock' }) {
  if (type === 'rock') {
    return (
      <mesh position={position} castShadow receiveShadow>
        {/* ARTIFICIAL CRYSTAL/BARRIER - clearly a game obstacle */}
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
        {/* METAL PIPE - clearly artificial */}
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
