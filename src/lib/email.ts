import nodemailer from 'nodemailer';

function getTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
}

export async function sendOtpEmail(to: string, name: string, code: string) {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.log(`[OTP DEV] ${to} → ${code}`);
    return;
  }

  const transporter = getTransporter();
  await transporter.sendMail({
    from: `"Sandbox Group" <${process.env.GMAIL_USER}>`,
    to,
    subject: `Your Sandbox verification code: ${code}`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px">
        <div style="font-size:1.1rem;font-weight:800;color:#0F2557;margin-bottom:24px">
          SANDBOX <span style="color:#EF4444">GROUP</span>
        </div>
        <h2 style="color:#0F2557;margin:0 0 8px">Hi ${name},</h2>
        <p style="color:#475569;margin:0 0 24px;line-height:1.7">
          Use the verification code below to confirm your identity. It expires in <strong>10 minutes</strong>.
        </p>
        <div style="background:#F8FAFC;border:2px solid #E2E8F0;padding:24px;text-align:center;margin-bottom:24px">
          <div style="font-size:2.4rem;font-weight:800;letter-spacing:.3em;color:#0F2557">${code}</div>
        </div>
        <p style="color:#94A3B8;font-size:.8rem;margin:0">
          If you did not request this, please ignore this email.
        </p>
        <hr style="border:none;border-top:1px solid #E2E8F0;margin:24px 0">
        <p style="color:#CBD5E1;font-size:.72rem;margin:0">Sandbox Group · sandbox.ceo</p>
      </div>
    `,
  });
}
