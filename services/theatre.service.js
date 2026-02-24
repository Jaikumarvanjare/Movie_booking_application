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
        console.log(error);
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
        console.log(error);
        throw error;
    }    
}

const getAllTheatre= async (data) => {
    try{
        let query = {};
        let pagination = {};
        if(data && data.city) {
            query.city = data.city;
        } const Theatre = require ('../models/theatre.model')

        if(data && data.pincode) {
            query.pincode = data.pincode;
        }
        if(data && data.name) {
            query.name = data.name;
        }
        if(data && data.limit){
            pagination.limit = data.limit;
        }
        if(data && data.skip){
            let perPage = (data.limit) ? data.limit :3;
            pagination.skip = data.skip*perPage;
        }
        const response = await Theatre.find(query, {}, pagination);    

        return response;
    } catch(error) {
        console.log(error);
        throw error;
    }    
}

const updateTheatre = async (id, data) => {
    try {
        const response = await Theatre.findByIdAndUpdate(id, data, {
            new: true, runValidators: true
        });
        if(!response) {
            return {
                err: "No theatre found for the given id",
                code: 404
            }
        }
        return response;
    } catch (error) {
        if(error.name == 'ValidationError') {
            let err = {};
            Object.keys(error.errors).forEach((key) => {
                err[key] = error.errors[key].message;
            });
            return {err: err, code: 422}
        }
        throw error;
    }
}


module.exports = {
    createTheatre,
    deleteTheatre,
    getTheatre,
    getAllTheatre,
    updateTheatre
}
