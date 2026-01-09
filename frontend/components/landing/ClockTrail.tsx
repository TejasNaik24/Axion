/**
 * ClockTrail Component
 *
 * Purpose: Renders a thick, animated ribbon trail behind a clock hand tip
 * - Improved from simple Line to Mesh-based ribbon for better visibility
 * - Samples hand tip position each frame (world space)
 * - Generates quad-strip geometry with thickness
 * - Updates BufferGeometry with position and alpha attributes
 * - Uses additive blending for soft glow effect
 * - Renders behind hands (renderOrder = 0)
 *
 * Performance: reuses Vector3 objects, mutates BufferAttributes directly
 */

"use client";

import React, { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const FADE_EXPONENT = 1.1;

interface ClockTrailProps {
  handRef: React.RefObject<THREE.Mesh | null | undefined>;
  handLength: number;
  color: string;
  thickness?: number;
  maxSamples?: number;
}

export default function ClockTrail({
  handRef,
  handLength,
  color,
  thickness = 0.05, // Default thickness in Three.js units
  maxSamples = 80,
}: ClockTrailProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  // Reusable Vector3 and Matrix4 objects to avoid allocations in useFrame
  const tipLocal = useMemo(() => new THREE.Vector3(), []);
  const tipWorld = useMemo(() => new THREE.Vector3(), []);
  const smoothedTip = useMemo(() => new THREE.Vector3(), []);
  const lastPosition = useMemo(() => new THREE.Vector3(), []);
  const direction = useMemo(() => new THREE.Vector3(), []);
  const side = useMemo(() => new THREE.Vector3(), []);
  const up = useMemo(() => new THREE.Vector3(0, 0, 1), []);

  // Circular buffer state
  const initialized = useRef(false);

  // Create geometry and material
  const { geometry, material } = useMemo(() => {
    // Ribbon logic: 2 vertices per sample point to create a quad strip
    const positions = new Float32Array(maxSamples * 2 * 3);
    const alphas = new Float32Array(maxSamples * 2);
    const indices = new Uint16Array((maxSamples - 1) * 6);

    // Initialize indices for quad strip triangles
    for (let i = 0; i < maxSamples - 1; i++) {
      const v0 = i * 2;
      const v1 = v0 + 1;
      const v2 = v0 + 2;
      const v3 = v0 + 3;

      // Two triangles per segment
      indices[i * 6] = v0;
      indices[i * 6 + 1] = v1;
      indices[i * 6 + 2] = v2;
      indices[i * 6 + 3] = v2;
      indices[i * 6 + 4] = v1;
      indices[i * 6 + 5] = v3;
    }

    const geo = new THREE.BufferGeometry();
    geo.setIndex(new THREE.BufferAttribute(indices, 1));
    const posAttr = new THREE.BufferAttribute(positions, 3);
    const alphaAttr = new THREE.BufferAttribute(alphas, 1);

    posAttr.usage = THREE.DynamicDrawUsage;
    alphaAttr.usage = THREE.DynamicDrawUsage;

    geo.setAttribute("position", posAttr);
    geo.setAttribute("alpha", alphaAttr);

    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uColor: { value: new THREE.Color(color) },
      },
      vertexShader: `
        attribute float alpha;
        varying float vAlpha;
        
        void main() {
          vAlpha = alpha;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        varying float vAlpha;
        
        void main() {
          // Stronger glowing beam with soft falloff
          vec3 bloom = uColor * 2.5;
          gl_FragColor = vec4(bloom, vAlpha * 0.9);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      depthTest: true,
      side: THREE.DoubleSide,
    });

    return { geometry: geo, material: mat };
  }, [color, maxSamples]);

  // Initialize positions on first valid frame
  useEffect(() => {
    if (!handRef.current || initialized.current) return;

    tipLocal.set(handLength, 0, 0);
    tipWorld.copy(tipLocal);
    handRef.current.localToWorld(tipWorld);
    smoothedTip.copy(tipWorld);
    lastPosition.copy(tipWorld);
    initialized.current = true;
  }, [handRef, handLength, tipLocal, tipWorld, smoothedTip, lastPosition]);

  useFrame(() => {
    if (!handRef.current || !initialized.current) return;

    // Get current tip position
    tipLocal.set(handLength, 0, 0);
    tipWorld.copy(tipLocal);
    handRef.current.localToWorld(tipWorld);

    // Only update trail if we've moved significantly to avoid "tiny dots" jitter
    const moveDist = tipWorld.distanceTo(lastPosition);
    if (moveDist < 0.001) return;

    // Smooth movement for the "history"
    smoothedTip.lerp(tipWorld, 0.4);

    const posAttr = geometry.getAttribute("position") as THREE.BufferAttribute;
    const alphaAttr = geometry.getAttribute("alpha") as THREE.BufferAttribute;
    const positions = posAttr.array as Float32Array;
    const alphas = alphaAttr.array as Float32Array;

    // Shift samples back (oldest falls off)
    for (let i = maxSamples - 1; i > 0; i--) {
      const srcIdx = (i - 1) * 2 * 3;
      const dstIdx = i * 2 * 3;
      for (let j = 0; j < 6; j++) {
        positions[dstIdx + j] = positions[srcIdx + j];
      }
      alphas[i * 2] = alphas[(i - 1) * 2];
      alphas[i * 2 + 1] = alphas[(i - 1) * 2 + 1];
    }

    // Calculate perpendicular "side" vector for thickness
    direction.subVectors(tipWorld, lastPosition).normalize();
    if (direction.lengthSq() < 0.0001) {
      direction.set(0, 1, 0); // Default direction
    }
    side.crossVectors(direction, up).normalize().multiplyScalar(thickness * 0.5);

    // Insert new points at ribbon head (index 0 and 1)
    // CRITICAL: use tipWorld (raw) for the header to ENSURE IT TOUCHES THE HAND
    positions[0] = tipWorld.x + side.x;
    positions[1] = tipWorld.y + side.y;
    positions[2] = tipWorld.z - 0.01;

    positions[3] = tipWorld.x - side.x;
    positions[4] = tipWorld.y - side.y;
    positions[5] = tipWorld.z - 0.01;

    // Update alpha fade
    for (let i = 0; i < maxSamples; i++) {
      const t = i / (maxSamples - 1);
      const alphaVal = Math.pow(1 - t, FADE_EXPONENT);
      alphas[i * 2] = alphaVal;
      alphas[i * 2 + 1] = alphaVal;
    }

    lastPosition.copy(tipWorld);
    posAttr.needsUpdate = true;
    alphaAttr.needsUpdate = true;
  });

  return <mesh ref={meshRef} geometry={geometry} material={material} renderOrder={0} />;
}
