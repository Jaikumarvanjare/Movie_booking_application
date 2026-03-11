const userService = require('../services/user.service');
const {successResponseBody, errorResponseBody} = require('../utils/responsebody');
const jwt = require('jsonwebtoken');
 
const signup = async (req,res) => {
    try {
        const response = await userService.createUser(req.body);
        successResponseBody.data = response;
        successResponseBody.message = "succcessfully register a account";
        return res.status(201).json(successResponseBody);
    } catch(error) {
        console.log(error);
        errorResponseBody.err = error;
        if(error.err){
            errorResponseBody.err = error.err;
            return res.status(error.code).json(errorResponseBody);
        }
        errorResponseBody.err = error;
        return res.status(500).json(errorResponseBody);
    }
}
const signin = async (req,res) => {
    try{
        const user = await userService.getUserByEmail(req.body.email);
        const isValidPassword = await user.isValidPassword(req.body.password);
        if(!isValidPassword){            
            return res.status(401).json({
                text : "Invalid password."
            });
        }
        const token = jwt.sign(
            {id : user._id, email: user.email},
            process.env.AUTH_KEY,
            {expiresIn: '1h'}
        );
        successResponseBody.message = "Successfully logged in";
        successResponseBody.data = {
            email : user.email,
            role : user.userRole,
            status : user.userStatus,
            token : token
        };
        return res.status(200).json(successResponseBody);
    } catch(error){
        console.log(error);
        if(error.err){
            errorResponseBody.err = error.err;
            return res.status(error.code).json(errorResponseBody);
        }
        errorResponseBody.err = error;
        return res.status(500).json(errorResponseBody);
    }
}

const resetPassword = async (req,res) => {
    try{
        const user = await userService.getUserById(req.user);
        const isOldPasswordCorrect = await user.isValidPassword(req.body.oldPassword);
        if(!isOldPasswordCorrect){
            throw {err : "Invalid old password, please write the correct old password", code : 403};
        }
        user.password = req.body.newPassword;
        await user.save();
        successResponseBody.data = user;
        successResponseBody.message = "Succesfully updated the password for the given user";
        return res.status(200).json(successResponseBody);
    } catch(error){
        if(error.err){
            errorResponseBody.err = error.err;
            return res.status(error.code).json(errorResponseBody);
        }
        errorResponseBody.err = error;
        return res.status(500).json(errorResponseBody);
    }
}
module.exports = {
    signup,
    signin,
    resetPassword
}