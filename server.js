require('dotenv').config();
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
        const ngrok = require('@ngrok/ngrok');

        let listener;
        // Setup Options Dasar
        const options = {
            addr: XAMPP_PORT,
            authtoken: process.env.NGROK_AUTHTOKEN,
        };

        // Tambah domain jika ada
        if (process.env.NGROK_DOMAIN) {
            options.domain = process.env.NGROK_DOMAIN;
            console.log(`🔒 Config Domain: ${options.domain}`);
        } else {
            console.log("\n==================================================");
            console.log("⚠️  KAMU BELUM PUNYA DOMAIN TETAP DI .env");
            console.log("    Agar link tidak berubah-ubah saat restart:");
            console.log("    1. Buka: https://dashboard.ngrok.com/domains/new");
            console.log("    2. Klik 'Create Domain' (Gratis 1 biji)");
            console.log("    3. Copy domain, masukkan ke file .env:");
            console.log("       NGROK_DOMAIN=domain-barumu.ngrok-free.app");
            console.log("==================================================\n");
        }

        try {
            // Percobaan Pertama
            listener = await ngrok.connect(options);
            console.log("✅ Ngrok Terhubung!");
        } catch (firstErr) {
            console.error("\n❌ GAGAL PAKE DOMAIN TETAP KARENA:");

            // Analisa Error biar user gak bingung
            const msg = firstErr.message || "";
            if (msg.includes("ERR_NGROK_313") || msg.includes("paid plans")) {
                console.error("👉 Domain yang kamu ketik itu SALAH / FITUR BERBAYAR.");
                console.error("   Jangan asal ketik/ngarang nama domain.");
                console.error("   Harus COPY dari Dashboard: https://dashboard.ngrok.com/domains");
            } else if (msg.includes("ERR_NGROK_320") || msg.includes("reserved for another account")) {
                console.error("👉 Domain itu SUDAH MILIK ORANG LAIN.");
                console.error("   Cek lagi token atau bikin domain baru.");
            } else {
                console.error(`👉 ${msg}`);
            }
            console.log(""); // Spasi

            // Jika error & kita tadi pakai domain, coba ulang TANPA domain (fallback)
            if (options.domain) {
                console.warn(`⚠️  Gagal connect pakai domain '${options.domain}'. Retrying random...`);
                delete options.domain;
                listener = await ngrok.connect(options);
                console.log("✅ Berhasil connect (Random Domain).");
            } else {
                // Jika errornya bukan soal domain (misal token salah/limit/koneksi), lempar errornya
                throw firstErr;
            }
        }

        const ngrokURL = listener.url();
        console.log(`🚀 Ngrok aktif: ${ngrokURL}`);

        // Update file JSON
        fs.writeFileSync(
            path.join(__dirname, "public/ngrok.json"),
            JSON.stringify({ url: ngrokURL }, null, 4)
        );

    } catch (err) {
        console.error("❌ NGROK ERROR FATAL:", err);
    }
});
