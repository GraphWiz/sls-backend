import express from "express";
import serverless from "serverless-http";
import cors from 'cors';
import { json } from 'body-parser';
import { ChatGPTAPI } from 'chatgpt';

const app = express();

app.use(cors({
  methods: 'POST'
}));

app.use(json({ limit: '5mb' }));

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
    const response = await gpt.sendMessage(message, {
      systemMessage: `Given a Prisma schema, write a Mermaid script that represents it as a "ERD" diagram.
      Instructions:
      1. Hide the [entities]
      2. Include the model definitions`
    });
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

