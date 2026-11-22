<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import CountUp from './components/CountUp.vue'
import Planisphere from './components/Planisphere.vue'
import StarField from './components/StarField.vue'

interface Track {
  name: string
  shortName: string
  statement: string
  path: string
  points: readonly (readonly [number, number])[]
}

const tracks: Track[] = [
  {
    name: '知识与探索',
    shortName: '知识',
    statement: '让知识可靠可用',
    path: 'M72 236 152 106 250 166 346 66 474 134 404 266 250 166 152 106',
    points: [[72, 236], [152, 106], [250, 166], [346, 66], [474, 134], [404, 266]],
  },
  {
    name: '陪伴与交互',
    shortName: '陪伴',
    statement: '让协作自然发生',
    path: 'M82 174 176 78 284 128 374 88 478 188 386 270 260 230 164 272 82 174M284 128 260 230M374 88 386 270',
    points: [[82, 174], [176, 78], [284, 128], [374, 88], [478, 188], [386, 270], [260, 230], [164, 272]],
  },
  {
    name: '出海',
    shortName: '出海',
    statement: '为真实市场而做',
    path: 'M66 224 154 142 236 198 322 86 414 134 496 62M236 198 294 282 414 234 496 62M322 86 414 234',
    points: [[66, 224], [154, 142], [236, 198], [322, 86], [414, 134], [496, 62], [294, 282], [414, 234]],
  },
]

const navItems = [
  { id: 'tracks', label: '赛道' },
  { id: 'schedule', label: '赛程' },
  { id: 'awards', label: '奖励' },
]

const activeTrack = ref(0)
const activeSection = ref('')
const isScrolled = ref(false)
const scrollProgress = ref(0)
const currentTrack = computed(() => tracks[activeTrack.value])
let revealObserver: IntersectionObserver | undefined
let sectionObserver: IntersectionObserver | undefined
let scrollFrame = 0

const updateScroll = () => {
  isScrolled.value = window.scrollY > 32
  const distance = document.documentElement.scrollHeight - window.innerHeight
  scrollProgress.value = distance > 0 ? window.scrollY / distance : 0
  scrollFrame = 0
}

const onScroll = () => {
  if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScroll)
}

const pull = (event: PointerEvent) => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const element = event.currentTarget as HTMLElement
  const bounds = element.getBoundingClientRect()
  element.style.setProperty('--pull-x', `${(event.clientX - bounds.left - bounds.width / 2) * 0.12}px`)
  element.style.setProperty('--pull-y', `${(event.clientY - bounds.top - bounds.height / 2) * 0.12}px`)
}

const resetPull = (event: PointerEvent) => {
  const element = event.currentTarget as HTMLElement
  element.style.setProperty('--pull-x', '0px')
  element.style.setProperty('--pull-y', '0px')
}

onMounted(() => {
  document.documentElement.classList.add('is-ready')
  window.addEventListener('scroll', onScroll, { passive: true })
  updateScroll()

  revealObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible')
        revealObserver?.unobserve(entry.target)
      }
    }
  }, { threshold: 0.14, rootMargin: '0px 0px -6% 0px' })

  document.querySelectorAll('[data-reveal]').forEach((element) => revealObserver?.observe(element))

  sectionObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) activeSection.value = entry.target.id
    }
  }, { rootMargin: '-35% 0px -55% 0px' })

  document.querySelectorAll('main section[id]').forEach((element) => sectionObserver?.observe(element))
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  cancelAnimationFrame(scrollFrame)
  revealObserver?.disconnect()
  sectionObserver?.disconnect()
})
</script>

