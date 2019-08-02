const router = require("express").Router();
const authController = require("../controllers/user");

router.post("/register", authController.register);

module.exports = router;
