<script setup lang="ts">
const props = defineProps<{
  trigger: number
}>()

const canvasRef = ref<HTMLCanvasElement | null>(null)

function resizeCanvas() {
  const canvas = canvasRef.value
  if (!canvas) {
    return
  }

  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
}

function drawHeart(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, alpha: number, hue: number) {
  ctx.save()
  ctx.translate(x, y)
  ctx.scale(size / 10, size / 10)
  ctx.fillStyle = `hsla(${hue}, 95%, 70%, ${alpha})`
  ctx.beginPath()
  ctx.moveTo(0, 3)
  ctx.bezierCurveTo(0, -3, -5, -3, -5, 1)
  ctx.bezierCurveTo(-5, 5, 0, 8, 0, 10)
  ctx.bezierCurveTo(0, 8, 5, 5, 5, 1)
  ctx.bezierCurveTo(5, -3, 0, -3, 0, 3)
  ctx.fill()
  ctx.restore()
}

function launchHearts() {
  const canvas = canvasRef.value
  if (!canvas) {
    return
  }

  const context = canvas.getContext('2d')
  if (!context) {
    return
  }
  const ctx: CanvasRenderingContext2D = context

  resizeCanvas()
  const width = canvas.width
  const height = canvas.height

  const hearts = Array.from({ length: 36 }, () => ({
    x: width * (0.2 + Math.random() * 0.6),
    y: height * (0.55 + Math.random() * 0.25),
    vx: (Math.random() - 0.5) * 2,
    vy: -2.2 - Math.random() * 2.8,
    size: 8 + Math.random() * 14,
    alpha: 1,
    hue: 330 + Math.random() * 40
  }))

  let frame = 0
  const maxFrames = 65

  function tick() {
    frame += 1
    ctx.clearRect(0, 0, width, height)

    hearts.forEach((heart) => {
      heart.x += heart.vx
      heart.y += heart.vy
      heart.vy += 0.08
      heart.alpha -= 0.014

      if (heart.alpha > 0) {
        drawHeart(ctx, heart.x, heart.y, heart.size, heart.alpha, heart.hue)
      }
    })

    if (frame < maxFrames) {
      requestAnimationFrame(tick)
    } else {
      ctx.clearRect(0, 0, width, height)
    }
  }

  requestAnimationFrame(tick)
}

watch(() => props.trigger, (next, prev) => {
  if (next <= prev) {
    return
  }

  launchHearts()
})

onMounted(() => {
  resizeCanvas()
  window.addEventListener('resize', resizeCanvas)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeCanvas)
})
</script>

<template>
  <canvas
    ref="canvasRef"
    class="pointer-events-none fixed inset-0 z-30"
    aria-hidden="true"
  />
</template>
