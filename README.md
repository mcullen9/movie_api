# Movie API
    This is a RESTful API built with Node.js and Express, which provides information about movies, genres, and directors.

## Link to Project
    Website: https://myfaveflix.onrender.com
    GitHub: https://github.com/mcullen9/movie_api.git

## Features
    - Create a user
    - Update user info
    - Get all movies
    - Get a single movie by title
    - Get a genre by name
    - Get a director by name
    - Add a movie to list of favorite movies
    - Remove a movie from list of favorite movies
    - Deregister account
 
## Dependencies
    This project uses the following dependencies:

    - bcrypt: ^5.1.1
    - body-parser: ^1.20.2
    - cors: ^2.8.5
    - express: ^4.18.2
    - express-validator: ^7.0.1
    - jsonwebtoken: ^9.0.2
    - lodash: ^4.17.21
    - mongoose: ^8.1.1
    - morgan: ^1.10.0
    - passport: ^0.7.0
    - passport-jwt: ^4.0.1
    - passport-local: ^1.0.0
    - uuid: ^9.0.1

## API Endpoints
    - `POST /users`: Allow new users to register
    - `PUT /users/:Username`: Allow users to update user info
    - `GET /movies`: Returns all movies
    - `GET /movies/:Title`: Returns a single movie by title
    - `GET /movies/genres/:genreName`: Returns a genre by name
    - `GET /movies/directors/:directorName`: Returns a director by name
    - `POST /users/:Username/movies/:MovieID`: Allow users to add movie to list of favorites
    - `DELETE /users/:Username/movies/:MovieID`: Allow users to remove movie from list of favorites
    - `DELETE /users/:Username`: Allow users to deregister

## Authentication
    This API uses Basic HTTP and JWT authentication. All endpoints require a valid JWT token in the `Authorization` header.

