const badRequestResponse = {
    success: false,
    err: '',
    data : {},
    message : "Malformed Request | Bad Request",
}

/**
 * 
 * @param req -> HTTP request object
 * @param {*} res -> HTTP response object
 * @param {*} next -> next middleware function
 * @returns -> whether the request is valid or not
 */

const validateMovieCreateRequest = (req, res, next) => {
    //validate the movie name
    if (!req.body.name) {
        badRequestResponse.err ="The name of the movie is not present in the request sent";
        return res.status(400).json(badRequestResponse);
    } 

    //validate the movie description
    if (!req.body.description) {
        badRequestResponse.err ="The name of the movie is not present in the request sent";
        return res.status(400).json(badRequestResponse);
    }

    //validate the movie casts
    if (!req.body.casts || !(req.body.casts instanceof Array )|| req.body.casts.length<=0) {
        badRequestResponse.err ="The casts of the movie is not present in the request sent";
        return res.status(400).json(badRequestResponse);
    }

    //validate the movie trailer url    
    if (!req.body.trailerUrl) {
        badRequestResponse.err ="The trailer url of the movie is not present in the request sent";
        return res.status(400).json(badRequestResponse);
    }

    //validate the movie release date
    if (!req.body.releaseDate) {
        badRequestResponse.err ="The release date of the movie is not present in the request sent";
        return res.status(400).json(badRequestResponse);
    }

    //validate the movie director
    if (!req.body.director) {
        badRequestResponse.err ="The director of the movie is not present in the request sent";
        return res.status(400).json(badRequestResponse);
    }
    next();
};

module.exports = {
    validateMovieCreateRequest
};  
  