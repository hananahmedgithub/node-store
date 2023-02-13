require('./dotenv.config');
const server = require('./server');
if (process.env.NODE_ENV === 'development') {
	server();
}
