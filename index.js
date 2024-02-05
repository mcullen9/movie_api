const express = require('express'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    uuid = require ('uuid'),
    fs = require('fs'),
    path = require('path'),
    mongoose = require('mongoose'),
    cors = require('cors'); 
const { check, validationResult } = require('express-validator');
const app = express();

//CORS
let allowedOrigins = ['http://localhost:8080', 'http://testsite.com']; //include any domains to be granted access

app.use(cors({
  origin: (origin, callback) => {
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){ 
    // If a specific origin isn’t found on the list of allowed origins
      let message = 'The CORS policy for this application doesn\’t allow access from origin ' + origin;
      return callback(new Error(message ), false);
    }
    return callback(null, true);
  }
}));

app.use(bodyParser.json()); // any time using req.body, data will be expected to be in JSON format
app.use(bodyParser.urlencoded({ extended: true }));

//Import auth.js
let auth = require('./auth')(app); //placed AFTER bodyParser middleware

//Import passport and passport.js
const passport = require('passport');
require('./passport');


//log all requests
// app.use(morgan('common'));
//setup the logger 
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'})
//enable morgan logging to ‘log.txt’ 
app.use(morgan('combined', {stream: accessLogStream}));


//Require Mongoose models from models.js
const Models = require('./models.js');
const Movies = Models.Movie;
const Users = Models.User;
//mongoose.connect('mongodb://localhost:27017/mfDB', { useNewUrlParser: true, useUnifiedTopology: true }); 
mongoose.connect( 'mongodb://process.env.CONNECTION_URI', { useNewUrlParser: true, useUnifiedTopology: true }); 
  


//READ default text at index page
app.get('/', (req, res) => {
    res.send('Welcome to myFlix app!');
   });

//READ movie list
// Return JSON object when at /movies
app.get('/movies', passport.authenticate('jwt', { session: false}), async (req, res) => {
    await Movies.find()
        .then((movies) => {
        res.status(201).json(movies);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

//READ users list
// Return JSON object when at /users
app.get('/users', async (req,res) => {
    await Users.find()
        .then((users) => {
            res.status(201).json(users);
        })
        .catch((err) => {
            res.status(500).send('Error:' + err);
        });
});

//READ movie by title
// GET JSON movie info 
app.get('/movies/:Title', passport.authenticate('jwt', { session: false}), async (req, res) => {
    await Movies.findOne({ Title: req.params.Title })
        .then((movie) => {
            res.json(movie);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
 });

//READ movie genre by genre name
// GET JSON genre info 
app.get('/movies/genres/:genreName', passport.authenticate('jwt', { session: false}), async (req, res) => {
    await Movies.findOne({ 'Genre.Name': req.params.genreName })
        .then((movies) => {
            res.json(movies);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
 });

//READ director info by director name
// GET JSON director info
app.get('/movies/directors/:directorName', passport.authenticate('jwt', { session: false}), async (req, res) => {
    await Movies.findOne({ 'Director.Name': req.params.directorName })
        .then((movies) => {
            res.json(movies);
        })
        .catch((err) => {
            res.status(500).send('Error: ' + err);
        });
 });

//CREATE new user
// Do not add JWT to this  endpoint
    /* We’ll expect JSON in this format
    {
    ID: Integer,
    Username: String,
    Password: String,
    Email: String,
    Birthday: Date
    }*/
app.post('/users',   
    // Validation logic here for request
    //you can either use a chain of methods like .not().isEmpty()
    //which means "opposite of isEmpty" in plain english "is not empty"
    //or use .isLength({min: 5}) which means
    //minimum value of 5 characters are only allowed
    [
    check('Username', 'Username is required').isLength({min: 5}),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()
    ], async (req, res) => {
    //Check the validation object for errors
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    let hashedPassword = Users.hashedPassword(req.body.Password);
    await Users.findOne({ Username: req.body.Username }) // Search to see if a user with the requested username already exists
      .then((user) => {
        if (user) {
        //If the user is found, send a response that it already exists
          return res.status(400).send(req.body.Username + 'already exists');
        } else {
          Users
            .create({
              Username: req.body.Username,
              Password: hashedPassword,
              Email: req.body.Email,
              Birthday: req.body.Birthday
            })
            .then((user) =>{res.status(201).json(user) })
          .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
          });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
      });
  });

//READ a user by username
// GET user by username
app.get('/users/:Username', passport.authenticate('jwt', { session: false}), async (req, res) => {
    await Users.findOne({ Username: req.params.Username })
      .then((user) => {
        res.json(user);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  });

//UPDATE user info by username
    /* We’ll expect JSON in this format
    {
    Username: String,
    (required)
    Password: String,
    (required)
    Email: String,
    (required)
    Birthday: Date
    }*/
app.put('/users/:Username', passport.authenticate('jwt', { session: false }), 
[
    check('Username', 'Username is required').isLength({min: 5}),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()
], async (req, res) => {
    //CONDITION TO CHECK ADDED HERE
   /* if(req.user.Username !== req.params.Username){
        return res.status(400).send('Permission denied');
    }    */
    
    //Check the validation object for errors
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    await Users.findOneAndUpdate({ Username: req.params.Username }, 
        { $set:
            {
            Username: req.body.Username,
            Password: req.body.Password,
            Email: req.body.Email,
            Birthday: req.body.Birthday
            }
    },
    { new: true }) //This line makes sure that the updated document is returned
    .then((updatedUser) => {
      res.json(updatedUser);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    })
  
  });

//CREATE new favorite movie
// Add a movie to a user's list of favorites
app.post('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), async (req, res) => {
   await Users.findOneAndUpdate({ Username: req.params.Username }, 
        { $push: { FavoriteMovies: req.params.MovieID }
     },
     { new: true }) 
    .then((updatedUser) => {
      res.json(updatedUser);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
  });

//DELETE movie from FavoriteMovies
// Remove a movie from a user's list of favorite movies
app.delete('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), async (req, res) => {
   await Users.findOneAndUpdate({ Username: req.params.Username }, {
       $pull: { FavoriteMovies: req.params.MovieID }
     },
     { new: true }) 
    .then((updatedUser) => {
      res.json(updatedUser);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
  });

//DELETE a user by username, allow user to deregister
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), async (req, res) => {
    await Users.findOneAndDelete({ Username: req.params.Username })
      .then((user) => {
        if (!user) {
          res.status(400).send(req.params.Username + ' was not found');
        } else {
          res.status(200).send(req.params.Username + ' was deleted.');
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  });

app.get('/documentation.html', (req,res) => {
  res.sendFile('public/documentation.html', {root: __dirname});
});

//App routing setup
app.use(express.static('public'));

//Error handling 
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});
  
//Listen for requests
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0',() => {
 console.log('Listening on Port ' + port);
});
