const mongoose = require('mongoose');

const string = process.env.DB_STRING.replace(
	'<username>',
	process.env.DB_USERNAME
).replace('<password>', process.env.DB_PASSWORD);

async function connectToDB() {
	await mongoose.connect(string);
}

connectToDB().catch((err) => console.log('DB Error: ', err));
