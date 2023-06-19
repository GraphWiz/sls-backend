import express from "express";
import serverless from "serverless-http";
import cors from 'cors';
import { getPrompt } from './helpers/message/index.js'
import { ChatGPTAPI } from 'chatgpt';
import bodyParser from 'body-parser';
const { json } = bodyParser;

const app = express();

app.use(cors({
  methods: 'POST'
}));
app.use(bodyParser.urlencoded({ extended: true }));
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
    const { type, message } = req.body;
    const prompt = getPrompt(type, message)
    const response = await gpt.sendMessage(message, {
      systemMessage: prompt
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

