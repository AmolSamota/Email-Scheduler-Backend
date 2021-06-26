const router = require("express").Router();
const userController = require("../controllers/user.controller");
const { authCheck } = require("../middlewares/auth");

// create new user if not exists
router.post("/create-user", authCheck, userController.createUser);

module.exports = router;
