const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());

// Models
const User = require("./models/User");
const Order = require("./models/Order");
const Message = require("./models/Message");

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/orders", require("./routes/orders"));
app.use("/api/chat", require("./routes/chat"));

// Serve frontend in production (optional)
app.use(express.static(path.join(__dirname, "..", "frontend")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "index.html"));
});

// Connect to MongoDB and start server
const MONGO = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/usta24";
mongoose.connect(MONGO, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(()=> {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`));
}).catch(err => {
  console.error("MongoDB connection error:", err.message);
});
