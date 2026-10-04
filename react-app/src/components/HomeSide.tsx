import { Link, useNavigate } from 'react-router'
import asciiArt from '../assets/ascii-art.txt?raw'
import { useLang } from '../i18n/lang'
import { LEAF_SECTIONS } from '../siteMap'
import { currentSong } from '../songs'

export const HomeSide = () => {
  const { t } = useLang()
  const navigate = useNavigate()

  const goSomewhere = () => {
    const section = LEAF_SECTIONS[Math.floor(Math.random() * LEAF_SECTIONS.length)]
    navigate(section.path)
  }

  return (
    <aside className="home-side">
      <pre className="side-ascii" aria-hidden="true">
        {asciiArt}
      </pre>
      <div className="side-separator" aria-hidden="true">
        {'#'.repeat(60)}
      </div>
      <button type="button" className="side-random" onClick={goSomewhere}>
        {t('side.random')}
      </button>
      <div className="side-separator" aria-hidden="true">
        {'/'.repeat(60)}
      </div>
      <div className="side-song">
        <iframe
          src={`https://www.youtube.com/embed/${currentSong.youtubeId}`}
          title={`${currentSong.artist} - ${currentSong.title}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        ></iframe>
      </div>
      <div className="side-song-info">
        <p className="side-song-label">{t('side.songOfTheDay')}</p>
        <Link to="/musica" className="side-see-all">
          {t('side.seeAll')}
        </Link>
      </div>
    </aside>
  )
}
