const express = require("express");
const Controller = require("../controller/community");
const isLoggedin = require("../middlewares/isloggedin");

const router  = express.Router();


router.route("/")
    .get(isLoggedin,Controller.GetAll)
    .post(isLoggedin,Controller.Create);

router.get('/me/owner',isLoggedin,Controller.GetMyOwnedCom);


router.get('/:id/members/',isLoggedin,Controller.GetMembers);


router.get('/me/member',isLoggedin,Controller.GetMyJoinedComm)

module.exports = router;