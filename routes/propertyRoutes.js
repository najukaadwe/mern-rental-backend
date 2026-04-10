const express = require("express");
const router = express.Router();

const {
  addProperty,
  getProperties,
  getProperty,
  updateProperty,
  deleteProperty,
} = require("../controllers/propertyController");

const upload = require("../middleware/uploadMiddleware");
const validate = require("../middleware/validate");
const auth = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");

const {
  createPropertySchema,
  updatePropertySchema,
} = require("../validators/property.validator");

/**
 * @swagger
 * tags:
 *   name: Property
 *   description: Property management APIs
 */


/**
 * @swagger
 * /api/property:
 *   post:
 *     summary: Create property with images
 *     description: Only owner can create property
 *     tags: [Property]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - location
 *               - price
 *             properties:
 *               title:
 *                 type: string
 *               location:
 *                 type: string
 *               price:
 *                 type: number
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Property created successfully
 */
router.post(
  "/",
  auth,
  authorize("owner"),
  upload.array("images", 5),
  validate(createPropertySchema),
  addProperty
);


/**
 * @swagger
 * /api/property:
 *   get:
 *     summary: Get all properties
 *     tags: [Property]
 *     responses:
 *       200:
 *         description: List of properties
 */
router.get("/", getProperties);


/**
 * @swagger
 * /api/property/{id}:
 *   get:
 *     summary: Get single property
 *     tags: [Property]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Property details
 *       404:
 *         description: Property not found
 */
router.get("/:id", getProperty);


/**
 * @swagger
 * /api/property/{id}:
 *   put:
 *     summary: Update property
 *     description: Only owner can update property
 *     tags: [Property]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             title: "Updated title"
 *             price: 5000
 *     responses:
 *       200:
 *         description: Property updated successfully
 */
router.put(
  "/:id",
  auth,
  authorize("owner"),
  validate(updatePropertySchema),
  updateProperty
);


/**
 * @swagger
 * /api/property/{id}:
 *   delete:
 *     summary: Delete property
 *     description: Only owner can delete property
 *     tags: [Property]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Property deleted successfully
 */
router.delete(
  "/:id",
  auth,
  authorize("owner"),
  deleteProperty
);

module.exports = router;