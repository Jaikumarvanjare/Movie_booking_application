const {errorResponseBody} = require('../utils/responsebody');
const jwt = require("jsonwebtoken")
const userService = require("../services/user.service");
const {USER_ROLE, STATUS} =require('../utils/constants');

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
        return res.status(STATUS.BAD_REQUEST).json(errorResponseBody);
    }
    //validate the email of user
    if(!req.body.email){
        errorResponseBody.err = "Email of the user is not present in the request";
        return res.status(STATUS.BAD_REQUEST).json(errorResponseBody);
    }
    //validate the password of user
    if(!req.body.password){
        errorResponseBody.err = "password of the user is not present in the request";
        return res.status(STATUS.BAD_REQUEST).json(errorResponseBody);
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
        return res.status(STATUS.BAD_REQUEST).json(errorResponseBody);
    }

    // validate user password presence
    if(!req.body.password) {
        errorResponseBody.err = "No password provided for sign in";
        return res.status(STATUS.BAD_REQUEST).json(errorResponseBody);
    }
    next();
}

const isAuthenticated = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization || req.headers.Authorization;
        if(!authHeader){
            errorResponseBody.err = "No token provided";
            return res.status(STATUS.FORBIDDEN).json(errorResponseBody);
        }
        const token = authHeader && authHeader.split(" ")[1];

        if(!token){
            return res.status(403).json({
                success:false,
                message:"Token missing",
                err:"Authorization header malformed"
            });
        }        console.log("Token:", token);
        const response = jwt.verify(token, process.env.AUTH_KEY);
        console.log("Decoded:", response);
        if(!response){
            errorResponseBody.err = "Token not verified";
            return res.status(STATUS.UNAUTHORISED).json(errorResponseBody);
        }
        const user = await userService.getUserById(response.id);
        req.user = user.id;
        next();
    } catch (error) {
        console.log("JWT ERROR:", error);
        if(error.name === "JsonWebTokenError"){
            errorResponseBody.err = error.message;
            return res.status(STATUS.UNAUTHORISED).json(errorResponseBody);
        }

        if(error.code === STATUS.NOT_FOUND){
            errorResponseBody.err = "User doesn't exist";
            return res.status(error.code).json(errorResponseBody);
        }

        errorResponseBody.err = error;
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
}

const validateResetPasswordRequest = async (req, res, next) =>{
    if(!req.body.oldPassword){
        errorResponseBody.err = 'Missing the old password in the request';
        return res.status(400).json(errorResponseBody);
    }

    if(!req.body.newPassword){
        errorResponseBody.err = 'Missing the new password in the request';
        return res.status(STATUS.BAD_REQUEST).json(errorResponseBody);
    }
    next();
}    

const isAdmin = async (req,res,next) => {
    console.log(req.user);
    const user =await userService.getUserById(req.user);
    if(user.userType != USER_ROLE.admin){
        errorResponseBody.err = 'User is not an admin, cannot proceed with the request';
        return res.status(STATUS.UNAUTHORISED).json(errorResponseBody);
    }
    next();
}

const isClient = async(req,res,next) =>{
    const user = await userService.getUserById(req.user);
    if(user.userRole != USER_ROLE.client){
        errorResponseBody.err = 'User is not an client, cannot proceed with the request';
    return res.status(STATUS.UNAUTHORISED).json(errorResponseBody);
    }
    next();
}

const isAdminOrClient = async(req,res,next) =>{
    const user = await userService.getUserById(req.user);
    if(user.userRole != USER_ROLE.client  && user.userRole != USER_ROLE.admin){
        errorResponseBody.err = "User is neither a client not an admin, cannot proceed with the request";
        return res.status(STATUS.UNAUTHORISED).json(errorResponseBody);
    }
    next();
}

module.exports ={
    validateSignupRequest, 
    validateSigninRequest,
    isAuthenticated,
    validateResetPasswordRequest,
    isAdmin,
    isClient,
    isAdminOrClient
}