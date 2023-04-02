require("dotenv").config();
const bodyParser = require("body-parser");
const { Configuration, OpenAIApi } = require("openai");
const express = require("express");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 8080;

// Allow CORS from any origin
app.use(cors());

app.use(bodyParser.json());
// Routes
app.use(express.static("static"));

// Test route, visit localhost:3000 to confirm it's working
app.get("/", function (req, res) {
  // save html files in the `views` folder...
  res.sendFile(__dirname + "/static/index.html");
});

// Our Goodreads relay route!
app.post("/api/search", async (req, res) => {
  const openai = new OpenAIApi(
    new Configuration({
      apiKey: process.env.CHATGPT_API_KEY,
    })
  );
  try {
    const response = openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: req.body.query }],
    });
    console.log(response.data);
    const image = openai.createImage({
      prompt: req.body.param,
      n: 1,
      size: "256x256",
    });
    const [poem, art] = await Promise.all([response, image]);
    console.log(poem.data, art.data);
    return res.json({
      succes: true,
      dataPoem: poem.data,
      dataArt: art.data,
    });
  } catch (e) {
    console.log(e);
  }
});

app.listen(port, "0.0.0.0", () =>
  console.log(`Example app listening on port ${port}!`)
);
