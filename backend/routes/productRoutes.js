const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const adminAuth = require('../middleware/adminAuthMiddleware');
const Product = require('../models/Product');

router.get('/', async (req, res) => {
  try {
    const { search, category, stockStatus } = req.query;

    let query = {};

    if (stockStatus === 'outOfStock') {
      query.stock = 0;
    } else if (stockStatus === 'inStock') {
      query.stock = { $gt: 0 };
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (category) {
      query.category = { $regex: category, $options: 'i' };
    }

    const products = await Product.find(query).sort({ name: 1 });
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ msg: 'Producto no encontrado' });
    }

    res.json(product);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ msg: 'ID de producto no válido' });
    }
    res.status(500).send('Error del servidor');
  }
});

router.post('/', auth, adminAuth, async (req, res) => {
  const { name, description, price, stock, imageUrl, category } = req.body;

  try {
    const newProduct = new Product({
      name,
      description,
      price,
      stock,
      imageUrl,
      category,
    });

    const product = await newProduct.save();
    res.status(201).json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});

router.put('/:id', auth, adminAuth, async (req, res) => {
  const { name, description, price, stock, imageUrl, category } = req.body;

  const productFields = {};
  if (name) productFields.name = name;
  if (description) productFields.description = description;
  if (price) productFields.price = price;
  if (stock !== undefined) productFields.stock = stock;
  if (imageUrl) productFields.imageUrl = imageUrl;
  if (category) productFields.category = category;

  try {
    let product = await Product.findById(req.params.id);

    if (!product)
      return res.status(404).json({ msg: 'Producto no encontrado' });

    product = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: productFields },
      { new: true }
    );

    res.json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});

router.delete('/:id', auth, adminAuth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product)
      return res.status(404).json({ msg: 'Producto no encontrado' });

    await Product.findByIdAndDelete(req.params.id);

    res.json({ msg: 'Producto eliminado' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});

module.exports = router;
