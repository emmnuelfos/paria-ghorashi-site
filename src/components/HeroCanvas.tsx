"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/gsap";

/**
 * WebGL hero backdrop: a domain-warped fractal-noise light field mapped to
 * Paria's Signature Gold palette on Luxury Black. It evolves slowly over time
 * and flows toward the (smoothed) mouse position — the cloud brightens and
 * warps toward the cursor. Rendered at reduced internal resolution (the field
 * is soft, so there is no visible quality loss) for performance; paused when
 * offscreen; a single static frame when reduced motion is preferred.
 */

const VERT = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;
uniform vec2  u_res;
uniform float u_time;
uniform vec2  u_mouse;   // normalized 0..1, y up

// --- Ashima simplex noise 2D ---
vec3 mod289(vec3 x){ return x - floor(x * (1.0/289.0)) * 289.0; }
vec2 mod289(vec2 x){ return x - floor(x * (1.0/289.0)) * 289.0; }
vec3 permute(vec3 x){ return mod289(((x*34.0)+1.0)*x); }
float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                     -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0,0.0) : vec2(0.0,1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0))
                          + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m; m = m*m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++){
    v += a * snoise(p);
    p = p * 2.0 + vec2(11.3, 7.7);
    a *= 0.5;
  }
  return v;
}

// Signature-gold ramp: black -> warm onyx -> bronze -> gold -> light gold -> ivory
vec3 goldRamp(float x){
  x = clamp(x, 0.0, 1.0);
  vec3 c0 = vec3(0.0, 0.0, 0.0);
  vec3 c1 = vec3(0.075, 0.058, 0.043);
  vec3 c2 = vec3(0.290, 0.223, 0.140);
  vec3 c3 = vec3(0.655, 0.545, 0.396); // #A78B65
  vec3 c4 = vec3(0.815, 0.700, 0.520);
  vec3 c5 = vec3(0.930, 0.878, 0.792); // warm ivory
  vec3 c = mix(c0, c1, smoothstep(0.00, 0.28, x));
  c = mix(c, c2, smoothstep(0.28, 0.52, x));
  c = mix(c, c3, smoothstep(0.52, 0.76, x));
  c = mix(c, c4, smoothstep(0.76, 0.90, x));
  c = mix(c, c5, smoothstep(0.90, 1.00, x));
  return c;
}

void main(){
  vec2 uv = gl_FragCoord.xy / u_res.xy;
  float aspect = u_res.x / u_res.y;
  vec2 p = vec2(uv.x * aspect, uv.y);
  vec2 m = vec2(u_mouse.x * aspect, u_mouse.y);
  float t = u_time * 0.05;

  // gentle low-frequency domain warp -> soft organic drift (not marble)
  vec2 q = vec2(
    fbm(p * 0.55 + vec2(0.0,  t)),
    fbm(p * 0.55 + vec2(4.3, -t))
  );
  float n = fbm(p * 0.65 + 0.55 * q + t * 0.5);   // soft low-freq cloud, ~[-1,1]
  float cloud = 0.5 + 0.5 * n;                     // 0..1

  // large soft glow that follows the cursor, its shape modulated by the cloud
  float md = length(p - m);
  float glowM = smoothstep(1.25, 0.05, md);        // big, very soft
  // a second, slower drifting glow keeps the field alive away from the cursor
  vec2 g2 = vec2(0.32 + 0.18 * sin(t * 0.7), 0.66 + 0.12 * cos(t * 0.9));
  g2.x *= aspect;
  float glow2 = smoothstep(1.15, 0.1, length(p - g2)) * 0.6;

  float glow = max(glowM, glow2);
  // shape the glow with the soft cloud so edges are organic, and keep voids black
  float intensity = glow * (0.35 + 0.85 * cloud);
  intensity = pow(clamp(intensity, 0.0, 1.0), 1.15);   // deepen the blacks

  vec3 col = goldRamp(intensity);
  // subtle cool shadow tint in the deep voids (kept low, stays on-brand)
  float shadow = 1.0 - smoothstep(0.0, 0.4, intensity);
  col += vec3(-0.008, 0.0, 0.02) * shadow;

  // fine grain
  float gr = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233)) + u_time) * 43758.5453);
  col += (gr - 0.5) * 0.016;

  gl_FragColor = vec4(max(col, 0.0), 1.0);
}
`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type);
  if (!s) return null;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    console.error("shader:", gl.getShaderInfoLog(s));
    gl.deleteShader(s);
    return null;
  }
  return s;
}

export function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = (canvas.getContext("webgl", {
      antialias: false,
      alpha: false,
      depth: false,
      powerPreference: "low-power",
    }) ||
      canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null;
    if (!gl) return;

    const reduced = prefersReducedMotion();

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;
    const prog = gl.createProgram();
    if (!prog) return;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error("link:", gl.getProgramInfoLog(prog));
      return;
    }
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    // fullscreen triangle
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );
    const loc = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "u_res");
    const uTime = gl.getUniformLocation(prog, "u_time");
    const uMouse = gl.getUniformLocation(prog, "u_mouse");

    // internal render scale — the field is soft, so 0.6x is invisible but cheap
    const RSCALE = 0.6;
    let w = 1;
    let h = 1;

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      const cw = Math.max(1, Math.round(rect?.width || window.innerWidth));
      const ch = Math.max(1, Math.round(rect?.height || window.innerHeight));
      canvas.style.width = cw + "px";
      canvas.style.height = ch + "px";
      w = Math.max(1, Math.round(cw * RSCALE));
      h = Math.max(1, Math.round(ch * RSCALE));
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    };
    resize();
    window.addEventListener("resize", resize);

    // mouse (normalized, y up), smoothed. Start upper-right to match the reference.
    let tx = 0.68;
    let ty = 0.62;
    // verification hook: ?mx=&my= pins the glow (skips live tracking)
    const qp =
      typeof window !== "undefined"
        ? new URLSearchParams(window.location.search)
        : null;
    const pinned = qp?.has("mx");
    if (pinned) {
      tx = parseFloat(qp!.get("mx") || "0.5");
      ty = parseFloat(qp!.get("my") || "0.5");
    }
    let mx = tx;
    let my = ty;
    const onMove = (e: MouseEvent) => {
      tx = e.clientX / window.innerWidth;
      ty = 1.0 - e.clientY / window.innerHeight;
    };
    if (!reduced && !pinned)
      window.addEventListener("mousemove", onMove, { passive: true });

    let raf = 0;
    let running = false;
    let start = 0;

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!start) start = now;
      mx += (tx - mx) * 0.045;
      my += (ty - my) * 0.045;
      gl.uniform2f(uRes, w, h);
      gl.uniform1f(uTime, (now - start) / 1000);
      gl.uniform2f(uMouse, mx, my);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const drawStatic = () => {
      gl.uniform2f(uRes, w, h);
      gl.uniform1f(uTime, 0);
      gl.uniform2f(uMouse, mx, my);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const startLoop = () => {
      if (running || reduced) return;
      running = true;
      start = 0;
      raf = requestAnimationFrame(frame);
    };
    const stopLoop = () => {
      if (!running) return;
      running = false;
      cancelAnimationFrame(raf);
    };

    let io: IntersectionObserver | null = null;
    if (reduced) {
      drawStatic();
    } else {
      io = new IntersectionObserver((entries) => {
        if (entries[0]?.isIntersecting) startLoop();
        else stopLoop();
      });
      io.observe(canvas);
      startLoop();
    }

    return () => {
      stopLoop();
      io?.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      gl.deleteProgram(prog);
      gl.deleteBuffer(buf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        display: "block",
      }}
    />
  );
}
