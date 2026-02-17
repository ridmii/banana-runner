import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';

// Realistic Monkey Character using procedural modeling
function RealisticMonkey({ crouch = false, tilt = 0 }) {
  const monkeyRef = useRef();
  const leftArmRef = useRef();
  const rightArmRef = useRef();
  const leftLegRef = useRef();
  const rightLegRef = useRef();
  const tailRef = useRef();
  
  useFrame((state) => {
    if (monkeyRef.current) {
      const time = state.clock.elapsedTime;
      // Subtle breathing animation
      monkeyRef.current.scale.y = 1 + Math.sin(time * 2) * 0.02;
      // Body tilt for crouching
      monkeyRef.current.rotation.x = crouch ? 0.3 : Math.sin(time * 8) * 0.02;
      monkeyRef.current.rotation.z = tilt * 0.3;
    }
    
    // Realistic running animation - alternating arm and leg movement
    if (leftArmRef.current && rightArmRef.current) {
      const armTime = state.clock.elapsedTime * 6; // Speed of arm movement
      leftArmRef.current.rotation.x = Math.sin(armTime) * 0.6;
      rightArmRef.current.rotation.x = Math.sin(armTime + Math.PI) * 0.6;
    }
    
    if (leftLegRef.current && rightLegRef.current) {
      const legTime = state.clock.elapsedTime * 6; // Speed of leg movement
      leftLegRef.current.rotation.x = Math.sin(legTime + Math.PI) * 0.4;
      rightLegRef.current.rotation.x = Math.sin(legTime) * 0.4;
    }
    
    // Animated tail swaying
    if (tailRef.current) {
      const tailTime = state.clock.elapsedTime;
      tailRef.current.rotation.x = 0.5 + Math.sin(tailTime * 2) * 0.3;
      tailRef.current.rotation.z = Math.sin(tailTime * 1.5) * 0.2;
    }
  });

  return (
    <group ref={monkeyRef} rotation={[0, Math.PI, 0]}>
      {/* Body */}
      <mesh castShadow scale={[1, 1.3, 0.7]}>
        <sphereGeometry args={[0.6, 16, 12]} />
        <meshStandardMaterial 
          color="#8B4513"
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>
      
      {/* Head */}
      <mesh position={[0, 1.3, 0]} castShadow scale={[1, 1.1, 0.8]}>
        <sphereGeometry args={[0.45, 16, 12]} />
        <meshStandardMaterial color="#A0522D" roughness={0.7} />
      </mesh>
      
      {/* Face */}
      <mesh position={[0, 1.2, 0.3]} castShadow scale={[1, 1.2, 0.6]}>
        <sphereGeometry args={[0.25, 12, 8]} />
        <meshStandardMaterial color="#D2B48C" roughness={0.6} />
      </mesh>
      
      {/* Eyes */}
      <mesh position={[-0.15, 1.35, 0.4]} castShadow>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0.15, 1.35, 0.4]} castShadow>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      
      {/* Pupils */}
      <mesh position={[-0.15, 1.35, 0.47]} castShadow>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      <mesh position={[0.15, 1.35, 0.47]} castShadow>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      
      {/* Nose */}
      <mesh position={[0, 1.25, 0.45]} castShadow scale={[1, 0.7, 0.7]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      
      {/* Ears */}
      <mesh position={[-0.35, 1.4, 0]} castShadow scale={[1, 1.3, 0.3]}>
        <sphereGeometry args={[0.15, 12, 8]} />
        <meshStandardMaterial color="#A0522D" roughness={0.7} />
      </mesh>
      <mesh position={[0.35, 1.4, 0]} castShadow scale={[1, 1.3, 0.3]}>
        <sphereGeometry args={[0.15, 12, 8]} />
        <meshStandardMaterial color="#A0522D" roughness={0.7} />
      </mesh>
      
      {/* Left Arm Group with Hand */}
      <group ref={leftArmRef} position={[-0.5, 0.8, 0]}>
        <mesh castShadow>
          <capsuleGeometry args={[0.12, 0.6, 8, 16]} />
          <meshStandardMaterial color="#8B4513" roughness={0.8} />
        </mesh>
        {/* Left Hand */}
        <mesh position={[0, -0.5, 0]} castShadow>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial color="#D2B48C" roughness={0.6} />
        </mesh>
      </group>
      
      {/* Right Arm Group with Hand */}
      <group ref={rightArmRef} position={[0.5, 0.8, 0]}>
        <mesh castShadow>
          <capsuleGeometry args={[0.12, 0.6, 8, 16]} />
          <meshStandardMaterial color="#8B4513" roughness={0.8} />
        </mesh>
        {/* Right Hand */}
        <mesh position={[0, -0.5, 0]} castShadow>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial color="#D2B48C" roughness={0.6} />
        </mesh>
      </group>
      
      {/* Left Leg Group with Foot */}
      <group ref={leftLegRef} position={[-0.25, -0.2, 0]}>
        <mesh castShadow>
          <capsuleGeometry args={[0.15, 0.7, 8, 16]} />
          <meshStandardMaterial color="#8B4513" roughness={0.8} />
        </mesh>
        {/* Left Foot */}
        <mesh position={[0, -0.5, 0.1]} castShadow scale={[1, 0.7, 1.7]}>
          <sphereGeometry args={[0.12, 12, 8]} />
          <meshStandardMaterial color="#654321" roughness={0.9} />
        </mesh>
      </group>
      
      {/* Right Leg Group with Foot */}
      <group ref={rightLegRef} position={[0.25, -0.2, 0]}>
        <mesh castShadow>
          <capsuleGeometry args={[0.15, 0.7, 8, 16]} />
          <meshStandardMaterial color="#8B4513" roughness={0.8} />
        </mesh>
        {/* Right Foot */}
        <mesh position={[0, -0.5, 0.1]} castShadow scale={[1, 0.7, 1.7]}>
          <sphereGeometry args={[0.12, 12, 8]} />
          <meshStandardMaterial color="#654321" roughness={0.9} />
        </mesh>
      </group>
      
      {/* Tail with ref for animation */}
      <mesh ref={tailRef} position={[0, 0.5, -0.4]} rotation={[0.5, 0, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.04, 1, 8]} />
        <meshStandardMaterial color="#8B4513" roughness={0.8} />
      </mesh>
    </group>
  );
}

