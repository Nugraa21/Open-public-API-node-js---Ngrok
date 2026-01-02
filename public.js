require('dotenv').config();
const ngrok = require('@ngrok/ngrok');
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

/* =========================
   REVERSE PROXY LANGSUNG
========================= */
app.use(
  '/',
  createProxyMiddleware({
    target: 'https://10.10.10.25',
    changeOrigin: true,
    secure: false, // WAJIB kalau SSL lokal
  })
);

/* =========================
   START + NGROK
========================= */
app.listen(3000, async () => {
  console.log('Proxy aktif di http://localhost:3000');

  const listener = await ngrok.connect({
    addr: 3000,
    authtoken: process.env.NGROK_AUTHTOKEN,
  });

  console.log('PUBLIC URL:', listener.url());
});
