const badRequestResponse = {
    success: false,
    err: '',
    data : {},
    message : "Malformed Request | Bad Request",
}

const validateMovieCreateRequest = (req, res, next) => {
    if (!req.body.name) {
        badRequestResponse.err ="The name of the movie is not present in the request sent";
        return res.status(400).json(badRequestResponse);
    } 

    if (!req.body.description) {
        badRequestResponse.err ="The name of the movie is not present in the request sent";
        return res.status(400).json(badRequestResponse);
    }

    if (!req.body.casts || !(req.body.casts instanceof Array )|| req.body.casts.length<=0) {
        badRequestResponse.err ="The casts of the movie is not present in the request sent";
        return res.status(400).json(badRequestResponse);
    }

    if (!req.body.trailerUrl) {
        badRequestResponse.err ="The trailer url of the movie is not present in the request sent";
        return res.status(400).json(badRequestResponse);
    }

    if (!req.body.releaseDate) {
        badRequestResponse.err ="The release date of the movie is not present in the request sent";
        return res.status(400).json(badRequestResponse);
    }

     if (!req.body.director) {
        badRequestResponse.err ="The director of the movie is not present in the request sent";
        return res.status(400).json(badRequestResponse);
    }
    ``
    next();
};

module.exports = {
    validateMovieCreateRequest
};  
