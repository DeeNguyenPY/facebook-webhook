
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const PORT = process.env.PORT || 3000;

const VERIFY_TOKEN = "giahan123";

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

// Nhận tin nhắn từ Facebook
app.post("/webhook", (req, res) => {
  console.log("Tin nhắn nhận được:", JSON.stringify(req.body, null, 2));
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`Server chạy tại cổng ${PORT}`);
});
