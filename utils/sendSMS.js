const twilio = require("twilio");

const client = twilio(
  process.env.TWILIO_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const sendSMS = async (to, message) => {
  try {
    await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE,
      to,
    });

    console.log("SMS sent successfully ✅");
  } catch (error) {
    console.error("SMS failed ❌:", error.message);
  }
};

module.exports = sendSMS;