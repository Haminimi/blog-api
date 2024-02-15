const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PostSchema = new Schema({
	user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
	title: { type: String, required: true },
	post: { type: String, required: true },
	published: { type: Boolean, required: true },
	timestamp: { type: Number, default: Date.now },
});

module.exports = mongoose.model('Post', PostSchema);
