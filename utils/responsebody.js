const createErrorResponseBody = () => ({
    err: {},
    data: {},
    message: "Something went wrong, cannot process the request",
    success: false
});

const createSuccessResponseBody = () => ({
    err: {},
    data: {},
    message: "Successfully processed the request",
    success: true
});

module.exports = {
    createErrorResponseBody,
    createSuccessResponseBody
};