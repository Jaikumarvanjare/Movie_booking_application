const theatreService = require('../services/theatre.service');
const {successResponseBody, errorResponseBody} = require('../utils/responsebody');
const createTheatre = async (req, res) => {
    try {
        const response = await theatreService.createTheatre(req.body);
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

module.exports = {
    createTheatre
}; 