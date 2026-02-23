const Theatre = require ('../models/theatre.model')

const createTheatre = async (data) => {
    try{
        const response = await Theatre.create(data);
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

const deleteTheatre = async(id) => {
    try {
        const response = await Theatre.findByIdAndDelete(id);
        if(!response) {
            return {
                err: "No record of a theatre found for given id",
                code: 404
            }
        }
        return response;
    }catch(error){
        conmnsole.log(error);
        throw error;
    }
}

/**
 * 
 * @param id -> unique id by which we can fetch theatre
 */

const getTheatre= async (id) => {
    try{
        const response = await Theatre.findById(id);
        if(!response){
            return {
                err : "No theatre found for the given id",
                code: 404
            }
      
        }
        return response;
    } catch(error) {
        console.log(err);
        throw error;
    }    
}

const getAllTheatre= async () => {
    try{
        const response = await Theatre.find({});
        if(!response){
            return {
                err : "No theatre found for the given id",
                code: 404
            }      
        }
        return response;
    } catch(error) {
        console.log(err);
        throw error;
    }    
}


module.exports = {
    createTheatre,
    deleteTheatre,
    getTheatre,
    getAllTheatre
}
