import { useEffect, useState } from 'react'

export type GalleryItem = {
  id: string
  src: string
  thumb: string
}

export const toItems = (
  full: Record<string, string>,
  thumbs: Record<string, string>,
): GalleryItem[] =>
  Object.keys(full).map((path) => ({ id: path, src: full[path], thumb: thumbs[path] ?? full[path] }))

const VIDEO_RE = /\.(mp4|webm|mov)$/i

const PLACEHOLDER_SPANS = [
  'tile tile-wide',
  'tile',
  'tile',
  'tile tile-tall',
  'tile',
  'tile',
  'tile tile-wide',
  'tile',
]

const spanFor = (ratio: number | undefined) => {
  if (!ratio) return 'tile'
  if (ratio > 1.3) return 'tile tile-wide'
  if (ratio < 0.77) return 'tile tile-tall'
  return 'tile'
}

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

const delay = (i: number) => ({ animationDelay: `${0.15 + Math.min(i, 12) * 0.05}s` })

export const Gallery = ({ items }: { items: GalleryItem[] }) => {
  const [ratios, setRatios] = useState<Record<string, number>>({})
  const [shuffled] = useState(() => shuffle(items))
  const [selected, setSelected] = useState<GalleryItem | null>(null)

  useEffect(() => {
    if (!selected) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelected(null)
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [selected])

  const measure = (id: string, w: number, h: number) => {
    if (!w || !h) return
    setRatios((prev) => (prev[id] ? prev : { ...prev, [id]: w / h }))
  }

  const placeholders = PLACEHOLDER_SPANS.slice(items.length)

  return (
    <>
      <div className="gallery-grid">
        {shuffled.map((item, i) => (
          <button
            key={item.id}
            type="button"
            className={ratios[item.id] ? spanFor(ratios[item.id]) : 'tile is-loading'}
            style={delay(i)}
            onClick={() => setSelected(item)}
          >
            {VIDEO_RE.test(item.src) ? (
              <video
                src={item.src}
                muted
                loop
                autoPlay
                playsInline
                onLoadedData={(e) =>
                  measure(item.id, e.currentTarget.videoWidth, e.currentTarget.videoHeight)
                }
              />
            ) : (
              <img
                src={item.thumb}
                alt=""
                loading="lazy"
                onLoad={(e) =>
                  measure(item.id, e.currentTarget.naturalWidth, e.currentTarget.naturalHeight)
                }
              />
            )}
          </button>
        ))}
        {placeholders.map((span, i) => (
          <div key={`placeholder-${i}`} className={span} style={delay(shuffled.length + i)} />
        ))}
      </div>
      {selected && (
        <div className="lightbox" role="dialog" aria-modal="true">
          <button
            type="button"
            className="lightbox-back"
            onClick={() => setSelected(null)}
            aria-label="Volver"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          {VIDEO_RE.test(selected.src) ? (
            <video src={selected.src} controls autoPlay loop playsInline />
          ) : (
            <img src={selected.src} alt="" />
          )}
        </div>
      )}
    </>
  )
}
