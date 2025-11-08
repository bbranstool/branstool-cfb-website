import { useEffect, useState } from 'react'
import Navbar from './components/navbar/Navbar'
import Footer from './components/footer/Footer';
import { Route, Routes } from 'react-router-dom';
import Home from './components/pages/home/Home';
import NotFound from './components/pages/not_found/NotFound';
import Scorigami from './components/pages/scorigami/Scorigami';
import TeamsPage from './components/pages/teams/TeamsPage';

function App() {
  const current_theme = localStorage.getItem('current_theme');
  const [theme, setTheme] = useState(current_theme ? current_theme : 'light');

  useEffect(() => {
    localStorage.setItem('current_theme', theme)
  }, [theme]);

  return (
    <div className={`container ${theme}`}>
      <Navbar theme={theme} setTheme={setTheme} />
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/scorigami' element={<Scorigami/>}/>
        <Route path='/teams' element={<TeamsPage theme={theme}/>}/>
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App
