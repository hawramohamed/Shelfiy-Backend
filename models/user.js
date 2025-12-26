const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  contact: {
    type: String,
  },
  address: { 
    type: String,
  },
});

const productSchema = new mongoose.Schema({
  name:{
    type: String,
    required: true,
  },
  price:{
    type: Number,
    min: 0,
    required: true,
  },
  stock:{
    type: Number,
    min: 0,
    required: true,
  },
  description:{
    type: String,
  },
  suppliers:[supplierSchema],
});

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  hashedPassword: {
    type: String,
    required: true,
  },
  role:{
    type: String,
    enum:['admin', 'guest'],
    default: 'guest',
  },
  products: [productSchema],
});

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    delete returnedObject.hashedPassword;
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
