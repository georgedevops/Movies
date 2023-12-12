// Import the mongoose library
var mongoose = require('mongoose');

// Create a mongoose schema for the 'movies' collection
var Schema = mongoose.Schema;
MovieSchema = new Schema({
  plot: String, 
  genres: [String], 
  runtime: Number, 
  cast: [String], 
  poster: String, 
  title: String, 
  fullplot: String, 
  languages: [String], 
  released: Date, 
  directors: [String], 
  rated: String, 
  awards: Object, 
  lastupdated: String, 
  year: Number, 
  imdb: Object, 
  countries: [String], 
  type: String, 
  tomatoes: Object, 
  authorid: String,
  num_mflix_comments: Number,
});

// Export the mongoose model for the 'movies' collection
module.exports = mongoose.model('movies', MovieSchema);
