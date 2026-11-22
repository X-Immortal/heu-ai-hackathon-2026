<script setup lang="ts">
const ticks = Array.from({ length: 96 }, (_, index) => index)
const stars = [
  [400, 112], [536, 184], [620, 314], [586, 478], [488, 590],
  [312, 608], [184, 492], [146, 342], [230, 206], [400, 276],
  [494, 352], [418, 468], [298, 414], [304, 302],
] as const
</script>

<template>
  <div class="planisphere" aria-hidden="true">
    <svg viewBox="0 0 800 800" role="presentation">
      <defs>
        <radialGradient id="sky-wash">
          <stop offset="0" stop-color="#7c8cff" stop-opacity=".14" />
          <stop offset=".65" stop-color="#7c8cff" stop-opacity=".025" />
          <stop offset="1" stop-color="#7c8cff" stop-opacity="0" />
        </radialGradient>
      </defs>

      <circle cx="400" cy="400" r="390" fill="url(#sky-wash)" />

      <g class="planisphere__ticks">
        <circle cx="400" cy="400" r="356" />
        <circle cx="400" cy="400" r="338" />
        <line
          v-for="tick in ticks"
          :key="tick"
          x1="400" y1="48" x2="400" :y2="tick % 8 === 0 ? 75 : 65"
          :transform="`rotate(${tick * 3.75} 400 400)`"
          :class="{ 'planisphere__tick--major': tick % 8 === 0 }"
        />
      </g>

      <g class="planisphere__orbit planisphere__orbit--slow">
        <circle cx="400" cy="400" r="286" />
        <ellipse cx="400" cy="400" rx="286" ry="104" transform="rotate(-24 400 400)" />
        <ellipse cx="400" cy="400" rx="286" ry="104" transform="rotate(52 400 400)" />
        <circle class="planisphere__planet" cx="663" cy="263" r="8" />
        <circle class="planisphere__planet planisphere__planet--blue" cx="199" cy="193" r="5" />
      </g>

      <g class="planisphere__constellation">
        <path d="M230 206 400 112 536 184 620 314 494 352 418 468 312 608 184 492 298 414 304 302 230 206" />
        <path d="M304 302 400 276 494 352 586 478M298 414 418 468 488 590M400 276 400 112" />
        <g v-for="(star, index) in stars" :key="index">
          <circle class="planisphere__star-halo" :cx="star[0]" :cy="star[1]" r="13" />
          <circle class="planisphere__star" :cx="star[0]" :cy="star[1]" :r="index % 3 === 0 ? 5 : 3" />
        </g>
      </g>

      <g class="planisphere__cross">
        <circle cx="400" cy="400" r="18" />
        <path d="M400 366v68M366 400h68" />
      </g>
    </svg>
  </div>
</template>

<style scoped>
.planisphere {
  width: 100%;
  aspect-ratio: 1;
  color: var(--color-lavender);
  filter: drop-shadow(0 24px 70px rgb(0 0 0 / 22%));
}

svg { display: block; width: 100%; overflow: visible; }
.planisphere__ticks,
.planisphere__orbit {
  fill: none;
  stroke: currentColor;
  stroke-width: 1;
  opacity: .28;
  transform-origin: 400px 400px;
}
.planisphere__ticks { animation: spin 120s linear infinite; }
.planisphere__tick--major { stroke: var(--color-amber); stroke-width: 2; opacity: .8; }
.planisphere__orbit--slow { animation: spin-reverse 70s linear infinite; }
.planisphere__planet { fill: var(--color-amber); stroke: none; opacity: 1; }
.planisphere__planet--blue { fill: var(--color-cyan); }
.planisphere__constellation path {
  fill: none;
  stroke: var(--color-lavender);
  stroke-width: 1.4;
  opacity: .5;
  stroke-dasharray: 8 10;
  animation: trace 28s linear infinite;
}
.planisphere__star { fill: var(--color-paper); }
.planisphere__star-halo { fill: var(--color-lavender); opacity: .12; }
.planisphere__cross { fill: none; stroke: var(--color-amber); stroke-width: 1.3; opacity: .75; }

@keyframes spin { to { transform: rotate(360deg); } }
@keyframes spin-reverse { to { transform: rotate(-360deg); } }
@keyframes trace { to { stroke-dashoffset: -360; } }

@media (prefers-reduced-motion: reduce) {
  .planisphere__ticks,
  .planisphere__orbit--slow,
  .planisphere__constellation path { animation: none; }
}
</style>
