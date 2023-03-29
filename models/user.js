const bcrypt = require('bcrypt');
const { Schema, model } = require('mongoose');
const { STARTER, PRO, BUSINESS } = require('../constants/enums');
const AppError = require('../utils/appError');
const { errorCreateUser } = require('../constants/customErrorMessage');

require('dotenv').config();
const { SALT_ROUNDS } = process.env;

const userSchema = new Schema(
  {
    password: {
      type: String,
      select: false,
      required: [true, 'Set password for user'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    subscription: {
      type: String,
      enum: [STARTER, PRO, BUSINESS],
      default: STARTER,
    },
    token: String,
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(+SALT_ROUNDS);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

userSchema.post('save', function (error, _, next) {
  if (error.name === 'MongoServerError' && error.code === 11000) {
    next(new AppError(409, errorCreateUser));
  } else {
    next();
  }
});

userSchema.methods.checkPassword = (candidate, hash) =>
  bcrypt.compare(candidate, hash);

const User = model('User', userSchema);

module.exports = User;
