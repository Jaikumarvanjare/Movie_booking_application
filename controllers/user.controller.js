const userService = require('../services/user.service');
const { createErrorResponseBody, createSuccessResponseBody } = require('../utils/responsebody');
const { STATUS } = require('../utils/constants');

const update = async (req, res) => {
    const successResponseBody = createSuccessResponseBody();
    const errorResponseBody = createErrorResponseBody();

    try {
        const response = await userService.updateUserRoleOrStatus(req.body, req.params.id);
        successResponseBody.data = response;
        successResponseBody.message = 'Successfully updated the user';
        return res.status(STATUS.OK).json(successResponseBody);
    } catch (error) {
        errorResponseBody.err = error.err || error;
        return res.status(error.code || STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
};

const getProfile = async (req, res) => {
    const successResponseBody = createSuccessResponseBody();
    const errorResponseBody = createErrorResponseBody();

    try {
        const response = await userService.getUserProfileById(req.user);
        successResponseBody.data = { user: response };
        successResponseBody.message = 'Profile fetched successfully';
        return res.status(STATUS.OK).json(successResponseBody);
    } catch (error) {
        errorResponseBody.err = error.err || error;
        return res.status(error.code || STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
};

const updateProfile = async (req, res) => {
    const successResponseBody = createSuccessResponseBody();
    const errorResponseBody = createErrorResponseBody();

    try {
        const response = await userService.updateProfile(req.user, req.body);
        successResponseBody.data = { user: response };
        successResponseBody.message = 'Profile updated successfully';
        return res.status(STATUS.OK).json(successResponseBody);
    } catch (error) {
        errorResponseBody.err = error.err || error;
        return res.status(error.code || STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
};

module.exports = {
    update,
    getProfile,
    updateProfile
};