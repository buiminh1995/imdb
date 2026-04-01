import React, { useState } from "react";
import SearchBar from "./SearchBar";
import HarryPotterPoster from "../assets/harry_potter_and_the_sorcerers_stone_2001_original_film_art_5000x.webp";
// import ChrisColumbusPoster from "../assets/chris_columbus.jpg";
import genericPersonPoster from '../assets/person-male.jpg'
import MovieCard from "./MovieCard";
import {useParams} from "react-router-dom";
import {getPerson} from "../api";
import { useEffect } from "react";

function getVisibleMovies(movies, start, count) {
  const result = [];
  if (movies.length > 0) {
    for (let i = 0; i < count; i++) {
      if (start + i >= movies.length) break;
      result.push(movies[(start + i)]);
    }
  }
  return result;
}

function PeoplePage() {

  const {pid} = useParams();
  console.log(pid)
  const [person, setPerson] = useState(null);
  const [loading, setLoading] = useState(true);

  const visibleCount = 4;
  const [directorStart, setDirectorStart] = useState(0);
  const [writerStart, setWriterStart] = useState(0);

  useEffect(() => {
      const controller = new AbortController();
  
      getPerson(pid, { signal: controller.signal })
        .then(setPerson)
        .catch((err) => {
          if (err.name !== "AbortError") console.error(err);
        })
        .finally(() => setLoading(false));
  
      return () => controller.abort();
    }, [pid]); //This means run useEffect when pid changes

  if (loading) return <div>Loading...</div>;
  if (!person) return <div>Person not found</div>;

  const visibleDirectorMovies = getVisibleMovies(person.directed, directorStart, visibleCount);
  const visibleWriterMovies = getVisibleMovies(person.written, writerStart, visibleCount);
  console.log(person.written)

  const handleDirectorPrev = () => {
    setDirectorStart(i => i - visibleCount);
  };
  const handleDirectorNext = () => {
    setDirectorStart(i => i + visibleCount);
  };
  const handleWriterPrev = () => {
    setWriterStart(i => i - visibleCount)
  };
  const handleWriterNext = () => {
    setWriterStart(i => i + visibleCount);
  };

  return (
    <div className="container container-people-page">
      <SearchBar />
      <section className="person-hero">
        <img className="person-photo" src={genericPersonPoster} alt="Generic person poster" />
        <div className="person-bio">
          <h1 className="person-name">{person.primary_name}</h1>
          {/* <p className="person-summary">Chris Columbus is an American filmmaker best known for directing beloved family films such as "Home Alone," "Mrs. Doubtfire," and the first two "Harry Potter" movies. He is also a prolific screenwriter and producer.</p> */}
          <ul className="person-facts">
            <li><strong>Born:</strong>{person.birth_year}</li>
            <li><strong>Died:</strong>{person.death_year == null ? '--' : person.death_year}</li>
            <li><strong>Known for:</strong>{person.primary_profession}</li>
          </ul>
        </div>
      </section>
      <section className="person-movies">
        <h2 className="subtitle">Filmography</h2>
        {person.directed.length > 0 &&
        <div className="carousel-section">
          <h3 className="carousel-title">Director</h3>
          <div className="carousel">
            {directorStart > 0 &&
            <button className="carousel-btn left" onClick={handleDirectorPrev}>
                <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" class="ipc-icon ipc-icon--chevron-left-inline ipc-icon--inline ipc-pager-icon" viewBox="0 0 24 24" fill="currentColor" role="presentation"><path d="M18.378 23.369c.398-.402.622-.947.622-1.516 0-.568-.224-1.113-.622-1.515l-8.249-8.34 8.25-8.34a2.16 2.16 0 0 0 .548-2.07A2.132 2.132 0 0 0 17.428.073a2.104 2.104 0 0 0-2.048.555l-9.758 9.866A2.153 2.153 0 0 0 5 12.009c0 .568.224 1.114.622 1.515l9.758 9.866c.808.817 2.17.817 2.998-.021z"></path></svg>
            </button>
            } 
            <div className="carousel-movie-list">
              {/* {visibleDirectorMovies.map((movie, idx) => (
                <div className="movie-card" key={idx}>
                  <div className="card-image">
                    <img className="small-poster-img" src={movie.img} alt={movie.alt} />
                  </div>
                  <div className="card-body">
                    <p className="title">{movie.title} <span className="movie-year">({movie.year})</span></p>
                  </div>
                </div>
              ))} */}
              {/* {person.directed.map((dirMovie, index) => (
                <MovieCard key={dirMovie[0]} tconst={dirMovie[0]} primaryTitle={dirMovie[1]} averageRating={dirMovie[2]} />
              ))} */}
              {visibleDirectorMovies.length > 0 && visibleDirectorMovies.map((dirMovie, index) => (
                <MovieCard key={dirMovie[0]} tconst={dirMovie[0]} primaryTitle={dirMovie[1]} averageRating={dirMovie[2]} />
              ))}
            </div>
            {directorStart + visibleCount < person.directed.length &&
            <button className="carousel-btn right" onClick={handleDirectorNext}>
                <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" role="presentation">
                    <path d="M5.622.631A2.153 2.153 0 0 0 5 2.147c0 .568.224 1.113.622 1.515l8.249 8.34-8.25 8.34a2.16 2.16 0 0 0-.548 2.07c.196.74.768 1.317 1.499 1.515a2.104 2.104 0 0 0 2.048-.555l9.758-9.866a2.153 2.153 0 0 0 0-3.03L8.62.61C7.812-.207 6.45-.207 5.622.63z">
                    </path>
                </svg>
            </button>
            }   
          </div>
        </div>}
        {person.written.length > 0 &&
        <div className="carousel-section">
          <h3 className="carousel-title">Writer</h3>
          <div className="carousel">
            {writerStart > 0 &&
            <button className="carousel-btn left" onClick={handleWriterPrev}>
                <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" class="ipc-icon ipc-icon--chevron-left-inline ipc-icon--inline ipc-pager-icon" viewBox="0 0 24 24" fill="currentColor" role="presentation"><path d="M18.378 23.369c.398-.402.622-.947.622-1.516 0-.568-.224-1.113-.622-1.515l-8.249-8.34 8.25-8.34a2.16 2.16 0 0 0 .548-2.07A2.132 2.132 0 0 0 17.428.073a2.104 2.104 0 0 0-2.048.555l-9.758 9.866A2.153 2.153 0 0 0 5 12.009c0 .568.224 1.114.622 1.515l9.758 9.866c.808.817 2.17.817 2.998-.021z"></path></svg>
            </button>
            }
            <div className="carousel-movie-list">
              {/* {visibleWriterMovies.map((movie, idx) => (
                <div className="movie-card" key={idx}>
                  <div className="card-image">
                    <img src={movie.img} alt={movie.alt} />
                  </div>
                  <div className="card-body">
                    <p className="title">{movie.title} <span className="movie-year">({movie.year})</span></p>
                  </div>
                </div>
              ))} */}
              {visibleWriterMovies.length > 0 && visibleWriterMovies.map((wirMovie, index) => (
                <MovieCard key={wirMovie[0]} tconst={wirMovie[0]} primaryTitle={wirMovie[1]} averageRating={wirMovie[2]} />
              ))}
            </div>
            {writerStart + visibleCount < person.written.length &&
            <button className="carousel-btn right" onClick={handleWriterNext}>
                <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" role="presentation">
                    <path d="M5.622.631A2.153 2.153 0 0 0 5 2.147c0 .568.224 1.113.622 1.515l8.249 8.34-8.25 8.34a2.16 2.16 0 0 0-.548 2.07c.196.74.768 1.317 1.499 1.515a2.104 2.104 0 0 0 2.048-.555l9.758-9.866a2.153 2.153 0 0 0 0-3.03L8.62.61C7.812-.207 6.45-.207 5.622.63z">
                    </path>
                </svg>
            </button>
            }
          </div>
        </div>}
      </section>
    </div>
  );
}

export default PeoplePage;