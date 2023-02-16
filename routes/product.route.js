const express = require('express');
const {
	getProducts,
	createProduct,
} = require('../controllers/product.controller');
const productRouter = express.Router();

productRouter.route('/').get(getProducts).post(createProduct);

// productRouter
// 	.route('/:id')
// 	.get(getProduct)
// 	.put(updateProduct)
// 	.delete(deleteProduct);

module.exports = productRouter;
