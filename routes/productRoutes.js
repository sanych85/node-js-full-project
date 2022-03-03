const express = require('express');
const router = express.Router();

const {
  createProduct,
  getAllProducts,
  updateProduct,
  uploadImage,
  deleteProduct,
  getSingleProduct,
} = require('../controllers/productController');
const {
  authenticateUser,
  authorizePermissions,
} = require('../middleware/authentication');

const {getSingleProductReviews} = require('../controllers/reviewController')

router
  .route('/')
  .post([authenticateUser, authorizePermissions('admin')], createProduct)
  .get(getAllProducts);
router.route('/updateProduct').patch(authenticateUser, updateProduct);


router.route('/uploadImage').post([authenticateUser, authorizePermissions('admin')], uploadImage);

router
  .route('/:id')
  .get(getSingleProduct)
  .delete([authenticateUser, authorizePermissions('admin')], deleteProduct)
  .patch([authenticateUser, authorizePermissions('admin')], updateProduct);

router.route('/:id/reviews').get(getSingleProductReviews)

module.exports = router;
