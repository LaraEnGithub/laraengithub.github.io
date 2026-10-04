import { Gallery, toItems } from '../components/Gallery'

const full = import.meta.glob('../assets/3D/*.{jpg,jpeg,png,webp,avif,mp4,webm,mov}', {
  eager: true,
  query: '?url',
  import: 'default',
  caseSensitive: false,
}) as Record<string, string>

const thumbs = import.meta.glob('../assets/3D/*.{jpg,jpeg,png,webp,avif}', {
  eager: true,
  query: { w: 800, format: 'webp' },
  import: 'default',
  caseSensitive: false,
}) as Record<string, string>

const items = toItems(full, thumbs)

export const ThreeD = () => <Gallery title="3D" items={items} />
