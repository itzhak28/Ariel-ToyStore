const express = require("express");
const bcrypt = require("bcrypt");
const {
  UserModel,
  validateUser,
  validateLogin,
  createToken,
} = require("../models/userModel");

const router = express.Router();

router.post("/", async (req, res) => {
  const body = req.body;
  const validBody = validateUser(body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    const user = new UserModel(body);
    user.password = await bcrypt.hash(user.password, 10);
    await user.save();
    user.password = "****";
    res.status(201).json(user);
  } catch (err) {
    console.log(err);
    if (err.code == 11000) {
      return res
        .status(400)
        .json({ msg: "Email already in system", code: 11000 });
    }
    res.status(502).json({ err });
  }
});

router.post("/login", async (req, res) => {
  const body = req.body;
  const validBody = validateLogin(body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    const user = await UserModel.findOne({ email: body.email });
    if (!user) {
      return res.status(401).json({ err: "Email not in system" });
    }
    const validPass = await bcrypt.compare(body.password, user.password);
    if (!validPass) {
      return res.status(401).json({ err: "password not match" });
    }
    const token = createToken(user._id, user.role);
    res.json({ token });
  } catch (err) {
    console.log(err);
    res.status(502).json({ err });
  }
});

module.exports = router;
