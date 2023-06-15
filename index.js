import express from "express";
import serverless from "serverless-http";
import { ChatGPTAPI } from 'chatgpt';

const app = express();
app.use(express.json());

const gpt = new ChatGPTAPI({
  apiKey: process.env.OPENAI_API_KEY
});

app.get("/", (req, res, next) => {
  return res.status(200).json({
    message: "Hello from root!",
  });
});

app.get("/path", (req, res, next) => {
  return res.status(200).json({
    message: "Hello from path!",
  });
});

app.post('/chat', async (req, res) => {
  try {
    const message = req.body.message;
    const response = await gpt.sendMessage(message);
    res.json({ response });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

const handler = serverless(app);
export { handler };

