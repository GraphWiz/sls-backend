import express from 'express';
import serverless from 'serverless-http';
import cors from 'cors';
import { getPrompt } from './helpers/message/index.js';
import { verifyAPIToken } from './middleware/auth.js';
import { ChatGPTAPI } from 'chatgpt';
import bodyParser from 'body-parser';

const app = express();
const { json, urlencoded } = bodyParser;

app.use(cors({ methods: 'POST' }));
app.use(urlencoded({ extended: true }));
app.use(json({ limit: '18mb' }));

app.get('/', (_, res) => {
  res.status(200).json({ message: 'Hello from root!' });
});

app.get('/path', (_, res) => {
  res.status(200).json({ message: 'Hello from path!' });
});

app.post('/chat', verifyAPIToken, async (req, res) => {
  try {
    const { type, message, model } = req.body;
    const prompt = getPrompt(type, message);
    
    const modelToUse = model || 'gpt-3.5-turbo';

    const gpt = new ChatGPTAPI({
      apiKey: process.env.OPENAI_API_KEY,
      completionParams: {
        model: modelToUse,
        temperature: 0.5,
        top_p: 0.8
      }
    });

    console.log("LOG\n" + JSON.stringify({
      modelToUse,
      type
    }));
    const response = await gpt.sendMessage(message, {
      systemMessage: prompt
    });
    console.log("RESPONSE\n" + JSON.stringify({
      response
    }));

    return JSON.stringify({response});
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
