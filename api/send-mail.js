export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const apiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL || "TigerWing <onboarding@resend.dev>";

    if (!apiKey) {
      return res.status(500).json({ error: "RESEND_API_KEY missing in Vercel Environment Variables" });
    }

    const { to_email, subject, body } = req.body || {};

    if (!to_email || !subject || !body) {
      return res.status(400).json({ error: "Missing to_email, subject or body" });
    }

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [to_email],
        subject,
        text: body
      })
    });

    const data = await resendResponse.json();

    if (!resendResponse.ok) {
      return res.status(resendResponse.status).json({
        error: "Resend failed",
        details: data
      });
    }

    return res.status(200).json({
      ok: true,
      resend: data
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message || "Unknown error"
    });
  }
}
