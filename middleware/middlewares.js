const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');
const User = require('../models/user.model');
const isLoggedIn = catchAsync(async (req, res, next) => {
	const { token } = req.cookies;
	if (!token) return next(new AppError('User not logged in', 401));
	const { id } = jwt.verify(token, process.env.JWT_SECRET);
	const user = await User.findById(id);
	if (!user) return next(new AppError('User not found.', 404));
	req.user = user;
	next();
});

module.exports = { isLoggedIn };
