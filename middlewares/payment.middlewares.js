const { STATUS } = require('../utils/constants');
const { createErrorResponseBody } = require('../utils/responsebody');

const isValidObjectId = (id) => typeof id === 'string' && /^[a-f\d]{24}$/i.test(id);

const verifyPaymentCreateRequest = async (req, res, next) => {
    const errorResponseBody = createErrorResponseBody();

    if (!req.body.bookingId) {
        errorResponseBody.err = 'No booking id recieved';
        return res.status(STATUS.BAD_REQUEST).json(errorResponseBody);
    }

    if (!isValidObjectId(req.body.bookingId)) {
        errorResponseBody.err = 'Invalid booking id';
        return res.status(STATUS.BAD_REQUEST).json(errorResponseBody);
    }

    if (!req.body.amount) {
        errorResponseBody.err = 'No amount Sent';
        return res.status(STATUS.BAD_REQUEST).json(errorResponseBody);
    }

    next();
};

const verifyRazorpayOrderRequest = (req, res, next) => {
    const errorResponseBody = createErrorResponseBody();

    if (!req.body.bookingId) {
        errorResponseBody.err = 'No booking id recieved';
        return res.status(STATUS.BAD_REQUEST).json(errorResponseBody);
    }

    if (!isValidObjectId(req.body.bookingId)) {
        errorResponseBody.err = 'Invalid booking id';
        return res.status(STATUS.BAD_REQUEST).json(errorResponseBody);
    }

    if (!req.body.amount) {
        errorResponseBody.err = 'No amount Sent';
        return res.status(STATUS.BAD_REQUEST).json(errorResponseBody);
    }

    next();
};

const verifyRazorpayVerificationRequest = (req, res, next) => {
    const errorResponseBody = createErrorResponseBody();

    if (!req.body.bookingId || !isValidObjectId(req.body.bookingId)) {
        errorResponseBody.err = 'Invalid booking id';
        return res.status(STATUS.BAD_REQUEST).json(errorResponseBody);
    }

    if (!req.body.amount) {
        errorResponseBody.err = 'No amount Sent';
        return res.status(STATUS.BAD_REQUEST).json(errorResponseBody);
    }

    if (!req.body.razorpayOrderId) {
        errorResponseBody.err = 'Missing razorpay order id';
        return res.status(STATUS.BAD_REQUEST).json(errorResponseBody);
    }

    if (!req.body.razorpayPaymentId) {
        errorResponseBody.err = 'Missing razorpay payment id';
        return res.status(STATUS.BAD_REQUEST).json(errorResponseBody);
    }

    if (!req.body.razorpaySignature) {
        errorResponseBody.err = 'Missing razorpay signature';
        return res.status(STATUS.BAD_REQUEST).json(errorResponseBody);
    }

    next();
};

module.exports = {
    verifyPaymentCreateRequest,
    verifyRazorpayOrderRequest,
    verifyRazorpayVerificationRequest
};