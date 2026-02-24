const mongoose = require('mongoose');
const { SocketAddress } = require('node:net');
// theatre resources

const theatreSchema = new mongoose.Schema({
    name :{
        type: String,
        required: true,
        trim: true,
        minlength: 2
    },

    description: {
        type: String,
        trim: true
    },

    city :{
        type:String,
        required : true,
        trim: true,
        uppercase: true
    },

    pincode : {
        type : Number,
        required : true, 
        validate: {
            validator: function(value) {
                return /^[1-9][0-9]{5}$/.test(value.toString());
            },
            message: "Pincode must be a valid 6-digit Indian postal code"
        }
    },

    address: {
        type: String,
        trim: true
    }
}, {timestamps : true});

const Theatre = mongoose.model('Theatre', theatreSchema);

module.exports = Theatre;
