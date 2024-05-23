const express = require("express");
const authController = require("../controllers/authController");
const { createDemoData } = require("../middleware/createDemoData");
const { removeDemoData } = require("../middleware/removeDemoData");

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout, removeDemoData);

module.exports = router;
