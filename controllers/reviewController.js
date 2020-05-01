const Review = require('./../models/reviewModel');
const AppError = require('../utils/appError');
const catchAsync = require('./../utils/catchAsync');
const { deleteOne, updateOne, createOne } = require('./handleFactory');

exports.getAllReviews = catchAsync(async (req, res, next) => {
  let filter = {};
  const { tourId = '' } = req.params;
  if (tourId) filter = { tour: tourId };
  const reviews = await Review.find(filter);

  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews
    }
  });
});

exports.setTourUserIds = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;

  next();
};

exports.createReview = createOne(Review);
exports.deleteReview = deleteOne(Review);
exports.updateReview = updateOne(Review);
