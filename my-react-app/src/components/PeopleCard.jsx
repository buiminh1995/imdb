import { Link } from 'react-router-dom';
// import harryPotterPoster from '../assets/harry_potter_and_the_sorcerers_stone_2001_original_film_art_5000x.webp';
import genericPersonPoster from '../assets/person-male.jpg'

function PeopleCard(props) {
    return (
        <article className="movie-card">
            <Link to={`/title/${props.tconst}`}>
                <div className="card-image">
                    <img src={genericPersonPoster} alt="generic person poster" />
                </div>
            </Link>
            <div className="card-body">
                <Link to={`/title/${props.tconst}`} className="title">
                    {props.primaryName}
                </Link>
                <div className="rating-row">
                    <span className="rating-label">{props.primaryProfession}</span>
                    {/* <div className="star-and-score">
                        <svg color="rgb(245, 197, 24)" width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" role="img" aria-hidden="true"><path d="M12 20.1l5.82 3.682c1.066.675 2.37-.322 2.09-1.584l-1.543-6.926 5.146-4.667c.94-.85.435-2.465-.799-2.567l-6.773-.602L13.29.89a1.38 1.38 0 0 0-2.581 0l-2.65 6.53-6.774.602C.052 8.126-.453 9.74.486 10.59l5.147 4.666-1.542 6.926c-.28 1.262 1.023 2.26 2.09 1.585L12 20.099z"></path></svg>
                        <span className="score">{props.knownFor}</span>
                    </div> */}
                </div>
            </div>
        </article>
    )
}

export default PeopleCard;