const express = require("express");
const Controller = require("../controller/member");
const isLoggedIn = require("../middlewares/isloggedin");

const router  = express.Router();

router.post('/',isLoggedIn,Controller.Add);

router.delete('/:id',isLoggedIn,Controller.Delete);

module.exports = router;