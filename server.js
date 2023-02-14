const express = require('express');

const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');

function Server() {
	const app = express();

	app.use(
		'/api-docs',
		swaggerUi.serve,
		swaggerUi.setup(swaggerDocument)
	);

	const PORT = process.env.PORT;

	app.listen(PORT);
}

module.exports = Server;
