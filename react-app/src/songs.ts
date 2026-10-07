export type Song = { date: string; youtubeId: string; artist: string; title: string }

export const SONGS: Song[] = [
  { date: '2026-10-07', youtubeId: 'sBtJ9_zTqdE', artist: 'The Smile', title: 'Bending Hectic' },
]

export const currentSong = SONGS.reduce((latest, song) => (song.date > latest.date ? song : latest))
