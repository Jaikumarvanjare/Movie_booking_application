const Movie = require('../models/movie.model');

const getMovieById = async(id) =>{
    const movie = Movie.findById(id);
    console.log(movie);
    if(!movie){
        return {
            err : "No movie found for corresponding id provided",
            code : 404,
        }
    };
    return Movie;
}

module.exports= {
    getMovieById
} 