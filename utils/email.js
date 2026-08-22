const Nodemailer = require('nodemailer');
const { MailtrapTransport } = require('mailtrap');

const sendEmail = async options => {
  const TOKEN = process.env.EMAIL_TOKEN;

  const transport = Nodemailer.createTransport(
    MailtrapTransport({
      token: TOKEN
    })
  );

  const info = await transport.sendMail({
    from: {
      address: 'hello@demomailtrap.co',
      name: 'Mailtrap Test'
    },
    to: options.email,
    subject: options.subject,
    text: options.message,
    category: options.category
  });
  return info;
};

module.exports = sendEmail;
