const express = require('express');
const {
	login,
	register,
	logout,
} = require('../controllers/user.controller');
const userRouter = express.Router();

userRouter.route('/register').post(register);
userRouter.route('/login').post(login);
userRouter.route('/logout').get(logout);

module.exports = userRouter;
