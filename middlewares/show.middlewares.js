const { STATUS } = require('../utils/constants');
const { createErrorResponseBody } = require('../utils/responsebody');

const isValidObjectId = (id) => typeof id === 'string' && /^[a-f\d]{24}$/i.test(id);

const validateCreateShowRequest = async (req, res, next) => {
    const errorResponseBody = createErrorResponseBody();

    if (!req.body.theatreId) {
        errorResponseBody.err = "No theatre provided";
        return res.status(STATUS.BAD_REQUEST).json(errorResponseBody);
    }
    if (!isValidObjectId(req.body.theatreId)) {
        errorResponseBody.err = "Invalid theatre id";
        return res.status(STATUS.BAD_REQUEST).json(errorResponseBody);
    }

    if (!req.body.movieId) {
        errorResponseBody.err = "No movie provided";
        return res.status(STATUS.BAD_REQUEST).json(errorResponseBody);
    }
    if (!isValidObjectId(req.body.movieId)) {
        errorResponseBody.err = "Invalid movie id";
        return res.status(STATUS.BAD_REQUEST).json(errorResponseBody);
    }

    if (!req.body.timing) {
        errorResponseBody.err = "No timing provided";
        return res.status(STATUS.BAD_REQUEST).json(errorResponseBody);
    }

    if (isNaN(new Date(req.body.timing).getTime())) {
        errorResponseBody.err = "Timing must be a valid datetime";
        return res.status(STATUS.BAD_REQUEST).json(errorResponseBody);
    }

    if (!req.body.noOfSeats) {
        errorResponseBody.err = "No seat info provided";
        return res.status(STATUS.BAD_REQUEST).json(errorResponseBody);
    }

    if (!req.body.price) {
        errorResponseBody.err = "No price information provided";
        return res.status(STATUS.BAD_REQUEST).json(errorResponseBody);
    }

    next();
};

const validateShowUpdateRequest = async (req, res, next) => {
    const errorResponseBody = createErrorResponseBody();

    if (req.body.theatreId || req.body.movieId) {
        errorResponseBody.err = "We cannot update theatre or movie for an already added show";
        return res.status(STATUS.BAD_REQUEST).json(errorResponseBody);
    }

    if (req.body.timing && isNaN(new Date(req.body.timing).getTime())) {
        errorResponseBody.err = "Timing must be a valid datetime";
        return res.status(STATUS.BAD_REQUEST).json(errorResponseBody);
    }

    next();
};

module.exports = {
    validateCreateShowRequest,
    validateShowUpdateRequest
};