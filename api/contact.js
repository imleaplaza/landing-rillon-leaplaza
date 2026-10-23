const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });

  const { from_name, from_email, phone, area, message } = req.body;

  if (!from_name || !from_email || !area || !message) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Web Rillón & Lea-Plaza" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_TO,
    replyTo: from_email,
    subject: `Nueva consulta web · ${area}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a;">
        <h2 style="border-bottom:1px solid #e0d8cc;padding-bottom:12px;color:#0e0d0b;">
          Nueva consulta desde la web
        </h2>
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:8px 0;color:#888;width:120px;">Nombre</td>
              <td style="padding:8px 0;font-weight:500;">${from_name}</td></tr>
          <tr><td style="padding:8px 0;color:#888;">Email</td>
              <td style="padding:8px 0;"><a href="mailto:${from_email}">${from_email}</a></td></tr>
          <tr><td style="padding:8px 0;color:#888;">Teléfono</td>
              <td style="padding:8px 0;">${phone || '—'}</td></tr>
          <tr><td style="padding:8px 0;color:#888;">Área legal</td>
              <td style="padding:8px 0;font-weight:500;">${area}</td></tr>
        </table>
        <h3 style="margin-top:24px;margin-bottom:8px;color:#0e0d0b;">Mensaje</h3>
        <p style="background:#f7f3ee;padding:16px;border-left:3px solid #0e0d0b;line-height:1.7;">
          ${message.replace(/\n/g, '<br>')}
        </p>
        <p style="margin-top:24px;font-size:12px;color:#aaa;">
          Enviado desde rillonleaplaza.cl
        </p>
      </div>
    `,
  });

  return res.status(200).json({ ok: true });
};
