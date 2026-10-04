import { useLang } from '../i18n/lang'

export const UnderConstruction = () => {
  const { t } = useLang()

  return (
    <section className="under-construction">
      <p>
        &gt; {t('construction.message')}
        <span className="cursor">_</span>
      </p>
    </section>
  )
}
