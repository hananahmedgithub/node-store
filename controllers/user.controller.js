const User = require('../models/user.model');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const { checkEmail, checkPassword } = require('../utils/helpers');

const login = catchAsync(async (req, res, next) => {
	const { email, password } = req.body;
	const user = await User.findOne({ email }).select('+password');
	if (!user) {
		return next(new AppError(`${email} not registered.`, 404));
	}
	const passwordIsValid = await user.isValidPassword(password);
	if (!passwordIsValid) {
		return next(new AppError('Invalid email or password.', 404));
	}
	const token = await user.getSignedUser();

	res
		.cookie('token', token, {
			expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
			httpOnly: true,
		})
		.status(200)
		.json({
			data: {
				first_name: user.first_name,
				last_name: user.last_name,
				email: user.email,
			},
		});
});

const register = catchAsync(async (req, res, next) => {
	const user = req.body;
	const { first_name, last_name, email, password } = user;
	if (!first_name || !last_name || !email) {
		return next(new AppError('Fields missing', 400));
	}
	const validEmail = checkEmail(email);
	const validPassword = checkPassword(password);
	if (!validEmail) {
		return next(new AppError('Email is not in a valid format', 400));
	}
	if (!validPassword) {
		return next(
			new AppError('Password is not in a valid format', 400)
		);
	}
	const newUser = await User(user);
	await newUser.save();
	res.status(201).json({ data: { message: 'User created' } });
});

const logout = catchAsync(async (req, res, next) => {
	res
		.cookie('token', null, {
			expires: new Date(Date.now()),
			httpOnly: true,
		})
		.status(200)
		.json({ data: { message: 'Logout Success' } });
});

module.exports = { login, register, logout };
