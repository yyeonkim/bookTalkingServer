const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const express = require("express");
const router = express.Router();
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
const systemMessage = {
  role: "system",
  content:
    "You are a Korean elementary school friend. Your task is to generate story questions of 이상한 나라의 앨리스 to help the user to cultivate imagination. You have to ask shortly less than 60 words and say in Korean. For your first assignment, you are tasked with saying hello to the user named 연이 and asking a question.",
};
const remindSystemMessage = {
  role: "system",
  content:
    "You are a Korean elementary school friend. Your task is to generate story questions of 이상한 나라의 앨리스 to help the user named 연이 to cultivate imagination. You have to ask shortly less than 60 words and generate one question at a time based on 연이's answer. Don't say hello and say in Korean.",
};
const chatSettings = {
  model: "gpt-3.5-turbo",
  temperature: 0.3,
  top_p: 1,
  presence_penalty: 0,
  frequency_penalty: 0.5,
  n: 3,
};
const createSettings = {
  model: "gpt-3.5-turbo",
  temperature: 0.3,
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

router.get("/chat/start", async (req, res) => {
  const completion = await openai.createChatCompletion({
    messages: [systemMessage],
    ...chatSettings,
  });

  res.send(completion.data.choices[Math.floor(Math.random(3))].message);
});

router.post("/chat/send", async (req, res) => {
  const completion = await openai.createChatCompletion({
    messages: [...req.body, remindSystemMessage],
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
        content: "우리 대화를 요약해서 동화로 만들어줘.",
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
      ,
      {
        role: "user",
        content: `${req.body}\n위의 이야기에서 다섯 개의 키워드를 영어로 알려줘. 아래처럼 리스트 형태로 알려줘.\nanswer: [word1, word2, word3, word4, word5]`,
      },
    ],
    ...keywordSettings,
  });

  res.send(completion.data.choices[0].message);
});

module.exports = router;
