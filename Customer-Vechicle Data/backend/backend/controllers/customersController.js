const db = require('../db');

exports.getCustomers = (req, res) => {
  db.query(` SELECT 
              c.*,
              u1.name AS created_by_name,
              u2.name AS modified_by_name
          FROM customers c
          LEFT JOIN users u1 
              ON c.created_by = u1.id
          LEFT JOIN users u2 
              ON c.modified_by = u2.id;`, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

exports.addCustomer = (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });

  const { name, email, phone } = req.body;
  const userId = req.user.id;

  db.query(
    'INSERT INTO customers (name, email, phone, created_by) VALUES (?, ?, ?, ?)',
    [name, email, phone, userId],
    (err, results) => {
      if (err) {
        console.error('DB Error:', err);

        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(400).json({ message: 'Customer with this email already exists.' });
        }

        return res.status(500).json({ message: 'Database error', error: err });
      }

      res.status(201).json({ id: results.insertId, name, email, phone });
    }
  );
};


exports.getCustomerById = (req, res) => {
  db.query(
    "SELECT * FROM customers WHERE id = ?",
    [req.params.id],
    (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results[0]);
    }
  );
};

exports.updateCustomer = (req, res) => {
  const { id } = req.params;
  const { name, email, phone } = req.body;
  const userId = req.user.id;

  db.query(
    "UPDATE customers SET name=?, email=?, phone=?, modified_by=?, modified_at=NOW() WHERE id=?",
    [name, email, phone, userId, id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Customer updated successfully" });
    }
  );
};