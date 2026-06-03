"use client";

import { useEffect, useRef } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Vec2 {
  x: number;
  y: number;
}

interface LegPoint {
  tip: Vec2;
  target: Vec2;
  restOffset: Vec2;
  stepT: number;
  stepping: boolean;
  prevTip: Vec2;
}

interface Spider {
  pos: Vec2;
  angle: number;
  targetAngle: number;
  speed: number;
  isPaused: boolean;
  stateTimer: number;
  legs: LegPoint[];
  /** Silk trail: last N positions */
  trail: Vec2[];
  /** Silk thread this spider is currently spinning from (anchor point) */
  silkAnchor: Vec2 | null;
  /** Accumulated silk segments: array of [from, to] pairs */
  silkLines: [Vec2, Vec2][];
  /** How long since we last pinned a new silk segment */
  silkTimer: number;
  /** Squeeze animation progress 0 → 1 (1 = fully squeezed, decays back to 0) */
  squeezeT: number;
  /** Whether a squeeze is currently playing */
  squeezeActive: boolean;
}

// ─── Web node for background web ─────────────────────────────────────────────

interface WebNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const BODY_RADIUS   = 7;
const NUM_LEGS      = 8;
const STEP_SPEED    = 0.14;
const STEP_THRESH   = 14;
const WALK_SPEED_MIN = 0.35;
const WALK_SPEED_MAX = 0.9;
const PAUSE_MIN     = 900;
const PAUSE_MAX     = 2400;
const WALK_MIN      = 1400;
const WALK_MAX      = 3200;
const TURN_SPEED    = 0.028;
const MARGIN        = 45;

// Silk / web
const SILK_INTERVAL = 300;       // ms between silk anchor pins
const MAX_SILK_LINES = 60;       // per spider
const SILK_FADE_START = 50;      // lines before they fade

// Background web
const WEB_NODES     = 14;        // anchor points for the decorative web
const WEB_RINGS     = 6;         // concentric rings
const WEB_DRIFT     = 0.12;      // gentle node drift speed

// Colours
const SPIDER_STROKE = "rgba(180, 180, 220, 0.60)";
const SPIDER_FILL   = "rgba(200, 200, 240, 0.70)";
const SILK_COLOR    = "rgba(160, 180, 255, 0.18)";
const WEB_COLOR     = "rgba(140, 160, 255, 0.10)";
const EYE_COLOR     = "rgba(120, 200, 255, 0.95)";

