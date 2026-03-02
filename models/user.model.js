const mongoose = require('mongoose');

const userSchema =new mongoose.Schema({
    name : {
        type : String,
        required : true,
        unique : true
    },
    email : {
        type : String,
        required : true,
        unique : true,
        match : [,/^\w+([\.-]?\w+)*@\w+([\-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email'],
        lowercase : true,
        trim : true
    },
    password : {
        type : String,
        required : true, 
        minLength : 6
    },
    userType : {
        type : String,
        required : true,
        default : "CUSTOMER"
    },
    userStatus : {
        type : String, 
        requireed : true,
        default : "APPROVED"
    }
}, {timeStamp : true});

const User = mongoose.model('User', userSchema);
module.exports = User;