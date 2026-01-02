// Dev: run 'npm i matter-js uuid'
// Dev: test reduced-motion behavior via OS settings or CSS media query
// NOTE: Matter.js code is loaded only in RagPhysicsCanvas to avoid SSR issues
"use client";
import React, { useEffect, useRef, useState } from "react";
import Matter from "matter-js";
import { v4 as uuidv4 } from "uuid";
import RagBlockCard from "./RagBlockCard";

interface RagBlock {
  id: string;
  title: string;
  brief: string;
  detail: string;
  tag: string;
}

const RAG_MOCK: RagBlock[] = [
  {
    id: "r1",
    title: "Missing Projects",
    brief: "You have few public projects.",
    detail:
      "Build 2–3 end-to-end projects that show ownership, architecture, and deployment. Include READMEs and demos.",
    tag: "projects",
  },
  {
    id: "r2",
    title: "Weak GitHub",
    brief: "Polish repos & READMEs.",
    detail:
      "Add tests, CI, and focused repos that demonstrate depth instead of breadth.",
    tag: "github",
  },
  {
    id: "r3",
    title: "Resume Format",
    brief: "Make GitHub visible & highlight impact.",
    detail:
      "Use concise bullets, metrics, and a visible GitHub link near top of resume.",
    tag: "resume",
  },
  {
    id: "r4",
    title: "Interview Prep",
    brief: "Timed practice & system design.",
    detail:
      "Combine timed LeetCode practice with weekly system design sketches for 30–60 minutes.",
    tag: "interview",
  },
];

// TODO: replace RAG_MOCK with retriever.getRelevantDocs(state, topK=24)
// Generate more blocks programmatically
function generateBlocks(count: number): RagBlock[] {
  const blocks: RagBlock[] = [];
  const variations = [
    "Build side projects",
    "Add project demos",
    "Improve GitHub profile",
    "Write better READMEs",
    "Add CI/CD badges",
    "Format resume better",
    "Highlight metrics",
    "Practice algorithms",
    "Study system design",
    "Mock interviews",
  ];

  for (let i = 0; i < count; i++) {
    const base = RAG_MOCK[i % RAG_MOCK.length];
    const variation = variations[i % variations.length];
    blocks.push({
      ...base,
      id: uuidv4(),
      brief: i < RAG_MOCK.length ? base.brief : variation,
    });
  }
  return blocks;
}

