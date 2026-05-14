// routes/checkout.js
const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/checkoutController');
const { Order } = require('../models');
router.get( '/',                    ctrl.getCheckoutPage);
router.post('/process',             ctrl.processCheckout);       // crea orden BD + muestra PayPal
router.post('/create-paypal-order', ctrl.createPayPalOrder);    // crea orden en PayPal API
router.post('/capture-paypal-order',ctrl.capturePayPalOrder);   // captura el pago aprobado
router.get('/success', async (req, res) => {
  try {
    const orderId = parseInt(req.query.orderId);
    if (isNaN(orderId)) {
      return res.status(400).render('error', { title: 'Error', message: 'Orden inválida' });
    }
    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).render('error', { title: 'No encontrado', message: 'Orden no encontrada' });
    }
    res.render('order-success', { title: 'Pedido Completado', order });
  } catch (err) {
    console.error('Error al mostrar success:', err);
    res.status(500).render('error', { title: 'Error', message: 'No se pudo mostrar el pedido' });
  }
});
router.get( '/cancel',              ctrl.handleCancelPayment);
module.exports = router;