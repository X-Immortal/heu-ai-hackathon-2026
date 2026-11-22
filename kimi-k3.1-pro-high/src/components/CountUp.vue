<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

const props = withDefaults(defineProps<{
  value: number
  duration?: number
}>(), {
  duration: 1400,
})

const root = ref<HTMLElement | null>(null)
const display = ref('0')
let observer: IntersectionObserver | undefined
let frame = 0

const finish = () => {
  display.value = props.value.toLocaleString('zh-CN')
}

onMounted(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduceMotion) {
    finish()
    return
  }

  observer = new IntersectionObserver(([entry]) => {
    if (!entry?.isIntersecting) return
    observer?.disconnect()
    const startedAt = performance.now()
    const tick = (now: number) => {
      const progress = Math.min((now - startedAt) / props.duration, 1)
      const eased = 1 - Math.pow(1 - progress, 4)
      display.value = Math.round(props.value * eased).toLocaleString('zh-CN')
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
  }, { threshold: 0.5 })

  if (root.value) observer.observe(root.value)
})

onBeforeUnmount(() => {
  observer?.disconnect()
  cancelAnimationFrame(frame)
})
</script>

<template>
  <span ref="root" class="count-up">{{ display }}</span>
</template>
