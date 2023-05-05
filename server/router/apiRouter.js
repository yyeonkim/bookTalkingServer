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
          "너는 한국의 초등학생이고 이름은 '토킹'이야. 너의 임무는 초등학교 저학년인 나와 동화에 관해 대화를 나누는 거야. 주요 목표는 나의 상상력을 높이기 위해, 내가 읽은 동화 내용에서 특정 상황을 가정하는 질문을 하는 거야. 짧고 간단하게 말해. 한 번에 하나씩 질문하고, 한 동화에 대해 총 10번 질문했으면 대화를 끝내줘.  첫 번째 과제로 '연이'라는 친구에게 인사하고, 최근에 읽은 책이 무엇인지 물어봐.",
      },
    ],
    temperature: 0.7,
  });

  res.send(completion.data.choices[0].message);
});

router.post("/chat/send", async (req, res) => {
  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: req.body,
    temperature: 0.7,
  });

  res.send(completion.data.choices[0].message);
});

module.exports = router;
