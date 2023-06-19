import express from 'express';
import serverless from 'serverless-http';
import cors from 'cors';
import { getPrompt } from './helpers/message/index.js';
import { ChatGPTAPI } from 'chatgpt';
import bodyParser from 'body-parser';

const app = express();
const { json, urlencoded } = bodyParser;

app.use(cors({ methods: 'POST' }));
app.use(urlencoded({ extended: true }));
app.use(json({ limit: '5mb' }));

const gpt = new ChatGPTAPI({
  apiKey: process.env.OPENAI_API_KEY
});

app.get('/', (_, res) => {
  res.status(200).json({ message: 'Hello from root!' });
});

app.get('/path', (_, res) => {
  res.status(200).json({ message: 'Hello from path!' });
});

app.post('/chat', async (req, res) => {
  try {
    const { type, message } = req.body;
    const prompt = getPrompt(type, message);
    const response = await gpt.sendMessage(message, {
      systemMessage: prompt
    });
    res.json({ response });
  } catch (error) {
    console.error("EVENT\n" + JSON.stringify(error, null, 2));
    res.status(500).json({ error: 'Function Error: See Cloudwatch Logs' });
  }
});

app.use((_, res) => {
  res.status(404).json({ error: 'Not Found' });
});

const handler = serverless(app);
export { handler };
