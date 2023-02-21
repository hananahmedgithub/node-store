const mongoose = require('mongoose');
const slugify = require('slugify');
const variantSchema = new mongoose.Schema({
	name: {
		type: String,
	},
	values: [
		{
			type: String,
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
	slug: {
		type: String,
		unique: true,
	},
});

productSchema.pre('save', function (next) {
	if (this.slug === null) {
		this.slug = slugify(this.title, {
			replacement: '-',
			lower: true,
			strict: true,
		});
	}
	next();
});

const productModel = mongoose.model('Product', productSchema);

module.exports = productModel;
