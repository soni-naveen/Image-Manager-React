const nodemailer = require("nodemailer");

exports.sendPasswordResetEmail = async (email, name, resetToken) => {
  const resetUrl = `${process.env.CORS_ORIGIN}/reset-password?token=${resetToken}`;

  // // For development, log reset URL
  // if (process.env.NODE_ENV === "development") {
  //   console.log("=".repeat(50));
  //   console.log("PASSWORD RESET EMAIL");
  //   console.log("=".repeat(50));
  //   console.log(`To: ${email}`);
  //   console.log(`Name: ${name}`);
  //   console.log(`Reset URL: ${resetUrl}`);
  //   console.log("=".repeat(50));
  //   return;
  // }

  // Nodemailer transport configuration
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_FROM,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: `"Image Manager" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: "Reset Your Password - Image Manager",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Reset Your Password</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: white; padding: 30px; border: 1px solid #e9ecef; }
            .button { display: inline-block; padding: 12px 24px; background: #007bff; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0; }
            .footer { background: #f8f9fa; padding: 20px; text-align: left; font-size: 12px; color: #6c757d; border-radius: 0 0 8px 8px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="content">
              <h2>Reset Your Password</h2>
              <p>Hello ${name},</p>
              <p>We received a request to reset your password for your Image Manager account.</p>
              <p>Click the button below to reset your password:</p>
              <a href="${resetUrl}" class="button">Reset Password</a>
              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #007bff;">${resetUrl}</p>
              <p><strong>This link will expire in 1 hour for security reasons.</strong></p>
              <p>If you didn't request this password reset, please ignore this email. Your password will remain unchanged.</p>
              <p>Best regards,<br>The Image Manager Team</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Password reset email sent to:", email);
  } catch (err) {
    console.error("Failed to send password reset email:", err);
    throw new Error("Email sending failed");
  }
};
