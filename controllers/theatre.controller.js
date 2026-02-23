const theatreService = require('../services/theatre.service');
const {successResponseBody, errorResponseBody} = require('../utils/responsebody');
const createTheatre = async (req, res) => {
    try {
        const response = await theatreService.createTheatre(req.body);
         if(response.err) {
            errorResponseBody.err = response.err;
            errorResponseBody.message = "Validation failed on few parameters of the request body"
            return res.status(response.code).json(errorResponseBody);
        }
        successResponseBody.data = response;
        successResponseBody.message = "Successfully created the theatre";
        return res.status(201).json(successResponseBody);
    }
    catch(error){
        errorResponseBody.data = response;
        errorResponseBody.message = "Something went wrong, not created the theatre";
        return res.status(500).json(errorResponseBody);
        
    }
}

const deleteTheatre = async (req, res) => {
    try {
        const response = await theatreService.deleteTheatre(req.params.id);
         if(response.err) {
            errorResponseBody.err = response.err;
            return res.status(response.code).json(errorResponseBody);
        }
        successResponseBody.data = response;
        successResponseBody.message = "Successfully deleted the given theatre";
        return res.status(200).json(successResponseBody);
    }
    catch(error){
        errorResponseBody.data = reponse;
        errorResponseBody.message = "Something went wrong, not deleted the theatre";
        return res.status(500).json(errorResponseBody);
        
    }
}

const getTheatre = async (req, res) => {
    try {
        const response = await theatreService.getTheatre(req.params.id);
         if(response.err) {
            errorResponseBody.err = response.err;
            return res.status(response.code).json(errorResponseBody);
        }
        successResponseBody.data = response;
        successResponseBody.message = "Successfully created the theatre";
        return res.status(200).json(successResponseBody);
    }
    catch(error){
        errorResponseBody.data = response;
        errorResponseBody.message = "Something went wrong, not created the theatre";
        return res.status(500).json(errorResponseBody);
        
    }
}

module.exports = {
    createTheatre,
    deleteTheatre,
    getTheatre 
}; 