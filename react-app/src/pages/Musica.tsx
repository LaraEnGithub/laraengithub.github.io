import { useLang } from '../i18n/lang'
import { SONGS } from '../songs'

const SONGS_NEWEST_FIRST = [...SONGS].sort((a, b) => b.date.localeCompare(a.date))

export const Musica = () => {
  const { t } = useLang()

  return (
    <section className="music">
      <h1 className="music-title">{t('nav.music')}</h1>
      <p className="music-subtitle">&gt; {t('music.songsOfTheDay')}</p>
      <ol className="song-list">
        {SONGS_NEWEST_FIRST.map((song) => (
          <li key={song.date} className="song-row">
            <time dateTime={song.date}>{song.date}</time>
            <span className="song-name">
              {song.artist} - {song.title}
            </span>
            <a
              href={`https://www.youtube.com/watch?v=${song.youtubeId}`}
              target="_blank"
              rel="noreferrer"
            >
              YouTube ↗
            </a>
          </li>
        ))}
      </ol>
    </section>
  )
}
