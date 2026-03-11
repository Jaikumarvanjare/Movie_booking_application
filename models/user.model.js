const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const {USER_ROLE,USER_STATUS} = require('../utils/constants')
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
        match : [/^\w+([\.-]?\w+)*@\w+([\-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email'],
        lowercase : true,
        trim : true
    },
    password : {
        type : String,
        required : true, 
        minLength : 6
    },
    userRole : {
        type : String,
        required : true,
        uppercase : true,
        enum : {
            values: [USER_ROLE.customer, USER_ROLE.admin, USER_ROLE.client],
            message : "Invalid user role given"
        },
        default : USER_ROLE.customer
    },
    userStatus : {
        type : String, 
        required : true,  
        uppercase : true,
        enum : {
            values : [USER_STATUS.approved, USER_STATUS.pending, USER_STATUS.rejected],
            message : "invalid user status given"
        },
        default : USER_STATUS.approved
    }
}, { timestamps : true, strict : "throw"});

userSchema.pre('save', async function () {  
    if (!this.isModified('password')) return;

    this.password = await bcrypt.hash(this.password, 10);
});

/**
 * This is going to be an instance method for user, to compare a password
 * with the stored encrypted password
 * @param plainPassword -> input password given by user in sign in request
 * @returns boolean denoting whether passwords are same or not ?
 */
userSchema.methods.isValidPassword = async function(plainPassword) {
    return bcrypt.compare(plainPassword, this.password);
}
const User = mongoose.model('User', userSchema);
module.exports = User;