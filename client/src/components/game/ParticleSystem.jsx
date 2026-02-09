import { useMemo } from 'react';
import { BufferAttribute } from 'three';

export default function ParticleSystem({ count = 200, color = '#ffffff' }) {
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 0] = (Math.random() - 0.5) * 30;
      arr[i * 3 + 1] = Math.random() * 10 + 1;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 30 - 10;
    }
    return new BufferAttribute(arr, 3);
  }, [count]);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" {...positions} />
      </bufferGeometry>
      <pointsMaterial color={color} size={0.05} sizeAttenuation transparent opacity={0.7} />
    </points>
  );
}
