const mongoose = require("mongoose");
const userShema = new mongoose.Schema({
  username: { type: String },
  avatar: { type: String },
  email: { type: String, unique: true, required: true },
  password: { type: String },
});

const UserModel = mongoose.model("user", userShema);

module.exports = { UserModel };
