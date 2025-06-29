const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticateJWT, requireAdmin } = require('../middlewares/auth');
const reviewRouter = require('./reviews');

router.route('/')
  .get(productController.getProducts)
  .post(authenticateJWT, requireAdmin, productController.createProduct);

router.route('/:id')
  .get(productController.getProduct)
  .patch(authenticateJWT, requireAdmin, productController.updateProduct)
  .delete(authenticateJWT, requireAdmin, productController.deleteProduct);

// Mount the review router for nested routes
router.use('/:id/reviews', reviewRouter);


module.exports = router;