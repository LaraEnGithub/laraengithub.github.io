import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import { NavBar } from './components/NavBar'
import homeIcon from './assets/home-icon.svg'

function App() {

  return (
    <div className='App'>
      <a href="#home" id="home-logo">
        <img src={homeIcon} alt="Home" height="70" />
      </a>
      <NavBar />
      <div id="center">
        <h1 className="hero-title">Hello World!</h1>
        <p className="subtitle">We ain't have no problem, Houston</p>
        <div id="song-widget">
          <iframe
            width="300"
            height="300"
            src="https://www.youtube.com/embed/a5uQMwRMHcs"
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  )
}

export default App
