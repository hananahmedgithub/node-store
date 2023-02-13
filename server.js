const express = require('express');

function Server() {
	const app = express();

	const PORT = process.env.PORT;

	app.listen(PORT);
}

module.exports = Server;
