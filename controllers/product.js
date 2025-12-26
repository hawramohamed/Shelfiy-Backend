const express = require('express');
const router = express.Router();
const User = require('../models/user');

const isSignedIn = require('../middleware/is-signed-in');
const adminPerm = require('../middleware/is-admin');

// Global index of all products across all users
router.get('/products', isSignedIn, async (req, res) => {
  try {
    const users = await User.find();
    const allProducts = users.flatMap(user => user.products);
    res.status(200).json(allProducts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: 'Something went wrong' });
  }
});

// Create product for a specific user
router.post('/:userId/products', isSignedIn, adminPerm, async (req, res) => {
  try {
    const { name, price, stock, description, suppliers } = req.body;
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ err: 'User not found' });

    user.products.push({ name, price, stock, description, suppliers });
    await user.save();

    res.status(201).json(user.products[user.products.length - 1]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: 'Something went wrong' });
  }
});

// Show single product
router.get('/:userId/products/:productId', isSignedIn, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ err: 'User not found' });

    const product = user.products.id(req.params.productId);
    if (!product) return res.status(404).json({ err: 'Product not found' });

    res.status(200).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: 'Something went wrong' });
  }
});

// Update product
router.put('/:userId/products/:productId', isSignedIn, adminPerm, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ err: 'User not found' });

    const product = user.products.id(req.params.productId);
    if (!product) return res.status(404).json({ err: 'Product not found' });

    Object.assign(product, req.body);
    await user.save();

    res.status(200).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: 'Something went wrong' });
  }
});

// Delete product
router.delete('/:userId/products/:productId', isSignedIn, adminPerm, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ err: 'User not found' });

    const product = user.products.id(req.params.productId);
    if (!product) return res.status(404).json({ err: 'Product not found' });

    product.remove();
    await user.save();

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: 'Something went wrong' });
  }
});

module.exports = router;