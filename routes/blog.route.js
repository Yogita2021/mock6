const express = require("express");
const { BlogModel } = require("../model/blog.model");
const blogroute = express.Router();

blogroute.get("/blogs", async (req, res) => {
  try {
    const data = await BlogModel.find();

    res.status(200).json({ isError: false, data: data });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
});

blogroute.get("/blogs/query", async (req, res) => {
  try {
    const { category, sortBy, search } = req.query;
    let query = BlogModel.find();

    if (category) {
      query = query.where({ category });
    }
    if (sortBy) {
      let sortField = sortBy === "ascending" ? "date" : "-date";
      query = query.sort(sortField);
    }
    if (search) {
      query = query.where({ title: { $regex: search, $options: "i" } });
    }

    let data = await query;
    res.status(200).json({ msg: "all data here", data: data });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
});

blogroute.post("/blogs", async (req, res) => {
  try {
    const data = new BlogModel(req.body);
    await data.save();
    res.status(200).json({ isError: false, msg: "blog created" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
});

blogroute.patch("/blogs/:id", async (req, res) => {
  try {
    const payload = req.body;
    const { id } = req.params;
    const data = await BlogModel.findByIdAndUpdate(id, payload);
    if (!data) {
      return res.status(201).res.json({ isError: true, msg: "blog not found" });
    }
    res.status(200).json({ isError: false, msg: "updated" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
});

blogroute.delete("/blogs/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = await BlogModel.findByIdAndDelete(id);
    if (!data) {
      return res.status(201).res.json({ isError: true, msg: "blog not found" });
    }
    res.status(200).json({ isError: false, msg: "deleted" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
});

blogroute.patch("/blogs/:id/like", async (req, res) => {
  try {
    let { id } = req.params;
    let data = await BlogModel.findById(id);
    if (!data) {
      return res.status(201).res.json({ isError: true, msg: "blog not found" });
    }
    data.likes++;
    await BlogModel.findByIdAndUpdate(id, data);
    res.status(200).json({ msg: "like updated" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
});
blogroute.patch("/blogs/:id/comment", async (req, res) => {
  try {
    const { comment } = req.body;
    let { id } = req.params;
    let data = await BlogModel.findById(id);
    if (!data) {
      return res.status(201).res.json({ isError: true, msg: "blog not found" });
    }
    data.comments.push(comment);
    await BlogModel.findByIdAndUpdate(id, data);
    res.status(200).json({ msg: "comment updated" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
});
module.exports = { blogroute };
