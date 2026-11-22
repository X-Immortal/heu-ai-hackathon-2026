/* ==========================================================================
   track-visuals.js — Bespoke 3D Kinetic Canvas Totems for the 3 Tracks
   ========================================================================== */
(() => {
  const canvas = document.getElementById('trackCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let width = 0;
  let height = 0;
  let dpr = 1;
  let t = 0;
  let activeTrack = 0;
  let isVisible = false;
  let rafId = null;

  // Track 0: 3D Octahedron + Orbiting Nodes
  const octaVerts = [
    [0, -1, 0], [1, 0, 0], [0, 0, 1], [-1, 0, 0], [0, 0, -1], [0, 1, 0]
  ];
  const octaEdges = [
    [0, 1], [0, 2], [0, 3], [0, 4],
    [5, 1], [5, 2], [5, 3], [5, 4],
    [1, 2], [2, 3], [3, 4], [4, 1]
  ];
  const orbitNodes = Array.from({ length: 14 }, (_, i) => ({
    angle: (i / 14) * Math.PI * 2,
    radius: 0.72 + (i % 3) * 0.2,
    tilt: (i % 2 === 0 ? 1 : -1) * (0.3 + (i % 4) * 0.12),
    speed: 0.45 + (i % 5) * 0.14,
  }));

  function project3D(x, y, z, scale, cx, cy) {
    const fov = 3.2;
    const factor = fov / (fov + z);
    return { x: cx + x * scale * factor, y: cy + y * scale * factor, z, factor };
  }

  function rotateXY(p, ax, ay) {
    // Rotate Y
    const cosY = Math.cos(ay), sinY = Math.sin(ay);
    const x1 = p[0] * cosY - p[2] * sinY;
    const z1 = p[0] * sinY + p[2] * cosY;
    // Rotate X
    const cosX = Math.cos(ax), sinX = Math.sin(ax);
    const y2 = p[1] * cosX - z1 * sinX;
    const z2 = p[1] * sinX + z1 * cosX;
    return [x1, y2, z2];
  }

  function drawKnowledge(cx, cy, scale, time) {
    // Ambient radar rings
    for (let i = 1; i <= 3; i++) {
      ctx.beginPath();
      ctx.arc(cx, cy, scale * (0.45 + i * 0.25), 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(46, 230, 214, ${0.14 - i * 0.03})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Sweeping scan beam
    const sweep = time * 1.1;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(sweep);
    const sweepGrad = ctx.createRadialGradient(0, 0, 8, 0, 0, scale * 1.15);
    sweepGrad.addColorStop(0, 'rgba(46, 230, 214, 0.22)');
    sweepGrad.addColorStop(1, 'rgba(46, 230, 214, 0)');
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, scale * 1.15, -0.35, 0.35);
    ctx.closePath();
    ctx.fillStyle = sweepGrad;
    ctx.fill();
    ctx.restore();

    // Octahedron wireframe
    const ax = 0.45 + Math.sin(time * 0.6) * 0.22;
    const ay = time * 0.72;
    const projected = octaVerts.map((v) => {
      const rv = rotateXY(v, ax, ay);
      return project3D(rv[0] * 0.68, rv[1] * 0.68, rv[2] * 0.68, scale, cx, cy);
    });

    ctx.lineWidth = 1.6;
    for (const [a, b] of octaEdges) {
      const pa = projected[a];
      const pb = projected[b];
      ctx.beginPath();
      ctx.moveTo(pa.x, pa.y);
      ctx.lineTo(pb.x, pb.y);
      ctx.strokeStyle = 'rgba(46, 230, 214, 0.78)';
      ctx.stroke();
    }

    // Vertices
    for (const p of projected) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3.4 * p.factor, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
    }

    // Orbiting knowledge nodes + dynamic filaments
    const nodePts = orbitNodes.map((n) => {
      const a = n.angle + time * n.speed;
      const x = Math.cos(a) * n.radius;
      const z = Math.sin(a) * n.radius;
      const y = Math.sin(a * 1.5) * n.tilt;
      return project3D(x, y, z, scale, cx, cy);
    });

    for (let i = 0; i < nodePts.length; i++) {
      const p = nodePts[i];
      const anchor = projected[i % projected.length];
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(anchor.x, anchor.y);
      ctx.strokeStyle = 'rgba(79, 139, 255, 0.24)';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(p.x, p.y, 2.8 * p.factor, 0, Math.PI * 2);
      ctx.fillStyle = i % 3 === 0 ? '#ffd166' : '#2ee6d6';
      ctx.fill();
    }
  }

  function drawCompanion(cx, cy, scale, time) {
    // Breathing dual-core aura
    const pulse = 1 + Math.sin(time * 2.1) * 0.08;
    for (let r = 4; r >= 1; r--) {
      ctx.beginPath();
      ctx.arc(cx, cy, scale * 0.24 * r * pulse, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255, 159, 67, ${0.28 - r * 0.05})`;
      ctx.lineWidth = r === 1 ? 2.2 : 1.2;
      ctx.stroke();
    }

    // Harmonic flowing voice / empathy waveforms
    const layers = 5;
    const span = Math.min(width * 0.84, scale * 2.5);
    const startX = cx - span / 2;

    for (let l = 0; l < layers; l++) {
      const phase = time * (1.5 + l * 0.28) + l * 0.9;
      ctx.beginPath();
      for (let i = 0; i <= 72; i++) {
        const u = i / 72;
        const env = Math.sin(u * Math.PI); // Smooth taper at edges
        const x = startX + u * span;
        const amp = (16 + l * 7) * env * env;
        const y = cy +
          Math.sin(u * 10 + phase) * amp +
          Math.cos(u * 18 - phase * 0.8) * (amp * 0.35);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      const grad = ctx.createLinearGradient(startX, cy, startX + span, cy);
      grad.addColorStop(0, 'rgba(255, 159, 67, 0.05)');
      grad.addColorStop(0.5, l % 2 === 0 ? 'rgba(255, 159, 67, 0.85)' : 'rgba(255, 107, 107, 0.65)');
      grad.addColorStop(1, 'rgba(255, 159, 67, 0.05)');
      ctx.strokeStyle = grad;
      ctx.lineWidth = l === 2 ? 2.4 : 1.3;
      ctx.stroke();
    }

    // Dual orbiting companion orbs
    for (let k = 0; k < 2; k++) {
      const a = time * 1.15 + k * Math.PI;
      const ox = cx + Math.cos(a) * scale * 0.52;
      const oy = cy + Math.sin(a * 2) * scale * 0.2;
      const glow = ctx.createRadialGradient(ox, oy, 1, ox, oy, 18);
      glow.addColorStop(0, 'rgba(255, 240, 210, 0.95)');
      glow.addColorStop(0.4, k === 0 ? 'rgba(255, 159, 67, 0.55)' : 'rgba(255, 107, 107, 0.55)');
      glow.addColorStop(1, 'rgba(255, 159, 67, 0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(ox, oy, 18, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawGlobal(cx, cy, scale, time) {
    const R = scale * 0.84;
    const rotY = time * 0.52;
    const tiltX = 0.32;

    // Outer atmosphere halo
    const halo = ctx.createRadialGradient(cx, cy, R * 0.65, cx, cy, R * 1.3);
    halo.addColorStop(0, 'rgba(79, 139, 255, 0.06)');
    halo.addColorStop(0.7, 'rgba(79, 139, 255, 0.16)');
    halo.addColorStop(1, 'rgba(79, 139, 255, 0)');
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(cx, cy, R * 1.3, 0, Math.PI * 2);
    ctx.fill();

    // Latitude circles
    const lats = [-0.6, -0.3, 0, 0.3, 0.6];
    for (const lat of lats) {
      const rLat = Math.sqrt(1 - lat * lat);
      ctx.beginPath();
      for (let i = 0; i <= 48; i++) {
        const lon = (i / 48) * Math.PI * 2;
        const p = rotateXY([Math.cos(lon) * rLat, lat, Math.sin(lon) * rLat], tiltX, rotY);
        const pr = project3D(p[0], p[1], p[2], R, cx, cy);
        if (i === 0) ctx.moveTo(pr.x, pr.y);
        else ctx.lineTo(pr.x, pr.y);
      }
      ctx.strokeStyle = lat === 0 ? 'rgba(46, 230, 214, 0.42)' : 'rgba(79, 139, 255, 0.24)';
      ctx.lineWidth = lat === 0 ? 1.5 : 1;
      ctx.stroke();
    }

    // Longitude meridians
    const meridians = 8;
    for (let m = 0; m < meridians; m++) {
      const lon = (m / meridians) * Math.PI;
      ctx.beginPath();
      for (let i = 0; i <= 40; i++) {
        const theta = (i / 40) * Math.PI * 2;
        const x = Math.cos(theta) * Math.cos(lon);
        const y = Math.sin(theta);
        const z = Math.cos(theta) * Math.sin(lon);
        const p = rotateXY([x, y, z], tiltX, rotY);
        const pr = project3D(p[0], p[1], p[2], R, cx, cy);
        if (i === 0) ctx.moveTo(pr.x, pr.y);
        else ctx.lineTo(pr.x, pr.y);
      }
      ctx.strokeStyle = 'rgba(79, 139, 255, 0.22)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Animated outgoing global flight arcs from origin beacon
    const destinations = [
      [0.85, -0.35, 0.38],
      [-0.75, -0.45, 0.48],
      [-0.45, 0.55, 0.7],
      [0.5, 0.48, -0.72],
    ];
    const origin = rotateXY([0.35, -0.45, 0.82], tiltX, rotY);
    const pOrigin = project3D(origin[0], origin[1], origin[2], R, cx, cy);

    destinations.forEach((dest, idx) => {
      const d = rotateXY(dest, tiltX, rotY);
      const pDest = project3D(d[0], d[1], d[2], R, cx, cy);
      const midX = (pOrigin.x + pDest.x) / 2;
      const midY = (pOrigin.y + pDest.y) / 2 - R * 0.42;

      ctx.beginPath();
      ctx.moveTo(pOrigin.x, pOrigin.y);
      ctx.quadraticCurveTo(midX, midY, pDest.x, pDest.y);
      ctx.strokeStyle = 'rgba(46, 230, 214, 0.55)';
      ctx.lineWidth = 1.4;
      ctx.stroke();

      // Traveling signal spark along quadratic curve
      const prog = (time * 0.55 + idx * 0.25) % 1;
      const inv = 1 - prog;
      const sx = inv * inv * pOrigin.x + 2 * inv * prog * midX + prog * prog * pDest.x;
      const sy = inv * inv * pOrigin.y + 2 * inv * prog * midY + prog * prog * pDest.y;
      ctx.beginPath();
      ctx.arc(sx, sy, 3.2, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();

      // Destination beacon dot
      ctx.beginPath();
      ctx.arc(pDest.x, pDest.y, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = '#ff9f43';
      ctx.fill();
    });

    // Origin beacon pulse
    const pPulse = 4 + Math.sin(time * 4) * 2;
    ctx.beginPath();
    ctx.arc(pOrigin.x, pOrigin.y, pPulse, 0, Math.PI * 2);
    ctx.fillStyle = '#2ee6d6';
    ctx.fill();
  }

  function render() {
    ctx.clearRect(0, 0, width, height);
    const cx = width / 2;
    const cy = height / 2;
    const scale = Math.min(width, height) * 0.42;

    if (activeTrack === 0) drawKnowledge(cx, cy, scale, t);
    else if (activeTrack === 1) drawCompanion(cx, cy, scale, t);
    else drawGlobal(cx, cy, scale, t);
  }

  function loop() {
    if (!isVisible) return;
    t += 0.016;
    render();
    rafId = requestAnimationFrame(loop);
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    width = Math.max(1, rect.width);
    height = Math.max(1, rect.height);
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    render();
  }

  window.setTrackVisual = (idx) => {
    activeTrack = idx;
    if (reducedMotion) render();
  };

  window.addEventListener('resize', resize, { passive: true });

  const io = new IntersectionObserver((entries) => {
    isVisible = entries[0].isIntersecting;
    if (isVisible && !reducedMotion && !rafId) loop();
    else if (!isVisible && rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }, { threshold: 0.05 });

  io.observe(canvas);
  resize();
})();
