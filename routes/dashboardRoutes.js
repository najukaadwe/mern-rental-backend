const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

const { getOwnerDashboard } = require("../controllers/dashboardController");

/**
 * @swagger
 * /api/dashboard/owner:
 *   get:
 *     summary: Get owner dashboard stats
 *     description: Returns total properties, bookings, earnings, and other metrics for owner
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard data fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 totalProperties: 3
 *                 totalBookings: 10
 *                 totalEarnings: 20000
 *                 activeBookings: 4
 *                 cancelledBookings: 2
 *                 monthlyEarnings: 8000
 */
router.get("/owner", auth, getOwnerDashboard);

module.exports = router;