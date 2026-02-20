const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 2
    },

    description: {
        type: String,
        required: true,
        trim: true,
        minlength: 5
    },

    casts: {
        type: [String],
        required: true,
        validate: {
            validator: function(arr) {
                return arr.length > 0 &&
                       arr.every(name => /^[A-Za-z .'-]+$/.test(name));
            },
            message: "Each cast name must contain only valid alphabetic characters"
        }
    },

    trailerUrl: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: function(value) {
                return /^(https?:\/\/)(www\.)?(youtube\.com|youtu\.be)\/.+$/.test(value);
            },
            message: "Trailer URL must be a valid YouTube link"
        }
    },

    language: {
        type: String,
        required: true,
        trim: true,
        default: "English"
    },

    releaseDate: {
        type: String,
        required: true,
        validate: {
            validator: function(value) {
                return /^(19|20)\d{2}$/.test(value);
            },
            message: "Release date must be a valid 4-digit year"
        }
    },

    director: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: function(value) {
                return /^[A-Za-z .'-]+$/.test(value);
            },
            message: "Director name must contain only valid alphabetic characters"
        }
    },

    releaseStatus: {
        type: String,
        required: true,
        enum: ["RELEASED", "UPCOMING", "POSTPONED", "CANCELLED"],
        uppercase: true,
        trim: true,
        default: "UPCOMING"
    }

}, { timestamps: true });

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;