<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

interface Star {
  x: number
  y: number
  radius: number
  alpha: number
  phase: number
  speed: number
}

interface TrailParticle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  decay: number
  size: number
  cyan: boolean
}

const canvas = ref<HTMLCanvasElement | null>(null)
let context: CanvasRenderingContext2D | null = null
let stars: Star[] = []
let particles: TrailParticle[] = []
let frame = 0
let width = 0
let height = 0
let lastPointerAt = 0
let reducedMotion = false

const resize = () => {
  if (!canvas.value) return
  width = window.innerWidth
  height = window.innerHeight
  const ratio = Math.min(window.devicePixelRatio || 1, 1.5)
  canvas.value.width = Math.round(width * ratio)
  canvas.value.height = Math.round(height * ratio)
  canvas.value.style.width = `${width}px`
  canvas.value.style.height = `${height}px`
  context = canvas.value.getContext('2d')
  context?.setTransform(ratio, 0, 0, ratio, 0, 0)

  const count = Math.min(Math.round((width * height) / 10500), 170)
  stars = Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    radius: Math.random() * 1.2 + 0.25,
    alpha: Math.random() * 0.55 + 0.2,
    phase: Math.random() * Math.PI * 2,
    speed: Math.random() * 0.0007 + 0.0002,
  }))
}

const addTrail = (event: PointerEvent) => {
  if (reducedMotion) return
  const now = performance.now()
  if (now - lastPointerAt < 18) return
  lastPointerAt = now
  const isTouch = event.pointerType === 'touch'
  const count = isTouch ? 2 : 3
  for (let index = 0; index < count; index += 1) {
    particles.push({
      x: event.clientX + (Math.random() - 0.5) * 12,
      y: event.clientY + (Math.random() - 0.5) * 12,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5 - 0.12,
      life: 1,
      decay: isTouch ? 0.9 : 0.955,
      size: Math.random() * 2.2 + 0.8,
      cyan: index % 2 === 0,
    })
  }
  if (particles.length > 90) particles.splice(0, particles.length - 90)
}

const render = (time: number) => {
  if (!context) return
  context.clearRect(0, 0, width, height)

  for (const star of stars) {
    const pulse = reducedMotion ? 1 : 0.72 + Math.sin(time * star.speed + star.phase) * 0.28
    context.beginPath()
    context.fillStyle = `rgba(220, 229, 255, ${star.alpha * pulse})`
    context.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
    context.fill()
  }

  particles = particles.filter((particle) => particle.life > 0.025)
  for (const particle of particles) {
    particle.x += particle.vx
    particle.y += particle.vy
    particle.life *= particle.decay
    context.beginPath()
    context.fillStyle = particle.cyan
      ? `rgba(88, 215, 229, ${particle.life * 0.72})`
      : `rgba(124, 140, 255, ${particle.life * 0.68})`
    context.arc(particle.x, particle.y, particle.size * particle.life, 0, Math.PI * 2)
    context.fill()
  }

  if (!reducedMotion) frame = requestAnimationFrame(render)
}

onMounted(() => {
  reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  resize()
  window.addEventListener('resize', resize, { passive: true })
  window.addEventListener('pointermove', addTrail, { passive: true })
  frame = requestAnimationFrame(render)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resize)
  window.removeEventListener('pointermove', addTrail)
  cancelAnimationFrame(frame)
})
</script>

<template>
  <canvas ref="canvas" class="star-field" aria-hidden="true" />
</template>

<style scoped>
.star-field {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}
</style>
