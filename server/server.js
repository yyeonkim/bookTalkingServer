const express = require("express");
const app = express();
const apiRouter = require("./router/apiRouter");

app.use(express.json());
app.use("/api", apiRouter);

const port = 5000;
app.listen(port, () => console.log(`Listening on port ${port}`));
