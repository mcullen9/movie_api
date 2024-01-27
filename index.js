const express = require('express'),
    bodyParser = require('body-parser'),
    uuid = require ('uuid');

const morgan = require('morgan'),
    fs = require('fs'),
    path = require('path');

const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;
//const Genres = Models.Genre;
//const Directors = Models.Director;

mongoose.connect('mongodb://localhost:27017/mfDB', { useNewUrlParser: true, useUnifiedTopology: true }); 
   
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// setup the logger 
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'})
// enable morgan logging to ‘log.txt’ 
app.use(morgan('combined', {stream: accessLogStream}));

// setup app routing
app.use(express.static('public'));


// Default text response when at /
app.get('/', (req, res) => {
    res.send('Welcome to myFlix app!');
   });

// Return JSON object when at /movies
// READ
app.get('/movies', (req, res) => {
    Movies.find()
        .then((movies) => {
        res.status(201).json(movies);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});
// Return JSON object when at /users
app.get('/users', (req,res) => {
    Users.find()
        .then((users) => {
            res.status(201).json(users);
        })
        .catch((err) => {
            res.status(500).send('Error:' + err);
        });
});

// GET JSON movie info when looking for specific title
// READ
app.get('/movies/:Title', (req, res) => {
    Movies.findOne({ Title: req.params.Title })
        .then((movie) => {
            res.json(movie);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
 });

 // GET JSON genre info when looking for specific genre
 // READ
app.get('/movies/genres/:Name', (req, res) => {
    Genres.findOne({ Name: req.params.Name })
        .then((genre) => {
            res.json(genre.Description);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
 });

// GET info on director when looking for specific director
// READ
app.get('/movies/directors/:Name', (req, res) => {
    Directors.findOne({ Name: req.params.Name })
        .then((director) => {
            res.json(director);
        })
        .catch((err) => {
            res.status(500).send('Error: ' + err);
        });
 });

//Add a user/allow user to register
/* We’ll expect JSON in this format
{
  ID: Integer,
  Username: String,
  Password: String,
  Email: String,
  Birthday: Date
}*/
app.post('/users', async (req, res) => {
    await Users.findOne({ Username: req.body.Username })
      .then((user) => {
        if (user) {
          return res.status(400).send(req.body.Username + 'already exists');
        } else {
          Users
            .create({
              Username: req.body.Username,
              Password: req.body.Password,
              Email: req.body.Email,
              Birthday: req.body.Birthday
            })
            .then((user) =>{res.status(201).json(user) })
          .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
          })
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
      });
  });

// READ 
// GET a user by username
app.get('/users/:Username', async (req, res) => {
    await Users.findOne({ Username: req.params.Username })
      .then((user) => {
        res.json(user);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  });

// Update a user's info, by username
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
app.put('/users/:Username', async (req, res) => {
    await Users.findOneAndUpdate({ Username: req.params.Username }, { $set:
      {
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthday: req.body.Birthday
      }
    },
    { new: true }) 
    .then((updatedUser) => {
      res.json(updatedUser);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    })
  
  });

// Add a movie to a user's list of favorites
app.post('/users/:Username/movies/:MovieID', async (req, res) => {
    await Users.findOneAndUpdate({ Username: req.params.Username }, {
       $push: { FavoriteMovies: req.params.MovieID }
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

  // Remove a movie from a user's list of favorites
app.delete('/users/:Username/movies/:MovieID', async (req, res) => {
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

// DELETE a user by username, allow user to deregister
app.delete('/users/:Username', async (req, res) => {
    await Users.findOneAndRemove({ Username: req.params.Username })
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

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });
  
// listen for requests

app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
});
