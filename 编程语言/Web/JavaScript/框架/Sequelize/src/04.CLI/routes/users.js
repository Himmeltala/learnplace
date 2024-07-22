let express = require("express");
let router = express.Router();
let models = require("../models");

router.get("/", function(req, res, next) {
  models.User.findAll().then((result) => {
    res.send(result);
  });
});

module.exports = router;
