import { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// semi-realistic monkey character
function RealisticMonkey({ crouch = false, tilt = 0 }) {
  const monkeyRef = useRef();
  const leftArmRef = useRef();
  const rightArmRef = useRef();
  const leftLegRef = useRef();
  const rightLegRef = useRef();
  const tailRef = useRef();
  const headRef = useRef();
  
  useFrame((state) => {
    if (monkeyRef.current) {
      const time = state.clock.elapsedTime;
      // Realistic breathing - more subtle
      monkeyRef.current.scale.y = 1 + Math.sin(time * 1.2) * 0.008;
      // Body posture
      monkeyRef.current.rotation.x = crouch ? 0.5 : Math.sin(time * 4) * 0.005;
      monkeyRef.current.rotation.z = tilt * 0.2;
      
      if (crouch) {
        monkeyRef.current.position.y = -0.15;
      } else {
        monkeyRef.current.position.y = 0;
      }
    }
    
    // natural head movement
    if (headRef.current) {
      const time = state.clock.elapsedTime;
      headRef.current.rotation.y = Math.sin(time * 0.8) * 0.05;
      headRef.current.rotation.x = Math.sin(time * 1.2) * 0.02;
    }
    
    // running animation (arms & legs)
    if (leftArmRef.current && rightArmRef.current) {
      const armTime = state.clock.elapsedTime * 6; // Natural running pace
      leftArmRef.current.rotation.x = Math.sin(armTime) * 0.8;
      rightArmRef.current.rotation.x = Math.sin(armTime + Math.PI) * 0.8;
      // Slight shoulder roll
      leftArmRef.current.rotation.z = Math.sin(armTime * 0.5) * 0.1;
      rightArmRef.current.rotation.z = -Math.sin(armTime * 0.5) * 0.1;
    }
    
    if (leftLegRef.current && rightLegRef.current) {
      const legTime = state.clock.elapsedTime * 6;
      // Opposite phase to arms (natural quadruped gait)
      leftLegRef.current.rotation.x = Math.sin(legTime + Math.PI) * 0.6;
      rightLegRef.current.rotation.x = Math.sin(legTime) * 0.6;
    }
    
    // tail animation
    if (tailRef.current) {
      const tailTime = state.clock.elapsedTime;
        // breathing and body posture tweaks
      tailRef.current.rotation.y = Math.sin(tailTime * 2.3) * 0.15;
    }
  });

  return (
    <group ref={monkeyRef} rotation={[0, Math.PI, 0]}>
      {/* TORSO - Semi-realistic proportions */}
      <mesh castShadow receiveShadow scale={[1, 1.4, 0.9]}>
        <capsuleGeometry args={[0.5, 0.8, 20, 32]} />
        <meshStandardMaterial 
          color="#8B4513"
          roughness={0.9}
          metalness={0.0}
          // Subsurface scattering effect
          clearcoat={0.02}
          clearcoatRoughness={0.95}
        />
      </mesh>
      
      {/* HEAD - More realistic monkey proportions */}
      <group ref={headRef} position={[0, 1.1, 0]}>
        <mesh castShadow receiveShadow scale={[1, 1.05, 1]}>
          <sphereGeometry args={[0.38, 24, 16]} />
          <meshStandardMaterial 
            color="#A0522D" 
            roughness={0.8}
            metalness={0.0}
          />
        </mesh>
        
        {/* MUZZLE - Prominent primate feature */}
        <mesh position={[0, -0.1, 0.32]} castShadow receiveShadow scale={[0.8, 1.1, 0.9]}>
          <capsuleGeometry args={[0.18, 0.12, 16, 12]} />
          <meshStandardMaterial 
            color="#D2B48C" 
            roughness={0.7}
            metalness={0.0}
          />
        </mesh>
        
        {/* EYES - Wet surface realistic eyes */}
        <mesh position={[-0.14, 0.08, 0.32]} castShadow>
          <sphereGeometry args={[0.075, 20, 16]} />
          <meshStandardMaterial 
            color="#ffffff"
            roughness={0.05}
            metalness={0.0}
            clearcoat={1.0}
            clearcoatRoughness={0.0}
            ior={1.4}
          />
        </mesh>
        <mesh position={[0.14, 0.08, 0.32]} castShadow>
          <sphereGeometry args={[0.075, 20, 16]} />
          <meshStandardMaterial 
            color="#ffffff"
            roughness={0.05}
            metalness={0.0}
            clearcoat={1.0}
            clearcoatRoughness={0.0}
            ior={1.4}
          />
        </mesh>
        
        {/* PUPILS - Dark and realistic */}
        <mesh position={[-0.14, 0.08, 0.39]}>
          <sphereGeometry args={[0.035, 16, 12]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
        </mesh>
        <mesh position={[0.14, 0.08, 0.39]}>
          <sphereGeometry args={[0.035, 16, 12]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
        </mesh>
        
        {/* NOSE */}
        <mesh position={[0, -0.02, 0.41]} castShadow scale={[1, 0.8, 0.8]}>
          <sphereGeometry args={[0.025, 12, 8]} />
          <meshStandardMaterial color="#000000" roughness={0.8} />
        </mesh>
        
        {/* EARS - Primate-like */}
        <mesh position={[-0.32, 0.15, 0.05]} castShadow scale={[0.8, 1.2, 0.4]}>
          <sphereGeometry args={[0.12, 16, 12]} />
          <meshStandardMaterial color="#A0522D" roughness={0.8} />
        </mesh>
        <mesh position={[0.32, 0.15, 0.05]} castShadow scale={[0.8, 1.2, 0.4]}>
          <sphereGeometry args={[0.12, 16, 12]} />
          <meshStandardMaterial color="#A0522D" roughness={0.8} />
        </mesh>
      </group>
      
      {/* ARMS - Realistic primate proportions */}
      <group ref={leftArmRef} position={[-0.4, 0.7, 0]}>
        {/* Upper arm */}
        <mesh castShadow>
          <capsuleGeometry args={[0.1, 0.5, 12, 16]} />
          <meshStandardMaterial color="#8B4513" roughness={0.9} />
        </mesh>
        {/* Forearm */}
        <mesh position={[0, -0.45, 0]} castShadow>
          <capsuleGeometry args={[0.08, 0.4, 12, 16]} />
          <meshStandardMaterial color="#8B4513" roughness={0.9} />
        </mesh>
        {/* Hand */}
        <mesh position={[0, -0.75, 0]} castShadow>
          <sphereGeometry args={[0.12, 16, 12]} />
          <meshStandardMaterial color="#D2B48C" roughness={0.8} />
        </mesh>
      </group>
      
      <group ref={rightArmRef} position={[0.4, 0.7, 0]}>
        <mesh castShadow>
          <capsuleGeometry args={[0.1, 0.5, 12, 16]} />
          <meshStandardMaterial color="#8B4513" roughness={0.9} />
        </mesh>
        <mesh position={[0, -0.45, 0]} castShadow>
          <capsuleGeometry args={[0.08, 0.4, 12, 16]} />
          <meshStandardMaterial color="#8B4513" roughness={0.9} />
        </mesh>
        <mesh position={[0, -0.75, 0]} castShadow>
          <sphereGeometry args={[0.12, 16, 12]} />
          <meshStandardMaterial color="#D2B48C" roughness={0.8} />
        </mesh>
      </group>
      
      {/* LEGS - Strong primate legs */}
      <group ref={leftLegRef} position={[-0.2, -0.2, 0]}>
        <mesh castShadow>
          <capsuleGeometry args={[0.12, 0.6, 12, 16]} />
          <meshStandardMaterial color="#8B4513" roughness={0.9} />
        </mesh>
        <mesh position={[0, -0.5, 0]} castShadow>
          <capsuleGeometry args={[0.1, 0.5, 12, 16]} />
          <meshStandardMaterial color="#8B4513" roughness={0.9} />
        </mesh>
        <mesh position={[0, -0.85, 0]} castShadow scale={[1.5, 1, 2.2]}>
          <sphereGeometry args={[0.1, 12, 8]} />
          <meshStandardMaterial color="#654321" roughness={0.95} />
        </mesh>
      </group>
      
      <group ref={rightLegRef} position={[0.2, -0.2, 0]}>
        <mesh castShadow>
          <capsuleGeometry args={[0.12, 0.6, 12, 16]} />
          <meshStandardMaterial color="#8B4513" roughness={0.9} />
        </mesh>
        <mesh position={[0, -0.5, 0]} castShadow>
          <capsuleGeometry args={[0.1, 0.5, 12, 16]} />
          <meshStandardMaterial color="#8B4513" roughness={0.9} />
        </mesh>
        <mesh position={[0, -0.85, 0]} castShadow scale={[1.5, 1, 2.2]}>
          <sphereGeometry args={[0.1, 12, 8]} />
          <meshStandardMaterial color="#654321" roughness={0.95} />
        </mesh>
      </group>
      
      {/* TAIL - Very characteristic monkey feature */}
      <group ref={tailRef} position={[0, 0.3, -0.4]}>
        <mesh castShadow>
          <capsuleGeometry args={[0.06, 1.4, 8, 12]} />
          <meshStandardMaterial color="#8B4513" roughness={0.9} />
        </mesh>
      </group>
    </group>
  );
}

// semi-realistic robot character
function RealisticRobot({ crouch = false, tilt = 0 }) {
  const robotRef = useRef();
  const eyeRef = useRef();
  const leftArmRef = useRef();
  const rightArmRef = useRef();
  const leftLegRef = useRef();
  const rightLegRef = useRef();
  
  useFrame((state) => {
    if (robotRef.current) {
      const time = state.clock.elapsedTime;
      // mechanical idle hover
      robotRef.current.position.y = Math.sin(time * 2.5) * 0.008;
      robotRef.current.rotation.z = tilt * 0.15; // More stable than organic
      
      if (crouch) {
        robotRef.current.scale.y = 0.75;
        robotRef.current.position.y -= 0.4;
      } else {
        robotRef.current.scale.y = 1.0;
      }
    }
    
    // LED eye glow
    if (eyeRef.current) {
      const glowTime = state.clock.elapsedTime * 3;
      const glowIntensity = 0.6 + Math.sin(glowTime) * 0.4;
      eyeRef.current.children.forEach(eye => {
        if (eye.material) {
          eye.material.emissiveIntensity = glowIntensity;
        }
      });
    }
    
    // mechanical arm movement
    if (leftArmRef.current && rightArmRef.current) {
      const armTime = state.clock.elapsedTime * 4; // Slower, more mechanical
      leftArmRef.current.rotation.x = Math.sin(armTime) * 0.3;
      rightArmRef.current.rotation.x = Math.sin(armTime + Math.PI) * 0.3;
      // Less shoulder movement - more rigid
    }
    
    // mechanical leg movement
    if (leftLegRef.current && rightLegRef.current) {
      const legTime = state.clock.elapsedTime * 4;
      leftLegRef.current.rotation.x = Math.sin(legTime + Math.PI) * 0.25;
      rightLegRef.current.rotation.x = Math.sin(legTime) * 0.25;
    }
  });

  return (
    <group ref={robotRef}>
      {/* MAIN CHASSIS - Primary structure */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.7, 1.1, 0.45]} />
        <meshStandardMaterial 
          color="#B8B8B8"
          metalness={0.9}
          roughness={0.15}
          envMapIntensity={1.8}
        />
      </mesh>
      
      {/* CHEST ARMOR PLATING */}
      <mesh position={[0, 0.3, 0.23]} castShadow>
        <boxGeometry args={[0.5, 0.7, 0.03]} />
        <meshStandardMaterial 
          color="#505050"
          roughness={0.3}
          metalness={0.8}
          normalScale={[2, 2]}
        />
      </mesh>
      
      {/* HEAD MODULE - Tactical design */}
      <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.5, 0.4, 0.5]} />
        <meshStandardMaterial 
          color="#D5D5D5"
          metalness={1.0}
          roughness={0.05}
          envMapIntensity={2.2}
        />
      </mesh>
      
      {/* LED EYES - Cyan glow */}
      <group ref={eyeRef} position={[0, 0.75, 0.26]}>
        <mesh position={[-0.12, 0.02, 0]}>
          <circleGeometry args={[0.06, 16]} />
          <meshStandardMaterial
            color="#00FFFF"
            emissive="#0099FF"
            emissiveIntensity={0.8}
            transparent
            opacity={0.95}
          />
        </mesh>
        <mesh position={[0.12, 0.02, 0]}>
          <circleGeometry args={[0.06, 16]} />
          <meshStandardMaterial
            color="#00FFFF"
            emissive="#0099FF"
            emissiveIntensity={0.8}
            transparent
            opacity={0.95}
          />
        </mesh>
      </group>
      
      {/* STATUS INDICATOR PANEL */}
      <group position={[0, 0.35, 0.24]}>
        {[0, 1, 2].map(i => (
          <mesh key={i} position={[0, 0.1 - i * 0.1, 0]}>
            <circleGeometry args={[0.015, 8]} />
            <meshStandardMaterial
              color={i === 0 ? "#00FF00" : i === 1 ? "#FFFF00" : "#FF0000"}
              emissive={i === 0 ? "#003300" : i === 1 ? "#333300" : "#330000"}
              emissiveIntensity={0.4}
            />
          </mesh>
        ))}
      </group>
      
      {/* Antenna */}
      <mesh position={[0, 1.7, 0]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, 0.2, 8]} />
        <meshStandardMaterial color="#FF0000" />
      </mesh>
      <mesh position={[0, 1.85, 0]} castShadow>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color="#FF0000" emissive="#FF0000" emissiveIntensity={0.3} />
      </mesh>
      
      {/* ROBOTIC ARMS - Hydraulic/mechanical design */}
      <group ref={leftArmRef} position={[-0.45, 0.4, 0]}>
        {/* Shoulder joint */}
        <mesh castShadow>
          <sphereGeometry args={[0.08, 12, 8]} />
          <meshStandardMaterial
            color="#606060"
            roughness={0.25}
            metalness={0.9}
          />
        </mesh>
        {/* Upper arm */}
        <mesh position={[0, -0.25, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.08, 0.4, 12]} />
          <meshStandardMaterial
            color="#808080"
            roughness={0.2}
            metalness={0.85}
          />
        </mesh>
        {/* Elbow joint */}
        <mesh position={[0, -0.5, 0]} castShadow>
          <sphereGeometry args={[0.07, 12, 8]} />
          <meshStandardMaterial
            color="#606060"
            roughness={0.25}
            metalness={0.9}
          />
        </mesh>
        {/* Forearm */}
        <mesh position={[0, -0.7, 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.07, 0.3, 12]} />
          <meshStandardMaterial
            color="#808080"
            roughness={0.2}
            metalness={0.85}
          />
        </mesh>
        {/* Mechanical hand */}
        <mesh position={[0, -0.9, 0]} castShadow>
          <boxGeometry args={[0.12, 0.08, 0.15]} />
          <meshStandardMaterial
            color="#707070"
            roughness={0.3}
            metalness={0.8}
          />
        </mesh>
      </group>
      
      <group ref={rightArmRef} position={[0.45, 0.4, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.08, 12, 8]} />
          <meshStandardMaterial
            color="#606060"
            roughness={0.25}
            metalness={0.9}
          />
        </mesh>
        <mesh position={[0, -0.25, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.08, 0.4, 12]} />
          <meshStandardMaterial
            color="#808080"
            roughness={0.2}
            metalness={0.85}
          />
        </mesh>
        <mesh position={[0, -0.5, 0]} castShadow>
          <sphereGeometry args={[0.07, 12, 8]} />
          <meshStandardMaterial
            color="#606060"
            roughness={0.25}
            metalness={0.9}
          />
        </mesh>
        <mesh position={[0, -0.7, 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.07, 0.3, 12]} />
          <meshStandardMaterial
            color="#808080"
            roughness={0.2}
            metalness={0.85}
          />
        </mesh>
        <mesh position={[0, -0.9, 0]} castShadow>
          <boxGeometry args={[0.12, 0.08, 0.15]} />
          <meshStandardMaterial
            color="#707070"
            roughness={0.3}
            metalness={0.8}
          />
        </mesh>
      </group>
      
      {/* ROBOTIC LEGS - Sturdy mechanical design */}
      <group ref={leftLegRef} position={[-0.2, -0.7, 0]}>
        {/* Hip joint */}
        <mesh position={[0, 0.1, 0]} castShadow>
          <sphereGeometry args={[0.09, 12, 8]} />
          <meshStandardMaterial
            color="#606060"
            roughness={0.25}
            metalness={0.9}
          />
        </mesh>
        {/* Thigh */}
        <mesh castShadow>
          <cylinderGeometry args={[0.08, 0.1, 0.5, 12]} />
          <meshStandardMaterial
            color="#909090"
            roughness={0.2}
            metalness={0.85}
          />
        </mesh>
        {/* Knee joint */}
        <mesh position={[0, -0.35, 0]} castShadow>
          <sphereGeometry args={[0.08, 12, 8]} />
          <meshStandardMaterial
            color="#606060"
            roughness={0.25}
            metalness={0.9}
          />
        </mesh>
        {/* Shin */}
        <mesh position={[0, -0.6, 0]} castShadow>
          <cylinderGeometry args={[0.07, 0.09, 0.4, 12]} />
          <meshStandardMaterial
            color="#909090"
            roughness={0.2}
            metalness={0.85}
          />
        </mesh>
        {/* Foot */}
        <mesh position={[0, -0.85, 0.08]} castShadow>
          <boxGeometry args={[0.18, 0.08, 0.25]} />
          <meshStandardMaterial
            color="#707070"
            roughness={0.3}
            metalness={0.8}
          />
        </mesh>
      </group>
      
      <group ref={rightLegRef} position={[0.2, -0.7, 0]}>
        <mesh position={[0, 0.1, 0]} castShadow>
          <sphereGeometry args={[0.09, 12, 8]} />
          <meshStandardMaterial
            color="#606060"
            roughness={0.25}
            metalness={0.9}
          />
        </mesh>
        <mesh castShadow>
          <cylinderGeometry args={[0.08, 0.1, 0.5, 12]} />
          <meshStandardMaterial
            color="#909090"
            roughness={0.2}
            metalness={0.85}
          />
        </mesh>
        <mesh position={[0, -0.35, 0]} castShadow>
          <sphereGeometry args={[0.08, 12, 8]} />
          <meshStandardMaterial
            color="#606060"
            roughness={0.25}
            metalness={0.9}
          />
        </mesh>
        <mesh position={[0, -0.6, 0]} castShadow>
          <cylinderGeometry args={[0.07, 0.09, 0.4, 12]} />
          <meshStandardMaterial
            color="#909090"
            roughness={0.2}
            metalness={0.85}
          />
        </mesh>
        <mesh position={[0, -0.85, 0.08]} castShadow>
          <boxGeometry args={[0.18, 0.08, 0.25]} />
          <meshStandardMaterial
            color="#707070"
            roughness={0.3}
            metalness={0.8}
          />
        </mesh>
      </group>
      
      {/* HYDRAULIC JOINT DETAILS - Industrial accents */}
      {/* Shoulder joints */}
      {[-0.45, 0.45].map((x, i) => (
        <mesh key={`shoulder-${i}`} position={[x, 0.4, 0]} castShadow>
          <sphereGeometry args={[0.09, 8, 8]} />
          <meshStandardMaterial color="#FFD700" metalness={0.95} roughness={0.1} />
        </mesh>
      ))}
      {/* Hip joints */}
      {[-0.2, 0.2].map((x, i) => (
        <mesh key={`hip-${i}`} position={[x, -0.6, 0]} castShadow>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial color="#FFD700" metalness={0.95} roughness={0.1} />
        </mesh>
      ))}
      {/* Central power core */}
      <mesh position={[0, 0.1, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.12, 0.3, 16]} />
        <meshStandardMaterial 
          color="#FFA500" 
          emissive="#FF6600" 
          emissiveIntensity={0.2}
          metalness={0.8} 
          roughness={0.2} 
        />
      </mesh>
    </group>
  );
}

export { RealisticMonkey, RealisticRobot };