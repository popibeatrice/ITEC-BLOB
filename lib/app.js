require("dotenv").config();
const bodyParser = require("body-parser");
const { Configuration, OpenAIApi } = require("openai");
const express = require("express");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const app = express();
const port = 3000;

// Allow CORS from any origin
app.use(cors());

app.use(bodyParser.json());
// Routes

// Test route, visit localhost:3000 to confirm it's working
// should show 'Hello World!' in the browser
app.get("/", (req, res) => res.send("Hello World!"));

// Our Goodreads relay route!
app.post("/api/search", async (req, res) => {
  const openai = new OpenAIApi(new Configuration({
    apiKey: process.env.CHATGPT_API_KEY
  }));
  try {
    const response = openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: req.body.query }]
    });
    console.log(response.data);
    const image = openai.createImage({
      prompt: req.body.param,
      n: 1,
      size: "256x256"
    });
    const [poem, art] = await Promise.all([response, image]);
    console.log(poem.data, art.data);
    return res.json({
      succes: true,
      dataPoem: poem.data,
      dataArt: art.data
    });
  } catch (e) {
    console.log(e);
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));