const bodyParser = require('body-parser');
const express = require('express'),
    morgan = require('morgan'),
    fs = require('fs'),
    path = require('path');

const app = express();

app.use(bodyParser.json());

let users = [

]

let movies = [
    {
        "title": "Just Go With It",
        "director": "Dennis Dugan",
        "genre": "Romantic Comedy"
    },

    {
        "title": "Bridesmaids",
        "director": "Paul Feig",
        "genre": "Comedy"
    },

    {
        "title": "The Proposal",
        "director": "Anna Fletcher",
        "genre": "Romantic Comedy"
    },

    {
        "title": "Set It Up",
        "director": "Claire Scanlon",
        "genre": "Romantic Comedy"
    },

    {
        "title": "Forgetting Sarah Marshall",
        "director": "Nicholas Stoller",
        "genre": "Romantic Comedy"
    },

    {
        "title": "She\'s the Man",
        "director": "Andy Fickman",
        "genre": "Romantic Comedy"
    },

    {
        "title": "Top Gun\: Maverick",
        "director": "Joseph Kosinski",
        "genre": "Action"
    },

    {
        "title": "I Love You\, Man",
        "director": "John Hamburg",
        "genre": "Comedy"
    },

    {
        "title": "Spider-Man\: No Way Home",
        "director": "Jon Watts",
        "genre": "Action"
    },

    {
        "title": "Superbad",
        "director": "Greg Mottola",
        "genre": "Comedy"
    }
];

// READ
app.get('/movies', (req, res) => {
    res.status(200).json(movies);
})

 READ
app.get('/movies/:title', (req, res) => {
   const { title } = req.params;
   const movie = movies.find( movie => movie.Title === title );

   if (movie) {
    res.status(200).json(movie);
   } else {
    res.status(400).send('no such movie');
   }
});


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

//app.get('/movies', (req, res) => {
  //  res.json(movies);
 //});
  
// error handling 
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });
  

// listen for requests

app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
});
