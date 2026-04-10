const User = require("../models/User");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");
const sendSMS = require("../utils/sendSMS");

// 🔐 Generate Token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};


// ✅ Register Service
exports.registerService = async (body) => {
  const { name, email, password, role } = body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  return {
    user,
    token: generateToken(user),
  };
};



// ✅ Login Service
exports.loginService = async (body) => {
  const { email, password } = body;

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new Error("User not found");
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  // 📩 Non-blocking notifications (BEST PRACTICE)
  sendEmail({
    to: user.email,
    subject: "Login Successful",
    text: "You have successfully logged in to your account",
  }).catch(() => console.log("Email failed"));

  if (user.phone) {
    sendSMS(
      `+91${user.phone}`,
      `Hi ${user.name}, your login success 🎉`
    ).catch(() => console.log("SMS failed"));
  }

  return {
    user,
    token: generateToken(user),
  };
};