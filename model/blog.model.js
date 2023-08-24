const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  username: { type: String },
  title: { type: String },
  content: { type: String },
  category: {
    type: String,
    enum: ["Business", "Tech", "Lifestyle", "Entertainment"],
  },
  date: { type: Date, default: Date.now() },
  likes: { type: Number },
  comments: [{ username: String, content: String }],
  userID: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
});

const BlogModel = mongoose.model("blog", blogSchema);
module.exports = { BlogModel };
