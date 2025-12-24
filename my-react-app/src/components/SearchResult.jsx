import SearchBar from "./SearchBar";
import MovieCard from "./MovieCard";
import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {search} from "../api";
import PeopleCard from "./PeopleCard";
function SearchResult () {
    //FOR LATER USE:

    // if (!results || results.length === 0) {
    //     return (
    //     <div className="search-results">
    //         <p>No results found for "{query}".</p>
    //     </div>
    //     );
    // }

    const [searchParams] = useSearchParams();
    const q = searchParams.get("q");
    const page = Number(searchParams.get("page") || 1);

    const [currOption, setCurrOption] = useState('movies')
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

    const controller = new AbortController();
    search({
      q,
      page,
      signal: controller.signal
    })
      .then(setData)
      .catch(err => {
        if (err.name !== "AbortError") console.error(err);
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [q, page]);



  if (loading) return <div>Loading...</div>;
  if (!data) return <div>No results</div>;
  console.log(data.movie_results.length > 0)

    return (
    <div className="container">
        <SearchBar />
        <div className="search-results">
            <h3 style={{fontSize: '1.2em'}}>{parseInt(data.movie_total) + parseInt(data.people_total)} result(s) for "{q}"</h3>
        </div>
        <div className="search-results-nav">
            {data.movie_results.length > 0 && (
                <div className={`search-results-nav-btn ${currOption == 'movies' ? 'active' : ''}`} onClick={() => setCurrOption('movies')} style={{cursor: 'pointer'}}>
                    Movies
                </div>
            )}
            {data.people_results.length > 0 && (
                <div className={`search-results-nav-btn ${currOption == 'people' ? 'active': ''}`} onClick={() => setCurrOption('people')} style={{cursor: 'pointer'}}>
                    People
                </div>
            )}
        </div>
        <main>
            <section aria-labelledby="upcoming">
                {/* <h2 id="upcoming" className="subtitle">Movies not yet released (no IMDb ratings)</h2> */}
                <div className="row">
                    {currOption == 'movies' && data.movie_results.map((m) => (
                        <MovieCard key={m.tconst} tconst = {m.tconst} primaryTitle = {m.primaryTitle} averageRating = {m.averageRating}/>
                    ))}
                    {currOption == 'people' && data.people_results.map((p) => (
                        <PeopleCard key={p.pid} pid = {p.pid} primaryName = {p.primaryName} primaryProfession = {p.primaryProfession}/>
                    ))}
                </div>
            </section>
            <div className="search-results-nav-arrow-container" style={{ marginTop: 20 }}>
                {page > 1 && (
                <Link className="search-results-nav-arrow" to={`/search?q=${encodeURIComponent(q)}&page=${page - 1}`}>
                    &#8592;
                </Link>
                )}
                {currOption == 'movies' && 
                <div className='search-results-page-number'> Page {page}{" "}/{" "}{parseInt(data.movie_total)%20 == 0 ? parseInt(data.movie_total)/20 : parseInt(parseInt(data.movie_total)/20) + 1}</div>
                }
                {currOption == 'people' && 
                <div className='search-results-page-number'> Page {page}{" "}/{" "}{parseInt(data.people_total)%20 == 0 ? parseInt(data.people_total)/20 : parseInt(parseInt(data.people_total)/20) + 1}</div>
                }
                {currOption == 'movies' && page * data.page_size < data.movie_total && (
                <Link className="search-results-nav-arrow" to={`/search?q=${encodeURIComponent(q)}&page=${page + 1}`}>
                    &#8594;
                </Link>
                )}
                {currOption == 'people' && page * data.page_size < data.people_total && (
                <Link className="search-results-nav-arrow" to={`/search?q=${encodeURIComponent(q)}&page=${page + 1}`}>
                    &#8594;
                </Link>
                )}
            </div>
            {/* <ul class="pagination">
                <li><a href="#">&laquo;</a></li>
                <li><a href="#" class="active">1</a></li>
                <li><a href="#">2</a></li>
                <li><a href="#">3</a></li>
                <li><a href="#">4</a></li>
                <li><a href="#">5</a></li>
                <li><a href="#">&raquo;</a></li>
            </ul> */}
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

export default SearchResult;
