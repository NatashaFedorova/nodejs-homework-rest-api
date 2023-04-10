const sgMail = require('@sendgrid/mail');
require('dotenv').config();

const { SEND_API_SECRET_KEY, SINGLE_SENDER_EMAIL } = process.env;

sgMail.setApiKey(SEND_API_SECRET_KEY);

const sendEmail = async (data) => {
  const email = { ...data, from: SINGLE_SENDER_EMAIL };
  await sgMail.send(email);
  return true;
};

module.exports = sendEmail;