// Realistic Robot Character
function RealisticRobot({ crouch = false, tilt = 0 }) {
  const robotRef = useRef();
  
  useFrame((state) => {
    if (robotRef.current) {
      const time = state.clock.elapsedTime;
      // Mechanical movements
      robotRef.current.rotation.z = tilt * 0.2;
      // LED pulsing effect on eyes
      const pulseFactor = (Math.sin(time * 3) + 1) * 0.5;
      robotRef.current.userData.eyeIntensity = pulseFactor;
    }
  });

  return (
    <group ref={robotRef}>
      {/* Main Body */}
      <mesh castShadow>
        <boxGeometry args={[0.8, 1, 0.5]} />
        <meshStandardMaterial 
          color="#C0C0C0" 
          metalness={0.9} 
          roughness={0.1} 
          envMapIntensity={1}
        />
      </mesh>
      
      {/* Body Details */}
      <mesh position={[0, 0.2, 0.26]} castShadow>
        <boxGeometry args={[0.3, 0.3, 0.02]} />
        <meshStandardMaterial color="#4169E1" roughness={0.2} />
      </mesh>
      
      {/* Head */}
      <mesh position={[0, 1.4, 0]} castShadow>
        <boxGeometry args={[0.6, 0.5, 0.4]} />
        <meshStandardMaterial color="#E5E5E5" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Eyes (LED) */}
      <mesh position={[-0.15, 1.45, 0.21]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.02, 8]} />
        <meshStandardMaterial 
          color="#00FF00" 
          emissive="#00FF00" 
          emissiveIntensity={0.5}
        />
      </mesh>
      <mesh position={[0.15, 1.45, 0.21]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.02, 8]} />
        <meshStandardMaterial 
          color="#00FF00" 
          emissive="#00FF00" 
          emissiveIntensity={0.5}
        />
      </mesh>
      
      {/* Antenna */}
      <mesh position={[0, 1.7, 0]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, 0.2, 8]} />
        <meshStandardMaterial color="#FF0000" />
      </mesh>
      <mesh position={[0, 1.85, 0]} castShadow>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color="#FF0000" emissive="#FF0000" emissiveIntensity={0.3} />
      </mesh>
      
      {/* Arms */}
      <mesh position={[-0.55, 0.7, 0]} castShadow>
        <boxGeometry args={[0.15, 0.6, 0.15]} />
        <meshStandardMaterial color="#C0C0C0" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[0.55, 0.7, 0]} castShadow>
        <boxGeometry args={[0.15, 0.6, 0.15]} />
        <meshStandardMaterial color="#C0C0C0" metalness={0.9} roughness={0.1} />
      </mesh>
      
      {/* Hands */}
      <mesh position={[-0.55, 0.2, 0]} castShadow>
        <boxGeometry args={[0.12, 0.2, 0.12]} />
        <meshStandardMaterial color="#B0B0B0" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0.55, 0.2, 0]} castShadow>
        <boxGeometry args={[0.12, 0.2, 0.12]} />
        <meshStandardMaterial color="#B0B0B0" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Legs */}
      <mesh position={[-0.2, -0.3, 0]} castShadow>
        <boxGeometry args={[0.18, 0.7, 0.18]} />
        <meshStandardMaterial color="#C0C0C0" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[0.2, -0.3, 0]} castShadow>
        <boxGeometry args={[0.18, 0.7, 0.18]} />
        <meshStandardMaterial color="#C0C0C0" metalness={0.9} roughness={0.1} />
      </mesh>
      
      {/* Feet */}
      <mesh position={[-0.2, -0.8, 0.1]} castShadow>
        <boxGeometry args={[0.15, 0.1, 0.25]} />
        <meshStandardMaterial color="#696969" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0.2, -0.8, 0.1]} castShadow>
        <boxGeometry args={[0.15, 0.1, 0.25]} />
        <meshStandardMaterial color="#696969" metalness={0.7} roughness={0.3} />
      </mesh>
      
      {/* Joint Details */}
      {[-0.55, 0.55].map((x, i) => (
        <mesh key={i} position={[x, 0.4, 0]} castShadow>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.1} />
        </mesh>
      ))}
      {[-0.2, 0.2].map((x, i) => (
        <mesh key={i} position={[x, 0.1, 0]} castShadow>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.1} />
        </mesh>
      ))}
    </group>
  );
}

export { RealisticMonkey, RealisticRobot };