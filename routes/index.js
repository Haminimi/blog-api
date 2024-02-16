const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const Comment = require('../models/comment');

router.get('/', (req, res) => {
	res.json({ message: 'Welcome to the API' });
});

router.get('/posts', async (req, res, next) => {
	try {
		const posts = await Post.find().sort({ timestamp: -1 }).exec();

		res.json(posts);
	} catch (err) {
		return next(err);
	}
});

router.post('/posts', async (req, res, next) => {
	try {
		let post;
		if (req.body.published) {
			post = new Post({
				user: req.body.user,
				title: req.body.title,
				post: req.body.post,
				published: req.body.publish,
				createdAt: Date.now(),
				publishedAt: Date.now(),
			});
		} else {
			post = new Post({
				user: req.body.user,
				title: req.body.title,
				post: req.body.post,
				published: req.body.publish,
				createdAt: Date.now(),
			});
		}

		await post.save();
		res.status(201).json({ success: true, post });
	} catch (err) {
		return next(err);
	}
});

router.get('/posts/:postId', async (req, res, next) => {
	try {
		const post = await Post.findById(req.params.postId).exec();

		res.json(post);
	} catch (err) {
		return next(err);
	}
});

router.put('/posts/:postId', async (req, res, next) => {
	try {
		const post = await Post.findById(req.params.postId).exec();

		const newPost = new Post({
			user: post.author,
			title: req.body.title || post.title,
			post: req.body.post || post.post,
			published: req.body.publish || post.published,
			createdAt: post.createdAt,
			publishedAt: post.publishedAt,
			lastUpdated: Date.now(),
			_id: req.params.postId,
		});

		const updatedPost = await Post.findByIdAndUpdate(
			req.params.postId,
			newPost,
			{ new: true }
		);

		res.json({ success: true, updatedPost });
	} catch (err) {
		return next(err);
	}
});

router.delete('/posts/:postId', async (req, res, next) => {
	try {
		const deletedPost = await Post.findByIdAndDelete(req.params.postId);

		res.json({ success: true, deletedPost });
	} catch (err) {
		return next(err);
	}
});

module.exports = router;
