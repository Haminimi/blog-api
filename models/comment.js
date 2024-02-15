const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
	username: String,
	comment: { type: String, required: true },
	post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
	timestamp: { type: Number, default: Date.now, required: true },
});

module.exports = mongoose.model('Comment', CommentSchema);
