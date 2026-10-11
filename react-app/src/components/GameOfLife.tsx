import { useEffect, useRef, useState } from 'react'
import { pointer, select } from 'd3-selection'
import { zoom, zoomIdentity, zoomTransform } from 'd3-zoom'
import { useLang } from '../i18n/lang'

const SIZE = 1000
const W = SIZE + 2
const INITIAL_CELL_PX = 20
const MAX_CELL_PX = 60
const GRID_MIN_CELL_PX = 6
const STEP_MS = 100
// --orange (#ff751f) packed as a little-endian RGBA pixel
const ALIVE_PIXEL = 0xff1f75ff
const GRID_COLOR = 'rgba(255, 255, 255, 0.15)'
const BORDER_COLOR = '#fff'

type Board = { cells: Uint8Array; next: Uint8Array; initial: Uint8Array; started: boolean }

const createBoard = (): Board => ({
  cells: new Uint8Array(W * W),
  next: new Uint8Array(W * W),
  initial: new Uint8Array(W * W),
  started: false,
})

const step = (board: Board) => {
  const { cells, next } = board
  let changed = false
  for (let y = 1; y <= SIZE; y++) {
    for (let i = y * W + 1, end = i + SIZE; i < end; i++) {
      const n =
        cells[i - W - 1] + cells[i - W] + cells[i - W + 1] +
        cells[i - 1] + cells[i + 1] +
        cells[i + W - 1] + cells[i + W] + cells[i + W + 1]
      const alive = n === 3 || (n === 2 && cells[i]) ? 1 : 0
      if (alive !== cells[i]) changed = true
      next[i] = alive
    }
  }
  board.cells = next
  board.next = cells
  return changed
}

