const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
	first_name: { type: String, required: true },
	last_name: { type: String, required: true },
	email: {
		type: String,
		unique: true,
		required: true,
		trim: true,
		validate: [validator.isEmail],
	},
	password: {
		type: String,
		required: true,
		select: false,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

userSchema.pre('save', async function (next) {
	if (!this.isModified('password')) return next();
	const hashed = await bcrypt.hash(this.password, 10);
	this.password = hashed;
});

userSchema.methods.isValidPassword = async function (userPassword) {
	return await bcrypt.compare(userPassword, this.password);
};

userSchema.methods.getSignedUser = function () {
	return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRY,
	});
};

module.exports = mongoose.model('User', userSchema);
