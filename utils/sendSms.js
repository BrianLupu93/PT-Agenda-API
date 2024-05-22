const axios = require('axios');

exports.sendSms = async (phone, message) => {
  try {
    const req = await axios.post(
      'https://www.smsadvert.ro/api/sms/',
      {
        phone: `+4${phone}`,
        shortTextMessage: message,
      },
      {
        headers: {
          Authorization: process.env.SMS_TOKEN,
        },
      }
    );
  } catch (err) {
    console.log(err);
  }
};
