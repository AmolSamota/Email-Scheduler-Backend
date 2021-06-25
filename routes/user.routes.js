const { Router } = require("express");
const { createOrUpdateUser, currentUser } = require("../controllers/user");
const { authCheck } = require("../middlewares/auth");

const router = Router();

router.post("/create-or-update-user", authCheck, createOrUpdateUser);
router.post("/current-user", authCheck, currentUser);

module.exports = router;
