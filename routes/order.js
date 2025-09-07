const mongoose = require("mongoose");
const OrderSchema = new mongoose.Schema({
  title: String,
  description: String,
  category: String,
  city: String,
  budget: String,
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model("Order", OrderSchema);
