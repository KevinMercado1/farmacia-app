const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const adminAuth = require('../middleware/adminAuthMiddleware.js');

router.post('/', auth, async (req, res) => {
  const { shippingAddress } = req.body;

  if (
    !shippingAddress ||
    !shippingAddress.street ||
    !shippingAddress.city ||
    !shippingAddress.state ||
    !shippingAddress.zip ||
    !shippingAddress.country
  ) {
    return res.status(400).json({
      message: 'Por favor, proporciona una dirección de envío completa.',
    });
  }

  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate(
      'items.product'
    );

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'El carrito está vacío.' });
    }

    let totalAmount = 0;
    const orderItems = [];

    for (const cartItem of cart.items) {
      const product = await Product.findById(cartItem.product._id);

      if (!product) {
        return res.status(404).json({
          message: `Producto no encontrado: ${cartItem.product.name}`,
        });
      }
      if (product.stock < cartItem.quantity) {
        return res.status(400).json({
          message: `No hay suficiente stock para ${product.name}. Stock disponible: ${product.stock}`,
        });
      }

      product.stock -= cartItem.quantity;
      await product.save();

      orderItems.push({
        product: product._id,
        quantity: cartItem.quantity,
        priceAtOrder: product.price,
      });
      totalAmount += product.price * cartItem.quantity;
    }

    const order = new Order({
      user: req.user.id,
      items: orderItems,
      totalAmount,
      shippingAddress,
    });

    await order.save();

    cart.items = [];
    await cart.save();

    res.status(201).json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .populate('items.product', ['name', 'imageUrl']);
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});

router.get('/all', auth, adminAuth, async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate('user', ['username', 'email'])
      .populate('items.product', ['name', 'imageUrl']);
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});

router.put('/:id/status', auth, adminAuth, async (req, res) => {
  const { status } = req.body;

  try {
    let order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }

    order.status = status;
    await order.save();
    res.json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});

module.exports = router;
