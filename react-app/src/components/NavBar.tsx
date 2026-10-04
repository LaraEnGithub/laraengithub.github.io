import { NavLink } from 'react-router'
import { useLang } from '../i18n/lang'

const LINKS = [
  { to: '/', key: 'nav.home' },
  { to: '/playground', key: 'nav.playground' },
  { to: '/galeria', key: 'nav.gallery' },
  { to: '/musica', key: 'nav.music' },
] as const

export const NavBar = () => {
  const { t } = useLang()

  return (
    <nav className="site-nav">
      {LINKS.map((link) => (
        <NavLink key={link.to} to={link.to} end={link.to === '/'}>
          {t(link.key)}
        </NavLink>
      ))}
    </nav>
  )
}
