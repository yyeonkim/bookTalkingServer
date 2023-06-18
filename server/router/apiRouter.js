const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const express = require("express");
const router = express.Router();
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
const chatSettings = {
  model: "gpt-3.5-turbo",
  temperature: 0.5,
  top_p: 1,
  presence_penalty: 0,
  frequency_penalty: 0.5,
};
const createSettings = {
  model: "gpt-3.5-turbo",
  temperature: 0.8,
  top_p: 1,
  presence_penalty: 0,
  frequency_penalty: 0.5,
};
const keywordSettings = {
  model: "gpt-3.5-turbo",
  temperature: 0.5,
  top_p: 1,
  presence_penalty: 0,
  frequency_penalty: 0.8,
};
const translateSettings = {
  model: "gpt-3.5-turbo",
  temperature: 0.3,
  top_p: 1,
  presence_penalty: 0,
  frequency_penalty: 0,
};

router.post("/chat/start", async (req, res) => {
  const completion = await openai.createChatCompletion({
    messages: [req.body],
    ...chatSettings,
  });

  res.send(completion.data.choices[0].message);
});

router.post("/chat/send", async (req, res) => {
  const completion = await openai.createChatCompletion({
    messages: req.body,
    ...chatSettings,
  });

  res.send(completion.data.choices[0].message);
});

router.post("/chat/summarize", async (req, res) => {
  const completion = await openai.createChatCompletion({
    messages: [
      ...req.body,
      {
        role: "user",
        content:
          "우리 대화를 요약해서 300자 정도의 한글 동화로 만들어줘. 동화만 만들어줘.",
      },
    ],
    ...createSettings,
  });

  res.send(completion.data.choices[0].message);
});

router.post("/chat/keyword", async (req, res) => {
  const completion = await openai.createChatCompletion({
    messages: req.body,
    ...keywordSettings,
  });

  res.send(completion.data.choices[0].message);
});

router.get("/chat/translate", async (req, res) => {
  // 영어 단어를 한글로 변환
  const completion = await openai.createChatCompletion({
    messages: [
      {
        role: "user",
        content: `"${req.query.keyword}"을 한글 단어로 알려줘. 부연 설명은 하지 마.`,
      },
    ],
    ...translateSettings,
  });

  res.send(completion.data.choices[0].message);
});

module.exports = router;
