const PasswordToken = require('../models/passwordtoken.model');
const User = require('../models/user.model');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const {
	checkEmail,
	checkPassword,
	getToken,
} = require('../utils/helpers');
const sendEmail = require('../utils/sendEmail');
const cloudinary = require('../utils/cloudinary.config');

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
	let imageUploaded = null;
	const { files, body: user } = req;
	if (files) {
		imageUploaded = await cloudinary.uploader.upload(
			files.image.tempFilePath,
			{
				upload_preset: 'node-store',
			}
		);
	}
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
	user.imageUrl = imageUploaded?.eager[0].secure_url;
	user.imageId = imageUploaded?.public_id;
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

const sendResetPasswordLink = catchAsync(async (req, res, next) => {
	const { email } = req.body;
	const findUser = await User.findOne({ email });
	if (!findUser)
		return next(new AppError(`${email} not registered.`, 404));
	const checkToken = await PasswordToken.findOne({
		owner: findUser.id,
	});
	if (checkToken) {
		await PasswordToken.findOneAndDelete({ owner: findUser.id });
	}
	const token = getToken();

	await PasswordToken.create({
		owner: findUser.id,
		token,
	});
	const emailMessage = `<h1>You can reset your password by clicking <a href=${process.env.PUBLIC_URL}/reset/${token}>here</a>.`;
	await sendEmail(
		'nodestore@hanan.tech',
		email,
		'Your password reset request',
		emailMessage,
		next
	);
	res.status(201).json({ data: { message: 'Reset link sent.' } });
});

const changePassword = catchAsync(async (req, res, next) => {
	const { token, email, password } = req.body;
	const user = await User.findOne({ email }).select('+password');
	if (!user) return next(new AppError('Email not found!', 404));
	const requestExists = await PasswordToken.findOne({
		owner: user.id,
	});
	if (!requestExists)
		return next(new AppError('Invalid request', 422));
	const validToken = await requestExists.isValidToken(token);
	if (!validToken) return next(new AppError('Invalid Token', 422));
	const passwordValid = checkPassword(password);
	if (!passwordValid)
		return next(new AppError('Invalid Password Format'), 422);
	user.password = password;
	await user.save();
	await PasswordToken.findByIdAndDelete(requestExists.id);
	await sendEmail(
		'nodestore@hanan.tech',
		user.email,
		'Nodestore Ecomm Password Changed',
		`Your password for nodestore ecomm has been changed.`
	);
	res.status(201).json({ data: { message: 'Password changed' } });
});

const userDashboard = catchAsync(async (req, res, next) => {
	const { user } = req;
	res.status(200).json({ data: { user } });
});

module.exports = {
	login,
	register,
	logout,
	sendResetPasswordLink,
	changePassword,
	userDashboard,
};
