require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const ngrok = require('@ngrok/ngrok');

const app = express();

// ========================
// CONFIG
const DASHBOARD_PORT = 3000;
const XAMPP_PORT = 80;
// ========================

// ======== SECURITY (optional) ========
// const helmetConfig = require('./security/helmet-config');
// const rateLimit = require('./security/rate-limit');
// const corsConfig = require('./security/cors-config');
// helmetConfig(app);
// app.use(rateLimit);
// app.use(corsConfig);

// ========================
// Helper: cek XAMPP online
const checkXampp = async () => {
    try {
        const res = await fetch(`http://localhost:${XAMPP_PORT}`);
        return res.ok;
    } catch (err) {
        return false;
    }
};

// ========================
// Serve folder public
app.use(express.static(path.join(__dirname, 'public')));

// ========================
// API Status
app.get('/api/status', async (req, res) => {
    const xamppOnline = await checkXampp();
    res.json({
        dashboard: "online",
        xampp_api: xamppOnline ? "online" : "offline",
        secure: true,
        time: new Date().toISOString()
    });
});

// ========================
// Route fallback HTML jika XAMPP mati
// Pakai regex /.* untuk catch-all supaya aman
app.get(/.*/, async (req, res) => {
    const xamppOnline = await checkXampp();
    if (!xamppOnline) {
        return res.send(`
        <!DOCTYPE html>
        <html lang="id">
        <head>
            <meta charset="UTF-8">
            <title>API Service</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body {margin:0;height:100vh;display:flex;justify-content:center;align-items:center;font-family:Arial,sans-serif;background:#f8fafc;color:#1e293b;}
                .wrapper {text-align:center;max-width:440px;padding:20px;}
                h1 {font-size:24px;margin-bottom:8px;}
                p {font-size:14px;color:#64748b;line-height:1.6;}
                .badge {display:inline-block;margin-top:12px;padding:6px 12px;font-size:12px;background:#e2e8f0;border-radius:20px;color:#334155;}
                .author {margin-top:16px;font-size:13px;color:#475569;}
                footer {margin-top:20px;font-size:12px;color:#94a3b8;}
            </style>
        </head>
        <body>
            <div class="wrapper">
                <h1>API Service</h1>
                <p>Layanan backend ini digunakan untuk komunikasi data aplikasi.<br>Akses langsung melalui browser tidak disarankan.</p>
                <div class="badge">Status: Offline</div>
                <div class="author">
                    Dikembangkan oleh<br>
                    <strong>Ludang Prasetyo Nugroho</strong>
                </div>
                <footer>© ${new Date().getFullYear()} Backend API</footer>
            </div>
        </body>
        </html>
        `);
    } else {
        // Jika online, serve index.html atau public lainnya
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    }
});

// ========================
// Jalankan Dashboard + ngrok
app.listen(DASHBOARD_PORT, async () => {
    console.log(`Dashboard: http://localhost:${DASHBOARD_PORT}`);

    try {
        console.log("Menghubungkan ke ngrok...");

        const ngrokUrl = await ngrok.connect({
            addr: XAMPP_PORT,
            authtoken: process.env.NGROK_AUTHTOKEN,
        });

        console.log(`Ngrok aktif: ${ngrokUrl}`);

        // Simpan URL ngrok ke file public/ngrok.json
        fs.writeFileSync(
            path.join(__dirname, "public/ngrok.json"),
            JSON.stringify({ url: ngrokUrl }, null, 4)
        );

    } catch (err) {
        console.error("NGROK ERROR:", err);
    }
});
