const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const User = mongoose.model("User");

const router = express.Router();

router.post("/signup", async (req, res) => {
  const { email, phone, password, name } = req.body;
  try {
    const user = User({ email, phone, password, name });
    await user.save();
    const token = jwt.sign({ userId: user._id }, "MY_SECRET_KEY");
    res.send({ token });
  } catch (err) {
    return res.status(422).send(err.message);
  }
});

router.post("/signin", async (req, res) => {
  const { phone, password } = req.body;

  if (!phone || !password) {
    return res.send({ error: "Fill all" });
  }

  const user = await User.findOne({ phone });
  if (!user) {
    return res.status(404).send({ error: "User not found" });
  }

  try {
    await user.comparePassword(password);
    const token = jwt.sign({ userId: user._id }, "MY_SECRET_KEY");
    res.send({ token });
  } catch (err) {
    return res.status(422).send({ error: err });
  }
});

module.exports = router;
