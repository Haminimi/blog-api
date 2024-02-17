const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PostSchema = new Schema({
	author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
	title: { type: String, required: true },
	post: { type: String, required: true },
	published: { type: Boolean, default: false, required: true },
	createdAt: { type: Number },
	publishedAt: { type: Number },
	lastUpdated: { type: Number },
});

module.exports = mongoose.model('Post', PostSchema);
