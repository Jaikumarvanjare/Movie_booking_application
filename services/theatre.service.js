const Theatre = require ('../models/theatre.model')
const Movie = require('../models/movie.model');
const { STATUS } = require('../utils/constants');

/**
 * 
 * @param data -> object containing details of new theatre to be created
 * @returns -> returns the new theatre created
 */

const createTheatre = async (data) => {
    try{
        const response = await Theatre.create(data);
        return response;
    }
    catch(error){
        if(error.name == 'ValidationError') {
            let err = {};
            Object.keys(error.errors).forEach((key) => {
                err[key] = error.errors[key].message;
            });
            throw {err: err, code: STATUS.UNPROCESSABLE_ENTITY};
        }
        console.log(err);
        throw error;
    }    
}

/**
 * 
 * @param id -> id which will be used to identify theatre to be deleted
 * @returns -> object containing details of the theatre deleted
 */

const deleteTheatre = async(id) => {
    try {
        const response = await Theatre.findByIdAndDelete(id);
        if(!response) {
            return {
                err: "No record of a theatre found for given id",
                code: 404
            }
        }
        return response;
    }catch(error){
        console.log(error);
        throw error;
    }
}

/**
 * 
 * @param id -> unique id by which we can fetch theatre
 */

const getTheatre= async (id) => {
    try{
        const response = await Theatre.findById(id);
        if(!response){
            return {
                err : "No theatre found for the given id",
                code: 404
            }
      
        }
        return response;
    } catch(error) {
        console.log(error);
        throw error;
    }    
}

/**
 * 
 * @param data -> the data to be used to filter out theatres based on city / pincode
 * @returns -> object containing details of the filtered theatres
 */

const getAllTheatre= async (data) => {
    try{
        let query = {};
        let pagination = {};
        if(data && data.city) {
            query.city = data.city;
        } 
        if(data && data.pincode) {
            query.pincode = data.pincode;
        }
        if(data && data.name) {
            query.name = data.name;
        }
        if(data && data.limit){
            pagination.limit = data.limit;
        }
        if(data && data.movieId){
            // let movie = await Movie.findById(data.movieId)
            query.movies = {$all : data.movieId}
        }

        if(data && data.skip){
            let perPage = (data.limit) ? data.limit :3;
            pagination.skip = data.skip*perPage;
        }
        const response = await Theatre.find(query, {}, pagination);    

        return response;
    } catch(error) {
        console.log(error);
        throw error;
    }    
}

/**
 * 
 * @param id -> id which will be used to identify theatre to be updated
 * @param data -> object containing details of theatre to be updated
 * @returns -> it returns the new updated theatre object
 */

const updateTheatre = async (id, data) => {
    try {
        const response = await Theatre.findByIdAndUpdate(id, data, {
            new: true, runValidators: true
        });
        if(!response) {
            return {
                err: "No theatre found for the given id",
                code: 404
            }
        }
        return response;
    } catch (error) {
        if(error.name == 'ValidationError') {
            let err = {};
            Object.keys(error.errors).forEach((key) => {
                err[key] = error.errors[key].message;
            });
            return {err: err, code: 422}
        }
        throw error;
    }
}


/**
 * 
 * @param theatreId -> id of the theatre for updated movies
 * @param movieId -> array of the movie  ids that are expected to be updated in theatre
 * @param insert -> boolean that tells whether insert or remove movies
 * @returns -> updated theatre object
 */

const updateMoviesInTheatre = async (theatreId, moviesIds, insert) => {
    try {
        let theatre;
        if(insert) {
            theatre = await Theatre.findByIdAndUpdate(
                theatreId,
                { $addToSet: { movies: { $each: moviesIds } } },
                { new: true }
            );
        } 
        else {
            theatre = await Theatre.findByIdAndUpdate(
                theatreId,
                { $pull: { movies: { $in: moviesIds } } },
                { new: true }
            );
        }
        if(!theatre){
            return {
                err: "No theatre found for the given id",
                code: 404
            };
        }
        return theatre.populate('movies');

    } catch(error){
        console.log(error);
        throw error;
    }
}

const getMoviesInTheatre = async (id) => {   
    try{
        const theatre = await Theatre.findById(id, {name:1, movies:1, address:1}).populate('movies');
        if(!theatre){
            return {
                err: "No theatre with given id",
                code :404
            }
        }
        return theatre;
    } catch(error){
        console.log(error);
        throw error;
    }
}

const checkMovieInATheatre = async (theatreId, movieId) => {
    try {
        let response = await Theatre.findById(theatreId);
        if(!response) {
            return {
                err: "No such theatre found for the given id",
                code: 404
            }
        }
        return response.movies.indexOf(movieId) != -1;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

module.exports = {
    createTheatre,
    deleteTheatre,
    getTheatre,
    getAllTheatre,
    updateTheatre,
    updateMoviesInTheatre,
    getMoviesInTheatre,
    checkMovieInATheatre
}
