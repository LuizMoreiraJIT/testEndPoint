// Imports dependencies and set up http server
import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import config from "./config/config.js";
import saveDatabase from "./db/database.js";

const app = express().use(bodyParser.json()); // creates express http server

// Sets server port and logs message on success
app.listen(config.port, () =>
  console.log("webhook is listening on port: ", config.port)
);

const sendMessage = (message, id, user) => {
  axios({
    method: "POST", // Required, HTTP method, a string, e.g. POST, GET
    url:
      "https://graph.facebook.com/v18.0/" +
      id +
      "/messages?access_token=" +
      config.token,
    data: {
      messaging_product: "whatsapp",
      to: user,
      text: { body: message },
    },
    headers: { "Content-Type": "application/json" },
  });
};

// Accepts POST requests at /webhook endpoint
app.post("/webhook", (req, res) => {
  try {
    // Check the Incoming webhook message
    console.log(JSON.stringify(req.body, null, 2));

    // info on WhatsApp text message payload: https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/payload-examples#text-messages
    if (req.body.object) {
      if (
        req.body.entry &&
        req.body.entry[0].changes &&
        req.body.entry[0].changes[0] &&
        req.body.entry[0].changes[0].value.messages &&
        req.body.entry[0].changes[0].value.messages[0]
      ) {
        let phone_number_id =
          req.body.entry[0].changes[0].value.metadata.phone_number_id;
        let from = req.body.entry[0].changes[0].value.messages[0].from; // extract the phone number from the webhook payload
        let msg_body = req.body.entry[0].changes[0].value.messages[0].text.body; // extract the message text from the webhook payload

        sendMessage(msg_body, phone_number_id, from);
        // saveDatabase(msg_body, phone_number_id, from);
      }
      res.sendStatus(200);
    } else {
      console.log("req.body is not an object");
      // Return a '404 Not Found' if event is not from a WhatsApp API
      res.sendStatus(404);
    }
  } catch (error) {
    res.sendStatus(500);
  }
});

//validar webtoken
app.get("/webhook", (req, res) => {
  // Parse params from the webhook verification request
  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];

  // Check if a token and mode were sent
  if (mode && token) {
    // Check the mode and token sent are correct
    if (mode === "subscribe" && token === config.verify_token) {
      // Respond with 200 OK and challenge token from the request
      console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
});
