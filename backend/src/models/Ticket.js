const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
  seat: String,  // 座位ID或标识
  qrCodeData: String, 
  pdfUrl: String // 若要将生成的PDF上传到S3后保存URL
}, { timestamps: true });

module.exports = mongoose.model('Ticket', ticketSchema);
