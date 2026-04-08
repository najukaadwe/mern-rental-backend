const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController");
const validate = require("../middleware/validate");
const {
  registerSchema,
  loginSchema,
} = require("../validators/auth.validator");


/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register new user
 *     description: Create a new user (renter or owner)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             name: Renuka
 *             email: renuka@gmail.com
 *             password: Renuka@123
 *             role: renter
 *     responses:
 *       200:
 *         description: User registered successfully
 */

router.post("/register", validate(registerSchema), register);


/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     description: Authenticate user and return JWT token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             email: renuka@gmail.com
 *             password: Renuka@123
 *     responses:
 *       200:
 *         description: Login successful
 */
router.post("/login", validate(loginSchema), login);

module.exports = router;