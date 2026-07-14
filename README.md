
# IMDb Explorer

A full-stack web application for browsing IMDb movie and people data. The application imports official IMDb datasets into PostgreSQL and provides a responsive interface for searching movies, actors, directors, and writers.

The project demonstrates building and deploying a production-style web application using React, FastAPI, PostgreSQL, Docker, and Nginx.

## Features

* Search movies by title
* Search people (actors, directors, writers)
* View movie details
* PostgreSQL full-text search for fast searching
* REST API built with FastAPI
* Dockerized deployment
* Production deployment on Oracle Cloud

## Tech Stack

### Frontend

* React
* Vite
* React Router

### Backend

* Python
* FastAPI
* SQLAlchemy

### Database

* PostgreSQL

### DevOps

* Docker
* Docker Compose
* Nginx
* Oracle Cloud Infrastructure (OCI)

## Architecture

```
Browser
    │
    ▼
Nginx
 ├── React Frontend
 └── FastAPI Backend
          │
          ▼
     PostgreSQL
```

## Dataset

This project uses the public IMDb datasets.

Data imported includes:

* Movies
* Ratings
* Actors
* Directors
* Writers

The database contains over **1 million records** across multiple tables.

## Screenshots

<img width="1512" height="824" alt="Screenshot 2026-07-14 at 16 40 42" src="https://github.com/user-attachments/assets/8594c2c3-22b8-412e-b564-c32a79f9c80f" />

## Project Structure

```
frontend/
    src/
backend/
    app/
database/
docker-compose.yml
README.md
```

## Deployment

The application is deployed on an Oracle Cloud virtual machine using Docker Compose.

Deployment stack:

* Docker containers
* Nginx reverse proxy
* FastAPI backend
* React static frontend
* PostgreSQL database

## Future Improvements

* User authentication
* Personalized watchlists
* IMDb rating prediction for unreleased movies
* Advanced filtering
* Pagination improvements
* Elasticsearch/Meilisearch integration
