const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		unique: true,
	},
	values: [
		{
			type: String,
			required: true,
			unique: true,
		},
	],
});

const productSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
		unique: true,
	},
	description: String,
	variants: [variantSchema],
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

const productModel = new mongoose.model('Product', productSchema);

module.exports = productModel;
