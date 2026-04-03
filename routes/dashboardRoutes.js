const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

const { getOwnerDashboard } = require("../controllers/dashboardController");

router.get("/owner", auth, getOwnerDashboard);

module.exports = router;