const express = require("express");
const bodyParser = require("body-parser");
const router = require("./routes");
const cors = require("cors");

const app = express();
const port = 1234; // Change to the desired port

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use("/", router);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
