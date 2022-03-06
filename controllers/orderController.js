const Product = require('../models/Product');
const Review = require('../models/Review');
const Order = require('../models/Order');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const { checkPermissons } = require('../utils');

const getAllOrders = async (req, res) => {
  console.log('in order');
  const orders = await Order.find({});
  if (orders.lengths < 1) {
    res.send('There is no order');
  }

  res.status(StatusCodes.OK).json({ orders });
};
const getSingleOrder = async (req, res) => {
  console.log(req.params.id);
  const order = await Order.findOne({ _id: req.params.id });

  if (!order) {
    throw new CustomError.NotFoundError(`No order with id ${req.params.id}`);
  }
  checkPermissons(req.user, order.user);
  res.status(StatusCodes.OK).json({ order });
};
const getCurrentUserOrder = async (req, res) => {
  const userId = req.user.userId;
  const orders = await Order.find({ user: userId });
  if (orders.length < 1) {
    throw new CustomError.NotFoundError(
      `There are no any orders assosiated with ${req.user.name}`
    );
  }

  res.status(StatusCodes.OK).json({ orders, count: orders.length });
};

const fakeStripeAPI = async (amount, currency) => {
  const client_secret = 'someRandomValue';
  return { client_secret, amount };
};

const createOrder = async (req, res) => {
  const { items: cartItems, tax, shippingFee } = req.body;
  if (!cartItems || cartItems.length < 1) {
    throw new CustomError.BadRequestError('No cart items provided');
  }
  if (!tax || !shippingFee) {
    throw new CustomError.BadRequestError('Please proveide tax');
  }
  let orderItems = [];
  let subtotal = 0;
  for (const item of cartItems) {
    const dbProduct = await Product.find({ _id: item.product });
    const newDB = dbProduct[0];
    console.log('dbProduct', newDB);
    if (!dbProduct) {
      throw new CustomError.NotFoundError(`No product with id ${item.product}`);
    }
    const { name, price, image, _id } = newDB;
    const singleOrderItem = {
      amount: item.amount,
      name,
      price,
      image,
      product: _id,
    };
    //add item to order
    orderItems = [...orderItems, singleOrderItem];
    //calculate subtotal
    subtotal += item.amount * price;
    //calculate total

    const total = tax + shippingFee + subtotal;
    //get client secret
    const paymentIntent = await fakeStripeAPI({
      amount: total,
      currency: 'usd',
    });

    const order = await Order.create({
      orderItems,
      total,
      subtotal,
      tax,
      shippingFee,
      clientSecret: paymentIntent.client_secret,
      user: req.user.userId,
    });
    res
      .status(StatusCodes.CREATED)
      .json({ order, clientSecret: order.clientSecret });
  }
};
const updateOrder = async (req, res) => {
  const orderId = req.params.id;
  const { paymentIntentId } = req.body;
  // const updatedOrder = await Order.findOneAndUpdate(
  //   {
  //     _id: orderId,
  //   },
  //   req.body,
  //   {
  //     new: true,
  //     runValidators: true,
  //   }
  // );
 
  const order = await Order.findOne({
    _id: req.params.id,
  });
  if(!order) {
    throw new CustomError.NotFoundError(`there is no id with ${req.params.id}`)
  }
  checkPermissons(req.user, order.user)
  order.paymentIntentId = paymentIntentId
  order.status = "paid"
  await order.save()
  res.status(StatusCodes.OK).json({order});
};

module.exports = {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrder,
  updateOrder,
  createOrder,
};
