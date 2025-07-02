const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: String,
  description: String,
  dates: [{
    startTime: Date,
    endTime: Date
  }],
  address: String,
  // 票价可以是一个数组(多票档) 或者单一票价
  price: Number,
  canRefund: { type: Boolean, default: false },
  promotions: [
    {
      code: String,
      discountRate: Number
    }
  ],
  // 存储海报在S3或本地的URL
  posterUrl: String
}, { timestamps: true });

module.exports = mongoose.model("Event", eventSchema);
