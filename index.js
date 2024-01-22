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
        "Title": "Just Go With It",
        "Director": "Dennis Dugan",
        "Genre": "Romantic Comedy"
    },

    {
        "Title": "Bridesmaids",
        "Director": "Paul Feig",
        "Genre": "Comedy"
    },

    {
        "Title": "The Proposal",
        "Director": "Anna Fletcher",
        "Genre": "Romantic Comedy"
    },

    {
        "Title": "Set It Up",
        "Director": "Claire Scanlon",
        "Genre": "Romantic Comedy"
    },

    {
        "Title": "Forgetting Sarah Marshall",
        "Director": "Nicholas Stoller",
        "Genre": "Romantic Comedy"
    },

    {
        "Title": "She\'s the Man",
        "Director": "Andy Fickman",
        "Genre": "Romantic Comedy"
    },

    {
        "Title": "Top Gun\: Maverick",
        "Director": "Joseph Kosinski",
        "Genre": "Action"
    },

    {
        "Title": "I Love You\, Man",
        "Director": "John Hamburg",
        "Genre": "Comedy"
    },

    {
        "Title": "Spider-Man\: No Way Home",
        "Director": "Jon Watts",
        "Genre": "Action"
    },

    {
        "Title": "Superbad",
        "Director": "Greg Mottola",
        "Genre": "Comedy"
    }
];

// READ
app.get('/movies', (req, res) => {
    res.status(200).json(movies);
})

// READ
app.get('/movies/:title', (req, res) => {
   const { title } = req.params;
   const movie = movies.find( movie => movie.Title === title );

   if (movie) {
    res.status(200).json(movie);
   } else {
    res.status(400).send('no such movie');
   }
})


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
