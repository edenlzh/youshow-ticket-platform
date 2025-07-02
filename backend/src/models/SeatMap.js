const mongoose = require('mongoose');

const seatMapSchema = new mongoose.Schema({
  // 关联到 event
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
  // 画布JSON描述(使用Konva/Fabric等前端库保存的结构)
  seatMapData: Object,
  // 座位图名称(用于后续复用)
  name: String
}, { timestamps: true });

module.exports = mongoose.model('SeatMap', seatMapSchema);
