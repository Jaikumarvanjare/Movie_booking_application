const {errorResponseBody} = require('../utils/responsebody');
const jwt = require("jsonwebtoken")
const userService = require("../services/user.service")

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

const isAuthenticated = async (req, res, next) => {
    try {

        const authHeader = req.headers.authorization || req.headers.Authorization;

        if(!authHeader){
            errorResponseBody.err = "No token provided";
            return res.status(403).json(errorResponseBody);
        }

        const token = authHeader.split(" ")[1];

        console.log("Token:", token);

        const response = jwt.verify(token, process.env.AUTH_KEY);

        console.log("Decoded:", response);

        if(!response){
            errorResponseBody.err = "Token not verified";
            return res.status(401).json(errorResponseBody);
        }

        const user = await userService.getUserById(response.id);

        req.user = user.id;

        next();

    } catch (error) {
        console.log("JWT ERROR:", error);
        if(error.name === "JsonWebTokenError"){
            errorResponseBody.err = error.message;
            return res.status(401).json(errorResponseBody);
        }

        if(error.code === 404){
            errorResponseBody.err = "User doesn't exist";
            return res.status(error.code).json(errorResponseBody);
        }

        errorResponseBody.err = error;
        return res.status(500).json(errorResponseBody);
    }
}

module.exports ={
    validateSignupRequest, 
    validateSigninRequest,
    isAuthenticated
}