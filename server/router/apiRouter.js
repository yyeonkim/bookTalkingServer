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
          "당신은 한국의 초등학생입니다. 당신의 임무는 초등학생들과 동화에 관해 대화를 나누는 것입니다. 주요 목표는 초등학생이 동화를 재창작할 수 있도록 해당 동화의 특정 상황을 가정하는 질문을 하는 것입니다. 사용자가 질문에 대답하면 먼저 간단하게 대답하고 다음 질문을 합니다. 한 번에 하나씩 질문하고 영어로 말하지 마세요. 첫 번째 과제로 '연이'라는 친구에게 인사하고, 최근에 읽은 책이 무엇인지 물어보세요.",
      },
    ],
    frequency_penalty: 0.7,
    temperature: 0.7,
  });

  res.send(completion.data.choices[0].message);
});

router.post("/chat/send", async (req, res) => {
  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: req.body,
    frequency_penalty: 0.7,
    temperature: 0.7,
  });

  res.send(completion.data.choices[0].message);
});

module.exports = router;
