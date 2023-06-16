import express from "express";
import serverless from "serverless-http";
import cors from 'cors';
import { ChatGPTAPI } from 'chatgpt';

const app = express();

app.use(cors({
  methods: 'POST'
}));

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
      systemMessage: `Given a message in any form, write a Mermaid script that represents it as a "graph TD" diagram.

      Instructions:
      1. Replace the placeholders [action1], [action2], ... with the actual actions.
      2. Replace the placeholders [description1], [description2], ... with the corresponding descriptions.
      3. Format the actions and descriptions using the format: ActionName[Description].
      4. Connect the actions and descriptions using appropriate arrows and connectors.`
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

