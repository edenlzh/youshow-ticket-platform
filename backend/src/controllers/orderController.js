const Order = require('../models/Order');
const Ticket = require('../models/Ticket');
const { generatePdfBuffer } = require('../utils/pdfGenerator');
const { sendEmailWithAttachment } = require('../utils/emailSender');
const QRCode = require('qrcode');

exports.createOrder = async (req, res) => {
  try {
    const { eventId, userEmail, seats, totalPrice } = req.body;

    // TODO: 此处应先和支付网关进行支付校验
    // 假设已经完成支付，status = 'PAID'
    const newOrder = new Order({
      eventId,
      userEmail,
      seats,
      totalPrice,
      status: 'PAID'
    });
    await newOrder.save();

    // 为每个座位生成一张Ticket
    const tickets = [];
    for (const seat of seats) {
      const qrData = `event:${eventId}, seat:${seat}, user:${userEmail}`;
      const qrCodeDataUrl = await QRCode.toDataURL(qrData);
      const ticket = new Ticket({
        orderId: newOrder._id,
        eventId,
        seat,
        qrCodeData: qrCodeDataUrl
      });
      await ticket.save();
      tickets.push(ticket);
    }

    // 生成PDF
    const pdfBuffer = await generatePdfBuffer(newOrder, tickets);

    // 发送邮件 (附带pdfBuffer)
    await sendEmailWithAttachment({
      to: userEmail,
      subject: "Your Youshow Tickets",
      text: "Thank you for your purchase! Attached are your tickets.",
      attachment: {
        filename: "tickets.pdf",
        content: pdfBuffer
      }
    });

    res.json({ success: true, order: newOrder, tickets });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const order = await Order.findById(orderId).populate('eventId');
    const tickets = await Ticket.find({ orderId });
    res.json({ success: true, order, tickets });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