export default function RagPhysicsCanvas() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);
  const blocksRef = useRef<
    Map<string, { body: Matter.Body; element: HTMLDivElement }>
  >(new Map());
  const [blocks] = useState(() => generateBlocks(18));
  const animationFrameRef = useRef<number | null>(null);
  const draggedBodyRef = useRef<Matter.Body | null>(null);
  const dragOffsetRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!sceneRef.current) return;

    const { Engine, Render, World, Bodies, Mouse, MouseConstraint, Runner } =
      Matter;

    // Create engine
    const engine = Engine.create({
      gravity: { x: 0, y: 0.5 },
    });
    engineRef.current = engine;

    // Get container dimensions
    const container = sceneRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Create renderer (invisible, just for physics)
    const render = Render.create({
      element: container,
      engine: engine,
      options: {
        width,
        height,
        wireframes: false,
        background: "transparent",
      },
    });
    renderRef.current = render;

    // Create boundaries - positioned to keep blocks fully on screen
    const wallOptions = { isStatic: true, render: { visible: false } };
    const blockWidth = 160;
    const blockHeight = 100;

    // Ground: top edge at screen bottom
    const ground = Bodies.rectangle(width / 2, height + 50, width, 200, {
      ...wallOptions,
      label: "ground",
    });
    // Left wall: right edge at screen left
    const leftWall = Bodies.rectangle(-80, height / 2, 200, height, {
      ...wallOptions,
      label: "leftWall",
    });
    // Right wall: left edge at screen right
    const rightWall = Bodies.rectangle(width + 80, height / 2, 200, height, {
      ...wallOptions,
      label: "rightWall",
    });

    World.add(engine.world, [ground, leftWall, rightWall]);

    // Create physics bodies for blocks
    const blockBodies: Matter.Body[] = [];
    blocks.forEach((block, index) => {
      const blockWidth = 160;
      const blockHeight = 100;
      // Distribute evenly across the full width, starting from left
      const spacing = (width - blockWidth) / blocks.length;
      const x = blockWidth / 2 + index * spacing + (Math.random() - 0.5) * 120;
      const y = -blockHeight * 2 - index * 80; // Spawn above viewport

      const body = Bodies.rectangle(x, y, blockWidth, blockHeight, {
        restitution: 0.3,
        friction: 0.4,
        frictionAir: 0.02,
        angle: (Math.random() - 0.5) * 0.3,
        render: { visible: false },
      });

      body.label = block.id;
      blockBodies.push(body);
    });

    World.add(engine.world, blockBodies);

    // Custom drag handling for DOM elements
    const handleMouseDown = (e: MouseEvent, body: Matter.Body) => {
      e.preventDefault();
      draggedBodyRef.current = body;
      const rect = container.getBoundingClientRect();
      dragOffsetRef.current = {
        x: e.clientX - rect.left - body.position.x,
        y: e.clientY - rect.top - body.position.y,
      };
      container.style.cursor = "grabbing";
      Matter.Body.setStatic(body, true);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (draggedBodyRef.current) {
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left - dragOffsetRef.current.x;
        const y = e.clientY - rect.top - dragOffsetRef.current.y;
        Matter.Body.setPosition(draggedBodyRef.current, { x, y });
      }
    };

    const handleMouseUp = () => {
      if (draggedBodyRef.current) {
        Matter.Body.setStatic(draggedBodyRef.current, false);
        draggedBodyRef.current = null;
        container.style.cursor = "grab";
      }
    };

    // Add event listeners to blocks
    blocks.forEach((block) => {
      const body = blockBodies.find((b) => b.label === block.id);
      if (body) {
        const element = blocksRef.current.get(block.id)?.element;
        if (element) {
          element.addEventListener("mousedown", (e) =>
            handleMouseDown(e as MouseEvent, body)
          );
        }
      }
    });

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseup", handleMouseUp);
    container.addEventListener("mouseleave", handleMouseUp);

    // Start engine
    const runner = Runner.create();
    Runner.run(runner, engine);
    Render.run(render);

    // Sync DOM elements with physics bodies
    const syncDOMWithPhysics = () => {
      blockBodies.forEach((body) => {
        const blockData = blocksRef.current.get(body.label);
        if (blockData && blockData.element) {
          const { x, y } = body.position;
          const angle = body.angle;
          blockData.element.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${angle}rad)`;
        }
      });
      animationFrameRef.current = requestAnimationFrame(syncDOMWithPhysics);
    };

    syncDOMWithPhysics();

    // Cleanup
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseup", handleMouseUp);
      container.removeEventListener("mouseleave", handleMouseUp);
      Runner.stop(runner);
      Render.stop(render);
      World.clear(engine.world, false);
      Engine.clear(engine);
      render.canvas.remove();
    };
  }, [blocks]);

  return (
    <div
      ref={sceneRef}
      className="relative w-full h-[800px] overflow-hidden"
      style={{
        cursor: "grab",
      }}
    >
      {/* Canvas will be injected here by Matter.js Render */}

      {/* DOM overlay blocks */}
      {blocks.map((block, index) => {
        const blockWidth = 160;
        const blockHeight = 100;

        return (
          <div
            key={block.id}
            ref={(el) => {
              if (el) {
                blocksRef.current.set(block.id, {
                  body: engineRef.current?.world.bodies.find(
                    (b: Matter.Body) => b.label === block.id
                  )!,
                  element: el,
                });
              }
            }}
            className="absolute top-0 left-0"
            style={{
              width: `${blockWidth}px`,
              height: `${blockHeight}px`,
              transformOrigin: "center center",
              pointerEvents: "auto",
            }}
          >
            <RagBlockCard
              id={block.id}
              title={block.title}
              brief={block.brief}
              detail={block.detail}
              tag={block.tag}
              isPhysics={true}
            />
          </div>
        );
      })}
    </div>
  );
}
