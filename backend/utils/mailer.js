const nodemailer = require("nodemailer");

async function createTransporter() {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "465"),
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.verify().catch(err => {
    console.warn("⚠️ Mailer verification failed:", err.message);
  });

  return transporter;
}

async function sendAlertMail(recipients, subject, text) {
  const transporter = await createTransporter();
  const mailOptions = {
    from: process.env.FROM_EMAIL,
    to: Array.isArray(recipients) ? recipients.join(",") : recipients,
    subject,
    text,
  };
  await transporter.sendMail(mailOptions);
  console.log("✅ Alert email sent to:", recipients);
}

module.exports = { sendAlertMail };
