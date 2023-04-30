const express = require("express");
const app = express();
const chatRouter = require("./router/chatRouter");

app.use("/chat", chatRouter);

const port = 5000;
app.listen(port, () => console.log(`Listening on port ${port}`));
