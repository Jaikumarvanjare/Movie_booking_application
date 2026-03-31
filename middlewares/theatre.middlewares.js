const { createErrorResponseBody } = require("../utils/responsebody");
const { STATUS } = require('../utils/constants');

const validateTheatreCreateRequest = async (req, res, next) => {
    const errorResponseBody = createErrorResponseBody();

    if (!req.body.name) {
        errorResponseBody.err = "The name of the theatre is not present in the request sent";
        return res.status(STATUS.BAD_REQUEST).json(errorResponseBody);
    }

    if (!req.body.pincode) {
        errorResponseBody.err = "The pincode of the theatre is not present in the request sent";
        return res.status(STATUS.BAD_REQUEST).json(errorResponseBody);
    }

    if (!req.body.city) {
        errorResponseBody.err = "The city of the theatre is not present in the request sent";
        return res.status(STATUS.BAD_REQUEST).json(errorResponseBody);
    }

    if (!req.body.address) {
        errorResponseBody.err = "The address of the theatre is not present in the request sent";
        return res.status(STATUS.BAD_REQUEST).json(errorResponseBody);
    }
    next();
};

const validateUpdateMovies = async (req, res, next) => {
    const errorResponseBody = createErrorResponseBody();

    if (req.body.insert == undefined) {
        errorResponseBody.err = " The insert parameter is missing in the request";
        return res.status(STATUS.BAD_REQUEST).json(errorResponseBody);
    }

    if (!req.body.movieIds) {
        errorResponseBody.err = "No movies is present in the request";
        return res.status(STATUS.BAD_REQUEST).json(errorResponseBody);
    }

    if (!Array.isArray(req.body.movieIds)) {
        errorResponseBody.err = "Expected array of movies but found something else";
        return res.status(STATUS.BAD_REQUEST).json(errorResponseBody);
    }

    if (req.body.movieIds.length <= 0) {
        errorResponseBody.err = "No movies is present in the array provided";
        return res.status(STATUS.BAD_REQUEST).json(errorResponseBody);
    }
    next();
};

module.exports = {
    validateTheatreCreateRequest,
    validateUpdateMovies
};