const express = require('express'),
    morgan = require('morgan'),
    fs = require('fs'),
    path = require('path');

const app = express();

let topMovies = [
    {
        title: 'Just Go With It',
        director: 'Dennis Dugan',
        genre: ['Comedy', 'Romance']
    },

    {
        title: 'Bridesmaids',
        director: 'Paul Feig',
        genre: 'Comedy'
    },

    {
        title: 'The Proposal',
        director: 'Anna Fletcher',
        genre: ['Comedy', 'Romance', 'Drama']
    },

    {
        title: 'Set It Up',
        director: 'Claire Scanlon',
        genre: ['Comedy', 'Romance']
    },

    {
        title: 'Forgetting Sarah Marshall',
        director: 'Nicholas Stoller',
        genre: ['Comedy', 'Romance', 'Drama']
    },

    {
        title: 'She\'s the Man',
        director: 'Andy Fickman',
        genre: ['Comedy', 'Romance', 'Sport']
    },

    {
        title: 'Top Gun\: Maverick',
        director: 'Joseph Kosinski',
        genre: ['Action', 'Drama']
    },

    {
        title: 'I Love You \, Man',
        director: 'John Hamburg',
        genre: ['Comedy', 'Romance']
    },

    {
        title: 'Spider-Man\: No Way Home',
        director: 'Jon Watts',
        genre: ['Action', 'Adventure', 'Fantasy']
    },

    {
        title: 'Superbad',
        director: 'Greg Mottola',
        genre: 'Comedy'
    }
];


// setup the logger 
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'})
// enable morgan logging to ‘log.txt’ 
app.use(morgan('combined', {stream: accessLogStream}));

// setup app routing
app.use(express.static('public'));

// GET requests
app.get('/', (req, res) => {
    res.send('Welcome to myFlix app!');
  });

app.get('/documentation.html', (req,res) => {
    res.sendFile('public/documentation.html', {root: __dirname});
});

app.get('/movies', (req, res) => {
    res.json(topMovies);
  });
  
// error handling 
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });
  

// listen for requests

app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
});
