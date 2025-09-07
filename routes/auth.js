const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email va parol kerak" });
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: "Bu email allaqachon ro'yxatdan o'tgan" });
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashed, role });
    await user.save();
    res.json({ msg: "Ro'yxatdan o'tish muvaffaqiyatli", user: { _id: user._id, name: user.name, email: user.email, role: user.role }});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email va parol kerak" });
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Email topilmadi" });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ error: "Parol noto'g'ri" });
    res.json({ msg: "Kirish muvaffaqiyatli", user: { _id: user._id, name: user.name, email: user.email, role: user.role }});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
