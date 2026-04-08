const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/database");
const errorHandler = require("./middleware/errorMiddleware");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");
const limiter = require("./middleware/rateLimiter");
const helmet = require("helmet");

dotenv.config();
connectDB();

const app = express();

// ✅ Global Middlewares
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(limiter); // ✅ MOVE HERE


// ✅ Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/property", require("./routes/propertyRoutes"));
app.use("/api/booking", require("./routes/bookingRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.send("API Running...");
});

// ❌ Not found
app.use((req, res) => {
  res.status(404).json({ msg: "Route not found" });
});

// ❌ Error handler (always last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));