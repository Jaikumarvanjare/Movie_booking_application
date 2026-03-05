const {errorResponseBody} = require('../utils/responsebody');

/**
 * validator for user signup
 * @param req -> http request object
 * @param res -> http response object
 * @param next -> next middleware
 */
const validateSignupRequest = (req, res, next)=> {
    //validate the name of user
    if(!req.body.name){
        errorResponseBody.err = "Name of the user is not present in the request";
        return res.status(400).json(errorResponseBody);
    }
    //validate the email of user
    if(!req.body.email){
        errorResponseBody.err = "Email of the user is not present in the request";
        return res.status(400).json(errorResponseBody);
    }
    //validate the password of user
    if(!req.body.password){
        errorResponseBody.err = "password of the user is not present in the request";
        return res.status(400).json(errorResponseBody);
    }
    next();
}

/**
 * validator for user signin
 * @param req -> http request object
 * @param res -> http response object
 * @param next -> next middleware
 */
const validateSigninRequest = (req,res,next)=>{
    // validate user email presence
    if(!req.body.email) {
        errorResponseBody.err = "No email provided for sign in";
        return res.status(400).json(errorResponseBody);
    }

    // validate user password presence
    if(!req.body.password) {
        errorResponseBody.err = "No password provided for sign in";
        return res.status(400).json(errorResponseBody);
    }
    next();
}

module.exports ={
    validateSignupRequest, 
    validateSigninRequest
}