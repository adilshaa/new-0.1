const express = require("express");
const userCtl = require("../controller/user");
const app = express();

app.get("/getprotolist", userCtl.loadPrototype);
app.get("/getprotoview/:id", userCtl.loadPrototypeById);
app.post("/gptup/:id", userCtl.udpateWIthGpt);

module.exports = app;
