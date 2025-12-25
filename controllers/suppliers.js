const express = require('express');
const router = express.Router();
const User = require('../models/user');

const isSignedIn = require('../middleware/is-signed-in');
const adminPerm = require('../middleware/is-admin');

//index of suppliers
router.get('/', isSignedIn, async (req, res) => {
  try {
    const users = await User.find();
    const allSuppliers = users.flatMap(user =>
      user.products.flatMap(product => product.suppliers)
    );
    res.status(200).json(allSuppliers);
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: "Something went wrong" });
  }
});


//add supplier to product
router.post('/:userId/products/:productId/suppliers', isSignedIn, adminPerm, async (req, res) => {
  try {
    const { name, contact, address } = req.body;
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

    product.suppliers.push({ name, contact, address });
    await user.save();

    res.status(201).json(product.suppliers[product.suppliers.length - 1]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: 'Something went wrong' });
  }
});


//show single supplier
router.get('/:userId/products/:productId/:supplierId', isSignedIn, async (req, res) => {
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

    const supplier = product.suppliers.id(req.params.supplierId);
    if (!supplier) {
      res.status(404);
      throw new Error('Supplier not found');
    }

    res.status(200).json(supplier);
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
router.get('/:userId/products/:productId/:supplierId/edit', isSignedIn, adminPerm, async (req, res) => {
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

    const supplier = product.suppliers.id(req.params.supplierId);
    if (!supplier) {
      res.status(404);
      throw new Error('Supplier not found');
    }

    res.status(200).json(supplier);
  } catch (err) {
    res.status(500).json({ err: 'Something went wrong' });
    console.log(err);
  }
});


//update 
router.put('/:userId/products/:productId/:supplierId', isSignedIn, adminPerm, async (req, res) => {
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

    const supplier = product.suppliers.id(req.params.supplierId);
    if (!supplier) {
      res.status(404);
      throw new Error('Supplier not found');
    }

    Object.assign(supplier, req.body);
    await user.save();

    res.status(200).json(supplier);
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


//delete 
router.delete('/:userId/products/:productId/:supplierId', isSignedIn, adminPerm, async (req, res) => {
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

    const supplier = product.suppliers.id(req.params.supplierId);
    if (!supplier) {
      res.status(404);
      throw new Error('Supplier not found');
    }

    supplier.remove();
    await user.save();

    res.status(200).json({ message: 'Supplier deleted successfully' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: 'Something went wrong' });
  }
});

module.exports = router;