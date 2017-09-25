var fs = require('fs');
var request = require('request');
var Twitter = require('twitter');
var keys = require('./keys.js');
var Spotify = require('node-spotify-api');
var inquirer = require('inquirer');
var colors = require('colors');
	
	var client = new Twitter({
		consumer_key: keys.twitterKeys.consumer_key,
		consumer_secret: keys.twitterKeys.consumer_secret,
		access_token_key: keys.twitterKeys.access_token_key,
		access_token_secret: keys.twitterKeys.access_token_secret
	})

	var spotify = new Spotify({
	  id: keys.spotifyKeys.id,
	  secret: keys.spotifyKeys.secret
	});

	inquirer.
	prompt([
		{
			type: "list",
	        name: "requestType",
	        message: "Select what you would like to do",
	        choices: ['my-tweets', 'spotify-this-song', 'movie-this', 'do-what-it-says']
		}
	])
	.then(function(inquirerResponse) {
		var operator = inquirerResponse.requestType;
		console.log(`The response is ${operator}`);

		    if(operator == 'my-tweets') {
					myTweets();
					return;
				}
		    	else if (operator == 'spotify-this-song') {
			    	inquirer.prompt([
			    		{	
			      			type: "input",
		        			message: "What song would you like to look up?".magenta,
		        			name: "song"
		        		}
			      	])
			      	.then(function(spotify) {
			      		if(!spotify.song) {
			      			selectSong('The Sign Ace of Base')
			      		} else {
			      			selectSong(spotify.song);
			      		}
			      	})		    	
		    	}
		    	else if (operator == 'movie-this') {
			    	inquirer.prompt([
			    		{
				      		type: "input",
			        		message: "What movie would you like to look up?".magenta,
			        		name: "movie"
			        	}
			      	])	
			      	.then(function(omdb) {
			      		selectMovie(omdb.movie);
			      	})		    	
		    	}
		    	else if (operator == 'do-what-it-says') {
					fs.readFile('random.txt', 'utf8', function(err, data) {
						if(err) {
							return console.log(err);
							}
							var directions = data.split(', ');	
							
							switch(directions[0]) {
								case 'my-tweets': {
									myTweets();
									return;
								}
								case 'spotify-this-song': {
									selectSong(directions[1]);
									return
								}
								case 'movie-this': {
									selectMovie(directions[1]);
									return
								}
								default: {
									console.log('Nothing in file');
									return;
								}
							}
					});		    	
		    	}
		    	else {
		    		console.log('Nothing selected');
		    	}

	});



function myTweets() {
	var params = {screen_name: 'dconcolor1', count: 20};

	client.get('statuses/user_timeline', params, function(error, tweets, response) {
	    // console.log(tweets[0]);
		if (!error) {
	      for (var i = 0; i < tweets.length; i++) {
	      	console.log(`Created: ${tweets[i].created_at}\nTweet: ${tweets[i].text}\n`.blue);
	      }
	    }
	})
}

function selectSong(songName) {

	var limit = 3;

	spotify.search({ type: 'track', query: songName, limit: limit}, function(err, data) {
	  if (err) {
	    return console.log('Error occurred: ' + err);
	  }
	  		console.log(`\n`);
	  		console.log(`----------------------------------------`.green);
			console.log(`Search Results for Song: ${songName}`.yellow);
			console.log(`----------------------------------------`.green);
			console.log(`\n`);

		for(var i = 0; i < limit; i++) {

			console.log(`Result ${i+1}`);
			console.log(`----------------------------------------`.green);
			console.log(`Artist(s) Name: ${data.tracks.items[i].artists[0].name}`.cyan); 
			console.log(`Album Name: ${data.tracks.items[i].album.name}`.cyan); 
			console.log(`Song Name: ${data.tracks.items[i].name}`.cyan);  
			console.log(`Spotify Preview Link: ${data.tracks.items[i].external_urls.spotify}`.cyan); 
			console.log(`Popularity: ${data.tracks.items[i].popularity}`.cyan); 
			console.log(`----------------------------------------`.green);
			console.log(`\n`);
		}
	});
		
}

function selectMovie(movieName) {
	// var movieName = process.argv[3];
		// Then run a request to the OMDB API with the movie specified
		  	var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=40e9cece";
		  
		// console.log(queryUrl);
		request(queryUrl, function(error, response, body) {
		  // If the request is successful (i.e. if the response status code is 200)
			  if (!error && response.statusCode === 200) {
			console.log(`\n`);	  	
	  		console.log(`----------------------------------------`.green);
			console.log(`Search Results for Movie: ${movieName}`.yellow);
			console.log(`----------------------------------------`.green);
			console.log(`\n`);			  	

			    console.log(`This movie title you requested was ${JSON.parse(body).Title}`.cyan);
			    console.log(`This movie was released in ${JSON.parse(body).Year}`.cyan);
			    console.log(`This IMDB rating for this movie is ${JSON.parse(body).imdbRating}`.cyan);
			    console.log(`This Rotten Tomatoes rating is ${JSON.parse(body).Ratings[1].Value}`.cyan);
			    console.log(`This movie was produced in ${JSON.parse(body).Country}`.cyan);
			    console.log(`This movie was released in ${JSON.parse(body).Language}`.cyan);
			    console.log(`The plot of ${JSON.parse(body).title + " is: " + JSON.parse(body).Plot}`.cyan);
			    console.log(`The actors in ${JSON.parse(body).Title + " are " + JSON.parse(body).Actors}`.cyan);
			  }
		});
}