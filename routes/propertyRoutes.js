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
const {
  createPropertySchema,
  updatePropertySchema,
} = require("../validators/property.validator");
const auth = require("../middleware/authMiddleware");

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
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               location:
 *                 type: string
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
  upload.array("images", 5),
  validate(createPropertySchema),
  addProperty
);



/**
 * @swagger
 * /api/property:
 *   get:
 *     summary: Get all properties
 *     description: Fetch all properties with optional filters
 *     tags: [Property]
 *     parameters:
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
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
 *         description: Property ID
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
 *         description: Property ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             title: "Updated Flat"
 *             price: 2500
 *     responses:
 *       200:
 *         description: Property updated
 */
router.put("/:id", auth, validate(updatePropertySchema), updateProperty);



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
 *         description: Property ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Property deleted
 */
router.delete("/:id", auth, deleteProperty);

module.exports = router;