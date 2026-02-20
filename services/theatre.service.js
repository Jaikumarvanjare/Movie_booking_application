const theatre = require ('../models/theatre.model')

const createTheatre = async (data) => {
    try{
        const response = await theatre.create(data);
        return response;
    }
    catch(error){
        if(error.name == 'ValidationError') {
            let err = {};
            Object.keys(error.errors).forEach((key) => {
                err[key] = error.errors[key].message;
            });
            console.log(err);
            return {err: err, code: 422};
        } else {
            throw error;
        }
    }    
}

module.exports = {
    createTheatre,
}
