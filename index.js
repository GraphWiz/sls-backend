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
      systemMessage: `Instructions:
      1. Write a Mermaid script that represents the given Prisma schema as an Entity-Relationship Diagram (ERD). 
      2. The ERD diagram should include the relationships between entities and their attributes. 
      3. Hide the [entities].
      4. Include the model definitions where they are enclosed in curly braces "{}", and the properties are listed inside with their respective data types. 
      5. Do not use colons in the models, use spaces instead. 
      6. Do not use colons within the curly braces "{}". 
      7. Use colons in the ER diagram itself and define relationships. 
      8. For "String" data types, do not put question marks "?" at the end. 
      9. Enclose the relationships in the ER diagram in double quotation marks '""'.
      Schema:`
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

