// packages
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

// app
const app = express();
app.use(bodyParser.json());
app.use(cors());

// routes
const stripe = require("./routes/stripe");
app.use("/api/stripe", stripe);

const rawg = require("./routes/rawg");
app.use("/api/rawg", rawg);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}...`));
