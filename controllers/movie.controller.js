const movieService = require('../services/movie.service');
const {successResponseBody, errorResponseBody} = require('../utils/responsebody');

/**
 * Common Response Bodies
 */

const createMovie = async (req, res) => {
    try {
        const movie = await movieService.createMovie(req.body);

        successResponseBody.data = movie;
        successResponseBody.message = "Successfully created a new movie";

        return res.status(201).json(successResponseBody);
    }
    catch (err) {
        console.log(err);

        errorResponseBody.err = err;

        return res.status(400).json(errorResponseBody);
    }
};

const deleteMovie = async (req, res) => {
    try {
        const response = await movieService.deleteMovie(req.params.id);

        if (!response) {
            errorResponseBody.message = "Movie not found";

            return res.status(404).json(errorResponseBody);
        }

        successResponseBody.data = response;
        successResponseBody.message = "Successfully deleted the movie";

        return res.status(200).json(successResponseBody);
    }
    catch (err) {
        console.log(err);

        errorResponseBody.err = err;

        return res.status(500).json(errorResponseBody);
    }
};

const getMovie = async (req, res) => {
    try {
        const response = await movieService.findById(req.params.id);

        if (!response) {
            errorResponseBody.message = "Movie not found";

            return res.status(404).json(errorResponseBody);
        }

        successResponseBody.data = response;
        successResponseBody.message = "Successfully fetched movie";

        return res.status(200).json(successResponseBody);
    }
    catch (err) {
        console.log(err);

        errorResponseBody.err = err;

        return res.status(500).json(errorResponseBody);
    }
};

module.exports = {
    createMovie,
    deleteMovie,
    getMovie
};
