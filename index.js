const express = require("express");
const router = require("./router");
const partnerRoutes = require("./src/router/route");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
app.use(
  cors({
    origin: "*",
    methods: ["POST", "GET"],
  })
);

app.use(express.json());
app.use("/", router);
app.use("/part", partnerRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then((res) => {})
  .catch((err) => console.log(err));

app.listen(4000, () => {
  console.log("connect");
});

module.exports = app;