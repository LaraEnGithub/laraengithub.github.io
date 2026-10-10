export type Song = { date: string; youtubeId: string; artist: string; title: string }

export const SONGS: Song[] = [
  { date: '2026-10-07', youtubeId: 'sBtJ9_zTqdE', artist: 'The Smile', title: 'Bending Hectic' },
  { date: '2026-10-08', youtubeId: '2jna3dWEnzo', artist: 'The Strokes', title: 'Brooklyn Bridge To Chorus' },
  { date: '2026-10-09', youtubeId: '1elgQ-zSYKU', artist: 'PANTERA BLUE', title: 'Anticuada' },
  { date: '2026-10-10', youtubeId: 'Ty9Pcg3qrmU', artist: 'Fontaines D.C.', title: 'I Love You' },
]

export const currentSong = SONGS.reduce((latest, song) => (song.date > latest.date ? song : latest))
