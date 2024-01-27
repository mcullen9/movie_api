const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect('mongodb://localhost:27017/mfDB', { useNewUrlParser: true, useUnifiedTopology: true });

const bodyParser = require('body-parser');
const express = require('express'),
    morgan = require('morgan'),
    fs = require('fs'),
    uuid = require ('uuid'),
    path = require('path');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let users = [
    {
        id: 1,
        name: "Jack",
        favoriteMovies: []
    },
    {
        id: 2,
        name: "Susan",
        favoriteMovies: ["Bridesmaids"]
    },
    {
        id: 3,
        name: "John",
        favoriteMovies: ["Top Gun: Maverick"]
    }

]

let movies = [
    {
        "Title":"Just Go With It",
        "Description":"On a weekend trip to Hawaii, a plastic surgeon convinces his loyal assistant to pose as his soon-to-be-divorced wife in order to cover up a careless lie he told to his much-younger girlfriend. (imdb.com)",
        "Genre": {
           "Name":"Romantic Comedy",
           "Description":"Romantic comedy is a subgenre of comedy. It's focused on humorous plotlines centered on romantic ideas, such as dating, marriage, break-ups, and true love. These movies usually contain happy endings."
        },
        "Director": {
            "Name":"Dennis Dugan",
            "Bio":"Dennis Barton Dugan is an American film director, actor, comedian and screenwriter from Wheaton, Illinois who directed several films featuring Adam Sandler including Happy Gilmore, Big Daddy, Jack & Jill, Grown Ups, I Now Pronounce You Chuck & Larry and You Don't Mess With the Zohan. He also directed Beverly Hills Ninja and The Benchwarmers. (imdb.com)",
            "Birth":"1946"
        },
        "ImageURL":"",
        "Featured":""
    },

    {
        "Title":"Bridesmaids",
        "Description":"Competition between the maid of honor and a bridesmaid, over who is the bride's best friend, threatens to upend the life of an out-of-work pastry chef. (imdb.com)",
        "Genre": {
            "Name":"Comedy",
            "Description":"A comedy film is a category of film that emphasizes humor. These films are designed to amuse audiences and make them laugh. Films in this genre typically have a happy ending, with dark comedy being an exception to this rule."
         },
        "Director": {
            "Name":"Paul Feig",
            "Bio":"Paul Feig is an American film director and writer who is known for creating Freaks and Geeks and directing Bridesmaids, The Heat, Spy and A Simple Favor. He is known for directing films starring frequent collaborator Melissa McCarthy. He also directed the highly controversial 2016 reboot of Ghostbusters. He also directed episodes of The Office. (imdb.com)",
            "Birth":"1962"
        },
        "ImageURL":"https://picfiles.alphacoders.com/774/thumb-1920-77421.jpg",
        "Featured": true
    },

    {
        "Title":"The Proposal",
        "Description":"A pushy boss forces her young assistant to marry her in order to keep her visa status in the U.S. and avoid deportation to Canada. (imdb.com)",
        "Genre": {
            "Name":"Romantic Comedy",
            "Description":"Romantic comedy is a subgenre of comedy. It's focused on humorous plotlines centered on romantic ideas, such as dating, marriage, break-ups, and true love. These movies usually contain happy endings."
         },
        "Director": {
            "Name":"Anne Fletcher",
            "Bio":"Anne Fletcher was born on 1 May 1966 in Detroit, Michigan, USA. She is a director and actress, known for The Proposal (2009), Step Up (2006) and Hairspray (2007). (imdb.com)",
            "Birth":"1966"
        },
        "ImageURL":"",
        "Featured":""
    },

    {
        "Title":"Set It Up",
        "Description":"Two corporate executive assistants hatch a plan to match-make their two bosses. (imdb.com)",
        "Genre": {
            "Name":"Romantic Comedy",
            "Description":"Romantic comedy is a subgenre of comedy. It's focused on humorous plotlines centered on romantic ideas, such as dating, marriage, break-ups, and true love. These movies usually contain happy endings."
         },
        "Director": {
            "Name":"Claire Scanlon",
            "Bio":"Claire Scanlon directs single cam comedies for both network and cable. She started her career editing documentaries for PBS and the Discovery Channel. After supervising post and producing Last Comic Standing, she joined The Office in its fifth season. After directing The Office, Claire transitioned over to directing full time in 2013. (imdb.com)",
            "Birth":"1971"
        },
        "ImageURL":"",
        "Featured":""
    },

    {
        "Title":"Forgetting Sarah Marshall",
        "Description":"Devastated Peter takes a Hawaiian vacation in order to deal with the recent break-up with his TV star girlfriend, Sarah. Little does he know, Sarah's traveling to the same resort as her ex - and she's bringing along her new boyfriend. (imdb.com)",
        "Genre": {
            "Name":"Romantic Comedy",
            "Description":"Romantic comedy is a subgenre of comedy. It's focused on humorous plotlines centered on romantic ideas, such as dating, marriage, break-ups, and true love. These movies usually contain happy endings."
         },
        "Director": {
            "Name":"Nicholas Stoller",
            "Bio":"Nicholas Stoller is an English-American screenwriter and director. He is known best for directing the 2008 comedy Forgetting Sarah Marshall, and writing/directing its 2010 spin-off/sequel, Get Him to the Greek. He also wrote The Muppets and directed the Seth Rogen comedy, Neighbors. He is a frequent creative partner of Jason Segel. (imdb.com)",
            "Birth":"1976"
        },
        "ImageURL":"",
        "Featured":""
    },

    {
        "Title":"She's the Man",
        "Description":"When her brother decides to ditch for a couple weeks, Viola heads over to his elite boarding school, disguised as him, and proceeds to fall for his school's star soccer player, and soon learns she's not the only one with romantic troubles. (imdb.com)",
        "Genre": {
            "Name":"Romantic Comedy",
            "Description":"Romantic comedy is a subgenre of comedy. It's focused on humorous plotlines centered on romantic ideas, such as dating, marriage, break-ups, and true love. These movies usually contain happy endings."
         },
        "Director": {
            "Name":"Andy Fickman",
            "Bio":"Andy Fickman was born on 25 December 1963 in Midland, Texas, USA. He is a producer and director, known for Paul Blart: Mall Cop 2 (2015), Race to Witch Mountain (2009) and Anaconda (1997). (imdb.com)",
            "Birth":"1963"
        },
        "ImageURL":"",
        "Featured":""
    },

    {
        "Title":"Top Gun: Maverick",
        "Description":"After thirty years, Maverick is still pushing the envelope as a top naval aviator, but must confront ghosts of his past when he leads TOP GUN's elite graduates on a mission that demands the ultimate sacrifice from those chosen to fly it. (imdb.com)",
        "Genre": {
            "Name":"Action",
            "Description":"Action film is a film genre in which the protagonist is thrust into a series of events that typically involve violence and physical feats. The genre tends to feature a mostly resourceful hero struggling against incredible odds, which include life-threatening situations, an indestructible villain, or a pursuit which usually concludes in victory for the hero."
         },
        "Director": {
            "Name":"Joseph Kosinski",
            "Bio":"Joseph Kosinski is a director whose uncompromising style has quickly made a mark in the filmmaking zeitgeist. His four theatrical releases have grossed $2.2 billion worldwide and been nominated for 7 Academy Awards and 2 Grammys. Joseph received his undergraduate degree in Mechanical Engineering at Stanford University and a Masters in Architecture from Columbia University. (imdb.com)",
            "Birth":"1974"
        },
        "ImageURL":"",
        "Featured":""
    },

    {
        "Title":"I Love You, Man",
        "Description":"Friendless Peter Klaven goes on a series of man-dates to find a Best Man for his wedding. But, when his insta-bond with his new B.F.F. puts a strain on his relationship with his fiancée, can the trio learn to live happily ever after? (imdb.com)",
        "Genre": {
            "Name":"Comedy",
            "Description":"A comedy film is a category of film that emphasizes humor. These films are designed to amuse audiences and make them laugh. Films in this genre typically have a happy ending, with dark comedy being an exception to this rule."
         },
        "Director": {
            "Name":"John Hamburg",
            "Bio":"John Hamburg was born on May 26, 1970 in New York City, New York, USA. He is a producer and director, known for Little Fockers (2010), Why Him? (2016) and I Love You, Man (2009). He has been married to Christina Kirk since September 24, 2005. (imdb.com)",
            "Birth":"1970"
        },
        "ImageURL":"",
        "Featured":""
    },

    {
        "Title":"Spider-Man: No Way Home",
        "Description":"With Spider-Man's identity now revealed, Peter asks Doctor Strange for help. When a spell goes wrong, dangerous foes from other worlds start to appear, forcing Peter to discover what it truly means to be Spider-Man. (imdb.com)",
        "Genre": {
            "Name":"Action",
            "Description":"Action film is a film genre in which the protagonist is thrust into a series of events that typically involve violence and physical feats. The genre tends to feature a mostly resourceful hero struggling against incredible odds, which include life-threatening situations, an indestructible villain, or a pursuit which usually concludes in victory for the hero."
         },
        "Director": {
            "Name":"Jon Watts",
            "Bio":"Jon Watts is an American filmmaker and screenwriter. He directed Cop Car and Clown before he was picked by Marvel and Sony to direct Spider-Man: Homecoming starring Tom Holland and Zendaya. It's success resulted in two sequels, Far from Home in 2019 and No Way Home in 2021. He was also picked by Marvel to direct a Fantastic Four reboot film following the failure of Josh Trank's Fant4stic, but dropped the directing role in April 2022. (imdb.com)",
            "Birth":"1981"
        },
        "ImageURL":"",
        "Featured":""
    },

    {
        "Title":"Superbad",
        "Description":"Two co-dependent high school seniors are forced to deal with separation anxiety after their plan to stage a booze-soaked party goes awry. (imdb.com)",
        "Genre": {
            "Name":"Comedy",
            "Description":"A comedy film is a category of film that emphasizes humor. These films are designed to amuse audiences and make them laugh. Films in this genre typically have a happy ending, with dark comedy being an exception to this rule."
         },
        "Director": {
            "Name":"Greg Mottola",
            "Bio":"Greg Mottola was born on 11 July 1964 in Dix Hills, Long Island, New York, USA. He is a producer and director, known for Adventureland (2009), The Daytrippers (1996) and Superbad (2007). He is married to Sarah Allentuch. They have three children. (imdb.com)",
            "Birth":"1964"
        },
        "ImageURL":"",
        "Featured":""
    }   
];

