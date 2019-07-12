const express = require('express');
const router = express.Router();

// Bring in movie Model
let Movie = require('../models/movie');

// 
router.get('/add', (req, res) => {
    res.render('add_movie', {
        title: 'Add A Movie'
    });
});

// Add Submit POST Route
router.post('/add', (req, res) => {
    req.checkBody('movie_upload', 'Upload Your Favorite Movie').notEmpty();
    req.checkBody('movie_title', 'Movie Title is Required').notEmpty();
    req.checkBody('genre', 'Movie Genre is Required').notEmpty();
    req.checkBody('year_released', 'The Year Released is Required').notEmpty();
    req.checkBody('movie_language', 'The Language Of The Movie is Required').notEmpty();
    req.checkBody('movie_length', 'The length of your movie is Required').notEmpty();
});

let movie = new Movies();
movie.movie_upload = req.body.movie_upload;
movie.movie_title = req.body.movie_title;
movie.genre = req.body.genre;
movie.year_released = req.body.year_released;
movie.movie_language = req.body.movie_language;
movie.movie_length = req.body.movie_length;

gfs.movie.save((err) => {
    if (err) {
        console.log(err);
        return;
    } else {
        req.flash('success', 'A Movie Is Added');
        res.redirect('/');
    }
});

// Load Edit Form
router.get('/edit/:genre', (req, res) => {
    gfs.files.find().toArray((err, files) => {
        res.render('edit_movie', {
            title: 'Edit Movie Info',
            movie: movie
        });
    });
});

// Update Submit POST Route
router.post('/edit/:genre', (req, res) => {
    let movie = {};
    movie.movie_upload = req.body.movie_upload;
    movie.movie_title = req.body.movie_title;
    movie.genre = req.body.genre;
    movie.year_released = req.body.year_released;
    movie.movie_language = req.body.movie_language;
    movie.movie_length = req.body.movie_length;

    let query = { _genre: req.params.genre }

    gfs.Movie.update(query, movie, (err) => {
        if (err) {
            console.log(err);
            return;
        } else {
            req.flash('success', 'Movie Info Is Updated');
            res.redirect('/');
        }
    });
});

// Delete Movie
router.delete('/:genre', (req, res) => {
    let query = { _genre: req.params.genre }

    gfs.Movie.remove(query, (err) => {
        if (err) {
            console.log(err);
        }
        res.send('Success');
    });
});

// Getting Single Movie
router.get('/:genre', (req, res) => {
    gfs.Movie.findById(req.params.id, (err, movie) => {
        res.render('movie', {
            movie: movie
        });
    });
});

module.exports = router;