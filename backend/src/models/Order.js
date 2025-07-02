const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
  userEmail: String,
  seats: [String], // 这里可存座位ID或坐标等
  totalPrice: Number,
  status: { type: String, default: 'PENDING' }, // PENDING, PAID, REFUNDED
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
