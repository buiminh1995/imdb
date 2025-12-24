import genericMoviePoster from '../assets/cinema-icons_23-2147514035.avif'
import SearchBar from './SearchBar';
import { useParams } from "react-router-dom";
import { Link } from 'react-router-dom';
import { getTitle } from "../api";
import { useState, useEffect } from "react";

function MoviePage() {
  const {tconst} = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    getTitle(tconst, { signal: controller.signal })
      .then(setMovie)
      .catch((err) => {
        if (err.name !== "AbortError") console.error(err);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [tconst]); //This means run useEffect when tconst changes

  if (loading) return <div>Loading...</div>;
  if (!movie) return <div>Movie not found</div>;

    return (
    <div className="container container-movie-page">
      <SearchBar />
      <div className="movie-card-detail">
        <h1 className="movie-title">{movie.primary_title}</h1>
        <section className="movie-info">
          <div className="movie-poster">
            <img src={genericMoviePoster} alt="Generic movie poster" />
          </div>
          <div className="movie-details">
            <ul className="meta-list">
              <li><strong>Year:</strong> {movie.start_year}</li>
              <li><strong>Runtime:</strong> {movie.runtime_minutes} min</li>
              <li><strong>Genre:</strong> {movie.genres}</li>
            </ul>
            <div className="rating-badges">
              <div className="badge">IMDb: <span className="badge-value">{movie.average_rating}</span></div>
              <div className="badge badge-ml">Predicted (ML): <span className="badge-value">--</span></div>
              <div className="badge badge-ml">Predicted (algorithm): <span className="badge-value">--</span></div>
            </div>
            <div className="synopsis">
              <h3>Synopsis</h3>
              <p>
                  Not available              
              </p>
            </div>
            <div className="credits-info">
              <h4>Credits</h4>
                <div>
                    Director:
                    {movie.directors.map((director, index) => (
                        <Link key={index} to={`/people-page/${director[0]}`} style={{textDecoration: 'none'}}>
                          <span style={{color: '#5799ef'}}>
                            {' '}
                            {director[1]}
                            {index !== movie.directors.length - 1 && " •"}
                          </span>
                        </Link>
                    ))}
                </div>              
                <div>Writers:
                  {movie.writers.map((writer, index) => (
                        <Link key={index} to={`/people-page/${writer[0]}`} style={{textDecoration: 'none'}}>
                          <span style={{color: '#5799ef'}}>
                            {'  '}
                            {writer[1]}
                            {index !== movie.writers.length - 1 && " •"}
                          </span>
                        </Link>
                    ))}
                </div>
            </div>
            <div className="actions">
              <button className="btn btn-primary" id="ml-btn" type="button">Machine Learning</button>
              <button className="btn" id="algo-btn" type="button">Algorithm</button>
            </div>
            <div className="explanation-section">
              <div id="ml-explanation">
                <h3>Machine Learning Prediction</h3>
                <p>The machine learning model is trained on thousands of movies using features like cast, crew, genre, budget, and more. It uses regression to predict the IMDb rating based on patterns learned from historical data.</p>
                <ul>
                  <li>Features: Cast, Director, Genre, Budget, Release Date, etc.</li>
                  <li>Model: Linear Regression (or your actual model)</li>
                  <li>Output: Predicted IMDb rating (0-10 scale)</li>
                </ul>
              </div>
              <div id="algo-explanation" style={{display:'none'}}>
                <h3>Algorithmic Prediction</h3>
                <p>This method uses a hand-crafted formula based on domain knowledge. Each feature (e.g., director, cast, genre) is assigned a weight, and the sum is normalized to produce a predicted rating.</p>
                {/* <!-- <pre className="math-block">Predicted Rating = 0.4 × Director Score + 0.3 × Cast Score + 0.2 × Genre Score + 0.1 × Budget Score</pre> --> */}
                <p>The weights reflect the relative importance of each factor in determining a movie's success.</p>
              </div>
            </div>
            {/* <script>
              const mlBtn = document.getElementById('ml-btn');
              const algoBtn = document.getElementById('algo-btn');
              const mlExp = document.getElementById('ml-explanation');
              const algoExp = document.getElementById('algo-explanation');
              mlBtn.addEventListener('click', () => {
                mlExp.style.display = 'block';
                algoExp.style.display = 'none';
                mlBtn.classList.add('btn-primary');
                algoBtn.classList.remove('btn-primary');
              });
              algoBtn.addEventListener('click', () => {
                mlExp.style.display = 'none';
                algoExp.style.display = 'block';
                algoBtn.classList.add('btn-primary');
                mlBtn.classList.remove('btn-primary');
              });
            </script> */}
          </div>
        </section>
      </div>
    </div>
    )
}

export default MoviePage