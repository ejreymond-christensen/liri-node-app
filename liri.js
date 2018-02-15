require("dotenv").config();

var keys = require("./keys.js");
var request = require("request");
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var command = process.argv[2];
var nodeRawData = process.argv;

var movieQuery = "";
var musicQuery = "";

/* ====== functions to run the API's ======*/

//The Twitter API
var myTweets = function(){
  console.log("tweettweet");
};

//Spotify API
var spotify = function(nodeRawData){
  console.log("spotty");
};

//Formats the movieQuery var to match OMBD's requirements
var movie = function(nodeRawData){
  console.log("flick");
  for (var i = 3; i < nodeRawData.length; i++) {
    if (i > 3 && i< nodeRawData.length) {
      movieQuery = movieQuery + "+" + nodeRawData[i];
    }else{
      movieQuery += nodeRawData[i];
    }
  }

  //OMDB API call
  var queryUrl = "http://www.omdbapi.com/?t=" + movieQuery + "&y=&plot=short&apikey=trilogy";

  //Node Request function to pull JSON
  request(queryUrl, function(error, response, body){
    if (!error && response.statusCode === 200) {
      console.log("==============================");
      console.log("Title: " + JSON.parse(body).Title + "\nYear: " + JSON.parse(body).Year + "\nIMDB Rating: " + JSON.parse(body).Ratings[0].Value + "\nRotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value + "\nCountry: " + JSON.parse(body).Country + "\nLanguage: " + JSON.parse(body).Language + "\nPlot: " + JSON.parse(body).Plot + "\nActors: " + JSON.parse(body).Actors);
      console.log("==============================");
    }
  });

};


var doWhat = function(){
  console.log("wwwaaaaah, who said dat?");
};


//Switch Statement to verify the user's command
switch (command) {
  case "my-tweets":
    console.log("tweettweet");
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
