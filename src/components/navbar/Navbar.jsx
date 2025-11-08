import "./Navbar.css"

import logo_light from '../../assets/football.png'
import logo_dark from '../../assets/football.png'
import search_icon_light from '../../assets/search-w.png'
import search_icon_dark from '../../assets/search-b.png'
import toggle_light from '../../assets/night.png'
import toggle_dark from '../../assets/day.png'
import { Link } from "react-router-dom"

function Navbar({theme, setTheme}) {

    const toggle_theme = () => {
        theme == 'light' ? setTheme('dark') : setTheme('light');
    }

    return (
        <div className="navbar">
            <Link to="/" className="logo-link">
                <img src={theme == 'light' ? logo_light : logo_dark} alt="" className="logo"/>
            </Link>
            <ul>
                <li><Link to="/" className="nav-link">Home</Link></li>
                <li><Link to="/teams" className="nav-link">Teams</Link></li>
                <li><Link to="/scorigami" className="nav-link">Scorigami</Link></li>
                <li><Link to="/about" className="nav-link">About</Link></li>
                <li><Link to="/faq" className="nav-link">FAQ</Link></li>
            </ul>

            {/* <div className="search-box">
                <input type="text" placeholder="Search"/>
                <img src={theme == 'light' ? search_icon_light : search_icon_dark} alt="toggle theme" className="toggle-icon"/>
            </div> */}

            <img onClick={() => {toggle_theme()}} src={theme == 'light' ? toggle_light : toggle_dark} alt="" className="toggle-icon"/>
        </div>
    );
}
export default Navbar

