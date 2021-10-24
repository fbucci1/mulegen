//function nocache(module) {require("fs").watchFile(require("path").resolve(module), () => {delete require.cache[require.resolve(module)]})}
//nocache("./controllers/generator.controller");

const express = require("express");
const cors = require("cors");

var corsOptions = {
  origin: "http://localhost:4200"
};

const app = express();
app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

var GeneratorController = require("./controllers/generator.controller");

var router = express.Router();
router.get("/", function (req, res) {
  res.send("Hello World!");
});
router.post("/api/generator", GeneratorController.generate);
app.use("/",router);


// set port, listen for requests
const PORT = process.env.PORT || 11111;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