// Three spiders start scattered around the viewport
const SPAWN_POSITIONS = [
  { rx: 0.25, ry: 0.3  },
  { rx: 0.70, ry: 0.2  },
  { rx: 0.50, ry: 0.75 },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const vecLerp = (a: Vec2, b: Vec2, t: number): Vec2 => ({
  x: lerp(a.x, b.x, t),
  y: lerp(a.y, b.y, t),
});
const dist = (a: Vec2, b: Vec2) => Math.hypot(b.x - a.x, b.y - a.y);
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

function rotateVec(v: Vec2, a: number): Vec2 {
  const c = Math.cos(a), s = Math.sin(a);
  return { x: v.x * c - v.y * s, y: v.x * s + v.y * c };
}

function buildRestOffsets(): Vec2[] {
  const angles = [-2.2, -1.4, -0.7, -0.1, 0.1, 0.7, 1.4, 2.2];
  return Array.from({ length: NUM_LEGS }, (_, i) => {
    const side = i < NUM_LEGS / 2 ? -1 : 1;
    const idx  = i < NUM_LEGS / 2 ? i : i - NUM_LEGS / 2;
    const a    = side * angles[idx] + Math.PI / 2;
    return { x: Math.cos(a) * 27, y: Math.sin(a) * 27 };
  });
}

const REST_OFFSETS = buildRestOffsets();

function createSpider(wx: number, wy: number, spawnIdx: number): Spider {
  const pos: Vec2 = {
    x: SPAWN_POSITIONS[spawnIdx].rx * wx,
    y: SPAWN_POSITIONS[spawnIdx].ry * wy,
  };
  const angle = Math.random() * Math.PI * 2;
  const legs: LegPoint[] = REST_OFFSETS.map((offset) => {
    const rotated = rotateVec(offset, angle);
    const tip: Vec2 = { x: pos.x + rotated.x, y: pos.y + rotated.y };
    return {
      tip: { ...tip }, target: { ...tip },
      restOffset: { ...offset },
      prevTip: { ...tip }, stepT: 1, stepping: false,
    };
  });
  return {
    pos, angle, targetAngle: angle,
    speed: 0, isPaused: true,
    stateTimer: lerp(PAUSE_MIN, PAUSE_MAX, Math.random()),
    legs,
    trail: [],
    silkAnchor: { ...pos },
    silkLines: [],
    silkTimer: 0,
    squeezeT: 0,
    squeezeActive: false,
  };
}

function scheduleState(s: Spider) {
  if (s.isPaused) {
    s.isPaused    = false;
    s.speed       = lerp(WALK_SPEED_MIN, WALK_SPEED_MAX, Math.random());
    s.targetAngle = Math.random() * Math.PI * 2;
    s.stateTimer  = lerp(WALK_MIN, WALK_MAX, Math.random());
  } else {
    s.isPaused   = true;
    s.speed      = 0;
    s.stateTimer = lerp(PAUSE_MIN, PAUSE_MAX, Math.random());
  }
}

// ─── Background Web ───────────────────────────────────────────────────────────

function createWebNodes(w: number, h: number): WebNode[] {
  return Array.from({ length: WEB_NODES }, (_, i) => {
    const a = (i / WEB_NODES) * Math.PI * 2;
    const r = Math.min(w, h) * 0.38;
    return {
      x:  w / 2 + Math.cos(a) * r * (0.7 + Math.random() * 0.5),
      y:  h / 2 + Math.sin(a) * r * (0.7 + Math.random() * 0.5),
      vx: (Math.random() - 0.5) * WEB_DRIFT,
      vy: (Math.random() - 0.5) * WEB_DRIFT,
    };
  });
}

function drawWeb(ctx: CanvasRenderingContext2D, nodes: WebNode[], w: number, h: number) {
  const cx = w / 2, cy = h / 2;

  ctx.save();
  ctx.strokeStyle = WEB_COLOR;
  ctx.lineWidth   = 0.7;
  ctx.lineCap     = "round";

  // Radial spokes from centre to each node
  for (const n of nodes) {
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(n.x, n.y);
    ctx.stroke();
  }

  // Concentric rings connecting nodes at each "depth"
  for (let ring = 1; ring <= WEB_RINGS; ring++) {
    const t = ring / WEB_RINGS;
    ctx.beginPath();
    for (let i = 0; i < WEB_NODES; i++) {
      const n = nodes[i];
      const rx = lerp(cx, n.x, t);
      const ry = lerp(cy, n.y, t);
      if (i === 0) ctx.moveTo(rx, ry);
      else         ctx.lineTo(rx, ry);
    }
    ctx.closePath();
    ctx.stroke();
  }

  // Extra cross-braces between adjacent nodes for complexity
  for (let i = 0; i < WEB_NODES; i++) {
    const a = nodes[i];
    const b = nodes[(i + 2) % WEB_NODES];
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  }

  ctx.restore();
}

// ─── Draw One Spider ──────────────────────────────────────────────────────────

function drawSpider(ctx: CanvasRenderingContext2D, s: Spider) {
  const { pos, angle, legs } = s;

  // ── Squeeze scale (squash-and-stretch) ──────────────────────────────────
  // squeezeT goes 1 → 0; peak squeeze is at t=1, recovers to normal at t=0
  // We use a sine envelope so it eases in and out: wide → squish → bounce back
  const sq = s.squeezeActive ? Math.sin(s.squeezeT * Math.PI) : 0;
  // scaleX widens, scaleY squashes (conservation of volume feel)
  const scaleX = 1 + sq * 0.65;
  const scaleY = 1 - sq * 0.45;

  ctx.save();
  ctx.lineCap   = "round";
  ctx.lineJoin  = "round";

  // ── Silk trail ──────────────────────────────────────────────────────────
  if (s.silkLines.length > 0) {
    for (let i = 0; i < s.silkLines.length; i++) {
      const [from, to] = s.silkLines[i];
      const fade = i < SILK_FADE_START ? i / SILK_FADE_START : 1;
      ctx.beginPath();
      ctx.strokeStyle = `rgba(160, 180, 255, ${0.18 * fade})`;
      ctx.lineWidth = 0.6;
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
      ctx.stroke();
    }
  }

  // ── Legs (drawn outside squeeze transform so they flail naturally) ──────
  ctx.strokeStyle = SPIDER_STROKE;
  ctx.lineWidth   = 1.2;

  for (let i = 0; i < NUM_LEGS; i++) {
    const leg     = legs[i];
    const rotated = rotateVec(REST_OFFSETS[i], angle);
    // During squeeze, pull legs inward a bit
    const legSqueeze = s.squeezeActive ? (1 - sq * 0.35) : 1;
    const sx = pos.x + rotated.x * 0.25 * legSqueeze;
    const sy = pos.y + rotated.y * 0.25 * legSqueeze;

    const tipX = pos.x + (leg.tip.x - pos.x) * legSqueeze;
    const tipY = pos.y + (leg.tip.y - pos.y) * legSqueeze;

    const mid: Vec2 = {
      x: (sx + tipX) / 2 + rotated.y * 0.18,
      y: (sy + tipY) / 2 - rotated.x * 0.18,
    };
    const lift = leg.stepping ? Math.sin(leg.stepT * Math.PI) * 5 : 0;

    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.quadraticCurveTo(mid.x, mid.y - lift, tipX, tipY - lift * 0.5);
    ctx.stroke();
  }

  // ── Apply squeeze transform for bodies only ──────────────────────────────
  ctx.save();
  ctx.translate(pos.x, pos.y);
  ctx.scale(scaleX, scaleY);
  ctx.translate(-pos.x, -pos.y);

  // ── Abdomen ─────────────────────────────────────────────────────────────
  const abdOff = rotateVec({ x: 0, y: BODY_RADIUS * 1.8 }, angle);
  ctx.beginPath();
  ctx.ellipse(
    pos.x + abdOff.x, pos.y + abdOff.y,
    BODY_RADIUS * 0.9, BODY_RADIUS * 1.3,
    angle + Math.PI / 2, 0, Math.PI * 2,
  );
  // Flash pink-red on squeeze peak
  const flashAmt = s.squeezeActive ? sq * 0.7 : 0;
  ctx.fillStyle = flashAmt > 0.05
    ? `rgba(${Math.round(200 + 55 * flashAmt)}, ${Math.round(200 - 100 * flashAmt)}, ${Math.round(240 - 100 * flashAmt)}, 0.85)`
    : SPIDER_FILL;
  ctx.fill();
  ctx.strokeStyle = SPIDER_STROKE;
  ctx.lineWidth   = 0.8;
  ctx.stroke();

  // ── Cephalothorax ───────────────────────────────────────────────────────
  ctx.beginPath();
  ctx.arc(pos.x, pos.y, BODY_RADIUS, 0, Math.PI * 2);
  ctx.fillStyle = flashAmt > 0.05
    ? `rgba(${Math.round(200 + 55 * flashAmt)}, ${Math.round(200 - 100 * flashAmt)}, ${Math.round(240 - 100 * flashAmt)}, 0.85)`
    : SPIDER_FILL;
  ctx.fill();
  ctx.stroke();

  // ── Eyes (stay bright, maybe widen with surprise) ──────────────────────
  const eyeOffsets: Vec2[] = [
    rotateVec({ x:  0,   y: -BODY_RADIUS * 0.55 }, angle),
    rotateVec({ x: -2.2, y: -BODY_RADIUS * 0.55 }, angle),
    rotateVec({ x:  2.2, y: -BODY_RADIUS * 0.55 }, angle),
  ];
  const eyeR = 1.1 + sq * 0.8; // eyes widen in surprise
  ctx.fillStyle = s.squeezeActive && sq > 0.1
    ? `rgba(255, 80, 80, 0.95)`  // red scared eyes at peak
    : EYE_COLOR;
  for (const e of eyeOffsets) {
    ctx.beginPath();
    ctx.arc(pos.x + e.x, pos.y + e.y, eyeR, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore(); // pop squeeze transform
  ctx.restore(); // pop main save
}

// ─── Update One Spider ────────────────────────────────────────────────────────

function updateSpider(s: Spider, dt: number, w: number, h: number) {
  // State machine
  s.stateTimer -= dt;
  if (s.stateTimer <= 0) scheduleState(s);

  // Movement
  if (!s.isPaused) {
    let da = s.targetAngle - s.angle;
    while (da >  Math.PI) da -= Math.PI * 2;
    while (da < -Math.PI) da += Math.PI * 2;
    s.angle += clamp(da, -TURN_SPEED, TURN_SPEED);

    s.pos.x += Math.cos(s.angle) * s.speed;
    s.pos.y += Math.sin(s.angle) * s.speed;

    if (s.pos.x < MARGIN)     { s.pos.x = MARGIN;     s.targetAngle =  Math.random() * Math.PI - Math.PI / 2; }
    if (s.pos.x > w - MARGIN) { s.pos.x = w - MARGIN; s.targetAngle =  Math.PI + Math.random() * Math.PI - Math.PI / 2; }
    if (s.pos.y < MARGIN)     { s.pos.y = MARGIN;     s.targetAngle =  Math.random() * Math.PI; }
    if (s.pos.y > h - MARGIN) { s.pos.y = h - MARGIN; s.targetAngle = -Math.random() * Math.PI; }
  }

  // Leg IK
  for (let i = 0; i < NUM_LEGS; i++) {
    const leg     = s.legs[i];
    const rotated = rotateVec(REST_OFFSETS[i], s.angle);
    const ideal: Vec2 = { x: s.pos.x + rotated.x, y: s.pos.y + rotated.y };

    if (leg.stepping) {
      leg.stepT = Math.min(1, leg.stepT + STEP_SPEED);
      leg.tip   = vecLerp(leg.prevTip, leg.target, leg.stepT);
      if (leg.stepT >= 1) leg.stepping = false;
    } else if (dist(leg.tip, ideal) > STEP_THRESH) {
      const prev = s.legs[(i + NUM_LEGS - 1) % NUM_LEGS];
      const next = s.legs[(i + 1) % NUM_LEGS];
      if (!prev.stepping && !next.stepping) {
        leg.prevTip = { ...leg.tip };
        leg.target  = { x: ideal.x + (Math.random() - 0.5) * 4, y: ideal.y + (Math.random() - 0.5) * 4 };
        leg.stepT   = 0;
        leg.stepping = true;
      }
    }
  }

  // Silk: pin a new segment while walking
  if (!s.isPaused) {
    s.silkTimer += dt;
    if (s.silkTimer >= SILK_INTERVAL && s.silkAnchor) {
      s.silkTimer = 0;
      const from: Vec2 = { ...s.silkAnchor };
      const to: Vec2   = { ...s.pos };
      s.silkLines.push([from, to]);
      if (s.silkLines.length > MAX_SILK_LINES) s.silkLines.shift();
      s.silkAnchor = { ...s.pos };
    }
  }

  // Squeeze decay — animate squeezeT from 1 back down to 0
  if (s.squeezeActive) {
    s.squeezeT -= dt / 350; // full cycle in ~350 ms
    if (s.squeezeT <= 0) {
      s.squeezeT = 0;
      s.squeezeActive = false;
    }
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function SpiderCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = window.innerWidth;
    let h = window.innerHeight;

    function resize() {
      if (!canvas) return;
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width  = w;
      canvas.height = h;
    }
    resize();
    window.addEventListener("resize", resize);

    // Initialise 3 spiders
    const spiders: Spider[] = [0, 1, 2].map((i) => createSpider(w, h, i));

    // Initialise background web nodes
    let webNodes = createWebNodes(w, h);

    // Re-create web on resize
    window.addEventListener("resize", () => {
      webNodes = createWebNodes(w, h);
      // Respawn spiders to new proportional positions
      for (let i = 0; i < spiders.length; i++) {
        spiders[i].pos.x = SPAWN_POSITIONS[i].rx * w;
        spiders[i].pos.y = SPAWN_POSITIONS[i].ry * h;
      }
    });

    let lastTime = performance.now();
    let rafId: number;

    function frame(now: number) {
      if (!canvas || !ctx) return;
      const dt = Math.min(now - lastTime, 50);
      lastTime = now;

      ctx.clearRect(0, 0, w, h);

      // ── Drift web nodes gently ─────────────────────────────────────────
      for (const n of webNodes) {
        n.x += n.vx;
        n.y += n.vy;
        // Soft bounce at boundaries
        if (n.x < w * 0.05 || n.x > w * 0.95) n.vx *= -1;
        if (n.y < h * 0.05 || n.y > h * 0.95) n.vy *= -1;
      }

      // ── Draw background web ────────────────────────────────────────────
      drawWeb(ctx, webNodes, w, h);

      // ── Update & draw spiders ─────────────────────────────────────────
      for (const s of spiders) {
        updateSpider(s, dt, w, h);
        drawSpider(ctx, s);
      }

      rafId = requestAnimationFrame(frame);
    }

    rafId = requestAnimationFrame(frame);

    // ── Click: squeeze the spider that was hit ───────────────────────────
    const HIT_RADIUS = 28; // generous hit zone (body + nearby legs)

    function getSpiderHit(mx: number, my: number): Spider | null {
      for (const s of spiders) {
        const abdOff = rotateVec({ x: 0, y: BODY_RADIUS * 1.8 }, s.angle);
        const abdCx  = s.pos.x + abdOff.x;
        const abdCy  = s.pos.y + abdOff.y;
        if (
          dist({ x: mx, y: my }, s.pos) < HIT_RADIUS ||
          dist({ x: mx, y: my }, { x: abdCx, y: abdCy }) < HIT_RADIUS
        ) return s;
      }
      return null;
    }

    function onWindowClick(e: MouseEvent) {
      const hit = getSpiderHit(e.clientX, e.clientY);
      if (hit) {
        hit.squeezeT      = 1;
        hit.squeezeActive = true;
        // Panic scurry away
        hit.isPaused    = false;
        hit.speed       = WALK_SPEED_MAX * 1.8;
        hit.targetAngle = Math.random() * Math.PI * 2;
        hit.stateTimer  = lerp(WALK_MIN, WALK_MAX, Math.random());
      }
    }

    // ── Cursor: pointer when hovering over a spider ──────────────────────
    function onWindowMouseMove(e: MouseEvent) {
      const hit = getSpiderHit(e.clientX, e.clientY);
      // Only override cursor if not hovering a real interactive element
      const tag = (e.target as HTMLElement).tagName;
      const isInteractive = ["A", "BUTTON", "INPUT", "TEXTAREA", "SELECT"].includes(tag);
      if (!isInteractive) {
        document.body.style.cursor = hit ? "pointer" : "";
      }
    }

    window.addEventListener("click",     onWindowClick);
    window.addEventListener("mousemove", onWindowMouseMove);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize",    resize);
      window.removeEventListener("click",     onWindowClick);
      window.removeEventListener("mousemove", onWindowMouseMove);
      document.body.style.cursor = "";
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width:  "100%",
        height: "100%",
        pointerEvents: "none",  // clicks pass through to page; window listener handles spider hits
        zIndex: 0,
      }}
    />
  );
}
