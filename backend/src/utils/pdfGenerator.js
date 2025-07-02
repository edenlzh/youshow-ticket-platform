const PDFDocument = require('pdfkit');
/**
 * generatePdfBuffer - 将订单信息与票务信息生成PDF并返回Buffer
 * @param {Object} order 订单信息
 * @param {Array} tickets 对应门票信息
 * @returns {Buffer} PDF文件的Buffer
 */
exports.generatePdfBuffer = (order, tickets) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ autoFirstPage: false });
      const chunks = [];
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));

      tickets.forEach((ticket, index) => {
        doc.addPage();
        doc.fontSize(20).text('Youshow Ticket', { align: 'center' });
        doc.text(`Order ID: ${order._id}`, { align: 'center' });
        doc.text(`Event ID: ${order.eventId}`, { align: 'center' });
        doc.text(`Seat: ${ticket.seat}`, { align: 'center' });
        doc.text(`Buyer: ${order.userEmail}`, { align: 'center' });

        // 插入二维码(如果是DataURL可先转Buffer)
        if (ticket.qrCodeData) {
          const base64Data = ticket.qrCodeData.replace(/^data:image\/png;base64,/, "");
          const qrBuffer = Buffer.from(base64Data, 'base64');
          doc.image(qrBuffer, { fit: [150, 150], align: 'center', valign: 'center' });
        }
      });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};
