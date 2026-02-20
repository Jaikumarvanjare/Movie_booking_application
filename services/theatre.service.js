const theatre = require ('../models/theatre.model')

const createTheatre = async (data) => {
    try{
        const response = await theatre.create(data);
    return response;
    }
    catch(err){
        console.log(err);
        throw err;
    }    
}

module.exports = {
    createTheatre,
}
