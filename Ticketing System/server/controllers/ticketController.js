const db = require("../services/db");
const { sendTicketEmail, sendReplyEmail } = require("../services/nodemailer");
const excelJS = require("exceljs");

//  Add Ticket
exports.AddticketController = async (req, res) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const {
      project,
      outlet,
      customerName,
      contactNumber,
      emailId,
      altContactNo,
      altCustomerName,
      subject,
      source,
      priority,
      category,
      company,
      issueMessage,
    } = req.body;

    if (!customerName || !contactNumber || !subject || !issueMessage) {
      return res.status(400).json({
        message: "Required fields missing",
      });
    }
    const username = req.user?.username ;
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: user not logged in" });
    }

    const ticketQuery = `
      INSERT INTO tickets (
        project, outlet, customer_name, contact_number, email_id,
        alternate_contact, alternate_customer_name, subject, source,
        priority, category, company, issue_message, status, created_by, assigned_to, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;

    const ticketValues = [
      project,
      outlet,
      customerName,
      contactNumber,
      emailId,
      altContactNo,
      altCustomerName,
      subject,
      source,
      priority,
      category,
      company,
      issueMessage,
      "Assigned",
      username,
      username
    ];

    const [ticketResult] = await connection.execute(ticketQuery, ticketValues);

    const ticketId = ticketResult.insertId;

    if (req.files && req.files.length > 0) {
      const attachQuery = `
          INSERT INTO ticket_attachments (ticket_id, file_name, file_path)
          VALUES ?
        `;
      const attachValues = req.files.map((file) => [ticketId, file.filename, `/uploads/${file.filename}`]);
      await connection.query(attachQuery, [attachValues]);
    }

    await connection.commit();


    if (emailId) {
      await sendTicketEmail(emailId, ticketId, customerName, subject);
    }

    res.status(201).json({
      message: "Ticket created successfully",
      ticketId,
    });

  } catch (error) {
    await connection.rollback();
    console.error(error);
    res.status(500).json({ message: "Server error" });
  } finally {
    connection.release();
  }
};

// getAllTickets
exports.getAllTicketsController = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
          t.id,
          t.project,
          t.subject,
          t.status,
          t.outlet,
          t.assigned_to,
          t.created_at
      FROM tickets t
      ORDER BY t.created_at DESC;
    `);

    res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch tickets" });
  }
};

// ViewTicket
exports.viewTicketController = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      `SELECT *
       FROM tickets 
       WHERE id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    const ticket = rows[0];

    const [attachments] = await db.query(
      `SELECT id, file_name, file_path
       FROM ticket_attachments
       WHERE ticket_id = ?`,
      [id]
    );

    ticket.attachments = attachments;

    res.json(ticket);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update ticket
exports.updateTicketController = async (req, res) => {
  try {
    const { id } = req.params;
    let updates = { ...req.body };
    const username = req.user?.username;

    if (!updates || Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    if (updates.status === "Closed") {
      updates.closed_at = new Date();
      updates.cancelled_at = null;
      updates.cancelled_by = null;
    }
    else if (updates.status === "Cancelled") {
      updates.cancelled_at = new Date();
      updates.cancelled_by = username || null;
      updates.closed_at = null;
      updates.closed_by = null;
    }
    else if (updates.status) {
      updates.closed_at = null;
      updates.cancelled_at = null;
      updates.cancelled_by = null;
    }

    const fields = Object.keys(updates).map((key) => `${key} = ?`).join(", ");
    const values = Object.values(updates);

    const [result] = await db.query(
      `UPDATE tickets SET ${fields} WHERE id = ?`,
      [...values, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.status(200).json({ message: "Ticket updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// replay message
exports.replyTicketController = async (req, res) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const { ticketId, message } = req.body;

    if (!ticketId || !message) {
      return res.status(400).json({
        message: "Ticket ID and message are required",
      });
    }

    const [ticketData] = await connection.execute(
      `SELECT customer_name, email_id, subject FROM tickets WHERE id = ?`,
      [ticketId]
    );

    if (ticketData.length === 0) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    const ticket = ticketData[0];

    if (ticket.email_id) {
      await sendReplyEmail(
        ticket.email_id,
        ticketId,
        ticket.customer_name,
        ticket.subject,
        message,
        req.files
      );
    }

    res.status(200).json({
      message: "Reply sent successfully",
    });
  } catch (error) {

    console.error(error);
    res.status(500).json({ message: "Server error" });
  } finally {
    connection.release();
  }
};

// Get project names
exports.getProjectsController = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT DISTINCT project FROM tickets ORDER BY project ASC`
    );

    const projects = rows.map(row => row.project);
    res.status(200).json({ projects });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch projects" });
  }
};

