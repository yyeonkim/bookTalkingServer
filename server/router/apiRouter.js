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
  n: 3,
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

router.post("/chat/start", async (req, res) => {
  const completion = await openai.createChatCompletion({
    messages: [req.body],
    ...chatSettings,
  });

  res.send(completion.data.choices[Math.floor(Math.random(3))].message);
});

router.post("/chat/send", async (req, res) => {
  const completion = await openai.createChatCompletion({
    messages: req.body,
    ...chatSettings,
  });

  res.send(completion.data.choices[Math.floor(Math.random(3))].message);
});

router.post("/chat/summarize", async (req, res) => {
  const completion = await openai.createChatCompletion({
    messages: [
      ...req.body,
      {
        role: "user",
        content: "우리 대화를 요약해서 동화로 만들어줘. 부연 설명 하지 마.",
      },
    ],
    ...createSettings,
  });

  res.send(completion.data.choices[0].message);
});

router.post("/chat/keyword", async (req, res) => {
  // 요약한 동화를 body로 보낸다.
  const completion = await openai.createChatCompletion({
    messages: [
      {
        role: "user",
        content: `${req.body}\n\n위 이야기에서 다섯 개의 키워드를 영어로 알려줘. 아래처럼 리스트 형태로 알려줘.\nanswer: [word1, word2, word3, word4, word5]`,
      },
    ],
    ...keywordSettings,
  });

  res.send(completion.data.choices[0].message);
});

module.exports = router;
