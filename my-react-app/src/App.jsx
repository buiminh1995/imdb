import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Main from './components/Main';
import MoviePage from './components/MoviePage';
import PeoplePage from './components/PeoplePage';
import SearchResult from "./components/SearchResult";


function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
  
    <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/search-result" element={<SearchResult />} />
        <Route path="/title/:tconst" element={<MoviePage />} />        
        <Route path="/people-page/:pid" element={<PeoplePage />} />
        <Route path="/search" element={<SearchResult />} />
        {/* <Route path="/contact" element={<Contact />} /> */}
      </Routes>
    </BrowserRouter>
  )
}

export default App
