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
    const allowedFields = ['name', 'about', 'profilePhotoUrl'];
    const receivedFields = Object.keys(req.body || {});
    const forbiddenFields = receivedFields.filter((field) => !allowedFields.includes(field));

    if (forbiddenFields.length) {
        errorResponseBody.err = `Cannot update restricted field(s): ${forbiddenFields.join(', ')}`;
        return res.status(STATUS.BAD_REQUEST).json(errorResponseBody);
    }

    if (!receivedFields.length) {
        errorResponseBody.err = 'Please send at least one profile field';
        return res.status(STATUS.BAD_REQUEST).json(errorResponseBody);
    }

    if (req.body.name !== undefined) {
        if (typeof req.body.name !== 'string') {
            errorResponseBody.err = 'Name must be a string';
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
    }

    if (req.body.about !== undefined) {
        if (typeof req.body.about !== 'string') {
            errorResponseBody.err = 'About must be a string';
            return res.status(STATUS.BAD_REQUEST).json(errorResponseBody);
        }

        if (req.body.about.trim().length > 500) {
            errorResponseBody.err = 'About must be 500 characters or fewer';
            return res.status(STATUS.BAD_REQUEST).json(errorResponseBody);
        }

        req.body.about = req.body.about.trim();
    }

    if (req.body.profilePhotoUrl !== undefined) {
        if (typeof req.body.profilePhotoUrl !== 'string') {
            errorResponseBody.err = 'Profile photo must be a string URL';
            return res.status(STATUS.BAD_REQUEST).json(errorResponseBody);
        }

        const profilePhotoUrl = req.body.profilePhotoUrl.trim();
        const isAllowedImage =
            profilePhotoUrl === '' ||
            profilePhotoUrl.startsWith('http://') ||
            profilePhotoUrl.startsWith('https://') ||
            profilePhotoUrl.startsWith('data:image/');

        if (!isAllowedImage) {
            errorResponseBody.err = 'Profile photo must be an image URL or uploaded image data';
            return res.status(STATUS.BAD_REQUEST).json(errorResponseBody);
        }

        if (profilePhotoUrl.length > 1500000) {
            errorResponseBody.err = 'Profile photo is too large';
            return res.status(STATUS.BAD_REQUEST).json(errorResponseBody);
        }

        req.body.profilePhotoUrl = profilePhotoUrl;
    }

    next();
};

module.exports = {
    validateUpdateUserRequest,
    validateUpdateProfileRequest
};
