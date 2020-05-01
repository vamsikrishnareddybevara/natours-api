const express = require('express');
const {
  createReview,
  getAllReviews,
  deleteReview,
  updateReview,
  setTourUserIds
} = require('./../controllers/reviewController');
const { protect, restrictTo } = require('./../controllers/authController');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(protect, getAllReviews)
  .post(protect, setTourUserIds, restrictTo('user'), createReview);

router
  .route('/:id')
  .delete(deleteReview)
  .patch(updateReview);

module.exports = router;
