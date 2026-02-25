const { errorResponseBody } = require("../utils/responsebody")

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

const validateTheatreCreateRequest = async(req,res, next) => {
    //validate the theatre name
    if(!req.body.name){
        errorResponseBody.message ="The name of the theatre is not present in the request sent";
        return res.status(400).json(errorResponseBody);
    }

    //validate the theatre pincode
    if(!req.body.pincode){
        errorResponseBody.message ="The pincode of the theatre is not present in the request sent";
        return res.status(400).json(errorResponseBody);
    }

    //validate the theatre city
     if(!req.body.city){
        errorResponseBody.message ="The city of the theatre is not present in the request sent";
        return res.status(400).json(errorResponseBody);
    }

    //validate the movie address   
    if(!req.body.address){
        errorResponseBody.message ="The address of the theatre is not present in the request sent";
        return res.status(400).json(errorResponseBody);
    }
    next();
}

const validateUpdateMovies = async(req,res, next) => {
    //validation of insert parameter
    if(req.body.insert==undefined){
        errorResponseBody.message=" The insert parameter is missing in the request";
        return res.status(400).json(errorResponseBody);
    }

    //validate movieIds presence
    if(!req.body.movieIds){
        errorResponseBody.message="No movies is present in the request";
        return res.status(400).json(errorResponseBody);
    }

    //validate whether moviedIds is an array or not
    if(!(req.body.movieIds instanceof Array)) {
        errorResponseBody.message= "Expected array of movies but found something else";
        return res.status(400).json(errorResponseBody);
    }

    //validate length of the movieIds whether empty or not 
    if(req.body.movieIds.length<=0){
        errorResponseBody.message="No movies is present in the array provided";
        return res.status(400).json(errorResponseBody);
    }
    next();
}

module.exports = {
    validateTheatreCreateRequest,
    validateUpdateMovies
}