const mongoose = require("mongoose");
const TodoSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  complete: {
    type: Boolean,
  },
});
module.exports = mongoose.model("Todo", TodoSchema);
