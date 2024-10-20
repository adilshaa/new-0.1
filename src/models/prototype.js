const mongoose = require("mongoose");

const prototypeSchema = new mongoose.Schema({
  heading: {
    type: String,
  },
  links: [
    {
      type: Number,
    },
  ],
  code: {
    type: String,
  },
  discription: {
    type: String,
  },
  orderNo: {
    type: Number,
  },
});

const Proto = mongoose.model("prototype", prototypeSchema);
module.exports = Proto;
