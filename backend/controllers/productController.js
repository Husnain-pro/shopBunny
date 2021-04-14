import asyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';

// @desc	Get all products
// @route	PUT /api/products
// @access	Public

const getProduct = asyncHandler(async (req, res) => {
	const pageSize = 10;
	const page = Number(req.query.pageNumber) || 1;

	const keyword = req.query.keyword
		? {
				name: {
					$regex: req.query.keyword,
					$options: 'i'
				}
		  }
		: {};

	const count = await Product.countDocuments({ ...keyword });
	const products = await Product.find({ ...keyword })
		.limit(pageSize)
		.skip(pageSize * (page - 1));
	res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

// @desc	Get Product by id
// @route	PUT /api/products/:id
// @access	Private

const getProductById = asyncHandler(async (req, res) => {
	const product = await Product.findById(req.params.id);
	if (product) {
		res.json(product);
	} else {
		res.status(404);
		throw new Error('Product not found');
	}
});

// @desc	Delete Product
// @route	PUT /api/products/:id
// @access	Private/Admin

const deleteProductById = asyncHandler(async (req, res) => {
	const product = await Product.findById(req.params.id);
	if (product) {
		product.remove();
		res.json({ message: 'Product successfully delete' });
	} else {
		res.status(404);
		throw new Error('Product not found');
	}
});

// @desc	Create Product
// @route	PUT /api/products
// @access	Private/Admin

const createProduct = asyncHandler(async (req, res) => {
	const product = new Product({
		name: 'Sample name',
		price: 0,
		user: req.user._id,
		image: '/images/sample.jpg',
		brand: 'Sample brand',
		category: 'Sample category',
		countInStock: 0,
		numReviews: 0,
		description: 'Sample description'
	});

	const createdProduct = await product.save();
	res.status(201).json(createdProduct);
});

// @desc	Update Product
// @route	PUT /api/products/:id
// @access	Private/Admin

const updateProductById = asyncHandler(async (req, res) => {
	const { name, price, description, image, brand, category, countInStock } = req.body;
	const product = await Product.findById(req.params.id);
	console.log('name', name, 'price', price, 'description', description);
	if (product) {
		product.name = name || product.name;
		product.price = price || product.price;
		product.description = description || product.description;
		product.image = image || product.image;
		product.brand = brand || product.brand;
		product.category = category || product.category;
		product.countInStock = countInStock || product.countInStock;
		const createUpdateProduct = await product.save();
		res.status(201).json(createUpdateProduct);
	} else {
		res.status(404);
		throw new Error('Product not found');
	}
});

// @desc	Create new review
// @route	PUT /api/products/:id/review
// @access	Private

const createProductReview = asyncHandler(async (req, res) => {
	const { rating, comment } = req.body;
	const product = await Product.findById(req.params.id);
	if (product) {
		const alreadyReview = await product.reviews.find((r) => r.user.toString() === req.user._id.toString());
		if (alreadyReview) {
			res.status(400);
			throw new Error('Already reviewed');
		}
		const review = {
			name: req.user.name,
			rating: Number(rating),
			comment,
			user: req.user._id
		};

		product.reviews.push(review);
		product.numReviews = product.reviews.length;
		product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;
		await product.save();
	} else {
		res.status(404);
		throw new Error('Product not found');
	}
});

// @desc	Create top rated products
// @route	PUT /api/products/top
// @access	Public

const getTopProducts = asyncHandler(async (req, res) => {
	const products = await Product.find({}).sort({ rating: -1 }).limit(3);
	res.json(products);
});

export {
	getProduct,
	getProductById,
	deleteProductById,
	updateProductById,
	createProduct,
	createProductReview,
	getTopProducts
};
