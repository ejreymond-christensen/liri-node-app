require("dotenv").config();

var keys = require("./keys.js");
var request = require("request");
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var fs = require('fs');

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var command = process.argv[2];
var nodeRawData = process.argv;

var movieQuery = "";

/* ====== functions to run the API's ====== */

//The Twitter API
var myTweets = function() {
  client.get('statuses/user_timeline', function(error, tweets, response) {
    if (error)
      throw error;
    console.log("==============================");
    for (var key in tweets) {
      console.log('"' + tweets[key].text + '" - ' + tweets[key].created_at);
    }
    console.log("==============================");
  });
};

//Spotify API
var spotify = function(nodeRawData) {
  var query;
  if (process.argv[3] === "" || process.argv[3] === undefined) {
    query = "The Sign ace of base";
    spotification(query);
  } else {
    query = process.argv[3];
    spotification(query);
  }

};

var spotification = function(query) {
  console.log(query);
  var spotify = new Spotify(keys.spotify);
  spotify.search({type: 'track', query: query, limit: 1}).then(function(response) {

    for (var i = 0; i < response.tracks.items.length; i++) {
      console.log("==============================");
      console.log("Artist: " + response.tracks.items[i].artists[0].name);
      console.log("Song: " + response.tracks.items[i].name);
      console.log("Ablum: " + response.tracks.items[i].album.name);
      console.log("Preview: " + response.tracks.items[i].preview_url);
      console.log("==============================");

    }
  }).catch(function(err) {
    console.log(err);
  });
};

//Formats the movieQuery var to match OMBD's requirements
var movie = function(nodeRawData) {
  console.log(process.argv[3]);
  for (var i = 3; i < nodeRawData.length; i++) {
    if (nodeRawData[3] === "" || nodeRawData[3] === undefined) {
      movieQuery = "Mr. Nobody";
    } else if (i > 3 && i < nodeRawData.length) {
      movieQuery = movieQuery + "+" + nodeRawData[i];
    } else {
      movieQuery += nodeRawData[i];
    }
  }
  movieRequest(movieQuery);
};

var movieRequest = function(movieQuery) {
  //OMDB API call
  var queryUrl = "http://www.omdbapi.com/?t=" + movieQuery + "&y=&plot=short&apikey=trilogy";

  //Node Request function to pull JSON
  request(queryUrl, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      console.log("==============================");
      console.log("Title: " + JSON.parse(body).Title + "\nYear: " + JSON.parse(body).Year + "\nIMDB Rating: " + JSON.parse(body).Ratings[0].Value + "\nRotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value + "\nCountry: " + JSON.parse(body).Country + "\nLanguage: " + JSON.parse(body).Language + "\nPlot: " + JSON.parse(body).Plot + "\nActors: " + JSON.parse(body).Actors);
      console.log("==============================");
    }
  });
};

var doWhat = function() {
  fs.readFile("random.txt", "utf8", function(error, data) {
    var twitterData = data.trim();
    var newData = data.trim().split(',');
    var command = newData[0];
    console.log(data);
    var query = newData[1];
    if (command === "my-tweets" || twitterData === "my-tweets") {
      console.log("coucou");
      myTweets();
    }
    if (command === "spotify-this-song") {
      spotification(query);
    }
    if (command === "movie-this") {
      movieRequest(query);
    }
  });
};

//Switch Statement to verify the user's command
switch (command) {
  case "my-tweets":
    myTweets();
    break;
  case "spotify-this-song":
    spotify(nodeRawData);
    break;
  case "movie-this":
    movie(nodeRawData);
    break;
  case "do-what-it-says":
    doWhat();
    break;
  default:
    console.log("Sorry, please choose a valid command");
}
