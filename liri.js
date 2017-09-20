var Twitter = require('twitter');
var twitterKeys = require('./keys.js');
var Spotify = require('node-spotify-api');

var operator=process.argv[2];

console.log(twitterKeys);

switch(operator) {
	case('my-tweets'): {
		twitterKeys.get('favorites/list', function(error, tweets, response) {
		  if(error) throw error;
		  console.log(tweets);  // The favorites. 
		  console.log(response);  // Raw response object. 
		});	
	}
	case('spotify-this-song'): {

	}
	case('movie-this'): {

	}
	case('do-what-it-says'): {

	}
	default: {
		console.log('What are you doing????');
	}

}
