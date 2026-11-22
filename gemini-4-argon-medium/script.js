// 1. Interactive Neural Constellation Background Canvas
(function initCanvas() {
  const canvas = document.getElementById('bgCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const mouse = { x: width / 2, y: height / 2, radius: 150 };
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const count = Math.min(75, Math.floor((width * height) / 18000));
  const particles = Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.55,
    vy: (Math.random() - 0.5) * 0.55,
    size: Math.random() * 1.8 + 0.8,
    color: Math.random() > 0.5 ? '#00f0ff' : '#8b5cf6',
  }));

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      // Subtle repulsion / attraction near cursor
      const dx = mouse.x - p.x;
      const dy = mouse.y - p.y;
      const dist = Math.hypot(dx, dy);
      if (dist < mouse.radius) {
        const force = (mouse.radius - dist) / mouse.radius;
        p.x -= (dx / dist) * force * 0.8;
        p.y -= (dy / dist) * force * 0.8;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = 0.65;
      ctx.fill();

      // Connect nearby nodes
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const d = Math.hypot(p.x - p2.x, p.y - p2.y);
        if (d < 130) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = '#00f0ff';
          ctx.globalAlpha = (1 - d / 130) * 0.16;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }
  animate();
})();

// 2. Custom Cursor & Magnetic Elements
(function initCursorAndMagnetic() {
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = `${mouseX}px`;
    dot.style.top = `${mouseY}px`;
  });

  function renderRing() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    ring.style.left = `${ringX}px`;
    ring.style.top = `${ringY}px`;
    requestAnimationFrame(renderRing);
  }
  renderRing();

  const interactives = document.querySelectorAll('a, button, .tilt-card, .t-node, .eval-item, input, .check-row');
  interactives.forEach((el) => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  // Magnetic effect
  const magnetics = document.querySelectorAll('.magnetic');
  magnetics.forEach((btn) => {
    const strength = parseFloat(btn.dataset.strength || '20');
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);
      btn.style.transform = `translate(${(x / rect.width) * strength}px, ${(y / rect.height) * strength}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0px, 0px)';
    });
  });
})();

// 3. 3D Tilt Cards + Spotlight + Hero Orbital Stage Parallax
(function init3DTilt() {
  const cards = document.querySelectorAll('.tilt-card');
  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);

      const rotateY = ((x / rect.width) - 0.5) * 10;
      const rotateX = (0.5 - (y / rect.height)) * 10;
      card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });

  const stage = document.getElementById('orbitalStage');
  if (stage) {
    window.addEventListener('mousemove', (e) => {
      const rx = (0.5 - e.clientY / window.innerHeight) * 22;
      const ry = (e.clientX / window.innerWidth - 0.5) * 22;
      stage.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
    });
  }
})();

// 4. Scroll Reveal, Progress Bar & Count-Up Numbers
(function initScrollEffects() {
  const progressBar = document.getElementById('scrollProgress');
  window.addEventListener('scroll', () => {
    const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
    if (progressBar) progressBar.style.width = `${scrolled}%`;
  });

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.14 }
  );

  document.querySelectorAll('.reveal-up').forEach((el) => revealObserver.observe(el));

  // Count-up animation for prize numbers
  const countObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.target || '0', 10);
        const duration = 1200;
        const start = performance.now();

        function step(now) {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.floor(eased * target).toLocaleString();
          if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        obs.unobserve(el);
      });
    },
    { threshold: 0.4 }
  );

  document.querySelectorAll('.count-up').forEach((el) => countObserver.observe(el));
})();

// 5. Real-time Hackathon Countdown (Target: 2026-11-30T23:59:59+08:00, then 2026-12-06T19:00:00+08:00)
(function initCountdown() {
  const submitDeadline = new Date('2026-11-30T23:59:59+08:00').getTime();
  const demoDay = new Date('2026-12-06T19:00:00+08:00').getTime();

  const phaseText = document.getElementById('phaseText');
  const dEl = document.getElementById('cdDays');
  const hEl = document.getElementById('cdHours');
  const mEl = document.getElementById('cdMins');
  const sEl = document.getElementById('cdSecs');

  function updateClock() {
    const now = Date.now();
    let target = submitDeadline;
    if (now < submitDeadline) {
      if (phaseText) phaseText.textContent = '距作品截止提交';
    } else if (now < demoDay) {
      target = demoDay;
      if (phaseText) phaseText.textContent = '距 12.06 决赛路演';
    } else {
      if (phaseText) phaseText.textContent = '路演已圆满开启';
      return;
    }

    const diff = Math.max(0, target - now);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / 1000 / 60) % 60);
    const secs = Math.floor((diff / 1000) % 60);

    if (dEl) dEl.textContent = String(days).padStart(2, '0');
    if (hEl) hEl.textContent = String(hours).padStart(2, '0');
    if (mEl) mEl.textContent = String(mins).padStart(2, '0');
    if (sEl) sEl.textContent = String(secs).padStart(2, '0');
  }

  updateClock();
  setInterval(updateClock, 1000);
})();

// 6. Interactive OpenDev Token Simulator ($200 base + $100/invite up to $500)
(function initTokenSimulator() {
  const slider = document.getElementById('inviteSlider');
  const valEl = document.getElementById('tokenDynamicVal');
  const countEl = document.getElementById('inviteCountText');
  if (!slider || !valEl || !countEl) return;

  slider.addEventListener('input', () => {
    const invites = parseInt(slider.value, 10);
    const total = Math.min(500, 200 + invites * 100);
    countEl.textContent = String(invites);
    valEl.textContent = String(total);
    valEl.style.transform = 'scale(1.12)';
    setTimeout(() => {
      valEl.style.transform = 'scale(1)';
    }, 150);
  });
})();

// 7. Interactive Timeline Stepper
(function initTimeline() {
  const nodes = document.querySelectorAll('.t-node');
  const fill = document.getElementById('timelineFill');
  if (!nodes.length || !fill) return;

  nodes.forEach((node, idx) => {
    node.addEventListener('mouseenter', () => {
      nodes.forEach((n, i) => n.classList.toggle('active', i <= idx));
      const pct = ((idx + 1) / nodes.length) * 100;
      fill.style.width = `${pct}%`;
    });
  });
})();

// 8. Interactive Evaluation Radar
(function initRadar() {
  const items = document.querySelectorAll('.eval-item');
  const vertices = document.querySelectorAll('.radar-vertex');
  const scoreEl = document.getElementById('radarActiveScore');
  const labelEl = document.getElementById('radarActiveLabel');
  const polygon = document.getElementById('radarPolygon');

  const polygonPresets = [
    '180,32 308,139 246,271 114,271 100,154',
    '180,45 322,134 246,271 114,271 100,154',
    '180,45 308,139 258,287 114,271 100,154',
    '180,45 308,139 246,271 102,287 100,154',
    '180,45 308,139 246,271 114,271 78,147',
  ];

  function activateIndex(idx) {
    items.forEach((item, i) => {
      const isMatch = i === idx;
      item.classList.toggle('active', isMatch);
      if (isMatch && scoreEl && labelEl) {
        scoreEl.textContent = item.dataset.score;
        labelEl.textContent = item.dataset.label;
      }
    });
    vertices.forEach((v, i) => v.classList.toggle('active', i === idx));
    if (polygon && polygonPresets[idx]) {
      polygon.setAttribute('points', polygonPresets[idx]);
    }
  }

  items.forEach((item, idx) => {
    item.addEventListener('mouseenter', () => activateIndex(idx));
    item.addEventListener('click', () => activateIndex(idx));
  });

  vertices.forEach((vertex, idx) => {
    vertex.addEventListener('mouseenter', () => activateIndex(idx));
  });
})();

// 9. Pre-flight Checklist Modal
(function initModal() {
  const modal = document.getElementById('checklistModal');
  const openBtns = [
    document.getElementById('openModalBtnTop'),
    document.getElementById('openModalBtnHero'),
    document.getElementById('openModalBtnFooter'),
  ];
  const closeBtn = document.getElementById('closeModalBtn');
  const checks = document.querySelectorAll('.check-input');
  const pctEl = document.getElementById('checkPercent');
  const fillEl = document.getElementById('checkFill');

  function openModal() {
    if (!modal) return;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
  }

  openBtns.forEach((btn) => btn && btn.addEventListener('click', openModal));
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  function updateProgress() {
    const total = checks.length;
    const done = Array.from(checks).filter((c) => c.checked).length;
    const pct = total ? Math.round((done / total) * 100) : 0;
    if (pctEl) pctEl.textContent = `${pct}%`;
    if (fillEl) fillEl.style.width = `${pct}%`;
  }

  checks.forEach((c) => c.addEventListener('change', updateProgress));
})();
