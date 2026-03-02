const userService = require('../services/user.service');
const {successResponseBody, errorResponseBody} = require('../utils/responsebody');
 
const signup =async (req,res) => {
    try {
        const response = await userService.createUser(req.body);
        successResponseBody.data = response;
        successResponseBody.message= "succcessfully register a account";
        return res.status(200).json(successResponseBody);
    } catch(error) {
        errorResponseBody.err = error;
        return res.status(500).json(errorResponseBody);
    }
}

module.exports = {
    signup
}
