var fs = require('fs');
var request = require('request');
var Twitter = require('twitter');
var keys = require('./keys.js');
var Spotify = require('node-spotify-api');

	
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

var operator=process.argv[2];

// console.log(process.argv);
// console.log(client);

switch(operator) {
	case('my-tweets'): {
		myTweets();
		return;
	}
	case('spotify-this-song'): {
		selectSong();
		return;
	}
	case('movie-this'): {
		selectMovie();		
		return;

	}
	case('do-what-it-says'): {
		fs.readFile('random.txt', 'utf8', function(err, data) {
			if(err) {
				return console.log(err);
				}
				var directions = data.split(', ');	
				console.log(directions[0]);
				console.log(directions[1]);
				
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
		return;
	}

	default: {
		console.log('What are you doing????');
		return;
	}

}

function myTweets() {
	var params = {screen_name: 'dconcolor1', count: 20};

	client.get('statuses/user_timeline', params, function(error, tweets, response) {
	    // console.log(tweets[0]);
		if (!error) {
	      for (var i = 0; i < tweets.length; i++) {
	      	console.log(`Created: ${tweets[i].created_at}\nTweet: ${tweets[i].text}\n`);
	      }
	    }
	})
}

function selectSong(songName) {
	var songName = process.argv[3];
		var limit = 10;

		if(!songName){
			spotify.search({ type: 'track', query: 'The Sign Ace of Base', limit: limit}, function(err, data) {
				if (err) {
					return console.log('Error occurred: ' + err);
				}
					console.log(`----------------------------------------`);
					console.log('Default Search for "The Sign" by Ace of Base');
					console.log(`----------------------------------------`);
					console.log(`\n`);

			  		// console.log(data.tracks.items[2].album);
				for(var i = 0; i < limit; i++) {

					console.log(`Result ${i+1}`);
					console.log(`----------------------------------------`);
					console.log(`Artist(s) Name: ${data.tracks.items[i].artists[0].name}`); 
					console.log(`Album Name: ${data.tracks.items[i].album.name}`); 
					console.log(`Song Name: ${data.tracks.items[i].name}`);  
					console.log(`Spotify Preview Link: ${data.tracks.items[i].external_urls.spotify}`); 
					console.log(`Popularity: ${data.tracks.items[i].popularity}`); 
					console.log(`----------------------------------------`);
					console.log(`\n`);
				}
			});
		} else {
			spotify.search({ type: 'track', query: songName, limit: limit}, function(err, data) {
			  if (err) {
			    return console.log('Error occurred: ' + err);
			  }
			  		console.log(`----------------------------------------`);
					console.log(`Search Results for Song: ${songName}`);
					console.log(`----------------------------------------`);
					console.log(`\n`);

				for(var i = 0; i < limit; i++) {

					console.log(`Result ${i+1}`);
					console.log(`----------------------------------------`);
					console.log(`Artist(s) Name: ${data.tracks.items[i].artists[0].name}`); 
					console.log(`Album Name: ${data.tracks.items[i].album.name}`); 
					console.log(`Song Name: ${data.tracks.items[i].name}`);  
					console.log(`Spotify Preview Link: ${data.tracks.items[i].external_urls.spotify}`); 
					console.log(`Popularity: ${data.tracks.items[i].popularity}`); 
					console.log(`----------------------------------------`);
					console.log(`\n`);
				}
			});
		}
}

function selectMovie(movieName) {
	// var movieName = process.argv[3];
		// Then run a request to the OMDB API with the movie specified
		if (process.argv[3]) {
		  	var queryUrl = "http://www.omdbapi.com/?t=" + process.argv[3] + "&y=&plot=short&apikey=40e9cece";
		  } else {
		  	var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=40e9cece";
		  }
		// console.log(queryUrl);
		request(queryUrl, function(error, response, body) {
		  // If the request is successful (i.e. if the response status code is 200)
			  if (!error && response.statusCode === 200) {
			    console.log("This movie title you requested was " + JSON.parse(body).Title);
			    console.log("This movie was released in " + JSON.parse(body).Year);
			    console.log("This IMDB rating for this movie is " + JSON.parse(body).imdbRating);
			    console.log("This Rotten Tomatoes rating is " + JSON.parse(body).Ratings[1].Value);
			    console.log("This movie was produced in " + JSON.parse(body).Country);
			    console.log("This movie was released in " + JSON.parse(body).Language);
			    console.log("The plot of " + JSON.parse(body).title + " is: " + JSON.parse(body).Plot);
			    console.log("The actors in " + JSON.parse(body).Title + " are " + JSON.parse(body).Actors);
			  }
		});
}