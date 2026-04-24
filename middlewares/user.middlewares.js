const { createErrorResponseBody } = require('../utils/responsebody');
const { STATUS } = require('../utils/constants');

const validateUpdateUserRequest = (req, res, next) => {
    const errorResponseBody = createErrorResponseBody();

    if (!(req.body.userRole || req.body.userStatus)) {
        errorResponseBody.err = 'Malformed request, please send atleast one parameter';
        return res.status(STATUS.BAD_REQUEST).json(errorResponseBody);
    }
    next();
};

const validateUpdateProfileRequest = (req, res, next) => {
    const errorResponseBody = createErrorResponseBody();
    const allowedFields = ['name'];
    const receivedFields = Object.keys(req.body || {});
    const forbiddenFields = receivedFields.filter((field) => !allowedFields.includes(field));

    if (forbiddenFields.length) {
        errorResponseBody.err = `Cannot update restricted field(s): ${forbiddenFields.join(', ')}`;
        return res.status(STATUS.BAD_REQUEST).json(errorResponseBody);
    }

    if (typeof req.body.name !== 'string') {
        errorResponseBody.err = 'Name is required';
        return res.status(STATUS.BAD_REQUEST).json(errorResponseBody);
    }

    const trimmedName = req.body.name.trim();

    if (!trimmedName) {
        errorResponseBody.err = 'Name cannot be empty';
        return res.status(STATUS.BAD_REQUEST).json(errorResponseBody);
    }

    if (trimmedName.length < 2) {
        errorResponseBody.err = 'Name must be at least 2 characters long';
        return res.status(STATUS.BAD_REQUEST).json(errorResponseBody);
    }

    req.body.name = trimmedName;
    next();
};

module.exports = {
    validateUpdateUserRequest,
    validateUpdateProfileRequest
};