const express = require("express");
const ngrok = require("@ngrok/ngrok");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(express.static("public"));

// API untuk cek status
app.get("/api/status", (req, res) => {
    res.json({
        status: "OK",
        timestamp: new Date().toISOString()
    });
});

// Jalankan server dashboard
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Dashboard berjalan di http://localhost:${PORT}`);
});

// Ngrok untuk dashboard
(async function () {
    try {
        const listener = await ngrok.connect({
            addr: PORT,
            authtoken: process.env.NGROK_AUTHTOKEN,
        });

        console.log("======================================");
        console.log("DASHBOARD NGROK AKTIF");
        console.log("URL Dashboard:", listener.url());
        console.log("======================================");
    } catch (err) {
        console.log("NGROK DASHBOARD ERROR:", err);
    }
})();
