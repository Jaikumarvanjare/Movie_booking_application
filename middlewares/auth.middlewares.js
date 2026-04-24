const { createErrorResponseBody } = require('../utils/responsebody');
const jwt = require("jsonwebtoken");
const userService = require("../services/user.service");
const { USER_ROLE, STATUS } = require('../utils/constants');

const validateSignupRequest = (req, res, next) => {
    const errorResponseBody = createErrorResponseBody();

    if (!req.body.name) {
        errorResponseBody.err = "Name of the user is not present in the request";
        return res.status(STATUS.BAD_REQUEST).json(errorResponseBody);
    }
    if (!req.body.email) {
        errorResponseBody.err = "Email of the user is not present in the request";
        return res.status(STATUS.BAD_REQUEST).json(errorResponseBody);
    }
    if (!req.body.password) {
        errorResponseBody.err = "password of the user is not present in the request";
        return res.status(STATUS.BAD_REQUEST).json(errorResponseBody);
    }
    next();
};

const validateSigninRequest = (req, res, next) => {
    const errorResponseBody = createErrorResponseBody();

    if (!req.body.email) {
        errorResponseBody.err = "No email provided for sign in";
        return res.status(STATUS.BAD_REQUEST).json(errorResponseBody);
    }

    if (!req.body.password) {
        errorResponseBody.err = "No password provided for sign in";
        return res.status(STATUS.BAD_REQUEST).json(errorResponseBody);
    }
    next();
};

const isAuthenticated = async (req, res, next) => {
    const errorResponseBody = createErrorResponseBody();

    try {
        const authHeader = req.headers.authorization || req.headers.Authorization;
        if (!authHeader) {
            errorResponseBody.err = "No token provided";
            return res.status(STATUS.FORBIDDEN).json(errorResponseBody);
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(STATUS.FORBIDDEN).json({
                success: false,
                message: "Token missing",
                err: "Authorization header malformed"
            });
        }

        const response = jwt.verify(token, process.env.AUTH_KEY);
        if (!response) {
            errorResponseBody.err = "Token not verified";
            return res.status(STATUS.UNAUTHORISED).json(errorResponseBody);
        }

        const user = await userService.getUserById(response.id);
        req.user = user.id;
        next();
    } catch (error) {
        if (error.name === "JsonWebTokenError") {
            errorResponseBody.err = error.message;
            return res.status(STATUS.UNAUTHORISED).json(errorResponseBody);
        }

        if (error.code === STATUS.NOT_FOUND) {
            errorResponseBody.err = "User doesn't exist";
            return res.status(error.code).json(errorResponseBody);
        }

        errorResponseBody.err = error.err || error;
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
};

const validateResetPasswordRequest = async (req, res, next) => {
    const errorResponseBody = createErrorResponseBody();

    if (!req.body.oldPassword) {
        errorResponseBody.err = 'Missing the old password in the request';
        return res.status(STATUS.BAD_REQUEST).json(errorResponseBody);
    }

    if (!req.body.newPassword) {
        errorResponseBody.err = 'Missing the new password in the request';
        return res.status(STATUS.BAD_REQUEST).json(errorResponseBody);
    }
    next();
};

const validateChangePasswordRequest = async (req, res, next) => {
    const errorResponseBody = createErrorResponseBody();

    if (!req.body.currentPassword) {
        errorResponseBody.err = 'Missing the current password in the request';
        return res.status(STATUS.BAD_REQUEST).json(errorResponseBody);
    }

    if (!req.body.newPassword) {
        errorResponseBody.err = 'Missing the new password in the request';
        return res.status(STATUS.BAD_REQUEST).json(errorResponseBody);
    }

    if (typeof req.body.newPassword !== 'string' || req.body.newPassword.trim().length < 6) {
        errorResponseBody.err = 'New password must be at least 6 characters long';
        return res.status(STATUS.BAD_REQUEST).json(errorResponseBody);
    }

    next();
};

const isAdmin = async (req, res, next) => {
    const errorResponseBody = createErrorResponseBody();

    try {
        const user = await userService.getUserById(req.user);
        if (user.userRole != USER_ROLE.admin) {
            errorResponseBody.err = 'User is not an admin, cannot proceed with the request';
            return res.status(STATUS.UNAUTHORISED).json(errorResponseBody);
        }
        next();
    } catch (error) {
        errorResponseBody.err = error.err || error;
        return res.status(error.code || STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
};

const isClient = async (req, res, next) => {
    const errorResponseBody = createErrorResponseBody();

    try {
        const user = await userService.getUserById(req.user);
        if (user.userRole != USER_ROLE.client) {
            errorResponseBody.err = 'User is not an client, cannot proceed with the request';
            return res.status(STATUS.UNAUTHORISED).json(errorResponseBody);
        }
        next();
    } catch (error) {
        errorResponseBody.err = error.err || error;
        return res.status(error.code || STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
};

const isAdminOrClient = async (req, res, next) => {
    const errorResponseBody = createErrorResponseBody();

    try {
        const user = await userService.getUserById(req.user);
        if (user.userRole != USER_ROLE.client && user.userRole != USER_ROLE.admin) {
            errorResponseBody.err = "User is neither a client not an admin, cannot proceed with the request";
            return res.status(STATUS.UNAUTHORISED).json(errorResponseBody);
        }
        next();
    } catch (error) {
        errorResponseBody.err = error.err || error;
        return res.status(error.code || STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
};

module.exports = {
    validateSignupRequest,
    validateSigninRequest,
    isAuthenticated,
    validateResetPasswordRequest,
    validateChangePasswordRequest,
    isAdmin,
    isClient,
    isAdminOrClient
};