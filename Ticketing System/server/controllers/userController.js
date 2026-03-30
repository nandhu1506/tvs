const db = require("../services/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const otpStore = require("../services/otpStore");
const { sendOtpEmail } = require("../services/nodemailer");


exports.registerController = async (req, res) => {
  try {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
      return res.status(400).json({
        message: "Username, email and password are required",
      });
    }

    const [existing] = await db.query(
      "SELECT * FROM users WHERE username = ? OR email = ?",
      [username, email]
    );

    if (existing.length > 0) {
      return res.status(409).json({
        message: "Username or Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
      [username, email, hashedPassword]
    );

    res.status(201).json({
      message: "User registered successfully",
      userId: result.insertId,
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.loginController = async (req, res) => {
  try {
    const { username, password } = req.body;

    const [results] = await db.query(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );

    if (results.length === 0) {
      return res.status(401).json({ message: "User not found" });
    }

    const user = results[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        username: user.username,
      },
    });

  } catch (err) {
    res.status(500).json(err);
  }
};

exports.changePasswordController = async (req, res) => {  
  try {
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields required",
      });
    }

    const [results] = await db.query(
      "SELECT * FROM users WHERE id = ?",
      [userId]
    );

    if (!results.length) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const user = results[0];

    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Old password incorrect",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db.query(
      "UPDATE users SET password = ? WHERE id = ?",
      [hashedPassword, userId]
    );

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.getAllUsersController = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT id, username FROM users");
    res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};


exports.forgotPasswordController = async (req, res) => {
  try {
    const { email } = req.body;

    const [users] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (!users.length) {
      return res.status(404).json({ message: "Email not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    const expiry = Date.now() + 5 * 60 * 1000;

    otpStore.set(email, { otp, expiry });

    await sendOtpEmail(email, otp);

    res.status(200).json({
      message: "OTP sent successfully",
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


exports.verifyOtpController = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const record = otpStore.get(email);

    if (!record) {
      return res.status(400).json({ message: "OTP not found" });
    }

    if (Date.now() > record.expiry) {
      otpStore.delete(email);
      return res.status(400).json({ message: "OTP expired" });
    }

    if (record.otp != otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    res.status(200).json({
      message: "OTP verified",
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.resetPasswordController = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({
        message: "Email and new password required",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const [result] = await db.query(
      "UPDATE users SET password = ? WHERE email = ?",
      [hashedPassword, email]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "Password reset successful",
    });

  } catch (err) {
    console.error("RESET ERROR:", err); // 🔥 must add
    res.status(500).json({ message: "Server error" });
  }
};