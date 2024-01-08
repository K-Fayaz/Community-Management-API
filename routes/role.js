const express = require("express");
const Controller = require("../controller/role");
const isLoggedIn = require("../middlewares/isloggedin");
const router = express.Router();

router.route("/")
    .get(isLoggedIn,Controller.Get)
    .post(isLoggedIn,Controller.Create);

module.exports = router;