// export excel
exports.exportTicketsController = async (req, res) => {
  try {
    const { fromDate, toDate, project } = req.query;

    if (!fromDate || !toDate || !project) {
      return res.status(400).json({
        message: "fromDate, toDate and project are required",
      });
    }
    
    const fromDateTime = `${fromDate} 00:00:00`;
    const toDateTime = `${toDate} 23:59:59`;

    const [tickets] = await db.query(
      `SELECT 
              ROW_NUMBER() OVER () AS 'Serial No',
              t.id AS 'Call Id',
              t.date AS 'Call Log DateTime',
              t.subject AS 'Call Ref No',
              t.source AS 'Call Origin',
              t.status AS 'Call Status',
              t.closed_at AS 'Completed DateTime',
              t.category AS 'Call Category',
              t.email_id AS 'From Email',
              t.customer_name AS 'User Name',
              t.priority AS 'Call Priority',
              CASE 
                  WHEN t.closed_at IS NULL THEN NULL
                  ELSE CONCAT(
                      FLOOR(TIMESTAMPDIFF(MINUTE, t.created_at, t.closed_at) / 1440), 'd ',
                      FLOOR((TIMESTAMPDIFF(MINUTE, t.created_at, t.closed_at) % 1440) / 60), 'h ',
                      (TIMESTAMPDIFF(MINUTE, t.created_at, t.closed_at) % 60), 'm'
                  )
              END AS 'Resolution Time',
              t.created_by AS 'Assign By',
              t.created_at AS 'Assigned DateTime',
              t.closed_by AS 'Closed By',
              t.cancelled_by AS 'Cancelled By',
              t.cancelled_at AS 'Cancelled DateTime',
              t.contact_number AS 'User Mobile',
              t.category AS 'Reason Categories',
              t.company AS 'Company'
          FROM tickets t
          WHERE t.date BETWEEN ? AND ? 
            AND t.project = ?`,
        [fromDateTime, toDateTime, project]
    );

    if (tickets.length === 0) {
      return res.status(404).json({ message: "No tickets found for the selected criteria." });
    }

    const workbook = new excelJS.Workbook();
    const worksheet = workbook.addWorksheet("Tickets");

    
    worksheet.columns = Object.keys(tickets[0]).map((key) => ({
      header: key,
      key: key,
      width: 20, 
    }));


    const dateColumns = ['Call Log DateTime', 'Completed DateTime', 'Assigned DateTime', 'Cancelled DateTime'];
    tickets.forEach(ticket => {
      dateColumns.forEach(col => {
        if (ticket[col]) {
          ticket[col] = new Date(ticket[col]).toLocaleString();
        }
      });
    });

    
    worksheet.addRows(tickets);

   
    worksheet.getRow(1).eachCell((cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFB0C4DE" },
      };
      cell.font = { bold: true };
      cell.alignment = { vertical: "middle", horizontal: "center" };
    });

  
    worksheet.columns.forEach((column) => {
      let maxLength = column.header.length;
      column.eachCell({ includeEmpty: true }, (cell) => {
 
        cell.alignment = { vertical: "middle", horizontal: "center" };

   
        if (dateColumns.includes(column.header) && cell.value instanceof Date) {
          cell.numFmt = 'yyyy-mm-dd hh:mm:ss';
        }


        const cellValue = cell.value ? cell.value.toString() : "";
        if (cellValue.length > maxLength) {
          maxLength = cellValue.length;
        }
      });
      column.width = maxLength + 2;
    });

  
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=tickets_${Date.now()}.xlsx`
    );

    await workbook.xlsx.write(res);
    res.end();

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Export failed" });
  }
};