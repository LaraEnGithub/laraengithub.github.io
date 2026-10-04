import { toItems } from './components/Gallery'

const fotosFull = import.meta.glob('./assets/fotos/*.{jpg,jpeg,png,webp,avif,mp4,webm,mov}', {
  eager: true,
  query: '?url',
  import: 'default',
  caseSensitive: false,
}) as Record<string, string>

const fotosThumbs = import.meta.glob('./assets/fotos/*.{jpg,jpeg,png,webp,avif}', {
  eager: true,
  query: { w: 800, format: 'webp' },
  import: 'default',
  caseSensitive: false,
}) as Record<string, string>

const threeDFull = import.meta.glob('./assets/3D/*.{jpg,jpeg,png,webp,avif,mp4,webm,mov}', {
  eager: true,
  query: '?url',
  import: 'default',
  caseSensitive: false,
}) as Record<string, string>

const threeDThumbs = import.meta.glob('./assets/3D/*.{jpg,jpeg,png,webp,avif}', {
  eager: true,
  query: { w: 800, format: 'webp' },
  import: 'default',
  caseSensitive: false,
}) as Record<string, string>

export const fotos = toItems(fotosFull, fotosThumbs)
export const threeD = toItems(threeDFull, threeDThumbs)
