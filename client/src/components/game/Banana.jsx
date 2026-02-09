import { Float } from '@react-three/drei';

export default function Banana({ position = [0, 1, 0] }) {
  return (
    <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.6}>
      <group position={position}>
        {/* Curved banana using a torus segment */}
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
          <torusGeometry args={[0.45, 0.12, 16, 48, Math.PI * 1.2]} />
          <meshStandardMaterial color="#FFD54F" roughness={0.4} metalness={0.0} emissive="#000000" />
        </mesh>
        {/* Stem */}
        <mesh position={[0.38, 0.05, 0]} rotation={[0, 0, Math.PI / 6]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.14, 12]} />
          <meshStandardMaterial color="#6D4C41" />
        </mesh>
      </group>
    </Float>
  );
}
