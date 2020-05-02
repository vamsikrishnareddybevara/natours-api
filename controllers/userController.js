const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const { deleteOne, updateOne, getOne } = require('./handleFactory');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};

  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });

  return newObj;
};

exports.getAllUsers = catchAsync(async (req, res, next) => {
  // EXECUTE QUERY
  const features = new APIFeatures(User.find(), req.query);

  const users = await features.query;

  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users
    }
  });
});

exports.createUser = (req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'This route is not defined! , Please user /signup'
  });
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;

  next();
};
exports.updateMe = catchAsync(async (req, res, next) => {
  // 1.) Throw error if posts password data
  const { password = '', passwordConfirm = '' } = req.body;
  if (password || passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updatePassword.',
        400
      )
    );
  }
  // 2.) Filter required fileds
  const filteredBody = filterObj(req.body, 'name', 'email');

  // 3.) Update user data
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.getUser = getOne(User);
// do not update passwords with this
exports.updateUser = updateOne(User);
exports.deleteUser = deleteOne(User);
