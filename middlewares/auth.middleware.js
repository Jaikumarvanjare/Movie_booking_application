const {errorResponseBody} = require('../utils/responsebody');

const validateSignupRequest = async (req, res, next)=> {
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

module.exports ={
    validateSignupRequest
}