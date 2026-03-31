const movieService = require('../services/movie.service');
const { createSuccessResponseBody, createErrorResponseBody } = require('../utils/responsebody');
const { STATUS } = require('../utils/constants');

const createMovie = async (req, res) => {
    const successResponseBody = createSuccessResponseBody();
    const errorResponseBody = createErrorResponseBody();

    try {
        const response = await movieService.createMovie(req.body);
        successResponseBody.data = response;
        successResponseBody.message = "Successfully created the movie";
        return res.status(STATUS.CREATED).json(successResponseBody);
    } catch (error) {
        errorResponseBody.err = error.err || error;
        return res.status(error.code || STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
};

const deleteMovie = async (req, res) => {
    const successResponseBody = createSuccessResponseBody();
    const errorResponseBody = createErrorResponseBody();

    try {
        const response = await movieService.deleteMovie(req.params.id);
        successResponseBody.data = response;
        successResponseBody.message = "Successfully deleted the movie";
        return res.status(STATUS.OK).json(successResponseBody);
    } catch (error) {
        errorResponseBody.err = error.err || error;
        return res.status(error.code || STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
};

const getMovie = async (req, res) => {
    const successResponseBody = createSuccessResponseBody();
    const errorResponseBody = createErrorResponseBody();

    try {
        const response = await movieService.getMoviById(req.params.id);
        successResponseBody.data = response;
        return res.status(STATUS.OK).json(successResponseBody);
    } catch (error) {
        errorResponseBody.err = error.err || error;
        return res.status(error.code || STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
};

const updateMovie = async (req, res) => {
    const successResponseBody = createSuccessResponseBody();
    const errorResponseBody = createErrorResponseBody();

    try {
        const response = await movieService.updateMovie(req.params.id, req.body);
        successResponseBody.data = response;
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
        const response = await movieService.fetchMovies(req.query);
        successResponseBody.data = response;
        return res.status(STATUS.OK).json(successResponseBody);
    } catch (error) {
        errorResponseBody.err = error.err || error;
        return res.status(error.code || STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
};

module.exports = {
    createMovie,
    deleteMovie,
    getMovie,
    updateMovie,
    getMovies
};