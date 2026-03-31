import { useRef, useEffect } from 'react';
import * as THREE from 'three';

// Static Cloud Component
function StaticCloud({ position, scale = 1 }) {
  return (
    <group position={position}>
      {/* Main cloud body */}
      <mesh>
        <sphereGeometry args={[2 * scale, 1.5 * scale, 1 * scale, 8, 6]} />
        <meshStandardMaterial 
          color="#ffffff" 
          opacity={0.8} 
          transparent 
          roughness={0.3}
        />
      </mesh>
      {/* Additional cloud puffs */}
      <mesh position={[-1.5 * scale, 0, 0]}>
        <sphereGeometry args={[1.2 * scale, 1 * scale, 0.8 * scale, 8, 6]} />
        <meshStandardMaterial 
          color="#ffffff" 
          opacity={0.7} 
          transparent 
          roughness={0.3}
        />
      </mesh>
      <mesh position={[1.2 * scale, 0.2 * scale, 0]}>
        <sphereGeometry args={[1.5 * scale, 1.2 * scale, 0.9 * scale, 8, 6]} />
        <meshStandardMaterial 
          color="#ffffff" 
          opacity={0.6} 
          transparent 
          roughness={0.3}
        />
      </mesh>
    </group>
  );
}

// Static Waterfall Component
function Waterfall({ position, scale = 1 }) {
  return (
    <group position={position}>
      {/* Rock formation */}
      <mesh position={[0, 2, 0]} castShadow>
        <boxGeometry args={[3 * scale, 4 * scale, 1 * scale]} />
        <meshStandardMaterial color="#696969" roughness={0.9} />
      </mesh>
      {/* Water stream */}
      <mesh position={[0, 1, 0.1]} receiveShadow>
        <planeGeometry args={[1.5 * scale, 3 * scale]} />
        <meshStandardMaterial 
          color="#87CEEB" 
          opacity={0.7} 
          transparent 
          roughness={0.1}
          metalness={0.3}
        />
      </mesh>
      {/* Static water splash particles */}
      <group position={[0, 0, 0.2]}>
        <mesh position={[-0.3 * scale, 0.1 * scale, 0]}>
          <sphereGeometry args={[0.02, 8, 6]} />
          <meshStandardMaterial color="#ffffff" opacity={0.6} transparent />
        </mesh>
        <mesh position={[0.2 * scale, 0.05 * scale, 0.1 * scale]}>
          <sphereGeometry args={[0.02, 8, 6]} />
          <meshStandardMaterial color="#ffffff" opacity={0.6} transparent />
        </mesh>
        <mesh position={[0 * scale, 0.15 * scale, -0.1 * scale]}>
          <sphereGeometry args={[0.02, 8, 6]} />
          <meshStandardMaterial color="#ffffff" opacity={0.6} transparent />
        </mesh>
        <mesh position={[0.4 * scale, 0.08 * scale, 0.05 * scale]}>
          <sphereGeometry args={[0.02, 8, 6]} />
          <meshStandardMaterial color="#ffffff" opacity={0.6} transparent />
        </mesh>
      </group>
    </group>
  );
}

