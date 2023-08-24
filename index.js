const express = require("express");
require("dotenv").config();
const cors = require("cors");
const { connection } = require("./config/db");
const { userroute } = require("./routes/user.route");
const { auth } = require("./middleware/auth");
const { blogroute } = require("./routes/blog.route");

const app = express();
app.use(express.json());
app.use(cors());
app.get("/", (req, res) => {
  res.send("I am server");
});

app.use("/api", userroute);
app.use(auth);
app.use("/api", blogroute);

app.listen(process.env.PORT, async () => {
  try {
    await connection;
    console.log("connected to db running at port 8000");
  } catch (error) {
    console.log(error);
    console.log("not connnected to db");
  }
});
