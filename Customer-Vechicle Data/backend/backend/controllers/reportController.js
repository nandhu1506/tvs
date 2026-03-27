const db = require("../db");
const ExcelJS = require("exceljs");

exports.getVehicleReport = (req, res) => {
  const sql = `
    SELECT 
    v.id,
    v.vehicle_number,
    c.name AS customer_name,
    v.make,
    v.model,
    v.year
FROM vehicles v
LEFT JOIN customers c ON v.customer_id = c.id
ORDER BY v.id;
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

exports.downloadVehicleReportExcel = (req, res) => {
  const sql = `
    SELECT 
      v.id,
      v.vehicle_number,
      c.name AS customer_name,
      v.make,
      v.model,
      v.year
    FROM vehicles v
    LEFT JOIN customers c ON v.customer_id = c.id
    ORDER BY v.id;
  `;

  db.query(sql, async (err, results) => {
    if (err) return res.status(500).json(err);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Vehicle Report");

    worksheet.columns = [
      { header: "ID", key: "id", width: 5 },
      { header: "Vehicle Number", key: "vehicle_number", width: 20 },
      { header: "Customer Name", key: "customer_name", width: 20 },
      { header: "Make", key: "make", width: 15 },
      { header: "Model", key: "model", width: 15 },
      { header: "Year", key: "year", width: 10 },
    ];

    results.forEach(row => {
      worksheet.addRow(row);
    });
    worksheet.getRow(1).font = { bold: true };
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=vehicle-report.xlsx"
    );

    await workbook.xlsx.write(res);
    res.end();
  });
};

exports.getCustomerReport = (req, res) => {
  const sql = `
    SELECT 
    id ,
    name,
    email,
    phone
    FROM customers
    ORDER BY id
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

exports.downloadCustomerReportExcel = (req, res) => {
  const sql = `
      SELECT 
        id ,
        name,
        email,
        phone
        FROM customers
        ORDER BY id
  `;

  db.query(sql, async (err, results) => {
    if (err) return res.status(500).json(err);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Customer Report");

    worksheet.columns = [
      { header: "ID", key: "id", width: 5 },
      { header: "Customer Name", key: "name", width: 15 },
      { header: "Email", key: "email", width: 20 },
      { header: "Phone", key: "phone", width: 20 },
    ];

    results.forEach(row => {
      worksheet.addRow({
        id: row.id,
        name: row.name,
        email: row.email,
        phone: row.phone
      });
    });
    worksheet.getRow(1).font = { bold: true };
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=customer-report.xlsx"
    );

    await workbook.xlsx.write(res);
    res.end();
  });
};

exports.getVehiclesByCustomerReport = (req, res) => {
  const { customerId } = req.params;

  const sql = `
    SELECT 
      v.id,
      v.vehicle_number,
      v.make,
      v.model,
      v.year,
      c.name AS customer_name
    FROM vehicles v
    JOIN customers c ON v.customer_id = c.id
    WHERE v.customer_id = ?
    ORDER BY v.id
  `;

  db.query(sql, [customerId], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

exports.downloadVehiclesByCustomerExcel = (req, res) => {
  const { customerId } = req.params;

  const sql = `
    SELECT 
      v.id,
      v.vehicle_number,
      v.make,
      v.model,
      v.year,
      c.name AS customer_name
    FROM vehicles v
    LEFT JOIN customers c ON v.customer_id = c.id
    WHERE v.customer_id = ?
    ORDER BY v.id
  `;

  db.query(sql, [customerId], async (err, results) => {
    if (err) return res.status(500).json(err);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Vehicles By Customer");
    const customerName = results.length > 0
      ? results[0].customer_name.replace(/\s+/g, "_")
      : customerId;

    worksheet.columns = [
      { header: "ID", key: "id", width: 10 },
      { header: "Customer Name", key: "customer_name", width: 20 },
      { header: "Vehicle Number", key: "vehicle_number", width: 20 },
      { header: "Make", key: "make", width: 15 },
      { header: "Model", key: "model", width: 15 },
      { header: "Year", key: "year", width: 10 },
    ];

    results.forEach((row) => {
      worksheet.addRow(row);
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=vehiclesbycustomer_${customerName}.xlsx`
    );


    await workbook.xlsx.write(res);
    res.end();
  });
};