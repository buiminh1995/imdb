# app/main.py
import os
from fastapi import FastAPI, HTTPException, Query
from typing import List, Optional
from pydantic import BaseModel
from database import init_db_pool, close_db_pool, get_pool

app = FastAPI(title="Mini-IMDb API - Recent Movies")

# Pydantic response model
class Movie(BaseModel):
    tconst: str
    primary_title: Optional[str] = None
    start_year: Optional[int] = None
    runtime_minutes: Optional[int] = None
    genres: Optional[str] = None
    average_rating: Optional[float] = None
    num_votes: Optional[int] = None
    directors: Optional[str] = None
    writers: Optional[str] = None

class Person(BaseModel):
    nconst: str
    primary_name: Optional[str] = None
    birth_year: Optional[int] = None
    death_year: Optional[int] = None
    primary_profession: Optional[str] = None
    known_for_titles: Optional[str] = None
    directed: Optional[str] = None
    written: Optional[str] = None

@app.on_event("startup")
async def startup():
    await init_db_pool()

@app.on_event("shutdown")
async def shutdown():
    await close_db_pool()

@app.get("/api/main", response_model=List[Movie])
async def recent(limit: int = Query(10, ge=1, le=100)):
    """
    Return recent movies. Default limit=10.
    Adjust the WHERE clause to change what 'recent' means.
    """
    pool = await get_pool()
    # NOTE: change the WHERE clause to match your definition of recent.
    # Here we use non-null start_year and order by start_year desc (newest years first).
    sql = """
    select * from movies_info where "startYear"::int = 2025 and "averageRating" is not null and "numVotes"::int > 1000 LIMIT $1
    """
    async with pool.acquire() as conn:
        rows = await conn.fetch(sql, limit)
    # asyncpg Record is dict-like; convert to normal dicts for pydantic
    result = []
    for r in rows:
        result.append({
            "tconst": r["tconst"],
            "primary_title": r["primaryTitle"],
            "start_year": r["startYear"],
            "genres": r["genres"],
            "runtime_minutes": r["runtimeMinutes"],
            "average_rating": r["averageRating"],
            "num_votes": r["numVotes"],
            "directors": r["directors"],
            "writers": r["writers"]
        })
    return result

@app.get("/api/title/{tconst}")
async def get_title(tconst: str, response_model=Movie):
    pool = await get_pool()

    row_movie = await pool.fetchrow("""
    select * from movies_info where tconst = $1 LIMIT 1
    """, tconst)

    if not row_movie:
        raise HTTPException(status_code=404, detail="Movie not found")

    directors_nconst = row_movie["directors"].split(",") if row_movie["directors"] else []
    writers_nconst = row_movie["writers"].split(",") if row_movie["writers"] else []

    directors = []
    writers = []

    for nconst in directors_nconst:
        row_director = await pool.fetchrow("""
        select * from directors_and_writers where pid = $1 LIMIT 1
        """, nconst)
        if row_director:
            directors.append((nconst,row_director["primaryName"]))

    for nconst in writers_nconst:
        row_writer = await pool.fetchrow("""
        select * from directors_and_writers where pid = $1 LIMIT 1
        """, nconst)
        if row_writer:
            writers.append((nconst,row_writer["primaryName"]))

    result = {
        "tconst": row_movie["tconst"],
        "primary_title": row_movie["primaryTitle"],
        "start_year": row_movie["startYear"],
        "genres": row_movie["genres"],
        "runtime_minutes": row_movie["runtimeMinutes"],
        "average_rating": row_movie["averageRating"],
        "num_votes": row_movie["numVotes"],
        "directors": directors,
        "writers": writers
    }
    return result

@app.get("/api/person/{nconst}")
async def get_person(nconst: str, response_model=Person):
    pool = await get_pool()

    row_person = await pool.fetchrow("""
    select * from directors_and_writers where pid = $1 LIMIT 1
    """, nconst)

    if not row_person:
        raise HTTPException(status_code=404, detail="Person not found")

   
    directed_tconst = (
    [item.strip() for item in row_person["directed"].split(",")]
    if row_person["directed"]
    else []
)
    written_tconst = (
    [item.strip() for item in row_person["written"].split(",")]
    if row_person["written"]
    else []
)
    print(directed_tconst)
    directed = []
    written = []

    for tconst in directed_tconst:
        director_movies = await pool.fetchrow("""
        select * from movies_info where tconst = $1 LIMIT 1
        """, tconst)
        if director_movies:
            directed.append((tconst,director_movies["primaryTitle"], director_movies["averageRating"]))

    for tconst in written_tconst:
        writer_movies = await pool.fetchrow("""
        select * from movies_info where tconst = $1 LIMIT 1
        """, tconst)
        if writer_movies:
            written.append((tconst,writer_movies["primaryTitle"], writer_movies["averageRating"]))
            
    result = {
        "nconst": row_person["pid"],
        "primary_name": row_person["primaryName"],
        "birth_year": row_person["birthYear"],
        "death_year": row_person["deathYear"],
        "primary_profession": row_person["primaryProfession"],
        "known_for_titles": row_person["knownForTitles"],
        "directed": directed,
        "written": written
    }
    return result

@app.get("/api/search")
async def search(
    q: str = Query(..., min_length=1),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100)
):
    pool = await get_pool()
    
    offset = (page - 1) * page_size

    movie_rows = await pool.fetch("""
         SELECT COALESCE("averageRating", '0') AS "averageRating", *
            FROM movies_info
            WHERE "primaryTitle" ILIKE '%' || $1 || '%'
            ORDER BY similarity("primaryTitle", $1) DESC
            LIMIT $2 OFFSET $3
    """, f"%{q}%", page_size, offset)

    people_rows = await pool.fetch("""SELECT *
            FROM directors_and_writers
            WHERE "primaryName" ILIKE '%' || $1 || '%'
            ORDER BY similarity("primaryName", $1) DESC
            LIMIT $2 OFFSET $3
    """, f"%{q}%", page_size, offset)

    # OFFSET: The OFFSET clause in SQL is used to skip a specified number of rows before starting to return rows from the query result. In the context of pagination, it helps in fetching the correct subset of results for a given page. The calculation (page - 1) * page_size determines how many rows to skip based on the current page number and the number of results per page.

    total_movie_row = await pool.fetchval("""
        SELECT count(*)
            FROM movies_info
            WHERE "primaryTitle" ILIKE '%' || $1 || '%'
    """, f"%{q}%")

    total_people_row = await pool.fetchval("""
        SELECT count(*)
            FROM directors_and_writers
            WHERE "primaryName" ILIKE '%' || $1 || '%'
    """, f"%{q}%")

    return {
        "movie_results": [dict(r) for r in movie_rows],
        "people_results": [dict(r) for r in people_rows],
        "movie_total": total_movie_row,
        "people_total": total_people_row,
        "page": page,
        "page_size": page_size
    }