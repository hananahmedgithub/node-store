const mongoose = require('mongoose');
const passwordTokenSchema = new mongoose.Schema({
	token: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
		expires: 30,
	},
});

module.exports = mongoose.model('Token', passwordTokenSchema);
