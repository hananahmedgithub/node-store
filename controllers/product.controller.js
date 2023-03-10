const Product = require('../models/product.model');
const catchAsync = require('../utils/catchAsync');

const getProducts = catchAsync(async (req, res) => {
	const allProducts = await Product.find();
	if (allProducts.length === 0) {
		return res
			.status(404)
			.json({ data: { message: 'No products found' } });
	}
	res.status(200).json({ data: allProducts });
});

const createProduct = catchAsync(async (req, res) => {
	const product = req.body;
	const newProduct = await Product.create(product);
	await newProduct.save();
	res.status(201).json({ data: newProduct });
});

const getProduct = catchAsync(async (req, res) => {
	const { id } = req.params;
	const product = await Product.findById(id);
	res.status(200).json({ data: product });
});

module.exports = { getProducts, createProduct, getProduct };
