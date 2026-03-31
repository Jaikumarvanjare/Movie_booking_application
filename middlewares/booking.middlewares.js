const { STATUS, USER_ROLE, BOOKING_STATUS } = require('../utils/constants');
const { createErrorResponseBody } = require('../utils/responsebody');
const theatreService = require('../services/theatre.service');
const userService = require('../services/user.service');

const isValidObjectId = (id) => typeof id === 'string' && /^[a-f\d]{24}$/i.test(id);

const validateBookingCreateRequest = async (req, res, next) => {
    const errorResponseBody = createErrorResponseBody();

    try {
        if (!req.body.theatreId) {
            errorResponseBody.err = "No theatre id provided";
            return res.status(STATUS.BAD_REQUEST).json(errorResponseBody);
        }

        if (!isValidObjectId(req.body.theatreId)) {
            errorResponseBody.err = "Invalid theatre id provided";
            return res.status(STATUS.BAD_REQUEST).json(errorResponseBody);
        }

        const theatre = await theatreService.getTheatre(req.body.theatreId);

        if (!theatre) {
            errorResponseBody.err = "No theatre found for the given id";
            return res.status(STATUS.BAD_REQUEST).json(errorResponseBody);
        }

        if (!req.body.movieId) {
            errorResponseBody.err = "No movie id present";
            return res.status(STATUS.BAD_REQUEST).json(errorResponseBody);
        }

        if (!isValidObjectId(req.body.movieId)) {
            errorResponseBody.err = "Invalid movie id provided";
            return res.status(STATUS.BAD_REQUEST).json(errorResponseBody);
        }

        if (!theatre.movies.map(id => id.toString()).includes(req.body.movieId)) {
            errorResponseBody.err = "Given movie is not present in the requested theatre";
            return res.status(STATUS.NOT_FOUND).json(errorResponseBody);
        }

        if (!req.body.timing) {
            errorResponseBody.err = "no movie timing passed";
            return res.status(STATUS.NOT_FOUND).json(errorResponseBody);
        }

        if (isNaN(new Date(req.body.timing).getTime())) {
            errorResponseBody.err = "Invalid timing passed";
            return res.status(STATUS.BAD_REQUEST).json(errorResponseBody);
        }

        if (!req.body.noOfSeats) {
            errorResponseBody.err = "no seat provided";
            return res.status(STATUS.BAD_REQUEST).json(errorResponseBody);
        }

        next();
    } catch (error) {
        errorResponseBody.err = error.err || error;
        return res.status(error.code || STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
};

const canChangeStatus = async (req, res, next) => {
    const errorResponseBody = createErrorResponseBody();

    try {
        const user = await userService.getUserById(req.user);
        if (user.userRole == USER_ROLE.customer && req.body.status && req.body.status != BOOKING_STATUS.cancelled) {
            errorResponseBody.err = "You are not allowed to change the booking status";
            return res.status(STATUS.UNAUTHORISED).json(errorResponseBody);
        }
        next();
    } catch (error) {
        errorResponseBody.err = error.err || error;
        return res.status(error.code || STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
};

module.exports = {
    validateBookingCreateRequest,
    canChangeStatus
};