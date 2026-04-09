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
const authorize = require("../middleware/authorize"); // 🔥 ADD THIS

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
 */
router.post(
  "/",
  auth,
  authorize("owner"), // 🔥 ONLY OWNER
  upload.array("images", 5),
  validate(createPropertySchema),
  addProperty
);


/**
 * @swagger
 * /api/property:
 *   get:
 *     summary: Get all properties
 */
router.get("/", getProperties);


/**
 * @swagger
 * /api/property/{id}:
 *   get:
 *     summary: Get single property
 */
router.get("/:id", getProperty);


/**
 * @swagger
 * /api/property/{id}:
 *   put:
 *     summary: Update property
 *     description: Only owner can update property
 */
router.put(
  "/:id",
  auth,
  authorize("owner"), // 🔥 ONLY OWNER
  validate(updatePropertySchema),
  updateProperty
);


/**
 * @swagger
 * /api/property/{id}:
 *   delete:
 *     summary: Delete property
 *     description: Only owner can delete property
 */
router.delete(
  "/:id",
  auth,
  authorize("owner"), // 🔥 ONLY OWNER
  deleteProperty
);

module.exports = router;