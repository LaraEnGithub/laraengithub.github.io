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
        <h1>Hello World!</h1>
      </div>
    </div>
  )
}

export default App
