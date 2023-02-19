const validator = require('validator');
const checkEmail = (email) => {
	return validator.isEmail(email) ? true : false;
};

const checkPassword = (password) => {
	return validator.isStrongPassword(password) ? true : false;
};

module.exports = { checkEmail, checkPassword };
