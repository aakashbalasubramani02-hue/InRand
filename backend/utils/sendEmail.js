const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // If email config is missing, just skip actual sending to avoid errors in dev
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('Skipping actual email send (Missing credentials).');
    return;
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"InRand Platform" <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
