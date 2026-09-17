const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { Resend } = require('resend');
const { saveReservation } = require('./database');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const resend = new Resend(process.env.RESEND_API_KEY);

app.use(cors());
app.use(express.json({ limit: '1mb' }));

function validateDate(dateString) {
  if (!dateString || typeof dateString !== 'string') return false;
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) return false;

  const date = new Date(dateString + 'T00:00:00');
  return !Number.isNaN(date.getTime());
}

app.get('/health', (_req, res) => {
  res.json({ ok: true, message: 'Servidor funcionando' });
});

app.post('/api/submit', async (req, res) => {
  const { date, food } = req.body || {};

  if (!date || !food) {
    return res.status(400).json({
      success: false,
      message: 'Faltan datos: fecha y comida son obligatorios.',
    });
  }

  if (!validateDate(date)) {
    return res.status(400).json({
      success: false,
      message: 'La fecha no tiene un formato válido (yyyy-mm-dd).',
    });
  }

  const emailTo = process.env.EMAIL_TO || 'brandond1013@gmail.com';
  const apiKey = process.env.RESEND_API_KEY;

  try {
    await saveReservation(date, food);
  } catch (error) {
    if (error.code === 'DATE_ALREADY_RESERVED') {
      return res.status(409).json({
        success: false,
        message: 'La fecha ya está reservada.',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'No se pudo guardar la reserva.',
      error: error.message,
    });
  }

  if (!apiKey) {
    return res.status(500).json({
      success: false,
      message: 'Falta la configuración de RESEND_API_KEY en .env.',
    });
  }

  if (process.env.NODE_ENV === 'test') {
    return res.json({
      success: true,
      message: 'Correo simulado en modo de prueba.',
      id: 'test-mode',
    });
  }

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'Cita <citas@tudominio.com>',
      to: [emailTo],
      subject: '💗 Nueva cita confirmada',
      html: `
        <h1>¡Aceptó la cita! 🥰</h1>
        <p><strong>Fecha:</strong> ${date}</p>
        <p><strong>Comida:</strong> ${food}</p>
      `,
    });

    if (error) {
      throw new Error(error.message || 'Error al enviar con Resend');
    }

    return res.json({
      success: true,
      message: 'Correo enviado correctamente con Resend.',
      id: data?.id || null,
    });
  } catch (error) {
    console.error('Error al enviar correo con Resend:', error);
    return res.status(500).json({
      success: false,
      message: 'No se pudo enviar el correo.',
      error: error.message,
    });
  }
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Servidor activo en http://localhost:${port}`);
  });
}

module.exports = app;
