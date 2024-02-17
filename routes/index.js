const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
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

router.post(
	'/posts',
	[
		body('author', 'Author must not be empty.').trim().isLength({ min: 1 }),
		body('title', 'Title must not be empty.').trim().isLength({ min: 1 }),
		body('post', 'Post must not be empty.').trim().isLength({ min: 1 }),
	],
	async (req, res, next) => {
		try {
			const errors = validationResult(req);

			if (!errors.isEmpty()) {
				res.json({ errors: errors.array() });
			} else {
				let post;
				if (req.body.published) {
					post = new Post({
						author: req.body.author,
						title: req.body.title,
						post: req.body.post,
						published: req.body.publish,
						createdAt: Date.now(),
						publishedAt: Date.now(),
					});
				} else {
					post = new Post({
						author: req.body.author,
						title: req.body.title,
						post: req.body.post,
						published: req.body.publish,
						createdAt: Date.now(),
					});
				}

				const createdPost = await post.save();
				res.status(201).json({ success: true, createdPost });
			}
		} catch (err) {
			return next(err);
		}
	}
);

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
			author: post.author,
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

router.get('/posts/:postId/comments', async (req, res, next) => {
	try {
		const comments = await Comment.find({ post: req.params.postId })
			.sort({ timestamp: -1 })
			.exec();

		res.json(comments);
	} catch (err) {
		return next(err);
	}
});

router.post(
	'/posts/:postId/comments',
	[
		body('comment', 'Comment must not be empty.')
			.trim()
			.isLength({ min: 1 }),
		body('post', 'Post reference must not be empty.')
			.trim()
			.isLength({ min: 1 }),
	],
	async (req, res, next) => {
		try {
			const errors = validationResult(req);

			if (!errors.isEmpty()) {
				res.json({ errors: errors.array() });
			} else {
				const comment = new Comment({
					username: req.body.username,
					comment: req.body.comment,
					post: req.params.postId,
					timestamp: Date.now(),
				});

				const createdComment = await comment.save();
				res.status(201).json({ success: true, createdComment });
			}
		} catch (err) {
			return next(err);
		}
	}
);

router.get('/posts/:postId/comments/:commentId', async (req, res, next) => {
	try {
		const comment = await Comment.findOne({
			post: req.params.postId,
			_id: req.params.commentId,
		}).exec();

		res.json(comment);
	} catch (err) {
		return next(err);
	}
});

router.put('/posts/:postId/comments/:commentId', async (req, res, next) => {
	try {
		const comment = await Comment.findById(req.params.commentId);

		const newComment = new Comment({
			username: req.body.username || comment.username,
			comment: req.body.comment || comment.comment,
			post: req.params.postId,
			timestamp: comment.timestamp,
			_id: req.params.commentId,
		});

		const updatedComment = await Comment.findByIdAndUpdate(
			req.params.commentId,
			newComment,
			{ new: true }
		);

		res.json({ success: true, updatedComment });
	} catch (err) {
		return next(err);
	}
});

router.delete('/posts/:postId/comments/:commentId', async (req, res, next) => {
	try {
		const deletedComment = await Comment.findByIdAndDelete(
			req.params.commentId
		);

		res.json({ success: true, deletedComment });
	} catch (err) {
		return next(err);
	}
});

module.exports = router;
