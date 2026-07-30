"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float } from "@react-three/drei";
import * as THREE from "three";

// ── 3D Knowledge Network Scene Component ─────────────────────────────
function KnowledgeNetwork() {
  const groupRef = useRef<THREE.Group>(null);
  const pulseGroupRef = useRef<THREE.Group>(null);

  // Generate deterministic cluster of vector embedding nodes
  const nodes = useMemo(() => {
    const tempNodes = [];
    const count = 18;
    for (let i = 0; i < count; i++) {
      const radius = 1.8 + Math.random() * 1.4;
      const theta = (i / count) * Math.PI * 2 + Math.random() * 0.5;
      const phi = Math.acos(2 * Math.random() - 1);
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      const size = 0.08 + Math.random() * 0.12;
      const isCore = i % 4 === 0;
      tempNodes.push({
        position: new THREE.Vector3(x, y, z),
        size,
        color: isCore ? "#60a5fa" : i % 3 === 0 ? "#38bdf8" : "#818cf8",
        emissiveIntensity: isCore ? 1.4 : 0.8,
      });
    }
    return tempNodes;
  }, []);

  // Connections between nodes
  const connectionLines = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const pulsePaths: { start: THREE.Vector3; end: THREE.Vector3; progress: number; speed: number }[] = [];

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dist = nodes[i].position.distanceTo(nodes[j].position);
        if (dist < 2.4) {
          points.push(nodes[i].position);
          points.push(nodes[j].position);
          pulsePaths.push({
            start: nodes[i].position.clone(),
            end: nodes[j].position.clone(),
            progress: Math.random(),
            speed: 0.006 + Math.random() * 0.008,
          });
        }
      }
    }

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    return { geometry, pulsePaths };
  }, [nodes]);

  // Line pulse animation reference
  const pulsesRef = useRef(connectionLines.pulsePaths);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.15;
      groupRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.1;
    }

    // Animate pulse particles along line paths
    if (pulseGroupRef.current) {
      pulsesRef.current.forEach((pulse, idx) => {
        pulse.progress += pulse.speed;
        if (pulse.progress > 1) pulse.progress = 0;

        const child = pulseGroupRef.current?.children[idx] as THREE.Mesh | undefined;
        if (child) {
          child.position.lerpVectors(pulse.start, pulse.end, pulse.progress);
        }
      });
    }
  });

  return (
    <group ref={groupRef}>
      {/* Central LangGraph Vector Core */}
      <mesh position={[0, 0, 0]}>
        <icosahedronGeometry args={[0.55, 2]} />
        <meshStandardMaterial
          color="#3b82f6"
          emissive="#2563eb"
          emissiveIntensity={1.8}
          roughness={0.2}
          metalness={0.8}
          wireframe
        />
      </mesh>

      {/* Inner Glowing Core Energy Sphere */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.35, 16, 16]} />
        <meshBasicMaterial color="#60a5fa" transparent opacity={0.6} />
      </mesh>

      {/* Vector Embedding Nodes */}
      {nodes.map((node, index) => (
        <mesh key={index} position={node.position}>
          <sphereGeometry args={[node.size, 16, 16]} />
          <meshStandardMaterial
            color={node.color}
            emissive={node.color}
            emissiveIntensity={node.emissiveIntensity}
            roughness={0.3}
            transparent
            opacity={0.9}
          />
        </mesh>
      ))}

      {/* Thin Animated Connection Lines */}
      <lineSegments geometry={connectionLines.geometry}>
        <lineBasicMaterial color="#3b82f6" transparent opacity={0.25} />
      </lineSegments>

      {/* Pulsing Light Particles traveling along lines */}
      <group ref={pulseGroupRef}>
        {connectionLines.pulsePaths.map((_, idx) => (
          <mesh key={idx}>
            <sphereGeometry args={[0.035, 8, 8]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        ))}
      </group>
    </group>
  );
}

// ── Main Canvas Component ───────────────────────────────────────────
export default function Hero3DCanvas({ className = "" }: { className?: string }) {
  return (
    <div className={`w-full h-full relative ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 5.2], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 10]} intensity={1.2} />
        <pointLight position={[-5, -5, -5]} color="#38bdf8" intensity={2} />

        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
          <KnowledgeNetwork />
        </Float>

        <OrbitControls
          autoRotate
          autoRotateSpeed={0.8}
          enableZoom={false}
          enablePan={false}
          enableRotate={false}
        />
      </Canvas>
    </div>
  );
}
