const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const passwordTokenSchema = new mongoose.Schema({
	owner: {
		type: mongoose.Types.ObjectId,
		ref: 'User',
	},
	token: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
		expires: 1200,
	},
});

passwordTokenSchema.pre('save', async function (next) {
	if (!this.isModified('token')) return next();
	const hashedToken = await bcrypt.hash(this.token, 10);
	this.token = hashedToken;
});

passwordTokenSchema.methods.isValidToken = async function (token) {
	return await bcrypt.compare(token, this.token);
};

module.exports = mongoose.model('Token', passwordTokenSchema);
