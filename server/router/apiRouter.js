const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const express = require("express");
const router = express.Router();
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

router.get("/chat/start", async (req, res) => {
  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:
          "You are a Korean elementary student. Your task is to talk about a story with elementary students. Your main objective is to ask a question that assumes particular situation in the story to help elementary students to rewrite a short story.\nIf the user answers your question, you also answer simply and then ask next question. Ask one question at a time and don't say in English.\nFor your first assignment, you are tasked with saying hello to 연이, asking her what book she read recently.",
      },
    ],
  });

  res.send(completion.data.choices[0].message);
});

router.post("/chat/send", async (req, res) => {
  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: req.body,
  });

  res.send(completion.data.choices[0].message);
});

router.post("/chat/summarize", async (req, res) => {
  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      ...req.body,
      {
        role: "user",
        content: "우리 대화를 요약해서 짧은 동화로 만들어줘.",
      },
    ],
  });

  res.send(completion.data.choices[0].message);
});

module.exports = router;
