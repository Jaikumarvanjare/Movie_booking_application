const paymentService = require('../services/payment.service');
const { BOOKING_STATUS, STATUS } = require('../utils/constants');
const { createErrorResponseBody, createSuccessResponseBody } = require('../utils/responsebody');

const create = async (req, res) => {
    const successResponseBody = createSuccessResponseBody();
    const errorResponseBody = createErrorResponseBody();

    try {
        const response = await paymentService.createPayment(req.body);

        if (response.status == BOOKING_STATUS.expired) {
            errorResponseBody.err = 'The payment took more than 5 minutes to get processed, hence your booking got expired, please try again';
            errorResponseBody.data = response;
            return res.status(STATUS.GONE).json(errorResponseBody);
        }

        if (response.status == BOOKING_STATUS.cancelled) {
            errorResponseBody.err = 'The payment failed due to some reason, booking was not successful, please try again';
            errorResponseBody.data = response;
            return res.status(STATUS.PAYMENT_REQUIRED).json(errorResponseBody);
        }

        successResponseBody.data = response;
        successResponseBody.message = 'Booking completed successfully';
        return res.status(STATUS.OK).json(successResponseBody);
    } catch (error) {
        errorResponseBody.message = 'Payment processing failed';
        errorResponseBody.err = error.err || error;
        if (error.data) {
            errorResponseBody.data = error.data;
        }
        return res.status(error.code || STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
};

const createRazorpayOrder = async (req, res) => {
    const successResponseBody = createSuccessResponseBody();
    const errorResponseBody = createErrorResponseBody();

    try {
        const response = await paymentService.createRazorpayOrder(req.body);
        successResponseBody.data = response;
        successResponseBody.message = 'Razorpay order created successfully';
        return res.status(STATUS.CREATED).json(successResponseBody);
    } catch (error) {
        errorResponseBody.message = 'Razorpay order creation failed';
        errorResponseBody.err = error.err || error;
        if (error.data) {
            errorResponseBody.data = error.data;
        }
        return res.status(error.code || STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
};

const verifyRazorpayPayment = async (req, res) => {
    const successResponseBody = createSuccessResponseBody();
    const errorResponseBody = createErrorResponseBody();

    try {
        const response = await paymentService.verifyRazorpayPayment(req.body);
        successResponseBody.data = response;
        successResponseBody.message = 'Razorpay payment verified successfully';
        return res.status(STATUS.OK).json(successResponseBody);
    } catch (error) {
        errorResponseBody.message = 'Payment verification failed';
        errorResponseBody.err = error.err || error;
        if (error.data) {
            errorResponseBody.data = error.data;
        }
        return res.status(error.code || STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
};

const getPaymentDetailsById = async (req, res) => {
    const successResponseBody = createSuccessResponseBody();
    const errorResponseBody = createErrorResponseBody();

    try {
        const response = await paymentService.getPaymentById(req.params.id);
        successResponseBody.data = response;
        successResponseBody.message = "Successfully fetched the booking and payment details";
        return res.status(STATUS.OK).json(successResponseBody);
    } catch (error) {
        errorResponseBody.message = 'Payment fetch failed';
        errorResponseBody.err = error.err || error;
        return res.status(error.code || STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
};

const getAllPayments = async (req, res) => {
    const successResponseBody = createSuccessResponseBody();
    const errorResponseBody = createErrorResponseBody();

    try {
        const response = await paymentService.getAllPayments(req.user);
        successResponseBody.data = response;
        successResponseBody.message = "Successfully fetched all the payments";
        return res.status(STATUS.OK).json(successResponseBody);
    } catch (error) {
        errorResponseBody.message = 'Payment fetch failed';
        errorResponseBody.err = error.err || error;
        return res.status(error.code || STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
};

module.exports = {
    create,
    createRazorpayOrder,
    verifyRazorpayPayment,
    getPaymentDetailsById,
    getAllPayments
};
