const badRequestResponse = {
    success: false,
    err: '',
    data: {},
    message: "Malformed Request | Bad Request",
};

const { STATUS } = require('../utils/constants');

const validateMovieCreateRequest = (req, res, next) => {
    if (!req.body.name) {
        badRequestResponse.err = "The name of the movie is not present in the request sent";
        return res.status(STATUS.BAD_REQUEST).json(badRequestResponse);
    }

    if (!req.body.description) {
        badRequestResponse.err = "The description of the movie is not present in the request sent";
        return res.status(STATUS.BAD_REQUEST).json(badRequestResponse);
    }

    if (!req.body.casts || !Array.isArray(req.body.casts) || req.body.casts.length <= 0) {
        badRequestResponse.err = "The casts of the movie is not present in the request sent";
        return res.status(STATUS.BAD_REQUEST).json(badRequestResponse);
    }

    if (!req.body.trailerUrl) {
        badRequestResponse.err = "The trailer url of the movie is not present in the request sent";
        return res.status(STATUS.BAD_REQUEST).json(badRequestResponse);
    }

    if (!req.body.releaseDate) {
        badRequestResponse.err = "The release date of the movie is not present in the request sent";
        return res.status(STATUS.BAD_REQUEST).json(badRequestResponse);
    }

    if (isNaN(new Date(req.body.releaseDate).getTime())) {
        badRequestResponse.err = "The release date of the movie must be a valid date";
        return res.status(STATUS.BAD_REQUEST).json(badRequestResponse);
    }

    if (!req.body.director) {
        badRequestResponse.err = "The director of the movie is not present in the request sent";
        return res.status(STATUS.BAD_REQUEST).json(badRequestResponse);
    }

    if (!req.body.language) {
        badRequestResponse.err = "The language of the movie is not present in the request sent";
        return res.status(STATUS.BAD_REQUEST).json(badRequestResponse);
    }

    if (!req.body.poster) {
        badRequestResponse.err = "The poster of the movie is not present in the request sent";
        return res.status(STATUS.BAD_REQUEST).json(badRequestResponse);
    }

    next();
};

module.exports = {
    validateMovieCreateRequest
};