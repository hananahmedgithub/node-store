require('./db.config');
const express = require('express');

const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const userRouter = require('./routes/user.route');
const swaggerDocument = YAML.load('./swagger.yaml');

function Server() {
	const app = express();

	app.use(express.json());

	app.use(
		'/api-docs',
		swaggerUi.serve,
		swaggerUi.setup(swaggerDocument)
	);

	app.use('/api/v1/user', userRouter);

	const PORT = process.env.PORT;

	app.listen(PORT);
}

module.exports = Server;
