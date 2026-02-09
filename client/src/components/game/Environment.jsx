import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
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
      {/* Water splash particles */}
      <group position={[0, 0, 0.2]}>
        {[...Array(8)].map((_, i) => (
          <mesh 
            key={i} 
            position={[
              (Math.random() - 0.5) * 2 * scale,
              Math.random() * 0.5 * scale,
              (Math.random() - 0.5) * 0.5 * scale
            ]}
          >
            <sphereGeometry args={[0.02, 8, 6]} />
            <meshStandardMaterial 
              color="#ffffff" 
              opacity={0.6} 
              transparent 
            />
          </mesh>
        ))}
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
      {/* Bushes */}
      {[...Array(3)].map((_, i) => (
        <mesh 
          key={i} 
          position={[
            (Math.random() - 0.5) * 4 * scale,
            0.5 * scale,
            (Math.random() - 0.5) * 2 * scale
          ]} 
          castShadow
        >
          <sphereGeometry args={[0.8 * scale, 8, 6]} />
          <meshStandardMaterial color="#2E8B57" roughness={0.8} />
        </mesh>
      ))}
      {/* Tall grass */}
      {[...Array(12)].map((_, i) => (
        <mesh 
          key={i} 
          position={[
            (Math.random() - 0.5) * 6 * scale,
            0.3 * scale,
            (Math.random() - 0.5) * 3 * scale
          ]} 
          rotation={[0, Math.random() * Math.PI, 0]}
          castShadow
        >
          <planeGeometry args={[0.1 * scale, 0.8 * scale]} />
          <meshStandardMaterial 
            color="#228B22" 
            side={THREE.DoubleSide} 
            roughness={0.7} 
          />
        </mesh>
      ))}
    </group>
  );
}

// Static Bird Component
function Bird({ position, speed = 1 }) {
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
  return (
    <>
      {/* Jungle Sky Background with Gradient */}
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
      <Bird position={[10, 15, -5]} speed={1.2} />
      <Bird position={[-8, 18, -8]} speed={0.8} />
      <Bird position={[5, 20, -12]} speed={1.5} />
      
      {/* Waterfalls */}
      <Waterfall position={[-15, 0, -20]} scale={1.5} />
      <Waterfall position={[18, 0, -35]} scale={1.2} />
      <Waterfall position={[-22, 0, -50]} scale={1} />
      
      {/* Dense Jungle Trees - Palm Trees */}
      {[...Array(8)].map((_, i) => (
        <JungleTree 
          key={`palm-${i}`}
          position={[
            (i % 2 === 0 ? -1 : 1) * (8 + Math.random() * 5), 
            0, 
            -i * 12 - Math.random() * 8
          ]}
          scale={0.8 + Math.random() * 0.4}
          type="palm"
        />
      ))}
      
      {/* Regular Jungle Trees */}
      {[...Array(12)].map((_, i) => (
        <JungleTree 
          key={`jungle-${i}`}
          position={[
            (i % 2 === 0 ? -1 : 1) * (12 + Math.random() * 8), 
            0, 
            -i * 10 - Math.random() * 6
          ]}
          scale={0.6 + Math.random() * 0.6}
          type="jungle"
        />
      ))}
      
      {/* Background Dense Forest */}
      {[...Array(20)].map((_, i) => (
        <JungleTree 
          key={`bg-${i}`}
          position={[
            (Math.random() - 0.5) * 80, 
            0, 
            -25 - Math.random() * 30
          ]}
          scale={0.4 + Math.random() * 0.4}
          type={Math.random() > 0.5 ? "palm" : "jungle"}
        />
      ))}
      
      {/* Jungle Foliage */}
      {[...Array(15)].map((_, i) => (
        <Foliage 
          key={i}
          position={[
            (Math.random() - 0.5) * 40, 
            0, 
            -Math.random() * 60
          ]}
          scale={0.8 + Math.random() * 0.4}
        />
      ))}
      
      {/* Path-side smaller trees and bushes */}
      {[...Array(25)].map((_, i) => (
        <group key={`path-${i}`} position={[i % 2 === 0 ? -4 : 4, 0, -i * 4]}>
          <mesh position={[0, 0.8, 0]} castShadow>
            <cylinderGeometry args={[0.1, 0.15, 1.6, 8]} />
            <meshStandardMaterial color="#8B4513" />
          </mesh>
          <mesh position={[0, 1.8, 0]} castShadow>
            <sphereGeometry args={[1, 8, 6]} />
            <meshStandardMaterial color="#228B22" roughness={0.8} />
          </mesh>
        </group>
      ))}
    </>
  );
}
