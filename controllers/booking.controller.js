const { createSuccessResponseBody, createErrorResponseBody } = require('../utils/responsebody');
const bookingService = require('../services/booking.service');
const { STATUS } = require('../utils/constants');

const create = async (req, res) => {
    const successResponseBody = createSuccessResponseBody();
    const errorResponseBody = createErrorResponseBody();

    try {
        const response = await bookingService.createBooking({ ...req.body, userId: req.user });
        successResponseBody.message = "Successfully created a booking";
        successResponseBody.data = response;
        return res.status(STATUS.CREATED).json(successResponseBody);
    } catch (error) {
        errorResponseBody.err = error.err || error;
        return res.status(error.code || STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
};

const update = async (req, res) => {
    const successResponseBody = createSuccessResponseBody();
    const errorResponseBody = createErrorResponseBody();

    try {
        const response = await bookingService.updateBooking(req.body, req.params.id);
        successResponseBody.data = response;
        successResponseBody.message = "Successfully updated the booking";
        return res.status(STATUS.OK).json(successResponseBody);
    } catch (error) {
        errorResponseBody.err = error.err || error;
        return res.status(error.code || STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
};

const getBookings = async (req, res) => {
    const successResponseBody = createSuccessResponseBody();
    const errorResponseBody = createErrorResponseBody();

    try {
        const response = await bookingService.getBookings({ userId: req.user });
        successResponseBody.data = response;
        successResponseBody.message = "Successfully fetched the bookings";
        return res.status(STATUS.OK).json(successResponseBody);
    } catch (error) {
        errorResponseBody.err = error.err || error;
        return res.status(error.code || STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
};

const getAllBookings = async (req, res) => {
    const successResponseBody = createSuccessResponseBody();
    const errorResponseBody = createErrorResponseBody();

    try {
        const response = await bookingService.getAllBookings();
        successResponseBody.data = response;
        successResponseBody.message = "succesfully fetched the bookings";
        return res.status(STATUS.OK).json(successResponseBody);
    } catch (error) {
        errorResponseBody.err = error.err || error;
        return res.status(error.code || STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
};

const getBookingById = async (req, res) => {
    const successResponseBody = createSuccessResponseBody();
    const errorResponseBody = createErrorResponseBody();

    try {
        const response = await bookingService.getBookingById(req.params.id, req.user);
        successResponseBody.data = response;
        successResponseBody.message = "Successfully fetched the booking";
        return res.status(STATUS.OK).json(successResponseBody);
    } catch (error) {
        errorResponseBody.err = error.err || error;
        return res.status(error.code || STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
};

module.exports = {
    create,
    update,
    getBookings,
    getAllBookings,
    getBookingById
};