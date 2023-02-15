const User = require('../models/user.model');

const getUser = (req, res) => {
	const user = {
		first_name: 'Fake',
		last_name: 'User',
		email: 'fake_user@fakemail.com',
	};
	res.status(200).json(user);
};

const createUser = async (req, res) => {
	const user = req.body;
	const newUser = await User.create(user);
	console.log(newUser);
	res.status(201).json({ message: 'User created' });
};

module.exports = { getUser, createUser };
