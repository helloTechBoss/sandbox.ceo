import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOtpEmail(to: string, name: string, code: string) {
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 're_placeholder') {
    console.log(`[OTP DEV] To: ${to} | Code: ${code}`);
    return;
  }

  await resend.emails.send({
    from: 'Sandbox Group <onboarding@resend.dev>',
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
