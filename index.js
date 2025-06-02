const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");

const app = express();
const PORT = process.env.PORT || 3000;

const VERIFY_TOKEN = "giahan123";
const PAGE_ACCESS_TOKEN = "EAAYntL8ZA6kUBO8cGCBnxqpE3mNtgjZBjfIGw6ZB7K1c1Cf16ua3tnisKvOTvhXO9TyZCjyCze7QSVm0DrZC5xsnp7t3a0nkPYeZAJb1OtVI9hem7fxeoMKnxHZBMGwA3J8md3DoZCdKxAdHYNnsmpxeoYEc3oWu1dq7ZBVKCGP38klEr5pC1xRP8JK2GNg5IDh4vEB576wZDZD"; // ⚠️ Thay chỗ này bằng token thật

app.use(bodyParser.json());

// Xác minh webhook
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("Webhook xác minh thành công!");
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// Nhận tin nhắn
app.post("/webhook", (req, res) => {
  const body = req.body;

  if (body.object === "page") {
    body.entry.forEach((entry) => {
      const event = entry.messaging[0];
      const sender_psid = event.sender.id;

      if (event.message && !event.message.is_echo) {
        console.log("Tin nhắn nhận được:", event.message.text);
        sendReply(sender_psid, "🎉 Chào bạn! Đây là bot của Sữa chua Gia Hân. Cảm ơn bạn đã nhắn tin 💌");
      }
    });

    res.status(200).send("EVENT_RECEIVED");
  } else {
    res.sendStatus(404);
  }
});

function sendReply(sender_psid, messageText) {
  const request_body = {
    recipient: { id: sender_psid },
    message: { text: messageText },
  };

  request(
    {
      uri: "https://graph.facebook.com/v17.0/me/messages",
      qs: { access_token: PAGE_ACCESS_TOKEN },
      method: "POST",
      json: request_body,
    },
    (err, res, body) => {
      if (!err) {
        console.log("Đã gửi tin phản hồi thành công.");
      } else {
        console.error("Lỗi gửi tin:", err);
      }
    }
  );
}

app.listen(PORT, () => {
  console.log(`Server chạy tại cổng ${PORT}`);
});
