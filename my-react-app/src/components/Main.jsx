import SearchBar from "./SearchBar";
import MovieCard from "./MovieCard";
import { getRecentMovies } from "../api";
import { useState, useEffect } from "react";


function Main () {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
    const controller = new AbortController();

    getRecentMovies({ limit: 8, signal: controller.signal })
      .then((data) => {
        console.log("DATA IN COMPONENT:", data);
        setMovies(data);
        })
      .catch((err) => {
        if (err.name !== "AbortError") console.error(err);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  if (loading) return <div>Loading...</div>;

    return (
    <div className="container">
       <header className="site-header">
            <h1 className="website-title">Predicting Upcoming Movies' IMDb Ratings</h1>
        </header>
        <SearchBar />
        <main>
            <section aria-labelledby="upcoming">
                {/* <h2 id="upcoming" className="subtitle">Movies not yet released (no IMDb ratings)</h2> */}
                <div className="row">
                    {movies.map((m) => (
                        <MovieCard key={m.tconst} tconst = {m.tconst} primaryTitle = {m.primary_title} averageRating = {m.average_rating}/>
                    ))}
                </div>
            </section>
            {/* <section aria-labelledby="released">
                <h2 id="released" className="subtitle">Movies already released (with IMDb ratings)</h2>
                <div className="row">
                  <MovieCard />
                  <MovieCard />
                  <MovieCard />
                  <MovieCard /> 
                </div>
            </section> */}
        </main>
    </div>
    )
}

export default Main;
