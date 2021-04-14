import express from 'express';
import {
	createProduct,
	createProductReview,
	deleteProductById,
	getProduct,
	getProductById,
	getTopProducts,
	updateProductById
} from '../controllers/productController.js';
import { admin, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getProduct).post(protect, admin, createProduct);
router.route('/top').get(getTopProducts);
router
	.route('/:id')
	.get(getProductById)
	.delete(protect, admin, deleteProductById)
	.put(protect, admin, updateProductById);

router.route('/:id/reviews').post(protect, createProductReview);

export default router;
