const User = require('../models/user.model');
const { USER_ROLE, USER_STATUS, STATUS} = require('../utils/constants');

const createUser = async (data) =>{
    try {
        if(!data.userType || data.userType == USER_ROLE.customer){
            if(data.userStatus && data.userStatus!= USER_STATUS.approved){
                throw {
                    err :"we canot set the any other type for this user", 
                    code : 400
                };
            }
        }
        if(data.userType && data.userType != USER_ROLE.customer){
            data.userStatus = USER_STATUS.pending;
        }

        const response = await  User.create(data);
        console.log(response);
        return response;
    } catch(error){
        console.log(error);
        if(error.name =='ValidationError'){
            let err = {};
            Object.keys(error.errors).forEach((key) => {
                err[key] = error.errors[key].message;
            });
            throw {err : err, code : 422};
        }
        throw error;
    }
}

const getUserByEmail = async (email) => {
    try {
        const response =await User.findOne({
            email: email
        });
        if(!response){
            throw {err : 'No user found for the given email', code :404};
        }
        return response;
    }catch (error){
        console.log(error);
        throw error;
    }
}

const getUserById = async(id) => {
    try{
        const user = await User.findById(id);
        if(!user){
            throw {err : "No user found for the given id", code : 404};
        }
        return user;
    }catch(error){
        console.log(error);    
    throw error;
    }
}

const updateUserRoleOrStatus = async (data, userId) => {
    try {
        let updateQuery = {};

        if(data.userRole) updateQuery.userRole = data.userRole;
        if(data.userStatus) updateQuery.userStatus = data.userStatus;

        let response = await User.findOneAndUpdate(userId, updateQuery, {new: tru, runValidators: true});
        if(!response) throw {err: 'No user found for the given id', code : STATUS.NOT_FOUND};
        
        return response;
    } catch (error){
        console.log(error, error.name);
        if(error.name == 'ValidationError'){
            let err = {};
            Object.keys(error.errors).forEach(key => {
                err[key] = error.errors[key].message;
            });
        throw {err: err, code : STATUS.BAD_REQUEST};
        }
        throw error;
    }
}
module.exports = {
    createUser,
    getUserByEmail,
    getUserById,
    updateUserRoleOrStatus
}