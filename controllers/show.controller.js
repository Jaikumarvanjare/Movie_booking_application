const showService = require('../services/show.service');
const { createSuccessResponseBody, createErrorResponseBody } = require('../utils/responsebody');
const { STATUS } = require('../utils/constants');

const create = async (req, res) => {
    const successResponseBody = createSuccessResponseBody();
    const errorResponseBody = createErrorResponseBody();

    try {
        const response = await showService.createShow(req.body);
        successResponseBody.message = "Successfully created the show";
        successResponseBody.data = response;
        return res.status(STATUS.OK).json(successResponseBody);
    } catch (error) {
        errorResponseBody.err = error.err || error;
        return res.status(error.code || STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
};

const getShows = async (req, res) => {
    const successResponseBody = createSuccessResponseBody();
    const errorResponseBody = createErrorResponseBody();

    try {
        const response = await showService.getShows(req.query);
        successResponseBody.message = "Successfully fetched the show";
        successResponseBody.data = response;
        return res.status(STATUS.OK).json(successResponseBody);
    } catch (error) {
        errorResponseBody.err = error.err || error;
        return res.status(error.code || STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
};

const destroy = async (req, res) => {
    const successResponseBody = createSuccessResponseBody();
    const errorResponseBody = createErrorResponseBody();

    try {
        const response = await showService.deleteShow(req.params.id);
        successResponseBody.message = " Successfully deleted the show";
        successResponseBody.data = response;
        return res.status(STATUS.OK).json(successResponseBody);
    } catch (error) {
        errorResponseBody.err = error.err || error;
        return res.status(error.code || STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
};

const update = async (req, res) => {
    const successResponseBody = createSuccessResponseBody();
    const errorResponseBody = createErrorResponseBody();

    try {
        const response = await showService.updateShow(req.body, req.params.id);
        successResponseBody.message = " Successfully updated the show";
        successResponseBody.data = response;
        return res.status(STATUS.OK).json(successResponseBody);
    } catch (error) {
        errorResponseBody.err = error.err || error;
        return res.status(error.code || STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
};

module.exports = {
    create,
    getShows,
    destroy,
    update
};