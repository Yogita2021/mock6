const express = require("express");
require("dotenv").config();

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { UserModel } = require("../model/user.model");

const userroute = express.Router();

userroute.post("/register", async (req, res) => {
  try {
    const { username, avatar, email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (user) {
      return res
        .status(201)
        .json({ isError: true, msg: "user already exists" });
    }
    let hashpassword = bcrypt.hashSync(password, 8);
    const newUser = new UserModel({
      username,
      avatar,
      email,
      password: hashpassword,
    });

    await newUser.save();
    res.status(200).json({
      msg: "user registerd successful",
      isError: false,
      data: newUser,
    });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
});

userroute.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(201).json({ isError: true, msg: "register first" });
    }
    let passcheck = bcrypt.compareSync(password, user.password);
    if (!passcheck) {
      return res.status(201).json({ isError: true, msg: "login failed" });
    }
    const payload = { email: user.email, id: user._id };

    const token = jwt.sign(payload, process.env.secretKey, { expiresIn: "8h" });
    res
      .status(200)
      .json({ isError: false, token: token, msg: "login successful" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
});

module.exports = { userroute };
