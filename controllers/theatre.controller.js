const theatreService = require('../services/theatre.service');
const {successResponseBody, errorResponseBody} = require('../utils/responsebody');

/**
 * Controller function to create a new theatre
 * @returns theatre created
 */

const createTheatre = async (req, res) => {
    try {
        const response = await theatreService.createTheatre(req.body);
         if(response.err) {
            errorResponseBody.err = response.err;
            errorResponseBody.message = "Validation failed on few parameters of the request body"
            return res.status(response.code).json(errorResponseBody);
        }
        successResponseBody.data = response;
        successResponseBody.message = "Successfully created the theatre";
        return res.status(201).json(successResponseBody);
    }
    catch(error){
        errorResponseBody.data = response;
        errorResponseBody.message = "Something went wrong, not created the theatre";
        return res.status(500).json(errorResponseBody);
        
    }
}

/**
 * Controller function to delete theatre
 * @returns theatre delete
 */

const deleteTheatre = async (req, res) => {
    try {
        const response = await theatreService.deleteTheatre(req.params.id);
         if(response.err) {
            errorResponseBody.err = response.err;
            return res.status(response.code).json(errorResponseBody);
        }
        successResponseBody.data = response;
        successResponseBody.message = "Successfully deleted the given theatre";
        return res.status(200).json(successResponseBody);
    }
    catch(error){
        errorResponseBody.data = response;
        errorResponseBody.message = "Something went wrong, not deleted the theatre";
        return res.status(500).json(errorResponseBody);
        
    }
}

/**
 * Controller function to fetch a theatre
 * @returns theatre fetched
 */

const getTheatre = async (req, res) => {
    try {
        const response = await theatreService.getTheatre(req.params.id);
         if(response.err) {
            errorResponseBody.err = response.err;
            return res.status(response.code).json(errorResponseBody);
        }
        successResponseBody.data = response;
        successResponseBody.message = "Successfully created the theatre";
        return res.status(200).json(successResponseBody);
    }
    catch(error){
        errorResponseBody.data = response;
        errorResponseBody.message = "Something went wrong, not created the theatre";
        return res.status(500).json(errorResponseBody);
        
    }
}

/**
 * Controller function to fetch theatres
 * @returns theatres fetched
 */

const getTheatres = async (req, res) => {
    try {
        const response = await theatreService.getAllTheatre(req.query);
         if(response.err) {
            errorResponseBody.err = response.err;
            return res.status(response.code).json(errorResponseBody);
        }
        successResponseBody.data = response;
        successResponseBody.message = "Successfully created the theatre";
        return res.status(200).json(successResponseBody);
    }
    catch(error){
        errorResponseBody.data = response;
        errorResponseBody.message = "Something went wrong, not created the theatre";
        return res.status(500).json(errorResponseBody);
        
    }
}

/**
 * Controller function to update a new theatre
 * @returns theatre updated
 */

const updateTheatre = async (req, res) => {
    try {
        const response = await theatreService.updateTheatre(req.params.id, req.body);
        if(response.err) {
            errorResponseBody.err = response.err;
            return res.status(response.code).json(errorResponseBody);
        }
        successResponseBody.data = response;
        successResponseBody.message = "Successfully updated the theatre";
        return res.status(200).json(successResponseBody);
    } catch (error) {
        console.log(error);
        errorResponseBody.err = error;
        return res.status(500).json(errorResponseBody);
    }
}

const updateMovies= async (req, res) => {
    try {
        const response = await theatreService.updateMoviesInTheatre(req.params.id, req.body.movieIds,req.body.insert);
        if(response.err) {
            errorResponseBody.err = response.err;
            return res.status(response.code).json(errorResponseBody);
        }
        successResponseBody.data = response;
        successResponseBody.message = "Successfully updated movies in the theatre";
        return res.status(200).json(successResponseBody);
    } catch (error) {
        console.log(error);
        errorResponseBody.err = error;
        return res.status(500).json(errorResponseBody);
    }
}

module.exports = {
    createTheatre,
    deleteTheatre,
    getTheatre,
    getTheatres,
    updateTheatre,
    updateMovies
}; 