const PasswordToken = require('../models/passwordtoken.model');
const User = require('../models/user.model');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const transporter = require('../utils/emailTransporter');
const {
	checkEmail,
	checkPassword,
	getToken,
} = require('../utils/helpers');

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

const resetPassword = catchAsync(async (req, res, next) => {
	const { token, hashedToken } = getToken();
	const newToken = await new PasswordToken({ token: hashedToken });
	await newToken.save();
	const resetLink = `${process.env.PUBLIC_URL}/reset=${token}`;
	try {
		await transporter.sendMail({
			from: 'Hanan <nodestore@hanan.tech>',
			to: 'test@gmail.com', // list of receivers
			subject: 'Your reset password link', // Subject line
			html: `<h1>You can reset your password here:</h1> ${resetLink}`, // plain text body
		});
		res.status(200).json({ data: { message: 'Link Sent' } });
	} catch (error) {
		next(new AppError(error.message, 500));
	}
});

module.exports = { login, register, logout, resetPassword };
