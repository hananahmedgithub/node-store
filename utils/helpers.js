const validator = require('validator');
const crypto = require('crypto');

const checkEmail = (email) => {
	return validator.isEmail(email) ? true : false;
};

const checkPassword = (password) => {
	return validator.isStrongPassword(password) ? true : false;
};

const getToken = () => {
	const token = crypto.randomBytes(20).toString('hex');
	const hashedToken = crypto
		.createHash('sha256')
		.update(token)
		.digest('hex');

	return { token, hashedToken };
};

module.exports = { checkEmail, checkPassword, getToken };
