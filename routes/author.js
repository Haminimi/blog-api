const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Author = require('../models/author');

router.get('/', async (req, res, next) => {
	try {
		const authors = await Author.find().sort({ username: 1 }).exec();
		res.json(authors);
	} catch (err) {
		next(err);
	}
});

router.post(
	'/',
	[
		body('username')
			.trim()
			.isLength({ min: 1 })
			.withMessage('Username must not be empty.')
			.custom(async (value) => {
				const author = await Author.findOne({ username: value });
				if (author) {
					throw new Error('Username already in use.');
				}
			}),
		body('email', 'Email must not be empty.').trim().isLength({ min: 1 }),
	],
	async (req, res, next) => {
		try {
			const errors = validationResult(req);

			if (!errors.isEmpty()) {
				res.json({ errors: errors.array() });
			} else {
				const author = new Author({
					firstName: req.body.first,
					lastName: req.body.last,
					username: req.body.username,
					email: req.body.email,
				});
				await author.save();
				res.json({ success: true, author });
			}
		} catch (err) {
			if (err.code === 11000) {
				return res.status(400).json({ error: 'User already exists' });
			}
			next(err);
		}
	}
);

module.exports = router;
