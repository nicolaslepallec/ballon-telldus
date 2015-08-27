
var mongoose = require('mongoose');

module.exports = mongoose.model('Ballon', {
	id :String,
	mode: String,
	state: String

});