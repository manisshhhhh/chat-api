const axios = require("axios");
const express = require("express");
const dotenv = require("dotenv");

const app = express();
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
let data = ""; // Initialize data variable

const apiCall = async (inputText) => {
  try {
    const dt = await axios.post(
      process.env.CHAT_API,
      {
        input: {
          question: inputText,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return dt.data.output.answer.content; // Return the content
  } catch (error) {
    console.log(error, "THE ERROR");
    throw error; // Rethrow the error to handle it outside the function if needed
  }
};

const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;

const client = require("twilio")(accountSid, authToken);

app.post("/", express.json(), async (req, res) => {
  try {
    console.log(req.body.Body);

    // Call the apiCall function and wait for the result
    data = await apiCall(req.body.Body);

    // Send the response using Twilio
    const msg = await client.messages.create({
      body: data,
      from: req.body.To,
      to: req.body.From,
    });

    console.log(msg.sid);
    res.send(msg.sid);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(3000, () => {
  console.log("Server is up");
});
