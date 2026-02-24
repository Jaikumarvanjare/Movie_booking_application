const Movie = require('../models/movie.model');
/**
 * 
 * @param data -> object containing details of new movie to be created
 * @returns -> returns the new movie created
 */

const createMovie = async (data) => {
    try {
        const movie = await Movie.create(data);
        return movie;
    } catch (error) {
        if(error.name == 'ValidationError') {
            let err = {};
            Object.keys(error.errors).forEach((key) => {
                err[key] = error.errors[key].message;
            });
            console.log(err);
            return {err: err, code: 422};
        } else {
            throw error;
        }
    } 
}

/**
 * 
 * @param id -> id which will be used to identify movie to be deleted
 * @returns -> object containing details of the movie deleted
 */

const deleteMovie = async (id) => {
    try{
        const movie = await Movie.findByIdAndDelete(id);
        if(!movie) {
            return {
                err: "No movie found for the corresponding id provided",
                code: 404
            }
        }
    return movie;
    }catch(error){
        console.log(error);
            throw error;
            
    }
}

/**
 * 
 * @param id -> id which will be used to identify movie to be fetched
 * @returns -> object containing details of the movie fetched
 */

const getMoviById = async (id) => {
    const movie = await Movie.findById(id);
    if(!movie) {
        return {
            err: "No movie found for the corresponding id provided",
            code: 404
        }
    };
    return movie;
}

/**
 * 
 * @param id -> id which will be used to identify movie to be updated
 * @param data -> object containing details of movie to be updated
 * @returns -> object containing details of the movie updated
 */

const updateMovie = async (id,data) =>{
    
    try {
        const movie = await Movie.findByIdAndUpdate(id, data, {new: true, runValidators: true});
        return movie;
    } catch (error) {
        if(error.name == 'ValidationError') {
            let err = {};
            Object.keys(error.errors).forEach((key) => {
                err[key] = error.errors[key].message;
            });
            console.log(err);
            return {err: err, code: 422};
        } else {
            throw error;
        }
    }

}

/**
 * 
 * @param filter -> filter will be used to filtering out movie based on the conditions
 * @returns -> object containing all the movies fetched based on the filter condtions
 */

const fetchMovies = async (filter) => {
    let query = {};
    if(filter.name){
        query.name= filter.name;
    }
    let movies = await Movie.find(query);
    if(!movies){
        return {
            err : 'Not able to find the queries',
            code : 404
        }
    }
    return movies;
}    

module.exports = {
    createMovie,
    deleteMovie,
    getMoviById,
    updateMovie,
    fetchMovies
}