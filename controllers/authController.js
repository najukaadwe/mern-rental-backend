const User = require("../models/User");
const jwt = require("jsonwebtoken");
const asyncHandler = require("../utils/asyncHandler");


const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};



exports.register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ msg: "User already exists" });
  }

  const user = await User.create({
    name,
    email,
    password, 
    role,
  });

  res.status(201).json({
    success: true,
    msg: "User registered successfully",
    token: generateToken(user),
    data: user,
  });
});



exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return res.status(400).json({ msg: "User not found" });
  }


  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    return res.status(400).json({ msg: "Invalid credentials" });
  }

  

  res.json({
    success: true,
    token: generateToken(user),
    data: user,
  });
});