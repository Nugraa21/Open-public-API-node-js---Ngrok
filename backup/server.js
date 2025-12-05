require('dotenv').config();
const ngrok = require('@ngrok/ngrok');
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

// ===============================
// KONFIGURASI PORT
// ===============================
const DASHBOARD_PORT = 3000;  // Dashboard
const XAMPP_PORT = 80;        // Backend XAMPP (Ngrok)

// ===============================
// API untuk dashboard
// ===============================
app.get('/api/status', (req, res) => {
    res.json({
        dashboard: "online",
        xampp_api: "ngrok-enabled",
        time: new Date().toISOString()
    });
});

// ===============================
// SERVE FILE FRONTEND
// ===============================
app.use(express.static(path.join(__dirname, 'public')));

// ===============================
// JALANKAN DASHBOARD
// ===============================
app.listen(DASHBOARD_PORT, async () => {

    console.log(`-----------------------------------------`);
    console.log(`>>  Dashboard berjalan di: http://localhost:${DASHBOARD_PORT}`);
    console.log(`-----------------------------------------\n`);

    try {
        console.log("-----------------------------------------");
        console.log("Menghubungkan ngrok ke XAMPP (port 80)...");
        console.log("-----------------------------------------");

        // ===============================
        // NGROK CONNECT KE XAMPP
        // ===============================
        const listener = await ngrok.connect({
            addr: XAMPP_PORT,
            authtoken: process.env.NGROK_AUTHTOKEN,
        });

        const ngrokURL = listener.url();
        console.log(`>> Ngrok URL aktif: ${ngrokURL}`);
        console.log(`>> Akses backend XAMPP: ${ngrokURL}/backendapk/\n`);

        // simpan URL agar dashboard bisa baca
        fs.writeFileSync(
            path.join(__dirname, "public/ngrok.json"),
            JSON.stringify({ url: ngrokURL }, null, 4)
        );

    } catch (err) {
        console.error("X NGROK ERROR:", err);
    }
});
