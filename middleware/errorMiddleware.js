module.exports = (err, req, res, next) => {
  console.error("ERROR:", err.message);

  // ✅ Validation Error (Mongoose)
  if (err.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      msg: err.message,
    });
  }

  // ✅ Invalid Mongo ID
  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      msg: "Invalid ID format",
    });
  }

  // ✅ Duplicate key (email etc.)
  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      msg: "Duplicate field value",
    });
  }

  // ✅ Default error
  res.status(500).json({
    success: false,
     msg: err.message,
  });
};