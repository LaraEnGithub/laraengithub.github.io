export type Song = { date: string; youtubeId: string; artist: string; title: string }

export const SONGS: Song[] = [
  { date: '2026-10-04', youtubeId: 'a5uQMwRMHcs', artist: 'Daft Punk', title: 'Instant Crush' },
]

export const currentSong = SONGS.reduce((latest, song) => (song.date > latest.date ? song : latest))
