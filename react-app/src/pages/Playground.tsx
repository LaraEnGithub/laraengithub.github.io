import { Navigate, NavLink, useParams } from 'react-router'
import { GameOfLife } from '../components/GameOfLife'
import { useLang } from '../i18n/lang'

export const Playground = () => {
  const { t } = useLang()
  const { game } = useParams()

  if (game !== 'conway') {
    return <Navigate to="/playground/conway" replace />
  }

  return (
    <section className="playground">
      <h1 className="playground-title">{t('nav.playground')}</h1>
      <nav className="playground-tabs">
        <NavLink to="/playground/conway">&gt; ./conway</NavLink>
      </nav>
      <GameOfLife />
    </section>
  )
}
