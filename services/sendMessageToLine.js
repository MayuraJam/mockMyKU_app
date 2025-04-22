const axios = require("axios");
require("dotenv").config();

const sendLineNotificate = async (sentMassage) => {
  const LINE_TOKEN = process.env.Line_TOKEN;
  const userId = process.env.GROUP_ID;
  try {
    await axios.post(
      "https://api.line.me/v2/bot/message/push",
      {
        to: "C0eb58c3a5e284c1328de46a7efd5ec57",
        messages: [
          {
            type: "text",
            text: sentMassage,
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${"JsrECbornf05X7wJl5HHG3uHpzH0VsOa8ERXoTouOGT3V5wwykEsM/Cp+RIIbC6jJk4c0wyev1kRB+6T+U/+kutfWcGTu8RzCQHa8L06nmBqSS6L3PLRKycmYVKn4vEM7LSt8Or6HhFrZ2FK1g0znwdB04t89/1O/w1cDnyilFU="}`,
        },
      }
    );
    console.log("sent line notificate  success");
  } catch (error) {
    console.error("Line notification error:", error);
  }
};

module.exports = sendLineNotificate;
