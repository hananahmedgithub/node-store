const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const userSchema = new mongoose.Schema({
	first_name: String,
	last_name: String,
	email: {
		type: String,
		unique: true,
		required: true,
		lowercase: true,
		trim: true,
	},
	password: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

userSchema.pre('save', async function (next) {
	const salt = await bcrypt.genSalt(10);
	const hashed = await bcrypt.hash(this.password, salt);
	console.log(this.password);
	this.password = hashed;
	console.log(this.password);
	next();
});

const userModel = new mongoose.model('User', userSchema);

module.exports = userModel;