<template>
  <StarField />

  <div class="scroll-progress" aria-hidden="true">
    <span :style="{ transform: `scaleY(${scrollProgress})` }" />
  </div>

  <header class="site-header" :class="{ 'site-header--scrolled': isScrolled }">
    <a class="brand" href="#top" aria-label="返回页面顶部">
      <svg class="brand__mark" viewBox="0 0 40 40" aria-hidden="true">
        <path d="M20 3 23.6 16.4 37 20 23.6 23.6 20 37 16.4 23.6 3 20 16.4 16.4Z" />
        <circle cx="20" cy="20" r="3.5" />
      </svg>
      <span>计协 · AI 黑客松</span>
    </a>

    <nav class="site-nav" aria-label="页面导航">
      <a
        v-for="item in navItems"
        :key="item.id"
        :href="`#${item.id}`"
        :class="{ 'is-active': activeSection === item.id }"
      >{{ item.label }}</a>
    </nav>

    <a class="header-action" href="/notice.pdf" target="_blank" rel="noopener">
      查看通知
      <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 15 15 5M7 5h8v8" /></svg>
    </a>
  </header>

  <main>
    <section id="top" class="hero" aria-labelledby="hero-title">
      <div class="hero__sky"><Planisphere /></div>

      <div class="hero__content">
        <h1 id="hero-title" class="hero-title">
          <span class="hero-title__line"><span>看见问题</span></span>
          <span class="hero-title__line hero-title__line--outline"><span>就是开始</span></span>
        </h1>
        <p class="hero__edition">2026 AI HACKATHON</p>
      </div>

      <div class="hero__deadline">
        <span>作品提交截止</span>
        <strong>11.30</strong>
        <span>23:59:59</span>
      </div>

      <a
        class="primary-action hero__action"
        href="/notice.pdf"
        target="_blank"
        rel="noopener"
        @pointermove="pull"
        @pointerleave="resetPull"
      >
        <span>查看完整通知</span>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 19 19 5M8 5h11v11" /></svg>
      </a>

      <a class="scroll-cue" href="#tracks">
        <span>向下发现</span>
        <i aria-hidden="true" />
      </a>
    </section>

    <section id="tracks" class="tracks section-shell" data-reveal aria-labelledby="tracks-title">
      <div class="section-heading">
        <h2 id="tracks-title">三条赛道</h2>
        <p>选一个真实问题，做成作品。</p>
      </div>

      <div class="track-stage">
        <div class="track-stage__visual" aria-hidden="true">
          <span class="track-stage__orbit" />
          <transition name="sky-change" mode="out-in">
            <svg :key="currentTrack.name" viewBox="0 0 560 340">
              <path class="track-stage__path" :d="currentTrack.path" />
              <g v-for="(point, index) in currentTrack.points" :key="index">
                <circle class="track-stage__halo" :cx="point[0]" :cy="point[1]" r="18" />
                <circle class="track-stage__star" :cx="point[0]" :cy="point[1]" :r="index % 3 === 0 ? 6 : 4" />
              </g>
            </svg>
          </transition>
        </div>

        <div class="track-stage__copy" aria-live="polite">
          <transition name="copy-change" mode="out-in">
            <div :key="currentTrack.name">
              <span>AI ×</span>
              <h3>{{ currentTrack.name }}</h3>
              <p>{{ currentTrack.statement }}</p>
            </div>
          </transition>
        </div>
      </div>

      <div class="track-tabs" role="group" aria-label="切换赛道">
        <button
          v-for="(track, index) in tracks"
          :key="track.name"
          type="button"
          :aria-pressed="activeTrack === index"
          :class="{ 'is-active': activeTrack === index }"
          @click="activeTrack = index"
          @mouseenter="activeTrack = index"
          @focus="activeTrack = index"
        >
          <span>AI ×</span>
          <strong>{{ track.name }}</strong>
          <i aria-hidden="true" />
        </button>
      </div>
    </section>

    <section id="schedule" class="schedule section-shell" data-reveal aria-labelledby="schedule-title">
      <div class="section-heading section-heading--split">
        <h2 id="schedule-title">从问题，到路演</h2>
        <p>全程线上</p>
      </div>

      <div class="timeline">
        <div class="timeline__line" aria-hidden="true"><span /></div>
        <article class="timeline__stop">
          <time datetime="2026-11-23">11.23</time>
          <h3>开赛</h3>
          <p>开发开始</p>
        </article>
        <article class="timeline__stop timeline__stop--accent">
          <time datetime="2026-11-30T23:59:59">11.30</time>
          <h3>截止</h3>
          <p>提交作品与源码</p>
        </article>
        <article class="timeline__stop">
          <time datetime="2026-12-06T19:00">12.06</time>
          <h3>路演</h3>
          <p>19:00 · 专家点评</p>
        </article>
      </div>
      <p class="schedule__note">线上初评 · 截止后一周</p>
    </section>

    <section id="awards" class="awards section-shell" data-reveal aria-labelledby="awards-title">
      <div class="section-heading">
        <h2 id="awards-title">奖金与支持</h2>
        <p>让好作品继续向前。</p>
      </div>

      <div class="prizes">
        <article class="prize prize--second">
          <h3>二等奖</h3>
          <p><span>¥</span><CountUp :value="600" /></p>
          <span>2 支队伍</span>
        </article>
        <article class="prize prize--first">
          <h3>一等奖</h3>
          <p><span>¥</span><CountUp :value="1200" /></p>
          <span>1 支队伍</span>
        </article>
        <article class="prize prize--third">
          <h3>三等奖</h3>
          <p><span>¥</span><CountUp :value="200" /></p>
          <span>3 支队伍</span>
        </article>
      </div>

      <div class="support-line">
        <span><strong>$200</strong> 入选 Token</span>
        <span>实习机会</span>
        <span>项目孵化</span>
        <span>参赛证书</span>
      </div>
    </section>

    <section class="finale section-shell" data-reveal aria-labelledby="finale-title">
      <div class="finale__star" aria-hidden="true">
        <svg viewBox="0 0 160 160"><path d="M80 4 91 69 156 80 91 91 80 156 69 91 4 80 69 69Z" /></svg>
      </div>
      <h2 id="finale-title">看见问题<br>就是开始</h2>
      <p>免费参赛 · 1—5 人组队</p>
      <a
        class="primary-action primary-action--large"
        href="/notice.pdf"
        target="_blank"
        rel="noopener"
        @pointermove="pull"
        @pointerleave="resetPull"
      >
        <span>查看完整通知</span>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 19 19 5M8 5h11v11" /></svg>
      </a>
    </section>
  </main>

  <footer class="site-footer">
    <span>河北工程大学计算机协会</span>
    <span>联合主办：夏野黑客松</span>
    <span>OpenDev · 连尚集团 · 连尚孵化器</span>
  </footer>
</template>
