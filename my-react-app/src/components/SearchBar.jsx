import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function SearchBar() {
    const [text, setText] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim() !== "") {
      navigate(`/search?q=${encodeURIComponent(text)}&page=1`);
    }
  };

    return (
    <>
        <header className="movie-header">
            <Link to="/" className="home-container" title="Back to home">
                <svg className="home" width="20" height="20" fill="#f5c518" viewBox="0 0 547.596 547.596"><path d="M540.76,254.788L294.506,38.216c-11.475-10.098-30.064-10.098-41.386,0L6.943,254.788c-11.475,10.098-8.415,18.284,6.885,18.284h75.964v221.773c0,12.087,9.945,22.108,22.108,22.108h92.947V371.067c0-12.087,9.945-22.108,22.109-22.108h93.865c12.239,0,22.108,9.792,22.108,22.108v145.886h92.947c12.24,0,22.108-9.945,22.108-22.108v-221.85h75.965C549.021,272.995,552.081,264.886,540.76,254.788z"></path></svg>
            </Link>
            <form onSubmit={handleSubmit} className="movie-search-bar-container" role="search" aria-label="Search movies">
                <label className="sr-only" htmlFor="q">Search movies</label>
                <input value={text} onChange={(e) => setText(e.target.value)} id="q" className="search-bar" type="search" placeholder="Enter a movie name" />
            </form>
        </header>
    </>
    )
}

export default SearchBar;