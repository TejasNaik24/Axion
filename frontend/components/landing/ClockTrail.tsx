/**
 * ClockTrail Component
 *
 * Purpose: Renders a thin, animated trail behind a clock hand tip
 * - Samples hand tip position each frame (world space)
 * - Maintains circular buffer of MAX_SAMPLES positions
 * - Updates BufferGeometry with position and alpha attributes
 * - Uses additive blending for soft glow effect
 * - Renders behind hands (renderOrder = 0)
 *
 * Performance: MAX_SAMPLES = 40, reuses Vector3 objects, mutates BufferAttributes directly
 *
 * NOTE: do not create new Vector3 inside useFrame (reuse objects)
 * TODO: switch to Line2 or MeshLine if linewidth is required across platforms
 * TODO: connect trail color dynamics to AxionParticle.state (retrieving -> stronger glow)
 */

"use client";

import React, { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const MAX_SAMPLES = 40;
const FADE_EXPONENT = 1.6;

interface ClockTrailProps {
  handRef: React.RefObject<THREE.Mesh>;
  handLength: number;
  color: string;
  thickness?: number;
}

export default function ClockTrail({
  handRef,
  handLength,
  color,
  thickness = 1.5,
}: ClockTrailProps) {
  const lineRef = useRef<THREE.Line>(null);

  // Reusable Vector3 objects to avoid allocations in useFrame
  const tipLocal = useMemo(() => new THREE.Vector3(), []);
  const tipWorld = useMemo(() => new THREE.Vector3(), []);
  const smoothedTip = useMemo(() => new THREE.Vector3(), []);

  // Circular buffer state
  const bufferIndex = useRef(0);
  const initialized = useRef(false);

  // Create geometry and material
  const { geometry, material, line } = useMemo(() => {
    // Positions buffer (x,y,z for each sample)
    const positions = new Float32Array(MAX_SAMPLES * 3);
    const alphas = new Float32Array(MAX_SAMPLES);

    // Initialize with zeros
    for (let i = 0; i < MAX_SAMPLES; i++) {
      positions[i * 3] = 0;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = -0.001; // Slightly behind to ensure trail is behind hands
      alphas[i] = 0;
    }

    const geo = new THREE.BufferGeometry();
    const posAttr = new THREE.BufferAttribute(positions, 3);
    const alphaAttr = new THREE.BufferAttribute(alphas, 1);

    posAttr.setUsage(THREE.DynamicDrawUsage);
    alphaAttr.setUsage(THREE.DynamicDrawUsage);

    geo.setAttribute("position", posAttr);
    geo.setAttribute("alpha", alphaAttr);

    // Material with vertex colors for alpha fade
    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uColor: { value: new THREE.Color(color) },
      },
      vertexShader: `
        attribute float alpha;
        varying float vAlpha;
        
        void main() {
          vAlpha = alpha;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        varying float vAlpha;
        
        void main() {
          // Soft glow with alpha fade
          vec3 finalColor = uColor * (1.0 + vAlpha * 0.5);
          gl_FragColor = vec4(finalColor, vAlpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      depthTest: true,
      toneMapped: false,
    });

    // Create the Line object
    const lineObj = new THREE.Line(geo, mat);
    lineObj.renderOrder = 0; // Render behind hands

    return { geometry: geo, material: mat, line: lineObj };
  }, [color]);

  // Initialize smoothedTip position on first valid hand position
  useEffect(() => {
    if (!handRef.current || initialized.current) return;

    // Compute initial tip position
    tipLocal.set(handLength, 0, 0);
    tipWorld.copy(tipLocal);
    handRef.current.localToWorld(tipWorld);
    smoothedTip.copy(tipWorld);
    initialized.current = true;
  }, [handRef, handLength, tipLocal, tipWorld, smoothedTip]);

  useFrame(() => {
    if (!handRef.current || !initialized.current) return;

    // Compute tip world position
    tipLocal.set(handLength, 0, 0);
    tipWorld.copy(tipLocal);
    handRef.current.localToWorld(tipWorld);

    // Smooth the tip position to avoid jitter
    smoothedTip.lerp(tipWorld, 0.25);

    // Update circular buffer
    const posAttr = geometry.getAttribute("position") as THREE.BufferAttribute;
    const alphaAttr = geometry.getAttribute("alpha") as THREE.BufferAttribute;
    const positions = posAttr.array as Float32Array;
    const alphas = alphaAttr.array as Float32Array;

    // Shift all samples back by one (oldest falls off)
    for (let i = MAX_SAMPLES - 1; i > 0; i--) {
      const srcIdx = (i - 1) * 3;
      const dstIdx = i * 3;
      positions[dstIdx] = positions[srcIdx];
      positions[dstIdx + 1] = positions[srcIdx + 1];
      positions[dstIdx + 2] = positions[srcIdx + 2];
      alphas[i] = alphas[i - 1];
    }

    // Insert new sample at index 0 (newest)
    positions[0] = smoothedTip.x;
    positions[1] = smoothedTip.y;
    positions[2] = smoothedTip.z - 0.001; // Slightly behind

    // Update alpha fade: newest = 1.0, oldest = 0
    for (let i = 0; i < MAX_SAMPLES; i++) {
      const t = i / (MAX_SAMPLES - 1);
      alphas[i] = Math.pow(1 - t, FADE_EXPONENT);
    }

    posAttr.needsUpdate = true;
    alphaAttr.needsUpdate = true;
  });

  return <primitive object={line} ref={lineRef} />;
}
