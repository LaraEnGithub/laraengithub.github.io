import { Navigate, NavLink, useParams } from 'react-router'
import { Gallery } from '../components/Gallery'
import { useLang } from '../i18n/lang'
import { fotos, threeD } from '../media'

const COLLECTIONS = { fotos, '3d': threeD }

export const Galeria = () => {
  const { t } = useLang()
  const { collection } = useParams()

  if (collection !== 'fotos' && collection !== '3d') {
    return <Navigate to="/galeria/fotos" replace />
  }

  return (
    <section className="gallery">
      <h1 className="gallery-title">{t('nav.gallery')}</h1>
      <nav className="gallery-tabs">
        <NavLink to="/galeria/fotos">&gt; ls fotos/</NavLink>
        <NavLink to="/galeria/3d">&gt; ls 3d/</NavLink>
      </nav>
      <Gallery key={collection} items={COLLECTIONS[collection]} />
    </section>
  )
}