export const GameOfLife = () => {
  const { t } = useLang()
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const redrawRef = useRef(() => {})
  const [board] = useState(createBoard)
  const [running, setRunning] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [generation, setGeneration] = useState(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const image = new ImageData(SIZE, SIZE)
    const pixels = new Uint32Array(image.data.buffer)
    const offscreen = document.createElement('canvas')
    offscreen.width = SIZE
    offscreen.height = SIZE
    const offscreenCtx = offscreen.getContext('2d')!
    let imageDirty = true
    let frame = 0

    const draw = () => {
      frame = 0
      if (imageDirty) {
        const { cells } = board
        for (let y = 0; y < SIZE; y++) {
          const src = (y + 1) * W + 1
          const dst = y * SIZE
          for (let x = 0; x < SIZE; x++) pixels[dst + x] = cells[src + x] ? ALIVE_PIXEL : 0
        }
        offscreenCtx.putImageData(image, 0, 0)
        imageDirty = false
      }

      const dpr = window.devicePixelRatio || 1
      const w = canvas.width / dpr
      const h = canvas.height / dpr
      const { k, x: tx, y: ty } = zoomTransform(canvas)

      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.imageSmoothingEnabled = false
      ctx.setTransform(k * dpr, 0, 0, k * dpr, tx * dpr, ty * dpr)
      ctx.drawImage(offscreen, 0, 0)

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.lineWidth = 1
      if (k >= GRID_MIN_CELL_PX) {
        const x0 = Math.max(0, Math.floor(-tx / k))
        const x1 = Math.min(SIZE, Math.ceil((w - tx) / k))
        const y0 = Math.max(0, Math.floor(-ty / k))
        const y1 = Math.min(SIZE, Math.ceil((h - ty) / k))
        ctx.beginPath()
        for (let x = x0; x <= x1; x++) {
          ctx.moveTo(tx + x * k, ty + y0 * k)
          ctx.lineTo(tx + x * k, ty + y1 * k)
        }
        for (let y = y0; y <= y1; y++) {
          ctx.moveTo(tx + x0 * k, ty + y * k)
          ctx.lineTo(tx + x1 * k, ty + y * k)
        }
        ctx.strokeStyle = GRID_COLOR
        ctx.stroke()
      }
      ctx.strokeStyle = BORDER_COLOR
      ctx.strokeRect(tx, ty, SIZE * k, SIZE * k)
    }

    const requestDraw = () => {
      if (!frame) frame = requestAnimationFrame(draw)
    }
    const markDirty = () => {
      imageDirty = true
      requestDraw()
    }
    redrawRef.current = markDirty

    const selection = select(canvas)
    const zoomBehavior = zoom<HTMLCanvasElement, unknown>()
      .translateExtent([[0, 0], [SIZE, SIZE]])
      .clickDistance(4)
      .on('zoom', requestDraw)
    selection.call(zoomBehavior).on('dblclick.zoom', null)

    let centered = false
    const resize = () => {
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      if (!w || !h) return
      const dpr = window.devicePixelRatio || 1
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      zoomBehavior.scaleExtent([Math.min(w, h) / SIZE, MAX_CELL_PX])
      if (centered) {
        selection.call(zoomBehavior.scaleBy, 1)
      } else {
        centered = true
        selection.call(
          zoomBehavior.transform,
          zoomIdentity.translate(w / 2, h / 2).scale(INITIAL_CELL_PX).translate(-SIZE / 2, -SIZE / 2),
        )
      }
      requestDraw()
    }
    const observer = new ResizeObserver(resize)
    observer.observe(canvas)

    const toggleCell = (event: MouseEvent) => {
      const [wx, wy] = zoomTransform(canvas).invert(pointer(event, canvas))
      const x = Math.floor(wx)
      const y = Math.floor(wy)
      if (x < 0 || y < 0 || x >= SIZE || y >= SIZE) return
      board.cells[(y + 1) * W + x + 1] ^= 1
      markDirty()
    }
    canvas.addEventListener('click', toggleCell)

    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
      selection.on('.zoom', null)
      canvas.removeEventListener('click', toggleCell)
    }
  }, [board])

  useEffect(() => {
    if (!running) return
    const id = setInterval(() => {
      if (!step(board)) {
        setRunning(false)
        return
      }
      setGeneration((g) => g + 1)
      redrawRef.current()
    }, STEP_MS)
    return () => clearInterval(id)
  }, [running, board])

  useEffect(() => {
    const onFullscreenChange = () => {
      if (!document.fullscreenElement) setExpanded(false)
    }
    document.addEventListener('fullscreenchange', onFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange)
  }, [])

  const saveInitial = () => {
    if (board.started) return
    board.initial.set(board.cells)
    board.started = true
  }

  const togglePlay = () => {
    if (!running) saveInitial()
    setRunning(!running)
  }

  const stepOnce = () => {
    saveInitial()
    if (!step(board)) return
    setGeneration((g) => g + 1)
    redrawRef.current()
  }

  const reset = () => {
    setRunning(false)
    setGeneration(0)
    if (board.started) board.cells.set(board.initial)
    board.started = false
    redrawRef.current()
  }

  const clear = () => {
    setRunning(false)
    setGeneration(0)
    board.cells.fill(0)
    board.initial.fill(0)
    board.started = false
    redrawRef.current()
  }

  const toggleExpanded = () => {
    if (expanded) {
      if (document.fullscreenElement) document.exitFullscreen()
    } else {
      containerRef.current?.requestFullscreen?.().catch(() => {})
    }
    setExpanded(!expanded)
  }

  return (
    <div ref={containerRef} className={expanded ? 'life is-expanded' : 'life'}>
      <div className="life-controls">
        <button
          type="button"
          className={running ? 'is-running' : undefined}
          onClick={togglePlay}
          aria-label={running ? t('life.pause') : t('life.play')}
          title={running ? t('life.pause') : t('life.play')}
        >
          {running ? '❚❚' : '▶︎'}
        </button>
        <button type="button" onClick={stepOnce} disabled={running} aria-label={t('life.step')} title={t('life.step')}>
          →
        </button>
        <button type="button" onClick={reset} aria-label={t('life.reset')} title={t('life.reset')}>
          ↺
        </button>
        <button type="button" onClick={clear} aria-label={t('life.clear')} title={t('life.clear')}>
          ⌫
        </button>
        <span className="life-generation">
          {t('life.generation')}: {generation}
        </span>
      </div>
      <div className="life-board">
        <div className="life-frame">
          <canvas ref={canvasRef} className="life-canvas" aria-label={t('graph.conway')} />
          <button
            type="button"
            className="life-expand"
            onClick={toggleExpanded}
            aria-label={expanded ? t('life.collapse') : t('life.expand')}
            title={expanded ? t('life.collapse') : t('life.expand')}
          >
            {expanded ? '✕' : '⛶'}
          </button>
        </div>
      </div>
    </div>
  )
}
