"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment, ContactShadows, Text } from "@react-three/drei";

import { useRef } from "react";
import * as THREE from "three";

function Card() {
  const ref = useRef();

  useFrame((state, delta) => {
    if (
      ref.current &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      ref.current.rotation.y += delta * 0.12;

      ref.current.rotation.x = THREE.MathUtils.lerp(
        ref.current.rotation.x,
        -0.08 + state.pointer.y * 0.08,
        0.04,
      );
    }
  });

  return (
    <Float speed={1.1} rotationIntensity={0.08} floatIntensity={0.18}>
      <group ref={ref}>
        {/* CUERPO DE LA TARJETA */}
        <mesh castShadow>
          <boxGeometry args={[3.7, 2.32, 0.075]} />

          <meshPhysicalMaterial
            color="#123e69"
            metalness={0.55}
            roughness={0.27}
            clearcoat={1}
          />
        </mesh>

        {/* NOMBRE DE LA PLATAFORMA */}
        <Text
          position={[-1.48, 0.88, 0.055]}
          fontSize={0.17}
          color="#ffffff"
          anchorX="left"
          anchorY="middle"
          letterSpacing={0.04}
        >
          CREDICHECK
        </Text>

        {/* CATEGORÍA DE TARJETA */}
        <Text
          position={[1.48, 0.88, 0.055]}
          fontSize={0.11}
          color="#a8dce9"
          anchorX="right"
          anchorY="middle"
        >
          FINANCIAL
        </Text>

        {/* CHIP */}
        <mesh position={[-1.3, 0.43, 0.055]}>
          <boxGeometry args={[0.48, 0.36, 0.025]} />

          <meshStandardMaterial
            color="#d9c58c"
            metalness={0.85}
            roughness={0.22}
          />
        </mesh>

        {/* DIVISIONES DEL CHIP */}
        <mesh position={[-1.3, 0.43, 0.07]}>
          <boxGeometry args={[0.025, 0.35, 0.008]} />
          <meshBasicMaterial color="#927b4d" />
        </mesh>

        <mesh position={[-1.3, 0.43, 0.07]}>
          <boxGeometry args={[0.46, 0.025, 0.008]} />
          <meshBasicMaterial color="#927b4d" />
        </mesh>

        {/* ICONO CONTACTLESS */}
        <Text
          position={[1.25, 0.43, 0.06]}
          fontSize={0.32}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          )))
        </Text>

        {/* NÚMERO DE TARJETA DEMOSTRATIVO */}
        <Text
          position={[-1.45, -0.08, 0.06]}
          fontSize={0.22}
          color="#ffffff"
          anchorX="left"
          anchorY="middle"
          letterSpacing={0.035}
        >
          0000 0000 0000 0000
        </Text>

        {/* TITULAR */}
        <Text
          position={[-1.45, -0.7, 0.06]}
          fontSize={0.105}
          color="#b8dce9"
          anchorX="left"
          anchorY="middle"
        >
          TITULAR DE LA TARJETA
        </Text>

        <Text
          position={[-1.45, -0.88, 0.06]}
          fontSize={0.13}
          color="#ffffff"
          anchorX="left"
          anchorY="middle"
        >
          JUAN RESTREPO
        </Text>

        {/* VENCIMIENTO */}
        <Text
          position={[0.35, -0.7, 0.06]}
          fontSize={0.09}
          color="#b8dce9"
          anchorX="left"
          anchorY="middle"
        >
          VENCE
        </Text>

        <Text
          position={[0.35, -0.88, 0.06]}
          fontSize={0.13}
          color="#ffffff"
          anchorX="left"
          anchorY="middle"
        >
          MM/AA
        </Text>

        {/* LOGOTIPO CIRCULAR */}
        <mesh position={[1.12, -0.72, 0.06]}>
          <circleGeometry args={[0.18, 32]} />
          <meshBasicMaterial color="#f2a65a" />
        </mesh>

        <mesh position={[1.32, -0.72, 0.065]}>
          <circleGeometry args={[0.18, 32]} />
          <meshBasicMaterial color="#e75c68" transparent opacity={0.9} />
        </mesh>
      </group>
    </Float>
  );
}

export default function Tarjeta3D() {
  return (
    <div
      className="three-wrap"
      aria-label="Tarjeta financiera CrediCheck en tres dimensiones"
    >
      <Canvas camera={{ position: [0, 0, 6.4], fov: 38 }} dpr={[1, 1.5]}>
        <ambientLight intensity={1.4} />

        <directionalLight position={[4, 5, 5]} intensity={2.3} />

        <pointLight position={[-4, -2, 3]} intensity={1.2} color="#65d8e8" />

        <Card />

        <Environment preset="city" />

        <ContactShadows
          position={[0, -1.8, 0]}
          opacity={0.3}
          scale={7}
          blur={2.8}
        />
      </Canvas>
    </div>
  );
}
