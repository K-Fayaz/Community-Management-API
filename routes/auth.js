const express = require("express");
const authController = require("../controller/auth");
const isLoggedin = require("../middlewares/isloggedin");
const router  = express.Router();


router.post('/signup',authController.signup);

router.post('/signin',authController.signin);

router.get('/me',isLoggedin,authController.getME);

module.exports = router;