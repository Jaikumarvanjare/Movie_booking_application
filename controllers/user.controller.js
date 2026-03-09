const userService = require ('../services/user.service');
const {errorResponseBody, successResponseBody} = require('../utils/responsebody');
const {STATUS} = require('../utils/constants');

const update = async (req , res) => {
    try {
        const response = await userService.updateUserRoleOrStatus(req.body, req.params.id);
        
        successResponseBody.data = response ;
        successResponseBody.message = 'Successfully updated the user';
        return res.status(STATUS.ok).json(successResponseBody);
    } catch (error) {
        if(error.err){
            errorResponseBody.err = error.err;
            return res.status(500).json(errorResponseBody);
        }
        errorResponseBody.err= error.err;
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
}

module.exports ={
    update
}