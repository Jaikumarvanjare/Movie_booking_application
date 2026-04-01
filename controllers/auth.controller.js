const env = require('../config/env');
const userService = require('../services/user.service');
const { createSuccessResponseBody, createErrorResponseBody } = require('../utils/responsebody');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const signup = async (req, res) => {
    const successResponseBody = createSuccessResponseBody();
    const errorResponseBody = createErrorResponseBody();

    try {
        const response = await userService.createUser(req.body);
        successResponseBody.data = response;
        successResponseBody.message = "succcessfully register a account";
        return res.status(201).json(successResponseBody);
    } catch (error) {
        console.log(error);
        errorResponseBody.err = error.err || error;
        return res.status(error.code || 500).json(errorResponseBody);
    }
};

const signin = async (req, res) => {
    const successResponseBody = createSuccessResponseBody();
    const errorResponseBody = createErrorResponseBody();

    try {
        const user = await userService.getUserByEmail(req.body.email);
        const isValidPassword = await bcrypt.compare(req.body.password, user.password);

        if (!isValidPassword) {
            return res.status(401).json({
                text: "Invalid password."
            });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            env.AUTH_KEY,
            { expiresIn: '1h' }
        );

        successResponseBody.message = "Successfully logged in";
        successResponseBody.data = {
            email: user.email,
            role: user.userRole,
            status: user.userStatus,
            token: token
        };
        return res.status(200).json(successResponseBody);
    } catch (error) {
        console.log(error);
        errorResponseBody.err = error.err || error;
        return res.status(error.code || 500).json(errorResponseBody);
    }
};

const resetPassword = async (req, res) => {
    const successResponseBody = createSuccessResponseBody();
    const errorResponseBody = createErrorResponseBody();

    try {
        const user = await userService.getUserById(req.user);
        const isOldPasswordCorrect = await bcrypt.compare(req.body.oldPassword, user.password);

        if (!isOldPasswordCorrect) {
            throw { err: "Invalid old password, please write the correct old password", code: 403 };
        }

        const updatedUser = await userService.updatePassword(req.user, req.body.newPassword);
        successResponseBody.data = updatedUser;
        successResponseBody.message = "Succesfully updated the password for the given user";
        return res.status(200).json(successResponseBody);
    } catch (error) {
        errorResponseBody.err = error.err || error;
        return res.status(error.code || 500).json(errorResponseBody);
    }
};

module.exports = {
    signup,
    signin,
    resetPassword
};