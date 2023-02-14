const getUser = (req, res) => {
	const user = {
		first_name: 'Fake',
		last_name: 'User',
		email: 'fake_user@fakemail.com',
	};
	res.status(200).json(user);
};

module.exports = { getUser };
