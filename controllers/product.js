const express = require('express');
const router = express.Router();
const User = require('../models/user');

//index of products
router.get('/', async (req, res) => {
  try {
    // Flatten all products from all users
    const users = await User.find();
    const allProducts = users.flatMap(user => user.products);
    res.status(200).json(allProducts);
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: "Something went wrong" });
  }
});

//create product to user
router.post('/:userId/new', isSignedIn, adminPerm, async (req, res) => {
  try {
    const { name, price, stock, description, suppliers } = req.body;
    const user = await User.findById(req.params.userId);

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    user.products.push({ name, price, stock, description, suppliers });
    await user.save();

    res.status(201).json(user.products[user.products.length - 1]); // return the new product
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: 'Something went wrong' });
  }
});

//show single product
router.get('/:userId/:productId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    const product = user.products.id(req.params.productId);
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    res.status(200).json(product);
  } catch (err) {
    if (res.statusCode === 404) {
      res.json({ err: "Something went wrong" });
      console.log(err);
    } else {
      res.status(500).json({ err: 'Something went wrong' });
      console.log(err);
    }
  }
});

//edit
router.get('/:userId/:productId/edit', isSignedIn, adminPerm, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    const product = user.products.id(req.params.productId);
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ err: 'Something went wrong' });
    console.log(err);
  }
});

//update product
router.put('/:userId/:productId', isSignedIn, adminPerm, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    const product = user.products.id(req.params.productId);
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    Object.assign(product, req.body);
    await user.save();

    res.status(200).json(product);
  } catch (err) {
    if (res.statusCode === 404) {
      res.json({ err: 'Something went wrong' });
      console.log(err);
    } else {
      res.status(500).json({ err: 'Something went wrong' });
      console.log(err);
    }
  }
});

//delete product
router.delete('/:userId/:productId', isSignedIn, adminPerm, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    const product = user.products.id(req.params.productId);
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    product.remove();
    await user.save();

    res.status(204).end();
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: 'Something went wrong' });
  }
});

module.exports = router;