require("dotenv").config();
const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(201).json({ isError: true, msg: "Invalid user" });
    }
    const decode = jwt.decode(token, process.env.secretKey);
    if (!decode) {
      return res.status(201).json({ isError: true, msg: "login first" });
    }
    const { email, id } = decode;
    req.user = { email, id };
    next();
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
module.exports = { auth };
