const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", 
  port: 465,
  secure: true, 
  auth: {
    user: process.env.Email,
    pass: process.env.Email_Password,
  },
});

async function sendTicketEmail(to, ticketId, customerName, subject) {
  const body = `
Dear ${customerName},

Thank you for reaching out to us.

We have received your request regarding: "${subject}".
Your ticket number is: #${ticketId}.

Our team will review the issue and get back to you as soon as possible.

Best regards,
IT Helpdesk
`;

  await transporter.sendMail({
    from: `"IT Helpdesk" <${process.env.Email}>`,
    to,
    subject: `Ticket Received - #${ticketId}`,
    text: body,
  });
}


async function sendReplyEmail(to,ticketId,customerName,subject,message,files = []) 
{
  const body = `
  Dear ${customerName},

  Regarding your ticket #${ticketId} - "${subject}",

  ${message}

  If you have any further questions, feel free to reply.

  Best regards,
  IT Helpdesk
  `;

  const attachments = files.map((file) => ({
    filename: file.originalname,
    path: file.path,
  }));

  await transporter.sendMail({
    from: '"IT Helpdesk" <your-email@example.com>',
    to,
    subject: `Update on your Ticket #${ticketId}`,
    text: body,
    attachments,
  });
}


async function sendOtpEmail(to, otp) {
  const body = `
Dear User,

You requested to reset your password.

Your OTP is: ${otp}

This OTP is valid for 5 minutes.

⚠️ Do not share this OTP with anyone.

Best regards,
IT Helpdesk
`;

  await transporter.sendMail({
    from: `"IT Helpdesk" <${process.env.Email}>`,
    to,
    subject: "Password Reset OTP",
    text: body,
  });
}

module.exports = { sendTicketEmail,sendReplyEmail,sendOtpEmail };