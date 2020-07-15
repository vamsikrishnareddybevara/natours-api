// review - string, rating - number, createdAt, ref to tour, ref to user
const mongoose = require('mongoose');
const Tour = require('./tourModel');
const reviewSchema = mongoose.Schema(
  {
    review: {
      type: String
    },
    rating: {
      type: Number,
      required: [true, 'Rating is mandatory'],
      min: [1, 'Rating must be minimum 1'],
      max: [5, 'Rating cannot exceed 5']
    },
    createdAt: {
      type: Date,
      default: Date.now()
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'A review must belong to a tour']
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A review must belong to a user']
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// QUERY MIDDLEWARE
reviewSchema.pre(/^find/, function(next) {
  this.populate({ path: 'user', select: 'name photo' });

  next();
});

reviewSchema.statics.calculateAverageRating = async function(tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId }
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ]);

  await Tour.findByIdAndUpdate(tourId, {
    ratingsQuantity: stats[0].nRating,
    ratingsAverage: stats[0].avgRating
  });
};

reviewSchema.post('save', function() {
  //this points to current tour document
  this.constructor.calculateAverageRating(this.tour);
});
const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
