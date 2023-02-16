const User = require('../models/user.model');

const catchAsync = require('../utils/catchAsync');

const getUser = catchAsync(async (req, res) => {
	const name = req.body.name;
	const user = await User.findOne({ first_name: name });
	res.status(200).json(user);
});

const createUser = catchAsync(async (req, res) => {
	const user = req.body;
	const newUser = await User.create(user);
	console.log(newUser);
	res.status(201).json({ message: 'User created' });
});

module.exports = { getUser, createUser };
