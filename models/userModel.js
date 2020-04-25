const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name!']
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false
  },
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user'
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    //Only works on CREATE & SAVE
    validate: {
      validator: function(val) {
        return val === this.password;
      },
      message: 'Passwords are not the same!'
    }
  },
  passwordChanged: Date
});

userSchema.pre('save', async function(next) {
  // Only runs this function is password was actually modified
  if (!this.isModified('password')) return next();

  // Hash the password with the cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.userChangedPassword = function(JWTTimeStamp) {
  if (this.passwordChanged) {
    const changedTimeStamp = parseInt(
      this.passwordChanged.getTime() / 1000,
      10
    );

    return JWTTimeStamp < changedTimeStamp;
  }
  // False means not changed
  return false;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
