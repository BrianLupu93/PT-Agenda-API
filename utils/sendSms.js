exports.sendSms = async (client, message) => {
  try {
    const req = await axios.post(
      'https://www.smsadvert.ro/api/sms/',
      {
        phone: `+4${client.phone}`,
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
