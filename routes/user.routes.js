const router = require("express").Router();
const userController = require("../controllers/user");
const { authCheck } = require("../middlewares/auth");

router.post("/create-or-update-user", authCheck, userController.createOrUpdateUser);
router.post("/current-user", authCheck, userController.currentUser);

module.exports = router;