// Static Jungle Tree Component
function JungleTree({ position, scale = 1, type = 'palm' }) {
  if (type === 'palm') {
    return (
      <group position={position}>
        {/* Palm trunk */}
        <mesh castShadow>
          <cylinderGeometry args={[0.2 * scale, 0.3 * scale, 5 * scale, 8]} />
          <meshStandardMaterial color="#8B7355" roughness={0.8} />
        </mesh>
        {/* Palm fronds */}
        {[...Array(6)].map((_, i) => (
          <group key={i} rotation={[0, (i / 6) * Math.PI * 2, -0.3]}>
            <mesh position={[0, 2.5 * scale, 2 * scale]} castShadow>
              <boxGeometry args={[0.1 * scale, 0.1 * scale, 3 * scale]} />
              <meshStandardMaterial color="#228B22" roughness={0.7} />
            </mesh>
            {/* Leaves */}
            {[...Array(8)].map((_, j) => (
              <mesh 
                key={j} 
                position={[
                  Math.sin((j / 8) * Math.PI * 2) * 0.5 * scale,
                  2.5 * scale,
                  2 * scale + j * 0.3 * scale
                ]} 
                rotation={[0, 0, (j / 8) * Math.PI * 2]}
                castShadow
              >
                <planeGeometry args={[0.8 * scale, 0.3 * scale]} />
                <meshStandardMaterial 
                  color="#32CD32" 
                  side={THREE.DoubleSide} 
                  roughness={0.6} 
                />
              </mesh>
            ))}
          </group>
        ))}
      </group>
    );
  }
  
  // Regular jungle tree
  return (
    <group position={position}>
      {/* Trunk */}
      <mesh castShadow>
        <cylinderGeometry args={[0.25 * scale, 0.4 * scale, 6 * scale, 12]} />
        <meshStandardMaterial color="#654321" roughness={0.9} />
      </mesh>
      {/* Canopy layers */}
      <mesh position={[0, 5 * scale, 0]} castShadow>
        <coneGeometry args={[2.5 * scale, 3 * scale, 8]} />
        <meshStandardMaterial color="#006400" roughness={0.8} />
      </mesh>
      <mesh position={[0, 4 * scale, 0]} castShadow>
        <coneGeometry args={[2 * scale, 2.5 * scale, 8]} />
        <meshStandardMaterial color="#228B22" roughness={0.8} />
      </mesh>
      <mesh position={[0, 3 * scale, 0]} castShadow>
        <coneGeometry args={[1.5 * scale, 2 * scale, 8]} />
        <meshStandardMaterial color="#32CD32" roughness={0.8} />
      </mesh>
    </group>
  );
}

// Dense Foliage Component
function Foliage({ position, scale = 1 }) {
  return (
    <group position={position}>
      {/* Static bushes */}
      <mesh position={[-1 * scale, 0.5 * scale, 0]} castShadow>
        <sphereGeometry args={[0.8 * scale, 8, 6]} />
        <meshStandardMaterial color="#2E8B57" roughness={0.8} />
      </mesh>
      <mesh position={[1 * scale, 0.5 * scale, 0.5 * scale]} castShadow>
        <sphereGeometry args={[0.8 * scale, 8, 6]} />
        <meshStandardMaterial color="#2E8B57" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.5 * scale, -0.8 * scale]} castShadow>
        <sphereGeometry args={[0.8 * scale, 8, 6]} />
        <meshStandardMaterial color="#2E8B57" roughness={0.8} />
      </mesh>
      
      {/* Static tall grass */}
      <mesh position={[-2 * scale, 0.3 * scale, -1 * scale]} rotation={[0, 0.5, 0]} castShadow>
        <planeGeometry args={[0.1 * scale, 0.8 * scale]} />
        <meshStandardMaterial color="#228B22" side={THREE.DoubleSide} roughness={0.7} />
      </mesh>
      <mesh position={[2 * scale, 0.3 * scale, 1 * scale]} rotation={[0, 1.2, 0]} castShadow>
        <planeGeometry args={[0.1 * scale, 0.8 * scale]} />
        <meshStandardMaterial color="#228B22" side={THREE.DoubleSide} roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.3 * scale, 2 * scale]} rotation={[0, 0.8, 0]} castShadow>
        <planeGeometry args={[0.1 * scale, 0.8 * scale]} />
        <meshStandardMaterial color="#228B22" side={THREE.DoubleSide} roughness={0.7} />
      </mesh>
      <mesh position={[-1.5 * scale, 0.3 * scale, 0.5 * scale]} rotation={[0, 2.1, 0]} castShadow>
        <planeGeometry args={[0.1 * scale, 0.8 * scale]} />
        <meshStandardMaterial color="#228B22" side={THREE.DoubleSide} roughness={0.7} />
      </mesh>
    </group>
  );
}

