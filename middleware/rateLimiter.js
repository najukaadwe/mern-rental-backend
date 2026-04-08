const rateLimit = require("express-rate-limit");

// ✅ Create limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requests per IP
  message: {
    success: false,
    msg: "Too many requests, please try again later",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = limiter;