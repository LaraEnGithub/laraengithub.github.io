import { HomeSide } from '../components/HomeSide'
import { SiteGraph } from '../components/SiteGraph'
import { Typewriter } from '../components/Typewriter'
import { useLang } from '../i18n/lang'

const TYPE_SPEED = 90

export const Home = () => {
  const { t } = useLang()
  const title = t('home.title')

  return (
    <div className="home">
      <div className="home-main">
        <h1 className="hero-title">
          <Typewriter key={title} text={title} speed={TYPE_SPEED} />
        </h1>
        <p
          key={`${title}-subtitle`}
          className="hero-subtitle"
          style={{ animationDelay: `${title.length * TYPE_SPEED}ms` }}
        >
          {t('home.subtitle')}
        </p>
        <SiteGraph
          key={`${title}-graph`}
          style={{ animationDelay: `${title.length * TYPE_SPEED + 300}ms` }}
        />
      </div>
      <HomeSide />
    </div>
  )
}
