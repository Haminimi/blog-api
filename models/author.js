const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const AuthorSchema = new Schema({
	firstName: { type: String },
	lastName: { type: String },
	username: { type: String, required: true, unique: true },
	email: { type: String, required: true },
});

module.exports = mongoose.model('Author', AuthorSchema);
