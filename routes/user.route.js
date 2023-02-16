const express = require('express');
const {
	getUser,
	createUser,
} = require('../controllers/user.controller');
const userRouter = express.Router();

userRouter.route('/').get(getUser).post(createUser);

module.exports = userRouter;
