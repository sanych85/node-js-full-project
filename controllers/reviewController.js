const Review = require('../models/Review');

const Product = require('../models/Product');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const { checkPermissons } = require('../utils');
const createReview = async (req, res) => {
  const { product: productId } = req.body;
  const isValidProduct = await Product.find({ _id: productId });

  if (!isValidProduct) {
    throw new CustomError.NotFoundError(`No product with id: ${productId}`);
  }
  const alreadySubmitted = await Review.findOne({
    product: productId,
    user: req.user.uesrId,
  });

  if (alreadySubmitted) {
    throw new CustomError.BadRequestError('Already submitted');
  }

  req.body.user = req.user.userId;
  const review = await Review.create(req.body);
  console.log(review, 'review');
  res.status(StatusCodes.CREATED).json({ review });
  // res.send('create review')
};
const getAllReviews = async (req, res) => {
  const reviews = await Review.find().populate({
    path: 'product',
    select: 'name company price',
  }).populate({
    path: 'user',
    select: 'name',
  });
  if (reviews.length < 1) {
    res.send('there are no review');
  }
  console.log(reviews, 'reviews');
  res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
};
const getSingleReview = async (req, res) => {
  const reviewId = req.params.id;

  const review = await Review.findOne({
    _id: reviewId,
  });
  if (!review) {
    throw new CustomError.NotFoundError(`no review with id ${reviewId} `);
  }
  res.status(StatusCodes.CREATED).json({
    review,
  });
};
const updateReview = async (req, res) => {
  const reviewId = req.params.id;
  const { rating, title, comment } = req.body;
  const review = await Review.findOne({
    _id: reviewId,
  });
  if (!review) {
    throw new CustomError.NotFoundError(`no review with id ${reviewId} `);
  }
  checkPermissons(req.user, review.user);

  review.rating = rating;
  review.title = title;
  review.comment = comment;
  await review.save();
  res.status(StatusCodes.OK).json({
    review,
  });
};
const deleteReview = async (req, res) => {
  const reviewId = req.params.id;
  const review = await Review.findOne({
    _id: reviewId,
  });

  if (!review) {
    throw new CustomError.NotFoundError(`no review with id ${reviewId} `);
  }
  checkPermissons(req.user, review.user);
  await review.remove();
  res.status(StatusCodes.OK).json({
    msg: 'success removed',
  });
};
const getSingleProductReviews = async(req,res)=> {
  const {id:productId} =req.params
  console.log(req.params)
  const reviews = await Review.find({product: productId})
  res.status(StatusCodes.OK).json({
    reviews, count: reviews.length
  })
}
module.exports = {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
  getSingleProductReviews
};
