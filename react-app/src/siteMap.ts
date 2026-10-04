import type { TranslationKey } from './i18n/translations'

export type SiteSection = { id: string; path: string; label: TranslationKey; parent?: string }

export const SITE_MAP: SiteSection[] = [
  { id: 'home', path: '/', label: 'nav.home' },
  { id: 'playground', path: '/playground', label: 'nav.playground', parent: 'home' },
  { id: 'galeria', path: '/galeria', label: 'nav.gallery', parent: 'home' },
  { id: 'musica', path: '/musica', label: 'nav.music', parent: 'home' },
  { id: 'fotos', path: '/galeria/fotos', label: 'graph.photos', parent: 'galeria' },
  { id: '3d', path: '/galeria/3d', label: 'graph.3d', parent: 'galeria' },
]

export const LEAF_SECTIONS = SITE_MAP.filter((s) => !SITE_MAP.some((other) => other.parent === s.id))
