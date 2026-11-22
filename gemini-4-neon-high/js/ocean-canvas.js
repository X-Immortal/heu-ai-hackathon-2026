/* ==========================================================================
   ocean-canvas.js — Interactive Bioluminescent 3D Wave & Compass Canvas
   ========================================================================== */
(() => {
  const canvas = document.getElementById('oceanCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const coordsEl = document.getElementById('cursorCoords');

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let width = 0;
  let height = 0;
  let dpr = 1;
  let rafId = null;
  let isVisible = true;
  let time = 0;

  const pointer = { x: 0.5, y: 0.45, tx: 0.5, ty: 0.45 };
  const ripples = [];
  const stars = [];
  const plankton = [];

  function initParticles() {
    stars.length = 0;
    plankton.length = 0;
    const starCount = Math.min(85, Math.floor((width * height) / 16000));
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height * 0.55,
        r: Math.random() * 1.4 + 0.4,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.02 + 0.008,
      });
    }
    const pCount = Math.min(54, Math.floor(width / 26));
    for (let i = 0; i < pCount; i++) {
      plankton.push({
        x: Math.random() * width,
        y: height * (0.38 + Math.random() * 0.62),
        vx: (Math.random() - 0.5) * 0.35,
        vy: -(Math.random() * 0.45 + 0.15),
        r: Math.random() * 2 + 0.8,
        alpha: Math.random() * 0.6 + 0.2,
        hue: Math.random() > 0.82 ? '255, 159, 67' : Math.random() > 0.4 ? '46, 230, 214' : '79, 139, 255',
      });
    }
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    width = Math.max(1, rect.width);
    height = Math.max(1, rect.height);
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    initParticles();
    if (reducedMotion) drawFrame(0);
  }

  function drawCompassHalo(cx, cy, t) {
    const radius = Math.min(width, height) * 0.34;
    ctx.save();
    ctx.translate(cx, cy);

    // Outer dashed nautical compass ring
    ctx.rotate(t * 0.045);
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(46, 230, 214, 0.10)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 10]);
    ctx.stroke();

    // Inner counter-rotating reticle
    ctx.rotate(-t * 0.11);
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.72, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(79, 139, 255, 0.11)';
    ctx.setLineDash([2, 18]);
    ctx.stroke();

    // 4 cardinal ticks
    ctx.setLineDash([]);
    ctx.strokeStyle = 'rgba(255, 159, 67, 0.25)';
    for (let i = 0; i < 4; i++) {
      const a = (i * Math.PI) / 2;
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * (radius - 10), Math.sin(a) * (radius - 10));
      ctx.lineTo(Math.cos(a) * (radius + 10), Math.sin(a) * (radius + 10));
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawWaveMesh(t) {
    const rows = 14;
    const cols = width < 640 ? 28 : 48;
    const horizonY = height * 0.46 + (pointer.y - 0.5) * 44;
    const rudderShift = (pointer.x - 0.5) * 90;

    for (let r = 0; r < rows; r++) {
      const depth = r / (rows - 1); // 0 = far horizon, 1 = near foreground
      const persp = Math.pow(depth, 1.55);
      const baseY = horizonY + persp * (height * 0.58);
      const amp = 10 + persp * 34;

      ctx.beginPath();
      for (let c = 0; c <= cols; c++) {
        const u = c / cols;
        const x = u * (width + 120) - 60 + rudderShift * (0.25 - depth * 0.6);
        const wave1 = Math.sin(u * 6.5 + t * (0.9 + depth * 0.4) + r * 0.55) * amp;
        const wave2 = Math.cos(u * 11.0 - t * 0.65 + r * 0.9) * (amp * 0.36);

        // Pointer gravity swell
        const dx = x - pointer.x * width;
        const dy = baseY - pointer.y * height;
        const dist = Math.hypot(dx, dy);
        const swell = Math.exp(-(dist * dist) / 48000) * -28 * (0.4 + depth);

        const y = baseY + wave1 + wave2 + swell;
        if (c === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      const alpha = 0.05 + Math.sin(depth * Math.PI) * 0.24;
      const grad = ctx.createLinearGradient(0, baseY, width, baseY);
      grad.addColorStop(0, `rgba(79, 139, 255, ${alpha * 0.45})`);
      grad.addColorStop(0.35, `rgba(46, 230, 214, ${alpha})`);
      grad.addColorStop(0.72, `rgba(79, 139, 255, ${alpha * 0.9})`);
      grad.addColorStop(1, `rgba(255, 159, 67, ${alpha * 0.65})`);

      ctx.strokeStyle = grad;
      ctx.lineWidth = 0.8 + persp * 1.3;
      ctx.stroke();

      // Bioluminescent crest nodes on foreground ribbons
      if (r % 2 === 1 && depth > 0.22) {
        for (let c = 2; c < cols; c += 4) {
          const u = c / cols;
          const x = u * (width + 120) - 60 + rudderShift * (0.25 - depth * 0.6);
          const wave1 = Math.sin(u * 6.5 + t * (0.9 + depth * 0.4) + r * 0.55) * amp;
          const wave2 = Math.cos(u * 11.0 - t * 0.65 + r * 0.9) * (amp * 0.36);
          const y = baseY + wave1 + wave2;
          const glow = 0.16 + 0.35 * (0.5 + 0.5 * Math.sin(t * 2.2 + c + r));
          ctx.beginPath();
          ctx.arc(x, y, 1.2 + persp * 1.4, 0, Math.PI * 2);
          ctx.fillStyle = (c + r) % 7 === 0
            ? `rgba(255, 159, 67, ${glow})`
            : `rgba(46, 230, 214, ${glow})`;
          ctx.fill();
        }
      }
    }
  }

  function drawFrame(t) {
    ctx.clearRect(0, 0, width, height);

    // Smooth pointer lerp
    pointer.x += (pointer.tx - pointer.x) * 0.06;
    pointer.y += (pointer.ty - pointer.y) * 0.06;

    // Deep abyssal atmospheric zenith glow
    const zenith = ctx.createRadialGradient(
      width * (0.5 + (pointer.x - 0.5) * 0.2),
      height * 0.26,
      10,
      width * 0.5,
      height * 0.4,
      Math.max(width, height) * 0.7
    );
    zenith.addColorStop(0, 'rgba(46, 230, 214, 0.11)');
    zenith.addColorStop(0.45, 'rgba(34, 72, 160, 0.09)');
    zenith.addColorStop(1, 'rgba(4, 7, 14, 0)');
    ctx.fillStyle = zenith;
    ctx.fillRect(0, 0, width, height);

    // Twinkling stars
    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      const a = 0.2 + 0.65 * (0.5 + 0.5 * Math.sin(t * 1.8 + s.phase));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(215, 235, 255, ${a})`;
      ctx.fill();
    }

    // Celestial compass ring centered behind title
    drawCompassHalo(
      width * 0.5 + (pointer.x - 0.5) * 24,
      height * 0.42 + (pointer.y - 0.5) * 18,
      t
    );

    // Flowing 3D perspective ocean waves
    drawWaveMesh(t);

    // Rising bioluminescent sparks
    for (let i = 0; i < plankton.length; i++) {
      const p = plankton[i];
      p.x += p.vx + Math.sin(t + i) * 0.18;
      p.y += p.vy;
      if (p.y < height * 0.22) {
        p.y = height + 10;
        p.x = Math.random() * width;
      }
      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.hue}, ${p.alpha})`;
      ctx.fill();
    }

    // Interactive click sonar ripples
    for (let i = ripples.length - 1; i >= 0; i--) {
      const rp = ripples[i];
      rp.r += 3.8;
      rp.alpha *= 0.955;
      if (rp.alpha < 0.015) {
        ripples.splice(i, 1);
        continue;
      }
      ctx.beginPath();
      ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(46, 230, 214, ${rp.alpha})`;
      ctx.lineWidth = 1.6;
      ctx.stroke();
    }
  }

  function loop() {
    if (!isVisible) return;
    time += 0.016;
    drawFrame(time);
    rafId = requestAnimationFrame(loop);
  }

  // Events
  window.addEventListener('resize', resize, { passive: true });
  window.addEventListener('pointermove', (e) => {
    pointer.tx = e.clientX / Math.max(1, window.innerWidth);
    pointer.ty = e.clientY / Math.max(1, window.innerHeight);
    if (coordsEl) {
      const heading = Math.round(pointer.tx * 360).toString().padStart(3, '0');
      coordsEl.textContent = `HDG ${heading}° · LIVE`;
    }
  }, { passive: true });

  const heroEl = document.getElementById('hero');
  if (heroEl) {
    heroEl.addEventListener('pointerdown', (e) => {
      if (e.target.closest('button, a')) return;
      const rect = canvas.getBoundingClientRect();
      ripples.push({ x: e.clientX - rect.left, y: e.clientY - rect.top, r: 8, alpha: 0.72 });
    });

    const io = new IntersectionObserver((entries) => {
      isVisible = entries[0].isIntersecting;
      if (isVisible && !reducedMotion && !rafId) {
        loop();
      } else if (!isVisible && rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    }, { threshold: 0.05 });
    io.observe(heroEl);
  }

  resize();
  if (!reducedMotion) loop();
})();
