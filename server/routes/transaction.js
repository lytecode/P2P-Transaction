const router = require("express").Router();
const transactionController = require("../controllers/transaction");
const auth = require("../middleware/verifyToken");

router.post("/send-otp", transactionController.transferFund);
router.post("/transfer", transactionController.completeTransaction);
router.get("/:walletId", transactionController.history);

module.exports = router;
