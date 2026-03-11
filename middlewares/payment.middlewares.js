const {STATUS} = require ('../utils/constants');
const {errorResponseBody, successResponseBody} = require('../utils/responsebody');
const  ObjectId = require('mongoose').Types.ObjectId;

const verifyPaymentCreateRequest = async(req, res, next) => {
    //validate bookingId presence
    if(!req.body.bookingId){
        errorResponseBody.err = 'No booking id recieved';
        return res.status(STATUS.BAD_REQUEST).json(errorResponseBody);
    }
    //validate bookingId 
    if(!ObjectId.isValid(req.body.bookingId)){
        errorResponseBody.err = 'Invalid booking id';
        return res.status(STATUS.BAD_REQUEST).json(errorResponseBody);
    }
    //validate amount presence 
    if(!req.body.amount){
        errorResponseBody.err = 'No amount Sent';
        return res.status(STATUS.BAD_REQUEST).json(errorResponseBody);
    }
    next();
}

module.exports = {
    verifyPaymentCreateRequest
}