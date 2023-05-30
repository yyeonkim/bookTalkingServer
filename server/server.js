const path = require("path");
const compression = require("compression");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const express = require("express");
const app = express();
const apiRouter = require("./router/apiRouter");

app.use(compression());
app.use(express.static(path.join(__dirname, "../client/build")));
app.use(express.json());
app.use("/api", apiRouter);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}`));