// Static Bird Component
function Bird({ position }) {
  return (
    <group position={position}>
      {/* Bird body */}
      <mesh scale={[1, 0.5, 2]}>
        <sphereGeometry args={[0.1, 8, 6]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
      {/* Wings */}
      <mesh position={[-0.1, 0, 0]} scale={[1, 0.15, 0.7]}>
        <sphereGeometry args={[0.15, 8, 6]} />
        <meshStandardMaterial color="#444444" />
      </mesh>
      <mesh position={[0.1, 0, 0]} scale={[1, 0.15, 0.7]}>
        <sphereGeometry args={[0.15, 8, 6]} />
        <meshStandardMaterial color="#444444" />
      </mesh>
    </group>
  );
}

export default function EnvironmentComponent() {
  //environment is static (no runtime movement)
  useEffect(() => {}, []);

  return (
    <>
      {/*static environment objects */}
      <mesh position={[0, 25, -50]} scale={[200, 50, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial 
          color="#87CEEB" 
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Enhanced Lighting for Jungle */}
      <ambientLight intensity={0.4} color="#98FB98" />
      <directionalLight 
        position={[50, 50, 50]} 
        intensity={0.8}
        color="#FFFFE0"
        castShadow 
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={100}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
      />
      
      {/* Soft fill light */}
      <directionalLight 
        position={[-30, 20, 30]} 
        intensity={0.3}
        color="#98FB98"
      />
      
      {/* Static Clouds */}
      <StaticCloud position={[15, 20, -10]} scale={1.2} />
      <StaticCloud position={[-12, 18, -15]} scale={0.8} />
      <StaticCloud position={[8, 25, -8]} scale={1.5} />
      <StaticCloud position={[-20, 22, -12]} scale={1} />
      <StaticCloud position={[25, 19, -18]} scale={0.9} />
      
      {/* Static Birds */}
      <Bird position={[10, 15, -5]} />
      <Bird position={[-8, 18, -8]} />
      <Bird position={[5, 20, -12]} />
      
      {/* Waterfalls */}
      <Waterfall position={[-20, 0, -30]} scale={1.2} />
      <Waterfall position={[25, 0, -45]} scale={0.8} />
      
      {/* Static Trees - No Math.random() to prevent movement */}
      <JungleTree position={[-8, 0, -12]} scale={0.8} type="palm" />
      <JungleTree position={[8, 0, -24]} scale={1.0} type="palm" />
      <JungleTree position={[-13, 0, -36]} scale={0.9} type="palm" />
      <JungleTree position={[13, 0, -48]} scale={1.1} type="palm" />
      
      <JungleTree position={[-12, 0, -10]} scale={0.6} type="jungle" />
      <JungleTree position={[12, 0, -20]} scale={0.8} type="jungle" />
      <JungleTree position={[-20, 0, -30]} scale={1.0} type="jungle" />
      <JungleTree position={[20, 0, -40]} scale={0.7} type="jungle" />
      
      <JungleTree position={[-30, 0, -25]} scale={0.3} type="palm" />
      <JungleTree position={[35, 0, -30]} scale={0.4} type="jungle" />
      <JungleTree position={[-40, 0, -35]} scale={0.35} type="palm" />
      
      <Foliage position={[-15, 0, -6]} scale={0.6} />
      <Foliage position={[15, 0, -12]} scale={0.7} />
      <Foliage position={[-20, 0, -18]} scale={0.65} />
      
      {/* Path-side smaller trees and bushes - Enhanced realism */}
      {[...Array(20)].map((_, i) => (
        <group 
          key={`path-${i}`} 
          position={[i % 2 === 0 ? -4 : 4, 0, -i * 4]}
          userData={{ static: true, environment: true }}
        >
          <mesh position={[0, 0.8, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.1, 0.15, 1.6, 8]} />
            <meshStandardMaterial 
              color="#8B4513" 
              roughness={0.8}
              metalness={0.0}
            />
          </mesh>
          <mesh position={[0, 1.8, 0]} castShadow receiveShadow>
            <sphereGeometry args={[1, 8, 6]} />
            <meshStandardMaterial 
              color="#228B22" 
              roughness={0.8}
              metalness={0.0}
            />
          </mesh>
        </group>
      ))}
    </>
  );
}
