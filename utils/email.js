const nodemailer = require('nodemailer');

const sendEmail = async options => {
  // 1.) Create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  // 2.) Define email options
  const emailOptions = {
    from: 'Vamsi Krishna <9e8692dae1-af0d96@inbox.mailtrap.io>',
    to: options.email,
    subject: options.subject,
    message: options.message
  };

  // 3.) Send the email
  await transporter.sendMail(emailOptions);
};

module.exports = sendEmail;
