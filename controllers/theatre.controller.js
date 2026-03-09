const theatreService = require('../services/theatre.service');
const {successResponseBody, errorResponseBody} = require('../utils/responsebody');
const { STATUS } = require('../utils/constants');
/**
 * Controller function to create a new theatre
 * @returns theatre created
 */

const createTheatre = async (req, res) => {
    try {
        const response = await theatreService.createTheatre(req.body);
        successResponseBody.data = response;
        successResponseBody.message = "Successfully created the theatre";
        return res.status(STATUS.CREATED).json(successResponseBody);
    }
    catch(error){
        if(error.err){
            errorResponseBody.err = error.err;
            errorResponseBody.message = "Something went wrong, not created the theatre";
            return res.status(error.code).json(errorResponseBody);
        }
        errorResponseBody.err = error;
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
}
/**
 * Controller function to delete theatre
 * @returns theatre delete
 */

const deleteTheatre = async (req, res) => {
    try {
        const response = await theatreService.deleteTheatre(req.params.id);
        successResponseBody.data = response;
        successResponseBody.message = "Successfully deleted the given theatre";
        return res.status(STATUS.OK).json(successResponseBody);
    }
    catch(error){
        if(error.err){
            errorResponseBody.err = error.err;
            return res.status(error.code).json(errorResponseBody);
        }
        errorResponseBody.err=error;
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
        
    }
}

/**
 * Controller function to fetch a theatre
 * @returns theatre fetched
 */

const getTheatre = async (req, res) => {
    try {
        const response = await theatreService.getTheatre(req.params.id);
        successResponseBody.data = response;
        successResponseBody.message = "Successfully created the theatre";
        return res.status(STATUS.OK).json(successResponseBody);
    }
    catch(error){
        if(error.err) {
           errorResponseBody.err = error.err;
           return res.status(error.code).json(errorResponseBody);
       }
        errorResponseBody.data = response;
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
        
    }
}

/**
 * Controller function to fetch theatres
 * @returns theatres fetched
 */

const getTheatres = async (req, res) => {
    try {
        const response = await theatreService.getAllTheatre(req.query);
        successResponseBody.data = response;
        successResponseBody.message = "Successfully fetched all the theatres";
        return res.status(STATUS.OK).json(errorResponseBody);
    }
    catch(error){
        errorResponseBody.err = error;
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
        
    }
}

/**
 * Controller function to update a new theatre
 * @returns theatre updated
 */

const updateTheatre = async (req, res) => {
    try {
        const response = await theatreService.updateTheatre(req.params.id, req.body);
        successResponseBody.data = response;
        successResponseBody.message = "Successfully updated the theatre";
        return res.status(STATUS.OK).json(successResponseBody);
    } catch (error) {
        console.log(error);
        if(error.err) {
            errorResponseBody.err = error.err;
            return res.status(error.code).json(errorResponseBody);
        }
        errorResponseBody.err = error;
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
}

const updateMovies = async (req, res) => {
    try {
        const response = await theatreService.updateMoviesInTheatres(
            req.params.id,
            req.body.movieIds,
            req.body.insert
        );
        successResponseBody.data = response;
        successResponseBody.message = "Successfully updated movies in the theatre";
        return res.status(STATUS.OK).json(successResponseBody);
    } catch (error) {
        if(error.err) {
            errorResponseBody.err = error.err;
            return res.status(error.code).json(errorResponseBody);
        }
        errorResponseBody.err = error;
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
}

const getMovies = async (req, res) => {
    try {
        const response = await theatreService.getMoviesInATheatre(req.params.id);
        successResponseBody.data = response;
        successResponseBody.message = "Successfully fetched the movies for the theatre";
        return res.status(STATUS.OK).json(successResponseBody);
    } catch (error) {
        if(error.err) {
            errorResponseBody.err = error.err;
            return res.status(error.code).json(errorResponseBody);
        }
        errorResponseBody.err = error;
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
}

const checkMovie = async (req, res) => {
    try {
        const response = await theatreService.checkMovieInATheatre(req.params.theatreId, req.params.movieId);
        successResponseBody.data = response;
        successResponseBody.message = "Successfully checked if movie is present in the theatre";
        return res.status(STATUS.OK).json(successResponseBody);
    } catch (error) {
        if(error.err) {
            errorResponseBody.err = error.err;
            return res.status(error.code).json(errorResponseBody);
        }
        errorResponseBody.err = error;
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
}
module.exports = {
    createTheatre,
    deleteTheatre,
    getTheatre,
    getTheatres,
    updateTheatre,
    updateMovies,
    getMovies,
    checkMovie
}; 