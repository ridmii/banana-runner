import { Float } from '@react-three/drei';

export default function PowerUp({ position = [0, 1, 0], type = 'speed' }) {
  let color = '#00BFFF';
  if (type === 'shield') color = '#00BFFF';
  if (type === 'magnet') color = '#8A2BE2';
  return (
    <Float speed={1.2} rotationIntensity={0.6} floatIntensity={0.5}>
      <mesh position={position} castShadow>
        <sphereGeometry args={[0.3, 24, 24]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} />
      </mesh>
    </Float>
  );
}
