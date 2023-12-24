// pages/api/verifyCaptcha.js

import axios from 'axios';

export default async (req, res) => {
  if (req.method === 'POST') {
    const { token } = req.body;

    try {
      const recaptchaSecretKey = process.env.RECAPTCHA_SECRET_KEY;
      const response = await axios.post(
        `https://www.google.com/recaptcha/api/siteverify?secret=${recaptchaSecretKey}&response=${token}`
      );

      if (response.data.score > 0.5) {
        res.status(200).json({ success: true });
      } else {
        res.status(403).json({ success: false });
      }
    } catch (error) {
      console.error('reCAPTCHA verification error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
};
