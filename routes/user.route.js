const express = require('express');
const {
	login,
	register,
	logout,
	sendResetPasswordLink,
	changePassword,
	userDashboard,
} = require('../controllers/user.controller');
const { isLoggedIn } = require('../middleware/middlewares');
const userRouter = express.Router();

userRouter.route('/register').post(register);
userRouter.route('/login').post(login);
userRouter.route('/logout').get(logout);
userRouter.route('/reset-password').post(sendResetPasswordLink);
userRouter.route('/change-password').post(changePassword);
userRouter.route('/user-dashboard').get(isLoggedIn, userDashboard);

module.exports = userRouter;
