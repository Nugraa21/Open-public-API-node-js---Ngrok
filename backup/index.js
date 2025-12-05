require('dotenv').config();
const ngrok = require('@ngrok/ngrok');
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const DASHBOARD_PORT = 3000; // Dashboard pakai port lain, bukan 80

// ------------------------
// API DASHBOARD
// ------------------------
app.get('/api/status', (req, res) => {
    res.json({
        dashboard: "online",
        xampp_api: "ngrok-enabled",
        time: new Date().toISOString()
    });
});

// Serve dashboard frontend
app.use(express.static(path.join(__dirname, 'public')));

// ------------------------
// START DASHBOARD SERVER
// ------------------------
app.listen(DASHBOARD_PORT, async () => {
    console.log(`Dashboard berjalan di http://localhost:${DASHBOARD_PORT}`);

    try {
        console.log("Menghubungkan ngrok ke XAMPP port 80...");

        // NGROK connect ke XAMPP (port 80)
        const listener = await ngrok.connect({
            addr: 80, // <-- PENTING!! ngrok menuju XAMPP, bukan dashboard
            authtoken: process.env.NGROK_AUTHTOKEN,
        });

        const ngrokURL = listener.url();

        console.log(`Ngrok URL: ${ngrokURL}`);
        console.log(`XAMPP backend bisa diakses di: ${ngrokURL}/backendapk/`);

        // simpan url agar dashboard bisa membacanya
        fs.writeFileSync("./public/ngrok.json", JSON.stringify({ url: ngrokURL }));

    } catch (err) {
        console.error("NGROK ERROR:", err);
    }
});
