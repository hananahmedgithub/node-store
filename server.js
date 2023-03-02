require('./utils/db.config');
require('./utils/cloudinary.config');
const express = require('express');
const globalErrorHandler = require('./controllers/error.controller');
const cookieParser = require('cookie-parser');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const fileUpload = require('express-fileupload');
const userRouter = require('./routes/user.route');
const productRouter = require('./routes/product.route');
const swaggerDocument = YAML.load('./swagger.yaml');

function Server() {
	const app = express();
	app.use(express.json());
	app.use(
		fileUpload({
			useTempFiles: true,
			tempFileDir: '/tmp/',
		})
	);
	app.use(cookieParser());
	app.use(
		'/api-docs',
		swaggerUi.serve,
		swaggerUi.setup(swaggerDocument)
	);
	app.use('/api/v1/users', userRouter);
	app.use('/api/v1/products', productRouter);
	app.use(globalErrorHandler);

	const PORT = process.env.PORT;

	app.listen(PORT);
}

module.exports = Server;
