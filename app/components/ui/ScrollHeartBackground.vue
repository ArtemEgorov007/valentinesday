<script setup lang="ts">
type HeartPhase = 'falling' | 'settled' | 'launching'
type SceneMode = 'intro' | 'resting' | 'transition'

type HeartParticle = {
  x: number
  y: number
  size: number
  vx: number
  vy: number
  alpha: number
  phase: HeartPhase
  targetX: number
  targetY: number
  startX: number
  startY: number
  progress: number
  speed: number
}

const canvasRef = ref<HTMLCanvasElement | null>(null)
const particles = ref<HeartParticle[]>([])
const overlayActive = ref(false)

let ctx: CanvasRenderingContext2D | null = null
let rafId: number | null = null
let viewportWidth = 0
let viewportHeight = 0
let lastFrame = 0
let reducedMotionQuery: MediaQueryList | null = null
let prefersReducedMotion = false

const sceneMode = ref<SceneMode>('intro')

const HEARTS_TOTAL = 170
const HEARTS_PER_FRAME = 5
const FLOOR_BAND_HEIGHT = 120

function clampDpr() {
  return Math.min(window.devicePixelRatio || 1, 1.5)
}

function easeOutCubic(value: number) {
  return 1 - ((1 - value) ** 3)
}

function random(min: number, max: number) {
  return Math.random() * (max - min) + min
}

function resetCanvas() {
  const canvas = canvasRef.value
  if (!canvas) {
    return
  }

  viewportWidth = window.innerWidth
  viewportHeight = window.innerHeight

  const dpr = clampDpr()
  canvas.width = Math.floor(viewportWidth * dpr)
  canvas.height = Math.floor(viewportHeight * dpr)
  canvas.style.width = `${viewportWidth}px`
  canvas.style.height = `${viewportHeight}px`

  const nextCtx = canvas.getContext('2d')
  if (!nextCtx) {
    ctx = null
    return
  }

  nextCtx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx = nextCtx
}

function drawHeart(context: CanvasRenderingContext2D, heart: HeartParticle) {
  context.save()
  context.translate(heart.x, heart.y)
  context.scale(heart.size / 10, heart.size / 10)
  context.fillStyle = `rgba(225, 29, 72, ${heart.alpha})`
  context.beginPath()
  context.moveTo(0, 3)
  context.bezierCurveTo(0, -3, -5, -3, -5, 1)
  context.bezierCurveTo(-5, 5, 0, 8, 0, 10)
  context.bezierCurveTo(0, 8, 5, 5, 5, 1)
  context.bezierCurveTo(5, -3, 0, -3, 0, 3)
  context.fill()
  context.restore()
}

function createFallingHeart(): HeartParticle {
  const floorY = viewportHeight - random(8, FLOOR_BAND_HEIGHT)
  return {
    x: random(0, viewportWidth),
    y: random(-viewportHeight * 1.1, -20),
    size: random(7, 15),
    vx: random(-14, 14),
    vy: random(56, 142),
    alpha: random(0.22, 0.62),
    phase: 'falling',
    targetX: random(0, viewportWidth),
    targetY: floorY,
    startX: 0,
    startY: 0,
    progress: 0,
    speed: random(0.9, 1.6)
  }
}

function spawnIntroBatch() {
  if (particles.value.length >= HEARTS_TOTAL) {
    return
  }

  const next = Math.min(HEARTS_PER_FRAME, HEARTS_TOTAL - particles.value.length)
  for (let i = 0; i < next; i += 1) {
    particles.value.push(createFallingHeart())
  }
}

function launchToCover() {
  if (!particles.value.length || !viewportWidth || !viewportHeight) {
    return
  }

  sceneMode.value = 'transition'
  overlayActive.value = true

  particles.value.forEach((heart) => {
    heart.phase = 'launching'
    heart.startX = heart.x
    heart.startY = heart.y
    heart.targetX = random(0, viewportWidth)
    heart.targetY = random(-viewportHeight * 0.48, -16)
    heart.progress = 0
    heart.speed = random(2.3, 3.6)
    heart.alpha = random(0.38, 0.84)
    heart.vx = random(-18, 18)
    heart.vy = random(92, 170)
  })
}

function restartFromTop() {
  particles.value = []
  sceneMode.value = 'intro'
  overlayActive.value = false
}

function onRouteStart() {
  if (prefersReducedMotion) {
    overlayActive.value = false
    return
  }

  launchToCover()
}

function animate(frameTime: number) {
  if (!ctx) {
    rafId = requestAnimationFrame(animate)
    return
  }

  if (!lastFrame) {
    lastFrame = frameTime
  }

  const delta = Math.min(34, frameTime - lastFrame)
  lastFrame = frameTime
  const deltaSec = delta / 1000

  ctx.clearRect(0, 0, viewportWidth, viewportHeight)

  if (sceneMode.value === 'intro' && particles.value.length < HEARTS_TOTAL) {
    spawnIntroBatch()
  }

  let settledCount = 0
  let movingCount = 0

  particles.value.forEach((heart) => {
    if (heart.phase === 'falling') {
      heart.vy += 76 * deltaSec
      heart.x += heart.vx * deltaSec
      heart.y += heart.vy * deltaSec

      if (heart.y >= heart.targetY) {
        heart.y = heart.targetY
        heart.phase = 'settled'
      } else {
        movingCount += 1
      }
    } else if (heart.phase === 'launching') {
      heart.progress = Math.min(1, heart.progress + heart.speed * deltaSec)
      const eased = easeOutCubic(heart.progress)
      heart.x = heart.startX + (heart.targetX - heart.startX) * eased
      heart.y = heart.startY + (heart.targetY - heart.startY) * eased

      if (heart.progress >= 1) {
        heart.phase = 'falling'
        heart.targetY = viewportHeight - random(8, FLOOR_BAND_HEIGHT)
      } else {
        movingCount += 1
      }
    }

    if (heart.phase === 'settled') {
      settledCount += 1
    }

    drawHeart(ctx as CanvasRenderingContext2D, heart)
  })

  if (sceneMode.value === 'intro' && particles.value.length === HEARTS_TOTAL && settledCount === HEARTS_TOTAL) {
    sceneMode.value = 'resting'
  }

  if (sceneMode.value === 'transition' && movingCount === 0) {
    sceneMode.value = 'resting'
    overlayActive.value = false
  }

  rafId = requestAnimationFrame(animate)
}

function onReducedMotionChange(event: MediaQueryListEvent) {
  prefersReducedMotion = event.matches
  if (prefersReducedMotion) {
    overlayActive.value = false
    particles.value = []
  } else {
    restartFromTop()
  }
}

onMounted(() => {
  resetCanvas()

  reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  prefersReducedMotion = reducedMotionQuery.matches
  reducedMotionQuery.addEventListener('change', onReducedMotionChange)

  const nuxtApp = useNuxtApp()
  nuxtApp.hook('page:start', onRouteStart)

  window.addEventListener('resize', resetCanvas, { passive: true })

  if (!prefersReducedMotion) {
    restartFromTop()
  }

  rafId = requestAnimationFrame(animate)
})

onBeforeUnmount(() => {
  if (rafId !== null) {
    cancelAnimationFrame(rafId)
  }

  window.removeEventListener('resize', resetCanvas)
  reducedMotionQuery?.removeEventListener('change', onReducedMotionChange)
})
</script>

<template>
  <canvas
    ref="canvasRef"
    class="pointer-events-none fixed inset-0 -z-10"
    :class="overlayActive ? 'opacity-100' : 'opacity-92'"
    aria-hidden="true"
  />
</template>
