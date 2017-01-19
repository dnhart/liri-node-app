var fs = require("fs");
var Twitter = require('twitter');
var spotify = require('spotify');
const imdb = require('imdb-api');
var omdb = require('omdb');
var keys =require('./keys.js'); 
// var randomText =require('./random.txt'); 

var divider ="****************************";
var input= process.argv;
var action = process.argv[2];
var searchTerm = input.slice(3);
searchTerm = searchTerm.toString();
serachTerm = searchTerm.replace(/,/g, '+');
var logSearch = action +" "+searchTerm;
logSearch = logSearch.toString().replace(/,/g, ' ');
fs.appendFile("log.txt", logSearch+"\r\n", function(err, data) {});


function inquiry(action) {
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

	  	
		 while(i<20){
		 	
		 	var tweetText="Tweet #"+i+" text:"+tweets[i].text;
		 	var tweetDate="Tweet #"+i+" date:"+tweets[i].created_at
		 	

		 	console.log(tweetText);
		 	console.log(tweetDate);
		

			var logTweet= tweetText+"\r\n"+tweetDate+"\r\n"+"\r\n";
     		logTweet = logTweet.toString();
		 	fs.appendFile("log.txt", logTweet, function(err, data) {});

		 	i++;
		 };
		 // console.log(myTweets);
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
	    	var results = {
	    		SongName: data.name,
	    		SongArtist: data.artists[0].name,
	    		SongURL: data.preview_url
	    	};

	    	console.log("Song Title: "+ results.SongName);
     		console.log("Song Artist(s): "+ results.SongArtist);
     		console.log("Song URL: "+ results.SongURL);


	    	//console.log (results);
			var logSong= "Song Title: "+ results.SongName+"\r\n"+"Song Artist(s): "+results.SongArtist+"\r\n"+"Song URL: "+results.SongURL+"\r\n";
     		logSong = logSong.toString();
        	fs.appendFile("log.txt", logSong+"\r\n", function(err, data) {});
	      // console.log(data.name);
	      // console.log(data.artists[0].name);
	      // console.log(data.preview_url);
	  } else {
	        console.log('Please check your spelling.');
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
	
	    	getMovie(searchTerm);
	 };
    
break;

case "do-what-it-says":

fs.readFile("random.txt", "utf8", function(err, contents) {
	  if (!err){
	var data = contents.split(",");
	//console.log(data);
	action = data[0];
	
	searchTerm = data[1];
	inquiry(action);
}else{
	 console.log('Please check your spelling.');
}

});
break;
    default:
        return false;
};
};
//*************end switch***************************************

function getSong(searchTerm){
	spotify.search({ type: 'track', query: searchTerm}, function(err, data) {
	    if (!err){

	    	var results = {
	    		SongName: data.tracks.items[0].name,
	    		SongArtist: [],
	    		SongURL: data.tracks.items[0].preview_url
	    	};
    //console.log(data.tracks.items[0]);
      // console.log(data.tracks.items[0].name);
    //display all artists
        data.tracks.items[0].artists.map(function(key, index, arr){
        //console.log(key.name);
        		var artists = results.SongArtist;
        		artists.push(key.name);

          });
        //console.log(data.tracks.items[0].preview_url);
     	console.log("Song Title: "+ results.SongName);
     	console.log("Song Artist(s): "+ results.SongArtist);
     	console.log("Song URL: "+ results.SongURL);

     	var logSong= "Song Title: "+ results.SongName+"\r\n"+"Song Artist(s): "+results.SongArtist+"\r\n"+"Song URL: "+results.SongURL+"\r\n";
     	logSong = logSong.toString();
        fs.appendFile("log.txt", logSong+"\r\n", function(err, data) {});
        	// console.log(results);


		// console.log(songAlbum);
      } else {
        console.log('Please check your spelling.');
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

    	var logMovie= "Movie Title: "+movies.title+"\r\n"+"Year Released: "+movies.year+"\r\n"+"IMDB Rating: "+movies.imdb.rating+"\r\n"+"Countries: "+movies.countries+"\r\n"+"Languages: "+data.languages+"\r\n"+"Plot: "+movies.plot+"\r\n"+"Actors: "+movies.actors+"\r\n"+"Rotten Tomatoes Rating: "+movies.tomato.rating+"\r\n"+"Rotten Tomato URL: "+movies.tomato.url+"\r\n";
     	logMovie = logMovie.toString();
        fs.appendFile("log.txt", logMovie+"\r\n", function(err, data) {});



   		// console.log(result);
   		});
    };
    });	
};


inquiry(action);