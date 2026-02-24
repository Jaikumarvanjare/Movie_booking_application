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

module.exports = {
    validateTheatreCreateRequest
}