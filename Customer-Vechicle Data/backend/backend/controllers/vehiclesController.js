const db = require('../db');

exports.getVehicles = (req, res) => {

  db.query(`
    SELECT v.id,
           v.vehicle_number,
           v.make,
           v.model,
           v.year,
           v.customer_id,
           c.name AS customer_name
    FROM vehicles v
    LEFT JOIN customers c
    ON v.customer_id = c.id
  `, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Database error" });
    }

    res.status(200).json(results);
  });
};



exports.addVehicle = (req, res) => {
  const { customer_id, vehicle_number, make, model, year } = req.body;
  userId = req.user.id;


  if (!customer_id || !vehicle_number || !make || !model) {
    return res.status(400).json({ message: "Required fields missing" });
  }

  db.query(
    `INSERT INTO vehicles (customer_id, vehicle_number, make, model, year,created_by)
         VALUES (?, ?, ?, ?, ?, ?)`,
    [customer_id, vehicle_number, make, model, year, userId || null],
    (err, results) => {
      if (err) {
        console.error(err);

        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(400).json({ message: "Vehicle number already exists" });
        }

        return res.status(500).json({ message: "Database error" });
      }

      res.status(201).json({
        id: results.insertId,
        customer_id,
        vehicle_number,
        make,
        model,
        year
      });
    }
  );
};

exports.getVehiclesByCustomer = (req, res) => {
  const customerId = req.params.id;

  db.query(
    `SELECT 
              v.*,
              u1.name AS created_by_name,
              u2.name AS modified_by_name
          FROM vehicles v
          LEFT JOIN users u1 
              ON v.created_by = u1.id
          LEFT JOIN users u2 
              ON v.modified_by = u2.id
         WHERE customer_id = ?;`,
    [customerId],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Database error" });
      }
      res.json(results);
    }
  );
};

exports.getVehicleById = (req, res) => {
  db.query(
    "SELECT * FROM vehicles WHERE id = ?",
    [req.params.id],
    (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results[0]);
    }
  );
};

exports.updateVehicle = (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  const { make, model, year } = req.body;

  db.query(
    "UPDATE vehicles SET make=?, model=?, year=?, modified_by=?, modified_at=NOW() WHERE id=?",
    [make, model, year, req.user.id, req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Vehicle updated successfully" });
    }
  );
};

exports.deleteVehicle = (req, res) => {
  const vehicleId = req.params.id;

  db.query(
    "DELETE FROM vehicles WHERE id = ?",
    [vehicleId],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Database error" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Vehicle not found" });
      }

      res.json({ message: "Vehicle deleted successfully" });
    }
  );
};