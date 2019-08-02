const express = require("express");
const mongoose = require("mongoose");
const config = require("./config/index");
const app = express();

mongoose.connect(
  config.MONGOURI,
  { useNewUrlParser: true, useCreateIndex: true },
  err => {
    if (err) console.log("cannot connect to db");
    else {
      console.log("db connetion successfully established");
    }
  }
);

app.use(express.json());
app.get("/", (req, res, next) => {
  res.status(200).send("Beginning of awesomness!");
});
app.use("/api/", require("./routes/auth"));

app.listen(config.PORT, () => console.log(`app started on ${config.PORT}`));
