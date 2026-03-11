const mongoose = require('mongoose');
const userSchma = new mongoose.Schema({
  name: { type: String, required: [true, 'name is required'] },
  age: { type: String, required: [true, 'age is required'] }
});
const User = mongoose.model('User', userSchma);
module.exports = User;
