const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
//
router.get('/', auth, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id }).populate(
      'items.product',
      ['name', 'price', 'imageUrl', 'stock']
    );
    if (!cart) {
      return res.json({ items: [] });
    }
    res.json(cart);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});

router.post('/', auth, async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    let cart = await Cart.findOne({ user: req.user.id });
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ msg: 'Producto no encontrado' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        msg: `No hay suficiente stock para ${product.name}. Stock disponible: ${product.stock}`,
      });
    }

    if (!cart) {
      cart = new Cart({
        user: req.user.id,
        items: [{ product: productId, quantity }],
      });
    } else {
      const itemIndex = cart.items.findIndex(
        (item) => item.product.toString() === productId
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity = quantity;
      } else {
        cart.items.push({ product: productId, quantity });
      }
    }

    await cart.save();

    cart = await Cart.findOne({ user: req.user.id }).populate('items.product', [
      'name',
      'price',
      'imageUrl',
      'stock',
    ]);
    res.json(cart);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});

router.delete('/:productId', auth, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({ msg: 'Carrito no encontrado' });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== req.params.productId
    );

    await cart.save();

    cart = await Cart.findOne({ user: req.user.id }).populate('items.product', [
      'name',
      'price',
      'imageUrl',
      'stock',
    ]);
    res.json(cart);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});

router.delete('/', auth, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({ msg: 'Carrito no encontrado' });
    }

    cart.items = [];
    await cart.save();
    res.json({ msg: 'Carrito vaciado' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});

module.exports = router;
