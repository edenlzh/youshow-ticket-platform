const express = require('express');
const router = express.Router();
const { createOrder, getOrder } = require('../controllers/orderController');

// 下订单(购买票)，生成PDF并发送邮件
router.post('/', createOrder);
// 查询订单及票
router.get('/:orderId', getOrder);

module.exports = router;
