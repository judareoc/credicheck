"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment, ContactShadows, Html } from "@react-three/drei";

import { useRef } from "react";
import * as THREE from "three";

// Indicadores flotantes
function Indicador({ position, titulo, descripcion, color, icono }) {
  return (
    <Html position={position} center distanceFactor={5.5}>
      <div
        style={{
          width: "145px",
          padding: "11px",
          borderRadius: "13px",
          background: "rgba(255,255,255,0.94)",
          border: `1px solid ${color}`,
          boxShadow: "0 8px 25px rgba(20,50,80,0.12)",
          fontFamily: "Arial, sans-serif",
          backdropFilter: "blur(10px)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "7px",
            marginBottom: "5px",
          }}
        >
          <span
            style={{
              color,
              fontSize: "18px",
            }}
          >
            {icono}
          </span>

          <strong
            style={{
              color: "#173653",
              fontSize: "11px",
            }}
          >
            {titulo}
          </strong>
        </div>

        <div
          style={{
            fontSize: "10px",
            color: "#718096",
          }}
        >
          {descripcion}
        </div>
      </div>
    </Html>
  );
}

// Esfera principal
function Esfera() {
  const esfera = useRef();

  useFrame((state, delta) => {
    if (esfera.current) {
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (!reduceMotion) {
        esfera.current.rotation.y += delta * 0.12;
        esfera.current.rotation.x =
          Math.sin(state.clock.elapsedTime * 0.3) * 0.08;
      }
    }
  });

  return (
    <Float speed={1} floatIntensity={0.16} rotationIntensity={0.08}>
      <group ref={esfera}>
        {/* Núcleo financiero */}
        <mesh>
          <icosahedronGeometry args={[1.05, 3]} />

          <meshPhysicalMaterial
            color="#123F69"
            metalness={0.45}
            roughness={0.27}
            clearcoat={1}
            clearcoatRoughness={0.15}
            emissive="#06233C"
            emissiveIntensity={0.25}
          />
        </mesh>

        {/* Malla tecnológica */}
        <mesh scale={1.012}>
          <icosahedronGeometry args={[1.05, 2]} />

          <meshBasicMaterial
            color="#71DCE8"
            wireframe
            transparent
            opacity={0.3}
          />
        </mesh>

        {/* Anillo turquesa */}
        <mesh rotation={[0.9, 0.3, 0.2]}>
          <torusGeometry args={[1.48, 0.018, 12, 120]} />
          <meshStandardMaterial
            color="#69D6E5"
            metalness={0.7}
            roughness={0.2}
          />
        </mesh>

        {/* Anillo dorado */}
        <mesh rotation={[1.2, 0.7, 0.5]}>
          <torusGeometry args={[1.65, 0.014, 12, 120]} />
          <meshStandardMaterial
            color="#E9B969"
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>

        {/* Nodos luminosos */}
        {[
          [1.35, 0.55, 0.2],
          [-1.35, -0.55, 0.1],
          [0.3, 1.55, -0.1],
          [-0.4, -1.5, 0.2],
        ].map((pos, i) => (
          <mesh key={i} position={pos}>
            <sphereGeometry args={[0.09, 24, 24]} />
            <meshStandardMaterial
              color={i % 2 === 0 ? "#70DCE8" : "#E9B969"}
              emissive={i % 2 === 0 ? "#70DCE8" : "#E9B969"}
              emissiveIntensity={0.5}
            />
          </mesh>
        ))}
      </group>
    </Float>
  );
}

// Escena completa
function Escena() {
  return (
    <>
      <ambientLight intensity={1.4} />

      <directionalLight position={[4, 5, 5]} intensity={2} />

      <pointLight position={[-4, -2, 3]} intensity={1.8} color="#64D8E8" />

      <Esfera />

      {/* Indicadores del perfil */}
      <Indicador
        position={[-2.0, 1.25, 0]}
        titulo="INGRESOS"
        descripcion="Capacidad económica"
        color="#25A9B7"
        icono="$"
      />

      <Indicador
        position={[2.0, 1.25, 0]}
        titulo="DEUDAS"
        descripcion="Obligaciones actuales"
        color="#D9A64E"
        icono="↗"
      />

      <Indicador
        position={[-2.0, -1.25, 0]}
        titulo="HISTORIAL"
        descripcion="Comportamiento financiero"
        color="#4278B8"
        icono="✓"
      />

      <Indicador
        position={[2.0, -1.25, 0]}
        titulo="CAPACIDAD"
        descripcion="Disponibilidad mensual"
        color="#25A9B7"
        icono="◎"
      />

      <Environment preset="city" />

      <ContactShadows
        position={[0, -2, 0]}
        opacity={0.2}
        scale={6}
        blur={2.5}
      />
    </>
  );
}

export default function PerfilFinanciero3D() {
  return (
    <div
      className="profile-3d-canvas"
      role="img"
      aria-label="Modelo conceptual del perfil financiero con indicadores de ingresos, deudas, historial y capacidad"
    >
      <Canvas camera={{ position: [0, 0, 6.4], fov: 43 }} dpr={[1, 1.5]}>
        <Escena />
      </Canvas>
    </div>
  );
}