// CREATE
//Add a user
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

// UPDATE
app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const updatedUser = req.body;

   let user = users.find( user => user.id == id);

   if (user) {
    user.name = updatedUser.name;
    res.status(200).json(user);
   } else {
    res.status(400).send('no such user')
   }
})

// CREATE
app.post('/users/:id/:movieTitle', (req, res) => {
    const { id, movieTitle } = req.params;
   
   let user = users.find( user => user.id == id);

   if (user) {
    user.favoriteMovies.push(movieTitle);
    res.status(200).send(`${movieTitle} has been added to user ${id}'s array`);
   } else {
    res.status(400).send('no such user')
   }
})

// DELETE
app.delete('/users/:id/:movieTitle', (req, res) => {
    const { id, movieTitle } = req.params;
   
   let user = users.find( user => user.id == id);

   if (user) {
    user.favoriteMovies = user.favoriteMovies.filter( title => title !== movieTitle);
    res.status(200).send(`${movieTitle} has been removed from user ${id}'s array`);
   } else {
    res.status(400).send('no such user')
   }
})

// DELETE
app.delete('/users/:id', (req, res) => {
    const { id } = req.params;
   
   let user = users.find( user => user.id == id);

   if (user) {
    users = users.filter( user => user.id != id);
    res.status(200).send(`user ${id} has been deleted`);
   } else {
    res.status(400).send('no such user')
   }
})


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

// READ
app.get('/movies/genre/:genreName', (req, res) => {
    const { genreName } = req.params;
    const genre = movies.find( movie => movie.Genre.Name === genreName ).Genre;
 
    if (genre) {
     res.status(200).json(genre);
    } else {
     res.status(400).send('no such genre');
    }
 })

 // READ
app.get('/movies/directors/:directorName', (req, res) => {
    const { directorName } = req.params;
    const director = movies.find( movie => movie.Director.Name === directorName ).Director;
 
    if (director) {
     res.status(200).json(director);
    } else {
     res.status(400).send('no such director');
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
