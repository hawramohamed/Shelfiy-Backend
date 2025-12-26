const express = require('express');
const router = express.Router();
const User = require('../models/user');

const isSignedIn = require('../middleware/is-signed-in');
const adminPerm = require('../middleware/is-admin');

//Global index of all suppliers across all users/products
router.get('/', isSignedIn, async (req, res) => {
  try {
    const users = await User.find();

    const allSuppliers = users.flatMap(user =>
      user.products.flatMap(product => product.suppliers)
    );

    res.status(200).json(allSuppliers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: 'Something went wrong' });
  }
});

//Add supplier to a specific product
router.post('/:userId/products/:productId/new', isSignedIn, adminPerm, async (req, res) => {
  try {
    const { name, contact, address } = req.body;
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ err: 'User not found' });

    const product = user.products.id(req.params.productId);
    if (!product) return res.status(404).json({ err: 'Product not found' });

    product.suppliers.push({ name, contact, address });
    await user.save();

    res.status(201).json(product.suppliers[product.suppliers.length - 1]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: 'Something went wrong' });
  }
});

// Show single supplier
router.get('/:userId/products/:productId/:supplierId', isSignedIn, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ err: 'User not found' });

    const product = user.products.id(req.params.productId);
    if (!product) return res.status(404).json({ err: 'Product not found' });

    const supplier = product.suppliers.id(req.params.supplierId);
    if (!supplier) return res.status(404).json({ err: 'Supplier not found' });

    res.status(200).json(supplier);
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: 'Something went wrong' });
  }
});

// Update supplier
router.put('/:userId/products/:productId/:supplierId', isSignedIn, adminPerm, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ err: 'User not found' });

    const product = user.products.id(req.params.productId);
    if (!product) return res.status(404).json({ err: 'Product not found' });

    const supplier = product.suppliers.id(req.params.supplierId);
    if (!supplier) return res.status(404).json({ err: 'Supplier not found' });

    Object.assign(supplier, req.body);
    await user.save();

    res.status(200).json(supplier);
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: 'Something went wrong' });
  }
});

//Delete supplier
router.delete('/:userId/products/:productId/:supplierId', isSignedIn, adminPerm, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ err: 'User not found' });

    const product = user.products.id(req.params.productId);
    if (!product) return res.status(404).json({ err: 'Product not found' });

    const supplier = product.suppliers.id(req.params.supplierId);
    if (!supplier) return res.status(404).json({ err: 'Supplier not found' });

    product.suppliers = product.suppliers.filter(
      s => s._id.toString() !== req.params.supplierId
    );

    await user.save();

    res.status(200).json({ message: 'Supplier deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: 'Something went wrong' });
  }
});

module.exports = router;