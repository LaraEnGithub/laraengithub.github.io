import { Gallery, toItems } from '../components/Gallery'

const full = import.meta.glob('../assets/fotos/*.{jpg,jpeg,png,webp,avif,mp4,webm,mov}', {
  eager: true,
  query: '?url',
  import: 'default',
  caseSensitive: false,
}) as Record<string, string>

const thumbs = import.meta.glob('../assets/fotos/*.{jpg,jpeg,png,webp,avif}', {
  eager: true,
  query: { w: 800, format: 'webp' },
  import: 'default',
  caseSensitive: false,
}) as Record<string, string>

const items = toItems(full, thumbs)

export const Fotos = () => <Gallery title="Fotos" items={items} />
