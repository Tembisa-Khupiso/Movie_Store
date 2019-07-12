let mongoose = require('mongoose');

let movieSchema = mongoose.Schema({
    movie_upload: {
        type: String,
        required: true
    },
    movie_title: {
        type: String,
        required: true
    },
    genre: {
        type: String,
        required: true
    },
    year_released: {
        type: String,
        required: true
    },
    movie_language: {
        type: String,
        required: true
    },
    movie_length: {
        type: String,
        required: true
    }
});

let Movie = module.exports = mongoose.model('Movie', movieSchema);