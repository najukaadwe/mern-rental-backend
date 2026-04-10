const asyncHandler = require("../utils/asyncHandler");
const authService = require("../services/auth.service");


// ✅ Register
exports.register = asyncHandler(async (req, res) => {
  const { user, token } = await authService.registerService(req.body);

  res.status(201).json({
    success: true,
    msg: "User registered successfully",
    token,
    data: user,
  });
});


// ✅ Login
exports.login = asyncHandler(async (req, res) => {
  const { user, token } = await authService.loginService(req.body);

  res.json({
    success: true,
    token,
    data: user,
  });
});