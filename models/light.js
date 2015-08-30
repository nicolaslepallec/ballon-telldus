
var mongoose = require('mongoose');

module.exports = mongoose.model('Light', {
	id :String,
	state: String,
	isDimmable: Boolean,
	level: String

});