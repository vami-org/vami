import nodemailer from "nodemailer";
import env from "../config/env.js";

// Setup nodemailer transporter
const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_PORT === 465,
  auth:
    process.env.SMTP_USER && process.env.SMTP_PASS
      ? {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        }
      : undefined,
});

export async function sendMagicLinkEmail(to, url) {
  const mailOptions = {
    from: `"${process.env.EMAIL_FROM_NAME || "VAMI"}" <${env.EMAIL_FROM_ADDRESS}>`,
    to,
    subject: "✨ Log in to VAMI",
    text: `Welcome! Click the following link to log in to VAMI:\n\n${url}\n\nThis link is valid for 15 minutes.`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; border: 1px solid var(--border-color-default, #eaeaea); border-radius: 8px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 30px;">
          <span style="font-size: 28px; font-weight: 800; letter-spacing: -0.5px; color: #1c1c1e;">VAMI</span>
        </div>
        <h2 style="color: #1c1c1e; font-size: 20px; font-weight: 700; text-align: center; margin-bottom: 20px;">Log in to your account</h2>
        <p style="color: #666668; font-size: 15px; line-height: 1.5; text-align: center; margin-bottom: 30px;">
          Click the link below to securely log in to VAMI. This magic link is valid for 15 minutes and can only be used once.
        </p>
        <div style="text-align: center; margin: 35px 0;">
          <a href="${url}" style="background-color: #1c1c1e; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 6px; font-size: 15px; font-weight: 600; display: inline-block; transition: background-color 0.2s;">
            Sign In to VAMI
          </a>
        </div>
        <p style="color: #8e8e93; font-size: 13px; text-align: center; margin-top: 35px;">
          If the button above does not work, copy and paste this URL into your browser:
        </p>
        <p style="color: #007aff; font-size: 13px; text-align: center; word-break: break-all; margin: 10px 0 30px 0;">
          <a href="${url}" style="color: #007aff; text-decoration: none;">${url}</a>
        </p>
        <hr style="border: none; border-top: 1px solid #eaeaea; margin: 30px 0;" />
        <p style="color: #aeaea2; font-size: 11px; text-align: center; line-height: 1.4;">
          If you did not request this email, you can safely ignore it.
        </p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.info(
      `📧 Email sent successfully to ${to}: Message ID ${info.messageId}`,
    );
    return info;
  } catch (error) {
    console.error("❌ Failed to send magic link email:", error);
    throw error;
  }
}
