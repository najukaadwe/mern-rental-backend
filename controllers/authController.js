const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ✅ REGISTER
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // ❌ REMOVE manual hashing if using pre-save middleware
    // const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password, // middleware will hash
      role,
    });

    res.json({
      success: true,
      msg: "User registered",
      data: user,
    });

  } catch (error) {
    next(error); // ✅ send to error middleware
  }
};

// ✅ LOGIN
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      token,
      data: user,
    });

  } catch (error) {
    next(error); // ✅ send to middleware
  }
};