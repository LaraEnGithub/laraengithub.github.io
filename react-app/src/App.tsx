import './App.css'
import { Routes, Route, Navigate } from 'react-router'
import { GitHubLink } from './components/GitHubLink'
import { NavBar } from './components/NavBar'
import { Home } from './pages/Home'
import { Galeria } from './pages/Galeria'
import { Musica } from './pages/Musica'
import { UnderConstruction } from './pages/UnderConstruction'
import { useLang } from './i18n/lang'

function App() {
  const { lang, setLang, t } = useLang()

  return (
    <div className="shell">
      <header className="shell-nav">
        <NavBar />
      </header>
      <div className="shell-status">
        <span className="status-dot" aria-hidden="true" />
        <button
          type="button"
          className="lang-toggle"
          onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
          aria-label={t('lang.switch')}
        >
          {lang === 'es' ? 'EN' : 'ES'}
        </button>
      </div>
      <main className="shell-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/galeria/:collection?" element={<Galeria />} />
          <Route path="/fotos" element={<Navigate to="/galeria/fotos" replace />} />
          <Route path="/3d" element={<Navigate to="/galeria/3d" replace />} />
          <Route path="/playground" element={<UnderConstruction />} />
          <Route path="/musica" element={<Musica />} />
        </Routes>
      </main>
      <aside className="shell-rail">
        <GitHubLink />
      </aside>
      <footer className="shell-footer">
        <GitHubLink />
      </footer>
    </div>
  )
}

export default App
