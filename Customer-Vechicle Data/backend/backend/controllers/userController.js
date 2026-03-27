const db = require("../db");
const bcrypt = require('bcrypt');
const { generateToken } = require("../jwt/jwt");

exports.registerUser = async (req, res) => {
  const { name, email, role, phone } = req.body;

  if (!name || !email || !phone) {
    return res.status(400).json({ message: "Name, email and phone are required" });
  }

  try {
    const defaultPassword = phone;

    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    db.query(
      `INSERT INTO users 
      (name, email, password, role, phone, created_at, modified_at) 
      VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
      [name, email, hashedPassword, role || "user", phone],
      (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Database error", error: err });
        }

        res.status(201).json({
          message: "User registered successfully",
          defaultPassword: phone
        });
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database error', error: err });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken({ id: user.id, email: user.email, role: user.role });     

        res.status(200).json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    });
};

exports.getUsers = (req, res) => {

  db.query(
    "SELECT id, name, role, phone FROM users ORDER BY id ASC",
    (err, results) => {

      if (err) {
        console.error("Get Users Error:", err);
        return res.status(500).json({
          message: "Database error",
          error: err
        });
      }

      res.status(200).json({
        success: true,
        users: results
      });

    }
  );

};

  exports.getProfile = (req, res) => {

    const userId = req.user.id;

    db.query(
      "SELECT id, name, email, phone, role, created_at, modified_at FROM users WHERE id = ?",
      [userId],
      (err, results) => {

        if (err) {
          console.error("Profile Error:", err);
          return res.status(500).json({
            message: "Database error",
            error: err
          });
        }

        if (results.length === 0) {
          return res.status(404).json({
            message: "User not found"
          });
        }

        res.status(200).json(results[0]);
      }
    );

  };

exports.updateProfile = (req, res) => {

  const { name, email, phone, password } = req.body;
  const userId = req.user.id;

  bcrypt.hash(password, 10, (err, hashedPassword) => {

    if (err) {
      return res.status(500).json({
        message: "Password hashing error"
      });
    }

    db.query(
      "UPDATE users SET name=?, email=?, phone=?, password=? WHERE id=?",
      [name, email, phone, hashedPassword, userId],
      (err, result) => {

        if (err) {
          console.error("Update Error:", err);
          return res.status(500).json({
            message: "Database error"
          });
        }

        res.status(200).json({
          message: "Profile updated successfully"
        });

      }
    );

  });

};