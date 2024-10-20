const mongoose = require("mongoose");

const ControlerSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  createdAt: { type: String, required: true },
  updatedAt: { type: String, required: true },
});
const Controler = mongoose.model("Controler", ControlerSchema);

module.exports = Controler;
