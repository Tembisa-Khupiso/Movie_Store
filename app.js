// Bring in Modules
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');

const mongoURI = 'mongodb://localhost:27017/store';

// Init gfs
let gfs;

// Create mongo connection
const conn = mongoose.createConnection(mongoURI);

conn.once('open', () => {
    // Init stream
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('movie');
});

// Create storage engine
const storage = new GridFsStorage({
    url: mongoURI,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            const filename = file.originalname;
            const fileInfo = {
                filename: filename,
                bucketName: 'movie'
            };
            resolve(fileInfo);
        });
    }
});

const movie = multer({ storage });

// Init App
const app = express();

// Bring in Models
let Movie = require('./models/movie');

// Load View Engine
app.use(methodOverride('_method'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Parseapplication/x-www-form-r=urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// Parse application/json
app.use(bodyParser.json());

// Set Public Folder
app.use(express.static(path.join(__dirname, 'public')));

// Express Session Middleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
}));

// Express Messages Middleware
app.use(require('connect-flash')());
app.use((req, res, next) => {
    res.locals.messages = require('express-messages')(req, res);
    next();
});

// Express Validation Middleware
app.use(expressValidator({
    errorFormatter: (req, param, msg, value) => {
        var namespace = param.split('.'),
            root = namespace.shift(),
            formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));

// Home Route
app.get('/', (req, res) => {
    gfs.Movie.find({}, (err, movies) => {
        if (err) {
            console.log(err);
        } else {
            res.render('index', {
                title: 'Movies',
                movies: movies
            });
        }
    });
});

// Route Files
let movies = require('./routes/movies');
app.use('/movies', movies);

// Start Server
app.listen(8080, () => {
    console.log('Server has started on port:8080');
});