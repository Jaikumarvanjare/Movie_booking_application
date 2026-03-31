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

module.exports = {
    validateUpdateUserRequest
};