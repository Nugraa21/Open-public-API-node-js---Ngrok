require('dotenv').config();
const ngrok = require('@ngrok/ngrok');
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

// Security modules
const helmetConfig = require('./security/helmet-config');
const rateLimit = require('./security/rate-limit');
const corsConfig = require('./security/cors-config');

// Apply Security
helmetConfig(app);
app.use(rateLimit);
app.use(corsConfig);

// ========================
const DASHBOARD_PORT = 3000;
const XAMPP_PORT = 80;
// ========================

// API
app.get('/api/status', (req, res) => {
    res.json({
        dashboard: "online",
        xampp_api: "ngrok-enabled",
        secure: true,
        time: new Date().toISOString()
    });
});

// Public folder
app.use(express.static(path.join(__dirname, 'public')));

// Jalankan Dashboard
app.listen(DASHBOARD_PORT, async () => {

    console.log(`Dashboard: http://localhost:${DASHBOARD_PORT}`);

    try {
        console.log("Menghubungkan ke ngrok...");

        const listener = await ngrok.connect({
            addr: XAMPP_PORT,
            authtoken: process.env.NGROK_AUTHTOKEN,
        });

        const ngrokURL = listener.url();
        console.log(`Ngrok aktif: ${ngrokURL}`);

        fs.writeFileSync(
            path.join(__dirname, "public/ngrok.json"),
            JSON.stringify({ url: ngrokURL }, null, 4)
        );

    } catch (err) {
        console.error("NGROK ERROR:", err);
    }
});
