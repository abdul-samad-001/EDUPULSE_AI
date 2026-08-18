const nodemailer = require("nodemailer");

/**
 * Configure Nodemailer Transporter
 * If SMTP credentials (SMTP_EMAIL / SMTP_PASSWORD) are set in .env, it uses Gmail/SMTP.
 * Otherwise, it logs the OTP in the server terminal with clear instructions.
 */
const createTransporter = () => {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = process.env.SMTP_PORT || 587;
  const user = process.env.SMTP_EMAIL || process.env.EMAIL_USER;
  const pass = process.env.SMTP_PASSWORD || process.env.EMAIL_PASS;

  if (user && pass) {
    return nodemailer.createTransport({
      host,
      port: Number(port),
      secure: Number(port) === 465,
      auth: { user, pass },
    });
  }

  return null;
};

/**
 * Send OTP Email for Password Reset or Email Verification
 */
const sendOTPEmail = async (toEmail, otpCode, type = "password_reset") => {
  const isReset = type === "password_reset";
  const subject = isReset
    ? "🔐 EduPulse AI - Password Reset OTP Code"
    : "✉️ EduPulse AI - Email Verification OTP Code";

  const title = isReset ? "Password Reset Request" : "Verify Your Email Address";
  const actionText = isReset
    ? "Use the verification code below to reset your account password. This code will expire in 10 minutes."
    : "Use the verification code below to confirm and verify your email address.";

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0f172a; margin: 0; padding: 20px; color: #f8fafc; }
        .card { max-width: 500px; margin: 0 auto; background: #1e293b; border-radius: 16px; border: 1px solid #334155; padding: 32px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.5); }
        .logo { font-size: 22px; font-weight: 800; color: #2dd4bf; margin-bottom: 20px; text-align: center; }
        .title { font-size: 20px; font-weight: 700; color: #f8fafc; text-align: center; margin-bottom: 12px; }
        .text { font-size: 14px; color: #94a3b8; line-height: 1.6; text-align: center; margin-bottom: 24px; }
        .otp-box { background: #0f172a; border: 2px dashed #2dd4bf; border-radius: 12px; padding: 18px; text-align: center; margin: 20px 0; }
        .otp-code { font-size: 32px; font-weight: 900; letter-spacing: 8px; color: #2dd4bf; font-family: monospace; }
        .footer { font-size: 11px; color: #64748b; text-align: center; margin-top: 24px; border-top: 1px solid #334155; padding-top: 16px; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="logo">⚡ EduPulse.AI</div>
        <div class="title">${title}</div>
        <div class="text">${actionText}</div>
        <div class="otp-box">
          <div class="otp-code">${otpCode}</div>
        </div>
        <div class="text" style="font-size: 12px; color: #cbd5e1;">
          ⚠️ If you did not request this OTP, please ignore this email or secure your account.
        </div>
        <div class="footer">
          © ${new Date().getFullYear()} EduPulse AI Intelligence Hub. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `;

  const transporter = createTransporter();

  if (transporter) {
    try {
      const info = await transporter.sendMail({
        from: `"EduPulse.AI Security" <${process.env.SMTP_EMAIL || "no-reply@edupulse.ai"}>`,
        to: toEmail,
        subject,
        html: htmlContent,
      });
      console.log(`[EmailService] OTP email dispatched to ${toEmail}. MessageId: ${info.messageId}`);
      return { success: true, messageId: info.messageId };
    } catch (err) {
      console.error("[EmailService] SMTP Send Error:", err.message);
      // Fall through to console logging
    }
  }

  // Fallback logging for local development / unconfigured SMTP
  console.log("=================================================");
  console.log(`📧 [EduPulse AI Email Service Simulated Delivery]`);
  console.log(`To: ${toEmail}`);
  console.log(`Subject: ${subject}`);
  console.log(`🔑 OTP CODE: [ ${otpCode} ] (Valid for 10 minutes)`);
  console.log("=================================================");

  return { success: true, simulated: true, otp: otpCode };
};

module.exports = {
  sendOTPEmail,
};
