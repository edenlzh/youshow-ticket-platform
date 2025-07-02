const nodemailer = require('nodemailer');

// 演示用本地 SMTP；生产环境可使用AWS SES或其他可靠服务
exports.sendEmailWithAttachment = async ({ to, subject, text, attachment }) => {
  // 这里仅演示
  const transporter = nodemailer.createTransport({
    host: "smtp.yourhost.com",
    port: 587,
    auth: {
      user: "username",
      pass: "password"
    }
  });

  const mailOptions = {
    from: '"Youshow" <noreply@youshow.com>',
    to,
    subject,
    text,
    attachments: [attachment]
  };

  await transporter.sendMail(mailOptions);
};
