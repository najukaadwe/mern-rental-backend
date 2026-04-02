const express = require("express");
const router = express.Router();
const {
  addProperty,
  getProperties,
  getProperty,
  updateProperty,
  deleteProperty,
} = require("../controllers/propertyController");

const auth = require("../middleware/authMiddleware");

router.post("/", auth, addProperty);
router.get("/", getProperties);
router.get("/:id", getProperty);
router.put("/:id", auth, updateProperty);
router.delete("/:id", auth, deleteProperty);

module.exports = router;