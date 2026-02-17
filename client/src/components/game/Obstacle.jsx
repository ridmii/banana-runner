export default function Obstacle({ position = [0, 0, 0], type = 'rock' }) {
  if (type === 'rock') {
    return (
      <mesh position={position} castShadow receiveShadow>
        <dodecahedronGeometry args={[0.8]} />
        <meshStandardMaterial color="#A9A9A9" roughness={1} />
      </mesh>
    );
  }
  if (type === 'log') {
    return (
      <mesh position={position} rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
        <cylinderGeometry args={[0.2, 0.2, 1.6, 16]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
    );
  }
  return null;
}
