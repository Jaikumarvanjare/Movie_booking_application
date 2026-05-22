const env = require('../config/env');
const userService = require('../services/user.service');
const { createSuccessResponseBody, createErrorResponseBody } = require('../utils/responsebody');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const emailService = require('../services/email.service');
const { USER_STATUS, STATUS } = require('../utils/constants');

const signup = async (req, res) => {
    const successResponseBody = createSuccessResponseBody();
    const errorResponseBody = createErrorResponseBody();

    try {
        const response = await userService.createUser(req.body);
        successResponseBody.data = response;

        successResponseBody.message = "Successfully registered account";

        return res.status(201).json(successResponseBody);
    } catch (error) {
        console.log(error);
        errorResponseBody.message = 'Sign up failed';
        errorResponseBody.err = error.err || error;
        return res.status(error.code || 500).json(errorResponseBody);
    }
};

const signin = async (req, res) => {
    const successResponseBody = createSuccessResponseBody();
    const errorResponseBody = createErrorResponseBody();

    try {
        const user = await userService.getUserByEmail(req.body.email);

        if (!user) {
            throw { err: "User not found", code: 404 };
        }

        const isValidPassword = await bcrypt.compare(req.body.password, user.password);

        if (!isValidPassword) {
            throw { err: "Invalid password", code: 401 };
        }

        if (user.userStatus !== USER_STATUS.approved) {
            throw {
                err: "Your account is not approved. Please contact the administrator.",
                code: STATUS.FORBIDDEN
            };
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
        errorResponseBody.message = 'Sign in failed';
        errorResponseBody.err = error.err || error;
        return res.status(error.code || 500).json(errorResponseBody);
    }
};

const resetPassword = async (req, res) => {
    const successResponseBody = createSuccessResponseBody();
    const errorResponseBody = createErrorResponseBody();

    try {
        const user = await userService.getUserById(req.user);

        if (!user) {
            throw { err: "User not found", code: 404 };
        }

        const isOldPasswordCorrect = await bcrypt.compare(req.body.oldPassword, user.password);

        if (!isOldPasswordCorrect) {
            throw { err: "Invalid old password, please write the correct old password", code: 403 };
        }

        const isSameAsOldPassword = await bcrypt.compare(req.body.newPassword, user.password);

        if (isSameAsOldPassword) {
            throw { err: "New password cannot be the same as the old password", code: 400 };
        }

        const updatedUser = await userService.updatePassword(req.user, req.body.newPassword);
        successResponseBody.data = updatedUser;

        successResponseBody.message = "Successfully updated the password for the given user";

        return res.status(200).json(successResponseBody);
    } catch (error) {
        errorResponseBody.message = 'Password reset failed';
        errorResponseBody.err = error.err || error;
        return res.status(error.code || 500).json(errorResponseBody);
    }
};

const changePassword = async (req, res) => {
    const successResponseBody = createSuccessResponseBody();
    const errorResponseBody = createErrorResponseBody();

    try {
        const user = await userService.getUserById(req.user);

        const isCurrentPasswordValid = await bcrypt.compare(req.body.currentPassword, user.password);

        if (!isCurrentPasswordValid) {
            throw { err: "Invalid current password", code: 403 };
        }

        const isSameAsCurrentPassword = await bcrypt.compare(req.body.newPassword, user.password);

        if (isSameAsCurrentPassword) {
            throw { err: "New password cannot be the same as the current password", code: 400 };
        }

        await userService.updatePassword(req.user, req.body.newPassword);

        successResponseBody.data = {};
        successResponseBody.message = "Password changed successfully";

        return res.status(200).json(successResponseBody);
    } catch (error) {
        errorResponseBody.message = 'Password change failed';
        errorResponseBody.err = error.err || error;
        return res.status(error.code || 500).json(errorResponseBody);
    }
};

const requestPasswordReset = async (req, res) => {
    const successResponseBody = createSuccessResponseBody();
    const errorResponseBody = createErrorResponseBody();

    try {
        const user = await userService.getUserByEmail(req.body.email);
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpHash = await bcrypt.hash(otp, 10);
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

        await userService.setPasswordResetOtp(user.id, otpHash, expiresAt);
        await emailService.sendPasswordResetOtp(user.email, otp, 10);

        successResponseBody.data = {};
        successResponseBody.message = 'Password reset OTP sent to your email';
        return res.status(200).json(successResponseBody);
    } catch (error) {
        errorResponseBody.message = 'Password reset request failed';
        errorResponseBody.err = error.err || error;
        return res.status(error.code || 500).json(errorResponseBody);
    }
};

const completePasswordReset = async (req, res) => {
    const successResponseBody = createSuccessResponseBody();
    const errorResponseBody = createErrorResponseBody();

    try {
        const user = await userService.getUserByEmail(req.body.email);

        if (!user.passwordResetOtpHash || !user.passwordResetOtpExpiresAt) {
            throw { err: 'Please request a password reset OTP first', code: 400 };
        }

        if (new Date(user.passwordResetOtpExpiresAt).getTime() < Date.now()) {
            await userService.clearPasswordResetOtp(user.id);
            throw { err: 'Password reset OTP has expired', code: 410 };
        }

        const isValidOtp = await bcrypt.compare(req.body.otp, user.passwordResetOtpHash);

        if (!isValidOtp) {
            throw { err: 'Invalid password reset OTP', code: 403 };
        }

        const isSameAsCurrentPassword = await bcrypt.compare(req.body.newPassword, user.password);

        if (isSameAsCurrentPassword) {
            throw { err: 'New password cannot be the same as the current password', code: 400 };
        }

        await userService.updatePassword(user.id, req.body.newPassword);
        await userService.clearPasswordResetOtp(user.id);

        successResponseBody.data = {};
        successResponseBody.message = 'Password reset successfully';
        return res.status(200).json(successResponseBody);
    } catch (error) {
        errorResponseBody.message = 'Password reset failed';
        errorResponseBody.err = error.err || error;
        return res.status(error.code || 500).json(errorResponseBody);
    }
};

const logout = async (req, res) => {
    const successResponseBody = createSuccessResponseBody();

    // JWT authentication is stateless here, so logout is an acknowledgement endpoint.
    successResponseBody.data = {};
    successResponseBody.message = "Logged out successfully";

    return res.status(200).json(successResponseBody);
};

module.exports = {
    signup,
    signin,
    resetPassword,
    changePassword,
    requestPasswordReset,
    completePasswordReset,
    logout
};
