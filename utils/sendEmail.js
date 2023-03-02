const nodemailer = require('nodemailer');
const AppError = require('./appError');
const transporter = nodemailer.createTransport({
	host: process.env.SMTP_HOST,
	port: process.env.SMTP_PORT,
	auth: {
		user: process.env.SMTP_USER,
		pass: process.env.SMTP_PASS,
	},
});

const sendEmail = async (from, to, subject, html, next) => {
	try {
		await transporter.sendMail({
			from,
			to,
			subject,
			html,
		});
	} catch (error) {
		next(new AppError(error.message, 500));
	}
};

module.exports = sendEmail;
