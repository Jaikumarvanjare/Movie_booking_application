const validateMovieCreateRequest = (req, res, next) => {
    if (!req.body.name) {
        return res.status(400).json({
            success: false,
            message: "Name is required"
        });
    }

    next();
};

module.exports = {
    validateMovieCreateRequest
};
