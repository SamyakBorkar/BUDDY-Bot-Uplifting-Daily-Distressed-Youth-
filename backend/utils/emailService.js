const nodemailer = require("nodemailer");

exports.sendCounsellorAlert = async (reg_no, message) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.EMAIL, pass: process.env.PASSWORD },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: process.env.COUNSELLOR_EMAIL,
    subject: "🚨 SOS Alert: Student in Distress",
    text: `Student with Reg No: ${reg_no} might need help.\n\nMessage: ${message}`,
  };

  await transporter.sendMail(mailOptions);
};
