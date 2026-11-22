/* ==========================================================================
   app.js — Kinetic Interactions, Countdown, Booster, Radar & Holo Pass
   ========================================================================== */
(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------------
     1. Split Kinetic Headline & Intro Reveal
     ------------------------------------------------------------------------ */
  let charIndex = 0;
  document.querySelectorAll('[data-split]').forEach((el) => {
    const text = el.textContent || '';
    el.textContent = '';
    for (const ch of text) {
      const span = document.createElement('span');
      span.className = 'char';
      span.style.setProperty('--i', charIndex++);
      span.textContent = ch;
      el.appendChild(span);
    }
  });

  const curtain = document.getElementById('introCurtain');
  window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
      if (curtain) curtain.classList.add('is-done');
      document.body.classList.add('is-ready');
      animateCounters();
    }, reducedMotion ? 0 : 420);
  });

  /* ------------------------------------------------------------------------
     2. Custom Magnetic Cursor, Spotlight Cards & 3D Tilt
     ------------------------------------------------------------------------ */
  const isTouch = window.matchMedia('(pointer: coarse)').matches;
  const cursorRing = document.getElementById('cursorRing');
  const cursorDot = document.getElementById('cursorDot');

  if (!isTouch && cursorRing && cursorDot && !reducedMotion) {
    let mx = -100, my = -100;
    let rx = -100, ry = -100;
    let started = false;

    window.addEventListener('pointermove', (e) => {
      mx = e.clientX;
      my = e.clientY;
      if (!started) {
        rx = mx;
        ry = my;
        started = true;
        document.body.classList.add('has-cursor');
      }
      cursorDot.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
    }, { passive: true });

    const tickCursor = () => {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      cursorRing.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      requestAnimationFrame(tickCursor);
    };
    tickCursor();

    const interactiveSelector = 'a, button, .track-card, .score-row, .booster-pill, .stat-pill';
    document.addEventListener('pointerover', (e) => {
      if (e.target.closest(interactiveSelector)) document.body.classList.add('cursor-hover');
    });
    document.addEventListener('pointerout', (e) => {
      if (e.target.closest(interactiveSelector)) document.body.classList.remove('cursor-hover');
    });
  }

  // Magnetic buttons
  if (!isTouch && !reducedMotion) {
    document.querySelectorAll('.magnetic').forEach((el) => {
      const strength = Number(el.dataset.strength || 14);
      el.addEventListener('pointermove', (e) => {
        const rect = el.getBoundingClientRect();
        const relX = (e.clientX - rect.left) / rect.width - 0.5;
        const relY = (e.clientY - rect.top) / rect.height - 0.5;
        el.style.transform = `translate3d(${relX * strength}px, ${relY * strength}px, 0)`;
      });
      el.addEventListener('pointerleave', () => {
        el.style.transform = '';
      });
    });
  }

  // Spotlight & 3D Tilt on Cards
  document.querySelectorAll('.spotlight-card').forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mx', `${x}px`);
      card.style.setProperty('--my', `${y}px`);

      if (!isTouch && !reducedMotion && card.classList.contains('tilt-card')) {
        const rx = ((y / rect.height) - 0.5) * -7;
        const ry = ((x / rect.width) - 0.5) * 7;
        card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-3px)`;
      }
    });

    card.addEventListener('pointerleave', () => {
      if (card.classList.contains('tilt-card')) {
        card.style.transform = '';
      }
    });
  });

  /* ------------------------------------------------------------------------
     3. Scroll Progress, Floating Nav & Scroll Reveals
     ------------------------------------------------------------------------ */
  const progressBar = document.getElementById('scrollProgress');
  const mainNav = document.getElementById('mainNav');
  const routePath = document.getElementById('routePath');
  const voyageMap = document.getElementById('voyageMap');
  let routeLength = 0;

  if (routePath) {
    routeLength = routePath.getTotalLength();
    routePath.style.strokeDasharray = `${routeLength}`;
    routePath.style.strokeDashoffset = reducedMotion ? '0' : `${routeLength}`;
  }

  let lastScrollY = window.scrollY;
  let scrollVelocity = 0;

  function onScroll() {
    const sy = window.scrollY;
    scrollVelocity = Math.min(24, Math.abs(sy - lastScrollY));
    lastScrollY = sy;

    const docH = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const ratio = Math.min(1, Math.max(0, sy / docH));
    if (progressBar) progressBar.style.transform = `scaleX(${ratio})`;
    if (mainNav) mainNav.classList.toggle('is-scrolled', sy > 36);

    // Draw SVG voyage route dynamically with scroll
    if (routePath && voyageMap && !reducedMotion) {
      const rect = voyageMap.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.min(1, Math.max(0, (vh * 0.85 - rect.top) / (vh * 0.7)));
      routePath.style.strokeDashoffset = `${routeLength * (1 - p)}`;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // IntersectionObserver for scroll reveals
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });

  document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

  /* ------------------------------------------------------------------------
     4. Animated Hero KPI Counters & Live Countdown
     ------------------------------------------------------------------------ */
  function animateCounters() {
    document.querySelectorAll('[data-count]').forEach((el) => {
      const target = Number(el.dataset.count);
      const prefix = el.dataset.prefix || '';
      if (reducedMotion) {
        el.textContent = `${prefix}${target.toLocaleString()}`;
        return;
      }
      const duration = 1250;
      const start = performance.now();
      const step = (now) => {
        const p = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - p, 4);
        const val = Math.round(target * eased);
        el.textContent = `${prefix}${val.toLocaleString()}`;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }

  // Countdown to 2026-11-30 23:59:59+08:00 (fallback to 12.06 19:00 finale)
  const submitDeadline = new Date('2026-11-30T23:59:59+08:00').getTime();
  const finaleDate = new Date('2026-12-06T19:00:00+08:00').getTime();
  const cdDays = document.getElementById('cdDays');
  const cdHours = document.getElementById('cdHours');
  const cdMins = document.getElementById('cdMins');
  const cdSecs = document.getElementById('cdSecs');
  const cdLabel = document.getElementById('countdownLabel');

  function setDigit(el, val) {
    if (!el) return;
    const str = String(val).padStart(2, '0');
    if (el.textContent !== str) {
      el.textContent = str;
      el.classList.remove('tick');
      void el.offsetWidth;
      el.classList.add('tick');
    }
  }

  function updateCountdown() {
    const now = Date.now();
    let target = submitDeadline;
    if (now > submitDeadline && now <= finaleDate) {
      target = finaleDate;
      if (cdLabel) cdLabel.textContent = '距离路演与开奖直播 · 12.06 19:00';
    } else if (now > finaleDate) {
      if (cdLabel) cdLabel.textContent = '2026 赛季路演开奖 · 12.06';
      setDigit(cdDays, 0); setDigit(cdHours, 0); setDigit(cdMins, 0); setDigit(cdSecs, 0);
      return;
    }

    const diff = Math.max(0, target - now);
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    const secs = Math.floor((diff % 60000) / 1000);

    setDigit(cdDays, days);
    setDigit(cdHours, hours);
    setDigit(cdMins, mins);
    setDigit(cdSecs, secs);
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);

  /* ------------------------------------------------------------------------
     5. Kinetic Velocity-Responsive Marquee
     ------------------------------------------------------------------------ */
  const marquee = document.getElementById('kineticMarquee');
  if (marquee && !reducedMotion) {
    let offset = 0;
    let hoverSlow = false;
    marquee.addEventListener('pointerenter', () => { hoverSlow = true; });
    marquee.addEventListener('pointerleave', () => { hoverSlow = false; });

    const tickMarquee = () => {
      const firstTrack = marquee.firstElementChild;
      const trackWidth = firstTrack ? firstTrack.offsetWidth : 1200;
      const baseSpeed = hoverSlow ? 0.35 : 0.95;
      offset += baseSpeed + scrollVelocity * 0.25;
      scrollVelocity *= 0.9;
      if (offset >= trackWidth) offset -= trackWidth;
      marquee.style.transform = `translate3d(${-offset}px, 0, 0)`;
      requestAnimationFrame(tickMarquee);
    };
    tickMarquee();
  }

  /* ------------------------------------------------------------------------
     6. Interactive 3-Track Stage
     ------------------------------------------------------------------------ */
  const TRACKS = [
    {
      code: 'TRACK // 01',
      name: 'AI × 知识与探索',
      slogan: '把散落资料变成清晰路径',
      award: '最佳知识探索奖 · 1 支',
      chips: ['课程助手', '文献梳理', '领域问答', '复杂讲解'],
    },
    {
      code: 'TRACK // 02',
      name: 'AI × 陪伴与交互',
      slogan: '让对话真正被理解与承接',
      award: '最佳陪伴交互奖 · 1 支',
      chips: ['学习伙伴', '生活助手', '特定陪伴', '自然交互'],
    },
    {
      code: 'TRACK // 03',
      name: 'AI × 出海',
      slogan: '从校园出发，直面全球用户',
      award: '最佳出海潜力奖 · 1 支',
      chips: ['海外工具', '本土化体验', '跨境原型', '全球演示'],
    },
  ];

  const trackCards = document.querySelectorAll('.track-card');
  const trackCodeEl = document.getElementById('trackCode');
  const trackAwardEl = document.getElementById('trackAward');
  const trackNameEl = document.getElementById('trackActiveName');
  const trackSloganEl = document.getElementById('trackActiveSlogan');
  const trackChipsEl = document.getElementById('trackActiveChips');
  let currentTrack = 0;
  let trackAutoTimer = null;

  function selectTrack(idx) {
    currentTrack = idx;
    const data = TRACKS[idx];
    document.body.setAttribute('data-track', String(idx));

    trackCards.forEach((c, i) => {
      const active = i === idx;
      c.classList.toggle('is-active', active);
      c.setAttribute('aria-selected', String(active));
    });

    if (trackCodeEl) trackCodeEl.textContent = data.code;
    if (trackAwardEl) trackAwardEl.textContent = data.award;
    if (trackNameEl) trackNameEl.textContent = data.name;
    if (trackSloganEl) trackSloganEl.textContent = data.slogan;
    if (trackChipsEl) {
      trackChipsEl.innerHTML = '';
      data.chips.forEach((label, i) => {
        const sp = document.createElement('span');
        sp.textContent = label;
        sp.style.animationDelay = `${i * 55}ms`;
        trackChipsEl.appendChild(sp);
      });
    }

    if (typeof window.setTrackVisual === 'function') {
      window.setTrackVisual(idx);
    }
  }

  let userTouchedTracks = false;

  trackCards.forEach((card) => {
    const idx = Number(card.dataset.trackIdx);
    card.addEventListener('click', () => {
      userTouchedTracks = true;
      clearInterval(trackAutoTimer);
      selectTrack(idx);
    });
    card.addEventListener('pointerenter', () => {
      if (!isTouch) {
        userTouchedTracks = true;
        clearInterval(trackAutoTimer);
        selectTrack(idx);
      }
    });
  });

  const tracksSection = document.getElementById('tracks');
  if (tracksSection && !reducedMotion) {
    const trackCycleObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !userTouchedTracks) {
        clearInterval(trackAutoTimer);
        trackAutoTimer = setInterval(() => {
          selectTrack((currentTrack + 1) % TRACKS.length);
        }, 5500);
      } else {
        clearInterval(trackAutoTimer);
      }
    }, { threshold: 0.25 });
    trackCycleObserver.observe(tracksSection);
  }

  /* ------------------------------------------------------------------------
     7. Interactive OpenDev Token Booster + Particle Spark Burst
     ------------------------------------------------------------------------ */
  const tokenAmountEl = document.getElementById('tokenAmount');
  const tokenBreakdownEl = document.getElementById('tokenBreakdown');
  const energyFillEl = document.getElementById('energyFill');
  const boosterPills = document.querySelectorAll('.booster-pill');
  const sparkCanvas = document.getElementById('sparkCanvas');
  const sparkCtx = sparkCanvas ? sparkCanvas.getContext('2d') : null;
  let currentTokenVal = 200;
  const sparks = [];
  let sparkRaf = null;

  function resizeSparkCanvas() {
    if (!sparkCanvas) return;
    const rect = sparkCanvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    sparkCanvas.width = Math.max(1, Math.floor(rect.width * dpr));
    sparkCanvas.height = Math.max(1, Math.floor(rect.height * dpr));
    sparkCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  window.addEventListener('resize', resizeSparkCanvas, { passive: true });
  resizeSparkCanvas();

  function spawnSparks(count = 24) {
    if (!sparkCanvas || reducedMotion) return;
    const rect = sparkCanvas.getBoundingClientRect();
    const ox = rect.width * 0.25;
    const oy = rect.height * 0.42;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.8 + Math.random() * 4.2;
      sparks.push({
        x: ox + (Math.random() - 0.5) * 60,
        y: oy + (Math.random() - 0.5) * 20,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.2,
        life: 1,
        r: 1.8 + Math.random() * 2.4,
        color: Math.random() > 0.45 ? '#2ee6d6' : '#ff9f43',
      });
    }
    if (!sparkRaf) animateSparks();
  }

  function animateSparks() {
    const rect = sparkCanvas.getBoundingClientRect();
    sparkCtx.clearRect(0, 0, rect.width, rect.height);
    for (let i = sparks.length - 1; i >= 0; i--) {
      const s = sparks[i];
      s.x += s.vx;
      s.y += s.vy;
      s.vy += 0.09;
      s.life -= 0.025;
      if (s.life <= 0) {
        sparks.splice(i, 1);
        continue;
      }
      sparkCtx.globalAlpha = s.life;
      sparkCtx.beginPath();
      sparkCtx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      sparkCtx.fillStyle = s.color;
      sparkCtx.fill();
    }
    sparkCtx.globalAlpha = 1;
    if (sparks.length > 0) sparkRaf = requestAnimationFrame(animateSparks);
    else sparkRaf = null;
  }

  function animateTokenNumber(targetVal) {
    const startVal = currentTokenVal;
    const start = performance.now();
    const dur = 420;
    const step = (now) => {
      const p = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      const v = Math.round(startVal + (targetVal - startVal) * eased);
      if (tokenAmountEl) tokenAmountEl.textContent = `$${v}`;
      if (p < 1) requestAnimationFrame(step);
      else currentTokenVal = targetVal;
    };
    requestAnimationFrame(step);
  }

  boosterPills.forEach((btn) => {
    btn.addEventListener('click', () => {
      const invites = Number(btn.dataset.invites);
      const bonus = invites * 100;
      const total = 200 + bonus;
      boosterPills.forEach((p) => p.classList.toggle('is-active', p === btn));
      animateTokenNumber(total);
      if (energyFillEl) energyFillEl.style.width = `${(total / 500) * 100}%`;
      if (tokenBreakdownEl) {
        tokenBreakdownEl.textContent = invites === 0
          ? '基础入选 $200'
          : `基础 $200 + 邀请 ${invites} 人加成 $${bonus}`;
      }
      spawnSparks(invites === 3 ? 38 : 20);
    });
  });

  /* ------------------------------------------------------------------------
     8. Interactive 5-Axis Judging Radar
     ------------------------------------------------------------------------ */
  const RADAR_DATA = [
    { name: '问题真实性', score: 25, max: 25, tip: '真实需求 · 目标用户清晰' },
    { name: '方案完成度', score: 25, max: 25, tip: '功能闭环 · 实机稳定演示' },
    { name: '技术实现', score: 20, max: 25, tip: '选型合理 · 工程规范复现' },
    { name: '价值潜力', score: 20, max: 25, tip: '对人有用 · 可迭代可孵化' },
    { name: '表达演示', score: 10, max: 25, tip: '阐述清晰 · 答辩直击要点' },
  ];

  const radarGrid = document.getElementById('radarGrid');
  const radarAxes = document.getElementById('radarAxes');
  const radarPoly = document.getElementById('radarPoly');
  const radarNodes = document.getElementById('radarNodes');
  const radarBeam = document.getElementById('radarBeam');
  const radarCenterNum = document.getElementById('radarCenterNum');
  const radarCenterSub = document.getElementById('radarCenterSub');
  const radarHint = document.getElementById('radarHint');
  const scoreRows = document.querySelectorAll('.score-row');
  const radarCard = document.getElementById('radarCard');

  const CX = 180, CY = 180, MAX_R = 114;
  const NS = 'http://www.w3.org/2000/svg';

  function polar(idx, radius) {
    const angle = -Math.PI / 2 + (idx * Math.PI * 2) / 5;
    return { x: CX + Math.cos(angle) * radius, y: CY + Math.sin(angle) * radius };
  }

  function buildRadar() {
    if (!radarGrid || !radarAxes || !radarNodes) return;

    // 4 concentric rings
    for (let ring = 1; ring <= 4; ring++) {
      const r = (MAX_R * ring) / 4;
      const pts = Array.from({ length: 5 }, (_, i) => {
        const p = polar(i, r);
        return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
      }).join(' ');
      const poly = document.createElementNS(NS, 'polygon');
      poly.setAttribute('points', pts);
      radarGrid.appendChild(poly);
    }

    // Axes & Interactive Nodes
    RADAR_DATA.forEach((item, i) => {
      const outer = polar(i, MAX_R);
      const line = document.createElementNS(NS, 'line');
      line.setAttribute('x1', CX);
      line.setAttribute('y1', CY);
      line.setAttribute('x2', outer.x.toFixed(1));
      line.setAttribute('y2', outer.y.toFixed(1));
      radarAxes.appendChild(line);

      const valR = MAX_R * (item.score / item.max);
      const vp = polar(i, valR);

      const dot = document.createElementNS(NS, 'circle');
      dot.setAttribute('class', 'radar-node-dot');
      dot.setAttribute('cx', vp.x.toFixed(1));
      dot.setAttribute('cy', vp.y.toFixed(1));
      dot.setAttribute('r', '5.5');
      dot.dataset.axis = i;
      radarNodes.appendChild(dot);

      const labelRadius = i === 0 ? MAX_R + 22 : MAX_R + 20;
      const lp = polar(i, labelRadius);
      const text = document.createElementNS(NS, 'text');
      text.setAttribute('class', 'radar-node-label');
      const anchor = i === 0 ? 'middle' : (i === 1 || i === 2) ? 'start' : 'end';
      const dx = i === 0 ? 0 : (i === 1 || i === 2) ? 6 : -6;
      const dy = i === 0 ? -2 : (i === 2 || i === 3) ? 12 : 4;
      text.setAttribute('x', (lp.x + dx).toFixed(1));
      text.setAttribute('y', (lp.y + dy).toFixed(1));
      text.setAttribute('text-anchor', anchor);
      text.textContent = `${item.name} ${item.score}`;
      text.dataset.axis = i;
      radarNodes.appendChild(text);

      [dot, text].forEach((el) => {
        el.addEventListener('pointerenter', () => highlightAxis(i));
        el.addEventListener('click', () => highlightAxis(i));
      });
    });
  }

  function highlightAxis(idx) {
    const item = RADAR_DATA[idx];
    const vp = polar(idx, MAX_R * (item.score / item.max));

    if (radarBeam) {
      radarBeam.setAttribute('x2', vp.x.toFixed(1));
      radarBeam.setAttribute('y2', vp.y.toFixed(1));
      radarBeam.classList.add('is-on');
    }
    if (radarCenterNum) radarCenterNum.textContent = `${item.score}`;
    if (radarCenterSub) radarCenterSub.textContent = item.name;
    if (radarHint) radarHint.textContent = `${item.name} (${item.score}分) · ${item.tip}`;

    document.querySelectorAll('.radar-node-dot').forEach((d, i) => {
      d.classList.toggle('is-active', i === idx);
      d.setAttribute('r', i === idx ? '7.5' : '5.5');
    });
    document.querySelectorAll('.radar-node-label').forEach((l, i) => {
      l.classList.toggle('is-active', i === idx);
    });
    scoreRows.forEach((row, i) => row.classList.toggle('is-active', i === idx));
  }

  scoreRows.forEach((row) => {
    const idx = Number(row.dataset.axis);
    row.addEventListener('pointerenter', () => highlightAxis(idx));
    row.addEventListener('click', () => highlightAxis(idx));
  });

  buildRadar();

  if (radarCard && radarPoly) {
    const radarObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        const pts = RADAR_DATA.map((item, i) => {
          const p = polar(i, MAX_R * (item.score / item.max));
          return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
        }).join(' ');
        radarPoly.setAttribute('points', pts);
        highlightAxis(0);
        radarObserver.disconnect();
      }
    }, { threshold: 0.25 });
    radarObserver.observe(radarCard);
  }

  /* ------------------------------------------------------------------------
     9. Interactive 3D Holographic Boarding Pass Modal & PNG Export
     ------------------------------------------------------------------------ */
  const modal = document.getElementById('passModal');
  const modalBackdrop = document.getElementById('modalBackdrop');
  const closeModalBtn = document.getElementById('closeModal');
  const openTriggers = [
    document.getElementById('openPassNav'),
    document.getElementById('openPassHero'),
    document.getElementById('openPassFinale'),
  ].filter(Boolean);

  const passNameInput = document.getElementById('passNameInput');
  const passNameDisplay = document.getElementById('passNameDisplay');
  const passTrackDisplay = document.getElementById('passTrackDisplay');
  const passCodeEl = document.getElementById('passCode');
  const holoPass = document.getElementById('holoPass');
  const pickBtns = document.querySelectorAll('.pick-btn');
  const downloadPassBtn = document.getElementById('downloadPassBtn');

  let passTrackIdx = 0;
  const randomCode = `VOY-${Math.floor(1000 + Math.random() * 9000)}`;
  if (passCodeEl) passCodeEl.textContent = randomCode;

  function openModal() {
    if (!modal) return;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    setPassTrack(currentTrack);
  }

  function closeModal() {
    if (!modal) return;
    modal.hidden = true;
    document.body.style.overflow = '';
  }

  function setPassTrack(idx) {
    passTrackIdx = idx;
    if (holoPass) holoPass.setAttribute('data-theme', String(idx));
    if (passTrackDisplay) passTrackDisplay.textContent = TRACKS[idx].name;
    pickBtns.forEach((b, i) => b.classList.toggle('is-active', i === idx));
  }

  openTriggers.forEach((btn) => btn.addEventListener('click', openModal));
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);
  if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && !modal.hidden) closeModal();
  });

  if (passNameInput && passNameDisplay) {
    passNameInput.addEventListener('input', () => {
      const val = passNameInput.value.trim();
      passNameDisplay.textContent = val || '航行者 01';
    });
  }

  pickBtns.forEach((btn) => {
    btn.addEventListener('click', () => setPassTrack(Number(btn.dataset.pick)));
  });

  // 3D Holo Tilt & Prismatic Foil Shift
  if (holoPass && !reducedMotion) {
    holoPass.addEventListener('pointermove', (e) => {
      const rect = holoPass.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      const rx = (py - 0.5) * -22;
      const ry = (px - 0.5) * 22;
      holoPass.style.setProperty('--rx', `${rx.toFixed(1)}deg`);
      holoPass.style.setProperty('--ry', `${ry.toFixed(1)}deg`);
      holoPass.style.setProperty('--px', `${(px * 100).toFixed(1)}%`);
      holoPass.style.setProperty('--py', `${(py * 100).toFixed(1)}%`);
    });
    holoPass.addEventListener('pointerleave', () => {
      holoPass.style.setProperty('--rx', '0deg');
      holoPass.style.setProperty('--ry', '0deg');
      holoPass.style.setProperty('--px', '50%');
      holoPass.style.setProperty('--py', '50%');
    });
  }

  // Export Crisp High-Res Boarding Pass PNG
  if (downloadPassBtn) {
    downloadPassBtn.addEventListener('click', () => {
      const c = document.createElement('canvas');
      c.width = 760;
      c.height = 1000;
      const g = c.getContext('2d');

      const accents = ['#2ee6d6', '#ff9f43', '#4f8bff'];
      const accent = accents[passTrackIdx] || '#2ee6d6';
      const squad = (passNameInput?.value.trim() || '航行者 01').slice(0, 16);

      // Background
      const bg = g.createLinearGradient(0, 0, 760, 1000);
      bg.addColorStop(0, '#0c1830');
      bg.addColorStop(1, '#040811');
      g.fillStyle = bg;
      g.fillRect(0, 0, 760, 1000);

      // Glow blobs
      const glow = g.createRadialGradient(140, 160, 20, 140, 160, 420);
      glow.addColorStop(0, `${accent}44`);
      glow.addColorStop(1, 'transparent');
      g.fillStyle = glow;
      g.fillRect(0, 0, 760, 1000);

      // Outer border
      g.strokeStyle = `${accent}88`;
      g.lineWidth = 4;
      g.strokeRect(24, 24, 712, 952);

      // Header
      g.fillStyle = accent;
      g.font = '700 22px monospace';
      g.fillText('HEBEU × XIAYE', 64, 104);

      g.fillStyle = '#ffffff';
      g.font = '900 38px sans-serif';
      g.fillText('2026 AI HACKATHON', 64, 152);

      g.fillStyle = 'rgba(255,255,255,0.65)';
      g.font = '700 22px monospace';
      g.fillText(randomCode, 560, 118);

      // Divider
      g.strokeStyle = 'rgba(255,255,255,0.2)';
      g.setLineDash([8, 8]);
      g.lineWidth = 2;
      g.beginPath();
      g.moveTo(64, 200);
      g.lineTo(696, 200);
      g.stroke();
      g.setLineDash([]);

      // Crew Name
      g.fillStyle = 'rgba(214,228,255,0.55)';
      g.font = '600 20px monospace';
      g.fillText('CREW / CAPTAIN', 64, 340);

      g.fillStyle = '#ffffff';
      g.font = '900 66px sans-serif';
      g.fillText(squad, 64, 430);

      // Track pill
      g.fillStyle = accent;
      g.fillRect(64, 480, 320, 56);
      g.fillStyle = '#040811';
      g.font = '700 26px sans-serif';
      g.fillText(TRACKS[passTrackIdx].name, 88, 517);

      // Slogan
      g.fillStyle = 'rgba(214,228,255,0.78)';
      g.font = '500 26px sans-serif';
      g.fillText('看见问题，就是开始', 64, 650);

      // Footer info
      g.strokeStyle = 'rgba(255,255,255,0.2)';
      g.setLineDash([8, 8]);
      g.beginPath();
      g.moveTo(64, 780);
      g.lineTo(696, 780);
      g.stroke();
      g.setLineDash([]);

      g.fillStyle = 'rgba(214,228,255,0.55)';
      g.font = '600 18px monospace';
      g.fillText('VOYAGE WINDOW', 64, 840);
      g.fillText('OPENDEV QUOTA', 380, 840);

      g.fillStyle = '#ffffff';
      g.font = '700 28px monospace';
      g.fillText('2026.11.23 — 12.06', 64, 882);
      g.fillText('UP TO $500 / PERSON', 380, 882);

      const link = document.createElement('a');
      link.download = `HEBEU-AI-Hackathon-2026-${randomCode}.png`;
      link.href = c.toDataURL('image/png');
      link.click();
    });
  }
})();
