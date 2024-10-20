const Controler = require("../models/controlers");
const bcrypt = require("bcryptjs");
const Proto = require("../models/prototype");
const {
  extractAndFormatCode,
  separateTextAndCode,
  parseResponse,
  parseGPTResponse,
} = require("../../collections/gpt.model");
const { default: axios } = require("axios");
const { isObject } = require("../../utils/generators");

module.exports = {
  async register(req, res) {
    console.log(req.body);

    const { email, password } = req.body;
    try {
      // Check if the user already exists
      let user = await Controler.findOne({ email });
      if (user) {
        return res.status(400).json({ msg: "User already exists" });
      }

      // Hash the password before saving
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const inserting = new Controler({
        email,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      if (inserting == null) return res.json({ error: "error" });

      console.log(inserting);

      await inserting.save();
      return res
        .status(200)
        .json({ status: "succes", msg: "Registration successed" });
    } catch (error) {
      console.log(error);

      return res.json({ status: "error", msg: "Internal server error" });
    }
  },
  async login(req, res) {
    const { email, password } = req.body;

    try {
      let user = await Controler.findOne({ email });
      if (!user) {
        return res.status(400).json({ msg: "No record found" });
      }

      let isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(400).json({ msg: "Authentication faild" });
      }

      await Controler.findOneAndUpdate(
        { _id: user._id },
        { updatedAt: new Date() }
      );

      return res.status(200).json({ status: 200, msg: "Login success" });
    } catch (error) {
      return res.json({ status: "error", msg: "Internal server error" });
    }
  },

  async insertModels(req, res) {
    const { links, heading, code, order } = req.body;

    try {
      const payload = { links, heading, code, orderNo: order };

      const createPrototype = new Proto(payload);

      let isInserted = await createPrototype.save();

      if (!isInserted) return res.status(400).json({ status: "error" });

      return res.status(200).json({ status: "Success" });
    } catch (error) {
      return res
        .status(500)
        .json({ status: "error", msg: "Internal server error" });
    }
  },

  async upsertModels(req, res) {
    const { links, heading, code, order, discription } = req.body;
    const { _id } = req.params;

    try {
      const payload = { links, heading, code, orderNo: order, discription };

      const createPrototype = await Proto.findByIdAndUpdate(_id, payload);

      if (!createPrototype) return res.status(400).json({ status: "error" });

      return res.status(200).json({ status: "Success", data: createPrototype });
    } catch (error) {
      return res
        .status(500)
        .json({ status: "error", msg: "Internal server error" });
    }
  },
  async loadDashboard(req, res) {
    try {
      const loadData = await Proto.find();

      if (loadData == null) loadData = [];

      return res.status(200).json({ status: "sucess", msg: loadData });
    } catch (error) {
      return res
        .status(500)
        .json({ status: "error", msg: "Internal server error" });
    }
  },
};
