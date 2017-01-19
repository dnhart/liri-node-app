var fs = require("fs");
var Twitter = require('twitter');
var spotify = require('spotify');
const imdb = require('imdb-api');
var omdb = require('omdb');
var keys =require('./keys.js'); 
var randomText =require('./random.txt'); 


var input= process.argv;
var action = process.argv[2];
var searchTerm = input.slice(3);
searchTerm = searchTerm.toString();
serachTerm = searchTerm.replace(/,/g, '+');


switch(action){

//tweets
case "my-tweets":

	 
	var client = new Twitter({
	  consumer_key: keys.twitterKeys.consumer_key,
	  consumer_secret: keys.twitterKeys.consumer_secret,
	  access_token_key: keys.twitterKeys.access_token_key,
	  access_token_secret: keys.twitterKeys.access_token_secret
	});
	//  console.log(client.consumer_key);
	var params = {screen_name: 'dnhart'};

	client.get('statuses/user_timeline', params, function(error, tweets, response) {
	  if (!error) {
	  	var i=0;

	  	//I did 10 because I don't have 20 tweets
		 while(i<10){
		 	console.log(tweets[i].text);
		 	console.log(tweets[i].created_at);
		 	i++;
		 };
	  } else {
	  	console.log("error happened");
	  }
	});
break;

//song search
case "spotify-this-song":


	//check if there is a song entered
	if (searchTerm) {
	  //if song entered, search for song
	  getSong(searchTerm);
	  
	  //if no song entered
	 } else {
	      spotify.lookup({ type: 'track', id: '3DYVWvPh3kGwPasp7yjahc'}, function(err, data) {
	    if (!err){
	      console.log(data.name);
	      console.log(data.artists[0].name);
	      console.log(data.preview_url);
	  } else {
	        console.log('Spotify is not working');
	  };
	      });
	 };



break;

//movie search
case "movie-this":


	//check if there is a movie entered
	if (searchTerm) {

		getMovie(searchTerm);
	   
	    } else {
	    	searchTerm = "Mr. Nobody";
			searchTerm = searchTerm.toString();
			serachTerm = searchTerm.replace(/,/g, '+');
	    	getMovie(searchTerm);
	 };
    
break;

case "do-what-it-says":
var array = fs.readFile(randomText).toString().split(",");
	// fs.readFile(randomText, "utf8", function(error, data){
		    // if (err) throw err;
    console.log(array);
	// var text = data.split(",");
	// console.log(text);

break;
    default:
        return false;
};
//*************end switch***************************************

function getSong(searchTerm){
	spotify.search({ type: 'track', query: searchTerm}, function(err, data) {
	    if (!err){
    //console.log(data.tracks.items[0]);
       console.log(data.tracks.items[0].name);
    //display all artists
        data.tracks.items[0].artists.map(function(key, index, arr){
        console.log(key.name);
          });
        console.log(data.tracks.items[0].preview_url);
     
		// console.log(songAlbum);
      } else {
        console.log('Spotify is not working');
      };

});
};

//function to get movie data
function getMovie(searchTerm){

	var params = {
    	title: searchTerm,
    	type: 'movie',
	}

	var options = {
		tomatoes: true
	}

	//call ombd to get info
	omdb.get(params, options, function(err, movies) {
    if(err) {
        return console.error(err);
    }
 
    if(movies.length < 1) {
        return console.log('No movies were found!');
    } else {

    	var imdbID = movies.imdb.id;
    	//since omdb didn't have languages, call the imdb
    	imdb.getById(imdbID, function(err, data) {
    		// console.log(data.languages);

    	//console.log all results
    	console.log("Movie Title: "+movies.title);
    	console.log("Year Released: "+movies.year);
    	console.log("IMDB Rating: "+movies.imdb.rating);
    	console.log("Countries: "+movies.countries);
    	console.log("Languages: "+data.languages);
    	console.log("Plot: "+movies.plot);
    	console.log("Actors: "+movies.actors);
    	console.log("Rotten Tomatoes Rating: "+movies.tomato.rating);
    	console.log("Rotten Tomato URL: "+movies.tomato.url);

   		// console.log(result);
   		});
    };
    });	
};