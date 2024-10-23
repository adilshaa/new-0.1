const { checkgpt } = require("../../collections/gpt.model");
const Proto = require("../models/prototype");

module.exports = {
  async loadPrototype(req, res) {
    try {
      const _list = await Proto.find({});

      if (_list !== null) {
        return res.status(200).json({ status: 200, msg: _list });
      }
      return res
        .status(400)
        .json({ status: "error", msg: "Internal server error" });
    } catch (error) {
      return res
        .status(500)
        .json({ status: "error", msg: "Internal server error" });
    }
  },
  async loadPrototypeById(req, res) {
    try {
      const { id } = req.params;

      if (!id)
        return res.status(400).json({ status: "error", msg: "Data not found" });
      const _proto = await Proto.findById({ _id: id });

      if (_proto !== null) {
        return res.status(200).json({ status: 200, msg: _proto });
      }
      return res
        .status(400)
        .json({ status: "error", msg: "Internal server error" });
    } catch (error) {
      return res
        .status(500)
        .json({ status: "error", msg: "Internal server error" });
    }
  },

  async udpateWIthGpt(req, res) {
    try {
      const { id } = req.params;
      let { prompt } = req.body;

      _sendprompt = `
Here is the code snipent to manuplate. " ${prompt}  Can i get a updated version with validation and everything with tis
And also can you add jwt session managment also on that, and also redis caching, ip address caching 
`;

      if (!id)
        return res.status(400).json({ status: "error", msg: "Data not found" });
      const _proto = await Proto.findById({ _id: id });

      checkgpt(_sendprompt).then((_resposne) => {
        console.log(_resposne);

        const _returnSnipet = _resposne.find(
          (_snip) =>
            _snip.language == "javascript" || _snip.language == "ndoe.js"
        );

        console.log(_returnSnipet, "snpt");

        if (_returnSnipet !== null) {
          return res.status(200).json({ status: 200, msg: _returnSnipet });
        }

        return res
          .status(400)
          .json({ status: "error", msg: "Internal server error" });
      });
    } catch (error) {
      console.log(error);

      return res
        .status(500)
        .json({ status: "error", msg: "Internal server error" });
    }
  },
};
