import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import { Routes, Route, Link } from 'react-router'
import { NavBar } from './components/NavBar'
import homeIcon from './assets/home-icon.svg'
import { Home } from './pages/Home'
import { Fotos } from './pages/Fotos'
import { ThreeD } from './pages/ThreeD'

function App() {

  return (
    <div className='App'>
      <Link to="/" id="home-logo" className="glass">
        <img src={homeIcon} alt="Home" height="70" />
      </Link>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/fotos" element={<Fotos />} />
        <Route path="/3d" element={<ThreeD />} />
      </Routes>
    </div>
  )
}

export default App
