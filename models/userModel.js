const mongoose = require('mongoose');
const validator = require('validator');
const zxcvbn = require('zxcvbn');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minLength: [10, 'name must have more than 10 characters'],
    maxLength: [40, 'name must have less than 40 characters']
  },

  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },

  photo: String,

  password: {
    type: String,
    required: [true, 'Password is required'],
    validate: {
      validator: function(password) {
        const strength = zxcvbn(password);
        return strength.score >= 2;
      },
      message: 'Password is too weak'
    }
  },

  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      validator: function(el) {
        return el === this.password;
      },
      message: 'Passwords are not the same!'
    }
  }
});

userSchema.pre('save', function() {
  this.passwordConfirm = undefined;
});

const User = mongoose.model('User', userSchema);

module.exports = User;
