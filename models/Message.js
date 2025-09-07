const mongoose = require("mongoose");
const MessageSchema = new mongoose.Schema({
  text: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name: String,
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model("Message", MessageSchema);
