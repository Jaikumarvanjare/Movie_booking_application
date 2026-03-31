const theatreService = require('../services/theatre.service');
const { createSuccessResponseBody, createErrorResponseBody } = require('../utils/responsebody');
const { STATUS } = require('../utils/constants');
const sendMail = require('../services/email.service');

const createTheatre = async (req, res) => {
    const successResponseBody = createSuccessResponseBody();
    const errorResponseBody = createErrorResponseBody();

    try {
        const response = await theatreService.createTheatre({ ...req.body, owner: req.user });
        successResponseBody.data = response;
        successResponseBody.message = "Successfully created the theatre";

        try {
            await sendMail(
                'Successfully created a theatre',
                req.user,
                'You have successsfully created a new theatre'
            );
        } catch (e) {
            console.log('Mail error:', e.message);
        }

        return res.status(STATUS.CREATED).json(successResponseBody);
    } catch (error) {
        errorResponseBody.err = error.err || error;
        errorResponseBody.message = "Something went wrong, not created the theatre";
        return res.status(error.code || STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
};

const deleteTheatre = async (req, res) => {
    const successResponseBody = createSuccessResponseBody();
    const errorResponseBody = createErrorResponseBody();

    try {
        const response = await theatreService.deleteTheatre(req.params.id);
        successResponseBody.data = response;
        successResponseBody.message = "Successfully deleted the given theatre";
        return res.status(STATUS.OK).json(successResponseBody);
    } catch (error) {
        errorResponseBody.err = error.err || error;
        return res.status(error.code || STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
};

const getTheatre = async (req, res) => {
    const successResponseBody = createSuccessResponseBody();
    const errorResponseBody = createErrorResponseBody();

    try {
        const response = await theatreService.getTheatre(req.params.id);
        successResponseBody.data = response;
        successResponseBody.message = "Successfully fetched the theatre";
        return res.status(STATUS.OK).json(successResponseBody);
    } catch (error) {
        errorResponseBody.err = error.err || error;
        return res.status(error.code || STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
};

const getTheatres = async (req, res) => {
    const successResponseBody = createSuccessResponseBody();
    const errorResponseBody = createErrorResponseBody();

    try {
        const response = await theatreService.getAllTheatre(req.query);
        successResponseBody.data = response;
        successResponseBody.message = "Successfully fetched all the theatres";
        return res.status(STATUS.OK).json(successResponseBody);
    } catch (error) {
        errorResponseBody.err = error.err || error;
        return res.status(error.code || STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
};

const updateTheatre = async (req, res) => {
    const successResponseBody = createSuccessResponseBody();
    const errorResponseBody = createErrorResponseBody();

    try {
        const response = await theatreService.updateTheatre(req.params.id, req.body);
        successResponseBody.data = response;
        successResponseBody.message = "Successfully updated the theatre";
        return res.status(STATUS.OK).json(successResponseBody);
    } catch (error) {
        errorResponseBody.err = error.err || error;
        return res.status(error.code || STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
};

const updateMovies = async (req, res) => {
    const successResponseBody = createSuccessResponseBody();
    const errorResponseBody = createErrorResponseBody();

    try {
        const response = await theatreService.updateMoviesInTheatre(
            req.params.id,
            req.body.movieIds,
            req.body.insert
        );
        successResponseBody.data = response;
        successResponseBody.message = "Successfully updated movies in the theatre";
        return res.status(STATUS.OK).json(successResponseBody);
    } catch (error) {
        errorResponseBody.err = error.err || error;
        return res.status(error.code || STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
};

const getMovies = async (req, res) => {
    const successResponseBody = createSuccessResponseBody();
    const errorResponseBody = createErrorResponseBody();

    try {
        const response = await theatreService.getMoviesInTheatre(req.params.id);
        successResponseBody.data = response;
        successResponseBody.message = "Successfully fetched the movies for the theatre";
        return res.status(STATUS.OK).json(successResponseBody);
    } catch (error) {
        errorResponseBody.err = error.err || error;
        return res.status(error.code || STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
};

const checkMovie = async (req, res) => {
    const successResponseBody = createSuccessResponseBody();
    const errorResponseBody = createErrorResponseBody();

    try {
        const response = await theatreService.checkMovieInATheatre(req.params.theatreId, req.params.movieId);
        successResponseBody.data = response;
        successResponseBody.message = "Successfully checked if movie is present in the theatre";
        return res.status(STATUS.OK).json(successResponseBody);
    } catch (error) {
        errorResponseBody.err = error.err || error;
        return res.status(error.code || STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
};

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