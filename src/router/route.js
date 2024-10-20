const express = require("express");
const userCtl = require("../controller/control");
const app = express();

app.post("/register", userCtl.register);
app.post("/login", userCtl.login);
app.post("/insert", userCtl.insertModels);
app.post("/upsert/:_id", userCtl.upsertModels);

app.get("/getdash", userCtl.loadDashboard);

module.exports = app;
