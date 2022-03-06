const express = require('express');
const router = express.Router();
const {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrder,
  updateOrder,
  createOrder,
} = require('../controllers/orderController');
const {
  authenticateUser,
  authorizePermissions,
} = require('../middleware/authentication');
router
  .route('/')
  .get(authenticateUser, getAllOrders)
  .post(authenticateUser, authorizePermissions('admin'), createOrder);
// router.route('showCurrentUserOrder').get('');

router.route('/showAllMyOrders').get(authenticateUser, getCurrentUserOrder);
router
  .route('/:id')
  .get(authenticateUser, getSingleOrder)
  .patch(authenticateUser, updateOrder);

module.exports = router;
